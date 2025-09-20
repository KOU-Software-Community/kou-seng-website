'use client';

import Link from "next/link";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useState } from 'react';
import { getFooterData, iconMap, type FooterData } from '@/lib/footerData';

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterData | null>(null);

  useEffect(() => {
    const loadFooterData = async () => {
      const data = await getFooterData();
      setFooterData(data);
    };
    loadFooterData();
  }, []);

  if (!footerData) {
    return (
      <footer className="border-t border-border/50 bg-background py-8">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex justify-center items-center h-32">
            <div className="animate-pulse text-muted-foreground">Yükleniyor...</div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="border-t border-border/50 bg-background py-8">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo ve Hakkında - Mobilde gizli */}
          <div className="hidden md:flex flex-col gap-2 items-start">
            <h2 className="text-lg font-semibold">{footerData.clubInfo.name}</h2>
            <p className="text-sm text-muted-foreground">
              {footerData.clubInfo.description}
            </p>
          </div>

          {/* Hızlı Bağlantılar - Mobilde gizli */}
          <div className="hidden md:flex flex-col gap-2 items-start">
            <h3 className="text-sm font-semibold">Sayfalar</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* İletişim - Mobilde gizli */}
          <div className="hidden md:flex flex-col gap-2 items-start">
            <h3 className="text-sm font-semibold">İletişim</h3>
            <address className="not-italic">
              <p className="text-sm text-muted-foreground">
                {footerData.contactInfo.address.university}
                <br />
                {footerData.contactInfo.address.faculty}
                <br />
                {footerData.contactInfo.address.location}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <a
                  href={`mailto:${footerData.contactInfo.email}`}
                  className="hover:text-primary"
                >
                  {footerData.contactInfo.email}
                </a>
              </p>
            </address>
          </div>

          {/* Sosyal Medya - Her zaman görünür */}
          <div className="flex flex-col gap-4 items-center md:items-start md:col-span-1 col-span-full">
            <h3 className="text-sm font-semibold">Bizi Takip Edin</h3>
            <div className="flex gap-6 md:gap-4">
              {footerData.socialMedia.map((social, index) => {
                const IconComponent = iconMap[social.icon as keyof typeof iconMap];
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground transition-all duration-300 hover:text-primary hover:scale-110 transform"
                    aria-label={social.ariaLabel}
                  >
                    <FontAwesomeIcon icon={IconComponent} className="h-6 w-6 md:h-5 md:w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Telif Hakkı */}
        <div className="mt-8 border-t border-border/50 pt-4">
          <p className="text-center text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} {footerData.copyright.text}
          </p>
        </div>
      </div>
    </footer>
  );
}