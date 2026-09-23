import path from "node:path";
import type { NextConfig } from "next";

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
