'use client';

import React from 'react';
import AdminSidebar from '@/components/layout/AdminSidebar';
import { Sidebar, SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import useAuth, { type AuthUser } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';

type DashboardLayoutProps = {
  children: React.ReactNode;
};

export default function AdminDashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const { isAuthenticated, getAuthDetail } = useAuth();
  const pathname = usePathname();

  const [isChecking, setIsChecking] = React.useState(true);
  const [hasStoredToken, setHasStoredToken] = React.useState<boolean | null>(null);

  // İlk yüklemede localStorage'da token var mı bak
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = window.localStorage.getItem('auth_token');
      setHasStoredToken(Boolean(stored));
    } catch {
      setHasStoredToken(false);
    }
  }, []);

  // Auth doğrulama akışı
  React.useEffect(() => {
    if (hasStoredToken === null) return; // hâlâ depodaki token kontrol ediliyor

    let isMounted = true;

    const verifyAuth = async () => {
      // Depoda token yok ve state de authenticated değilse yönlendir
      if (!isAuthenticated && !hasStoredToken) {
        router.replace('/');
        return;
      }

      // Token var ve state authenticated ise detay kontrolü yap
      if (isAuthenticated) {
        const detail = await getAuthDetail();
        if ('error' in detail) {
          router.replace('/');
          return;
        }
        // Rol kontrolü
        const role = (detail as AuthUser).role;
        const onDashboardPage = pathname === '/admin/dashboard';
        
        // Admin rolü her sayfaya erişebilir
        if (role === 'admin') {
          if (isMounted) setIsChecking(false);
          return;
        }
        
        // Web, AI, Game rolleri sadece dashboard ve kendi teknik sayfasına erişebilir
        if (['web', 'ai', 'game'].includes(role)) {
          const isOwnTechnicalPage = pathname?.startsWith(`/admin/dashboard/technical-team/${role}`);
          if (!onDashboardPage && !isOwnTechnicalPage) {
            router.replace(`/admin/dashboard/technical-team/${role}`);
            return;
          }
          if (isMounted) setIsChecking(false);
          return;
        }
        if (isMounted) setIsChecking(false);
        return;
      }

      // Buraya gelindiyse depoda token var ama state hydrate olmadı; bekle
      // isAuthenticated değiştiğinde efekt tekrar çalışacak
    };

    void verifyAuth();
    return () => {
      isMounted = false;
    };
  }, [getAuthDetail, hasStoredToken, isAuthenticated, router, pathname]);

  if (isChecking) return null;

  return (
    <SidebarProvider>
      <div className="mx-auto w-full max-w-screen-xl px-4 py-6">
        <div className="flex gap-4">
          <Sidebar side="left" variant="sidebar" collapsible="offcanvas" className="border-r">
            <AdminSidebar />
          </Sidebar>
          <SidebarInset className="min-h-[60vh]">
            <div className="flex items-center gap-2 p-2 md:hidden">
              <SidebarTrigger />
              <h1 className="text-lg font-semibold">Admin Panel</h1>
            </div>
            {children}
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
}
