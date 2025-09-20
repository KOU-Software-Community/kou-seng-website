'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { ThemeToggle } from "@/components/theme/ThemeToggle";

interface NavLinkItem { title: string; href: string }
type NavItem = NavLinkItem | { title: string; children: NavLinkItem[] }

const navItems: NavItem[] = [
  { title: "Anasayfa", href: "/" },
  { title: "Hakkımızda", href: "/about" },
  {
    title: "Takımlarımız",
    children: [
      { title: "Web", href: "/technical-team/web" },
      { title: "AI", href: "/technical-team/ai" },
      { title: "Game", href: "/technical-team/game" },
    ],
  },
  { title: "Yayınlar", href: "/publications" },
  { title: "Başvuru", href: "/apply" },
  { title: "İletişim", href: "/contact" },
];

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(pathname);
  const [mobileSubmenusOpen, setMobileSubmenusOpen] = useState<Record<string, boolean>>({});
  
  // Sayfa değiştiğinde aktif menü öğesini güncelle
  useEffect(() => {
    setActiveItem(pathname);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur-sm">
      <div className="w-full max-w-screen-xl mx-auto px-4 h-16 relative flex justify-between items-center">
        {/* Mobil menü butonu - Sol */}
        <div className="md:hidden absolute left-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Menüyü kapat" : "Menüyü aç"}
          >
            {mobileMenuOpen ? (
              <FontAwesomeIcon icon={faXmark} className="h-5 w-5" />
            ) : (
              <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {/* Masaüstü navigasyon - Orta (tam ortada) */}
        <div className="flex justify-center w-full">
          <nav className="hidden md:flex md:items-center md:gap-8">
            {navItems.map((item) => {
              const isLink = (it: NavItem): it is NavLinkItem => (it as NavLinkItem).href !== undefined;
              if (isLink(item)) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                      activeItem === item.href
                        ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-['']"
                        : "text-foreground hover:text-primary"
                    }`}
                    onClick={() => setActiveItem(item.href)}
                  >
                    {item.title}
                  </Link>
                );
              }
              const isAnyChildActive = item.children.some((child) => pathname.startsWith(child.href));
              return (
                <div key={item.title} className="relative group">
                  <span
                    className={`relative px-3 py-2 text-sm font-medium cursor-default select-none ${
                      isAnyChildActive
                        ? "text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:content-['']"
                        : "text-foreground"
                    }`}
                    aria-haspopup="true"
                    aria-expanded="false"
                    role="button"
                    tabIndex={0}
                  >
                    {item.title}
                  </span>
                  <div className="invisible absolute left-1/2 z-50 mt-2 w-44 -translate-x-1/2 rounded-md border border-border/50 bg-background p-1 opacity-0 shadow-md transition-all group-hover:visible group-hover:opacity-100">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="block rounded-sm px-3 py-2 text-sm text-foreground hover:bg-muted/50 hover:text-primary"
                        onClick={() => setActiveItem(child.href)}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </nav>
        </div>
        
        {/* Theme Toggle - Sağ (her zaman sağda) */}
        <div className="absolute right-4">
          <ThemeToggle />
        </div>

        {/* Mobil menü */}
        {mobileMenuOpen && (
          <div className="absolute inset-x-0 top-16 z-50 w-full border-b border-border/50 bg-background p-6 md:hidden">
            <div className="w-full max-w-screen-xl mx-auto">
              <nav className="flex flex-col space-y-4">
                {navItems.map((item) => {
                  const isLink = (it: NavItem): it is NavLinkItem => (it as NavLinkItem).href !== undefined;
                  if (isLink(item)) {
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`text-center text-base font-medium transition-colors ${
                          activeItem === item.href ? "text-primary" : "text-foreground hover:text-primary"
                        }`}
                        onClick={() => {
                          setActiveItem(item.href);
                          setMobileMenuOpen(false);
                        }}
                      >
                        {item.title}
                      </Link>
                    );
                  }
                  const isOpen = mobileSubmenusOpen[item.title] === true;
                  return (
                    <div key={item.title} className="flex flex-col items-stretch">
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 text-center text-base font-medium text-foreground transition-colors hover:text-primary"
                        aria-haspopup="true"
                        aria-expanded={isOpen}
                        onClick={() =>
                          setMobileSubmenusOpen((prev) => ({ ...prev, [item.title]: !prev[item.title] }))
                        }
                      >
                        {item.title}
                        <FontAwesomeIcon 
                          icon={isOpen ? faChevronUp : faChevronDown} 
                          className="h-3 w-3 transition-transform duration-200" 
                        />
                      </button>
                      {isOpen && (
                        <div className="mt-2 space-y-2 flex flex-col items-center">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={`block rounded-md px-3 py-2 text-base text-center ${
                                pathname.startsWith(child.href)
                                  ? "bg-muted/50 text-primary"
                                  : "text-foreground hover:bg-muted/50 hover:text-primary"
                              }`}
                              onClick={() => {
                                setActiveItem(child.href);
                                setMobileMenuOpen(false);
                              }}
                            >
                              {child.title}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
