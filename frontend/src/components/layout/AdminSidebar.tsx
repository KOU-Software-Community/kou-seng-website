'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import useAuth from '@/hooks/useAuth';
import React, { useEffect, useMemo, useState } from 'react';
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/ui/sidebar';

type NavItem = {
  label: string;
  href: string;
};

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin/dashboard' },
  { label: 'Duyurular', href: '/admin/dashboard/announcements' },
  { label: 'Genel Üyelik', href: '/admin/dashboard/general-membership' },
  { label: 'Teknik Takım', href: '/admin/dashboard/technical-team' },
  { label: 'İletişim', href: '/admin/dashboard/contact' },
  { label: 'Admin Yönetimi', href: '/admin/dashboard/admin-management' },
];

export default function AdminSidebar() {
  const { isAuthenticated, getAuthDetail, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('');
  const [isTechnicalTeamOpen, setIsTechnicalTeamOpen] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      const detail = await getAuthDetail();
      if (!isMounted) return;
      if ('name' in detail && 'email' in detail) {
        setUserName(detail.name);
        setUserEmail(detail.email);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roleValue = (detail as any).role as string | undefined;
        setUserRole(roleValue || '');
      } else {
        setUserName('');
        setUserEmail('');
        setUserRole('');
      }
    };
    if (isAuthenticated) load();
    return () => {
      isMounted = false;
    };
  }, [getAuthDetail, isAuthenticated]);

  const activeHref = useMemo(() => pathname, [pathname]);
  const isTechnicalTeamRoute = useMemo(
    () => activeHref?.startsWith('/admin/dashboard/technical-team') ?? false,
    [activeHref]
  );

  useEffect(() => {
    // Yol teknik takım ile başlıyorsa otomatik açık kalsın
    if (isTechnicalTeamRoute) {
      setIsTechnicalTeamOpen(true);
    }
  }, [isTechnicalTeamRoute]);
  const visibleNavItems = useMemo(() => {
    if (userRole === 'admin') return navItems;
    const limitedRoles = ['web', 'ai', 'game'];
    if (limitedRoles.includes(userRole)) {
      return navItems.filter((n) => n.label === 'Dashboard' || n.label === 'Teknik Takım');
    }
    return [];
  }, [userRole]);

  const allowedTechSlug = useMemo(() => {
    const roleToSlug: Record<string, string | undefined> = {
      web: 'web',
      ai: 'ai',
      game: 'game',
    };
    return roleToSlug[userRole] ?? undefined;
  }, [userRole]);

  const handleLogoutClick = async () => {
    await logout();
    router.push('/admin/login');
  };

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium leading-none">{userName || 'Kullanıcı'}</p>
            <p className="text-xs text-muted-foreground">{userEmail || '—'}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-white cursor-pointer"
            aria-label="Çıkış yap"
            onClick={handleLogoutClick}
          >
            <FontAwesomeIcon icon={faRightFromBracket} className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNavItems.map((item) => {
                const isActive = activeHref === item.href;
                if (item.label === 'Teknik Takım') {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        isActive={isTechnicalTeamRoute}
                        className="flex w-full items-center justify-between cursor-pointer"
                        onClick={() => setIsTechnicalTeamOpen((prev) => !prev)}
                        aria-expanded={isTechnicalTeamOpen}
                        aria-controls="technical-team-submenu"
                        data-state={isTechnicalTeamOpen ? 'open' : 'closed'}
                      >
                        <span>{item.label}</span>
                        <FontAwesomeIcon
                          icon={faChevronDown}
                          className={`h-3 w-3 transition-transform ${
                            isTechnicalTeamOpen ? 'rotate-180' : 'rotate-0'
                          }`}
                        />
                      </SidebarMenuButton>
                      {isTechnicalTeamOpen && (
                        <SidebarMenuSub id="technical-team-submenu">
                          {[
                            { label: 'Web', slug: 'web' },
                            { label: 'AI', slug: 'ai' },
                            { label: 'Game', slug: 'game' },
                          ]
                            .filter((sub) => {
                              // admin tüm altları görür; diğer roller sadece kendi alanını görür
                              if (userRole === 'admin') return true;
                              return allowedTechSlug ? sub.slug === allowedTechSlug : false;
                            })
                            .map((sub) => {
                            const href = `/admin/dashboard/technical-team/${sub.slug}`;
                            const isSubActive = activeHref === href;
                            return (
                              <SidebarMenuSubItem key={href}>
                                <SidebarMenuSubButton asChild isActive={isSubActive}>
                                  <Link href={href}>
                                    <span>{sub.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                            })}
                        </SidebarMenuSub>
                      )}
                    </SidebarMenuItem>
                  );
                }
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter />
    </>
  );
}
