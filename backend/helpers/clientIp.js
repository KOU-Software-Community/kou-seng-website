import { BlockList, isIP } from 'node:net';

// Site ve API Cloudflare arkasında: ziyaretçi → Cloudflare → Coolify proxy → Express.
// `trust proxy 1` ile req.ip ziyaretçinin değil Cloudflare kenar sunucusunun adresi
// olur; rate limit onunla sayılırsa o sunucudan gelen herkes aynı kovayı paylaşır ve
// tek kişi herkesin girişini kilitleyebilir. Ziyaretçinin adresi CF-Connecting-IP
// başlığında. Başlığa yalnızca istek gerçekten bir Cloudflare adresinden geldiyse
// güvenilir; sunucuya doğrudan gelen biri başlığı uydurup limiti aşamasın.
// Liste: https://www.cloudflare.com/ips/ — Cloudflare değiştirirse güncellenmeli.
const CLOUDFLARE_RANGES = [
    '173.245.48.0/20', '103.21.244.0/22', '103.22.200.0/22', '103.31.4.0/22',
    '141.101.64.0/18', '108.162.192.0/18', '190.93.240.0/20', '188.114.96.0/20',
    '197.234.240.0/22', '198.41.128.0/17', '162.158.0.0/15', '104.16.0.0/13',
    '104.24.0.0/14', '172.64.0.0/13', '131.0.72.0/22',
    '2400:cb00::/32', '2606:4700::/32', '2803:f800::/32', '2405:b500::/32',
    '2405:8100::/32', '2a06:98c0::/29', '2c0f:f248::/32',
];

const cloudflare = new BlockList();
for (const range of CLOUDFLARE_RANGES) {
    const [address, prefix] = range.split('/');
    cloudflare.addSubnet(address, Number(prefix), isIP(address) === 6 ? 'ipv6' : 'ipv4');
}

const fromCloudflare = (ip) => {
    const address = ip?.startsWith('::ffff:') ? ip.slice(7) : ip; // IPv4-mapped IPv6
    const family = isIP(address ?? '');
    return family !== 0 && cloudflare.check(address, family === 6 ? 'ipv6' : 'ipv4');
};

// İsteği gönderen ziyaretçinin adresi
const clientIp = (req) => {
    const visitor = req.headers['cf-connecting-ip'];
    return typeof visitor === 'string' && isIP(visitor) !== 0 && fromCloudflare(req.ip) ? visitor : req.ip;
};

export default clientIp;
