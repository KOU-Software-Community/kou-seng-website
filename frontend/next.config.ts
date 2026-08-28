import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
