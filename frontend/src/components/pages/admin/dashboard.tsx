'use client';

import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useStatus } from '@/hooks/useStatus';
import { useAuth } from '@/hooks/useAuth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faSpinner, 
  faUsers, 
  faClipboardList, 
  faEnvelope,
  faExclamationTriangle 
} from '@fortawesome/free-solid-svg-icons';

export default function AdminDashboard() {
  const { statusData, isFetching, errorMessage, fetchStatus } = useStatus();
  const { isAuthenticated } = useAuth();

  // StrictMode'da çift çalışmayı önlemek için guard
  const hasFetchedRef = useRef<boolean>(false);
  useEffect(() => {
    if (hasFetchedRef.current) return;
    if (!isAuthenticated) return;
    hasFetchedRef.current = true;
    void fetchStatus();
  }, [isAuthenticated, fetchStatus]);

  if (isFetching) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Sistem istatistikleri ve genel durum bilgileri
          </p>
        </div>
        
        <div className="flex justify-center items-center h-64">
          <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Sistem istatistikleri ve genel durum bilgileri
          </p>
        </div>
        
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <FontAwesomeIcon icon={faExclamationTriangle} className="h-5 w-5" />
              Hata
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-destructive">{errorMessage}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Sistem istatistikleri ve genel durum bilgileri
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Genel Üye Başvuruları */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Genel Üye Başvuruları
            </CardTitle>
            <FontAwesomeIcon icon={faUsers} className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">İnceleme Bekleyen:</span>
                <span className="text-2xl font-bold">
                  {statusData?.generalSubmissions.pending ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Onay Bekleyen:</span>
                <span className="text-2xl font-bold">
                  {statusData?.generalSubmissions.reviewed ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Onaylandı:</span>
                <span className="text-2xl font-bold">
                  {statusData?.generalSubmissions.accepted ?? 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Teknik Takım Başvuruları */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Teknik Takım Başvuruları
            </CardTitle>
            <FontAwesomeIcon icon={faClipboardList} className="h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Web:</span>
              <span className="text-2xl font-bold">
                {statusData?.technicalSubmissions.web ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">AI:</span>
              <span className="text-2xl font-bold">
                {statusData?.technicalSubmissions.ai ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Game:</span>
              <span className="text-2xl font-bold">
                {statusData?.technicalSubmissions.game ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* İletişim Mesajları */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              İletişim Mesajları
            </CardTitle>
            <FontAwesomeIcon icon={faEnvelope} className="h-4 w-4" />
          </CardHeader>
          <CardContent>
          <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Okunmuş:</span>
              <span className="text-2xl font-bold">
                {statusData?.contactMessages.read ?? 0}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Okunmamış:</span>
              <span className="text-2xl font-bold">
                {statusData?.contactMessages.unread ?? 0}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Özet Bilgiler */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Sistem Özeti</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">
                  {(statusData?.generalSubmissions.pending ?? 0) + (statusData?.generalSubmissions.reviewed ?? 0) + (statusData?.generalSubmissions.accepted ?? 0)}
                </div>
                <div className="text-sm text-muted-foreground">Toplam Genel Başvuru</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">
                  {(statusData?.technicalSubmissions.web ?? 0) + (statusData?.technicalSubmissions.ai ?? 0) + (statusData?.technicalSubmissions.game ?? 0)}
                </div>
                <div className="text-sm text-muted-foreground">Toplam Teknik Başvuru</div>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <div className="text-2xl font-bold">
                  {(statusData?.contactMessages.read ?? 0) + (statusData?.contactMessages.unread ?? 0)}
                </div>
                <div className="text-sm text-muted-foreground">Toplam Mesaj</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}