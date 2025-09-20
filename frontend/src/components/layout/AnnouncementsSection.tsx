'use client';

import Link from "next/link";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faScroll, faSpinner, faBullhorn } from '@fortawesome/free-solid-svg-icons';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useAnnouncements from '@/hooks/useAnnouncements';

type AnnouncementsSectionProps = {
  title: string;
  description: string;
  viewAllHref: string;
  viewAllText: string;
  maxItems?: number;
};

export default function AnnouncementsSection({ 
  title, 
  description, 
  viewAllHref, 
  viewAllText,
  maxItems = 2 
}: AnnouncementsSectionProps) {
  const { announcements, isLoading, error } = useAnnouncements();

  // Tarih formatını düzenleyen yardımcı fonksiyon
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'd MMMM yyyy', { locale: tr });
    } catch {
      return dateString; // Hatalı tarih formatı durumunda orijinal string'i döndür
    }
  };

  return (
    <section className="container">
      <div className="mb-12 mx-auto text-center max-w-3xl">
        <h2 className="mb-2 text-3xl font-bold tracking-tight">{title}</h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          {description}
        </p>
      </div>

      <div className="mx-auto max-w-3xl">
        {/* Duyurular */}
        <Card>
          <CardHeader>
            <CardTitle>Güncel Duyurular</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <FontAwesomeIcon icon={faSpinner} className="h-6 w-6 text-primary animate-spin" />
              </div>
            ) : error ? (
              <div className="text-center p-6">
                <p className="text-sm text-muted-foreground">Duyurular yüklenirken bir hata oluştu.</p>
              </div>
            ) : announcements.length === 0 ? (
              <div className="text-center p-6">
                <p className="text-sm text-muted-foreground">Şu an gösterilecek duyuru bulunmamaktadır.</p>
              </div>
            ) : (
              announcements.slice(0, maxItems).map((announcement) => (
                <div key={announcement._id} className="rounded-lg border p-4">
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-medium">{announcement.title}</p>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <FontAwesomeIcon icon={faBullhorn} className="h-3 w-3" />
                      {announcement.category}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">
                    {announcement.summary}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    <FontAwesomeIcon icon={faScroll} className="h-3 w-3 mr-1" />
                    {formatDate(announcement.createdAt)}
                  </p>
                </div>
              ))
            )}
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" size="sm" className="mx-auto cursor-pointer">
              <Link href={viewAllHref}>
                <FontAwesomeIcon icon={faScroll} className="mr-2 h-4 w-4" /> {viewAllText}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}