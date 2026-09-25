import { BlockList, isIP } from 'node:net';

// Site ve API Cloudflare arkasında; ziyaretçinin adresi CF-Connecting-IP başlığında.
// `trust proxy 1` ile req.ip, Coolify proxy'sine bağlanan son hop olur: production'da
// 10.0.1.1 (Coolify Docker ağının geçidi; Cloudflare Tunnel ya da Docker'ın port
// yönlendirmesi), doğrudan bağlanan bir kurulumda Cloudflare'in kenar sunucusu. Rate
// limit bu hop'a göre sayılırsa bütün site tek kovayı paylaşır ve tek kişi herkesin
// girişini kilitleyebilir. Başlığa yalnızca hop Cloudflare'den ya da sunucunun kendi
// ağından geldiyse güvenilir; sunucuya dışarıdan doğrudan gelen biri Coolify
// proxy'sinde kendi public adresiyle görünür, başlığı uydurup limiti aşamaz.
// Liste: https://www.cloudflare.com/ips/ — Cloudflare değiştirirse güncellenmeli.
const CLOUDFLARE_RANGES = [
    '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22',
    '141.101.64.0/18', '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20',
    '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
    '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
    '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32',
    '2405:8100::/32', '2a06:98c0::/29', '2c0f:f248::/32',
];

// Sunucunun kendi ağı: Docker ağları, loopback.
const LOCAL_RANGES = ['10.0.0.0/8', '172.16.0.0/12', '192.168.0.0/16', '127.0.0.0/8', '::1/128', 'fc00::/7'];

const trustedHops = new BlockList();
for (const range of [...CLOUDFLARE_RANGES, ...LOCAL_RANGES]) {
    const [address, prefix] = range.split('/');
    trustedHops.addSubnet(address, Number(prefix), isIP(address) === 6 ? 'ipv6' : 'ipv4');
}

const fromTrustedHop = (ip) => {
    const address = ip?.startsWith('::ffff:') ? ip.slice(7) : ip; // IPv4-mapped IPv6
    const family = isIP(address ?? '');
    return family !== 0 && trustedHops.check(address, family === 6 ? 'ipv6' : 'ipv4');
};

// İsteği gönderen ziyaretçinin adresi
const clientIp = (req) => {
    const visitor = req.headers['cf-connecting-ip'];
    return typeof visitor === 'string' && isIP(visitor) !== 0 && fromTrustedHop(req.ip) ? visitor : req.ip;
};

export default clientIp;
