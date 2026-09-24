import path from "node:path";
import type { NextConfig } from "next";

// XSS'e karşı ikinci savunma hattı. Next hidrasyon için satır içi script
// kullandığından script-src 'unsafe-inline' şart (nonce, tüm sayfaları dinamik
// render'a zorlar); yine de dış script yüklemeyi, API dışındaki adreslere
// istek atmayı, yabancı görseli ve sitenin iframe'e gömülmesini engeller.
// Yeni bir dış kaynak (script, iframe, API adresi) eklenirse buraya da
// eklenmeli; yoksa tarayıcı onu konsola hata yazarak engeller.
const apiOrigin = process.env.NEXT_PUBLIC_API_URL ? new URL(process.env.NEXT_PUBLIC_API_URL).origin : '';
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === 'development' ? " 'unsafe-eval'" : ''}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  `connect-src 'self' ${apiOrigin}`,
  "frame-src https://www.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

const nextConfig: NextConfig = {
  // Turbopack workspace kökünü ağaçta yukarı doğru lockfile arayarak tahmin
  // ediyor. Geliştiricinin ev dizininde başıboş bir package-lock.json varsa
  // kökü oraya çözüyor. Kökü açıkça sabitliyoruz ki build makineden bağımsız
  // olsun.
  turbopack: {
    root: path.resolve(__dirname),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.medium.com',
      }
    ],
  },
  async headers() {
    return [
      { source: '/:path*', headers: [{ key: 'Content-Security-Policy', value: contentSecurityPolicy }] },
    ];
  },
  // Web takımı "Mobil Web" olarak yeniden adlandırıldı ve slug'ı değişti.
  // Eski URL'ler sitemap'te yayınlanmıştı ve dışarıda paylaşılmış olabilir.
  async redirects() {
    return [
      { source: '/technical-team/web', destination: '/technical-team/mobil-web', permanent: true },
      { source: '/apply/web', destination: '/apply/mobil-web', permanent: true },
    ];
  },
};

export default nextConfig;
