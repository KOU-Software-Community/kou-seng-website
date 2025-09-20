'use client';

import * as React from "react";
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faCalendarDays, faBullhorn, faEye, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import useAnnouncements from '@/hooks/useAnnouncements';

export default function Announcements() {
    const {
        announcements,
        isLoading,
        currentPage,
        totalPages,
        searchInput,
        setSearchInput,
        handleSearch,
        goToPage,
        nextPage,
        prevPage,
        selectedAnnouncement,
        handleAnnouncementClick,
        closeAnnouncementDetail
    } = useAnnouncements(5);

    // Tarih formatını düzenleyen yardımcı fonksiyon
    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), 'd MMMM yyyy', { locale: tr });
        } catch {
            return dateString; // Hatalı tarih formatı durumunda orijinal string'i döndür
        }
    };

    // Pagination numaralarını oluşturma
    const paginationItems = [];
    for (let i = 1; i <= totalPages; i++) {
        paginationItems.push(
            <Button
                key={i}
                variant={currentPage === i ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => goToPage(i)}
                className="w-8 h-8 p-0"
            >
                {i}
            </Button>
        );
    }

    return (
        <main className="flex flex-col">
            <div className="container py-8 md:py-12">
                <div className="mb-8 mx-auto text-center max-w-3xl">
                    <h1 className="mb-2 text-3xl font-bold tracking-tight md:text-4xl">Duyurular</h1>
                    <p className="text-muted-foreground">
                        Kulübümüze ait en güncel duyurular ve etkinlik bilgilerine buradan ulaşabilirsiniz.
                    </p>
                </div>

                {/* Arama ve filtreleme */}
                <div className="mb-6">
                    <div className="relative w-full max-w-md mx-auto">
                        <FontAwesomeIcon
                            icon={faSearch}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4"
                        />
                        <Input
                            type="text"
                            placeholder="Duyuru ara..."
                            className="pl-10 pr-4"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <FontAwesomeIcon icon={faSpinner} className="h-8 w-8 text-primary animate-spin" />
                    </div>
                ) : announcements.length > 0 ? (
                    <div className="space-y-4">
                        {announcements.map((announcement) => (
                            <Card key={announcement._id} className="gap-0 hover:shadow-md transition-shadow">
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="mb-2">{announcement.title}</CardTitle>
                                            <CardDescription className="flex items-center gap-1 text-xs">
                                                <FontAwesomeIcon icon={faCalendarDays} className="h-3 w-3" />
                                                <span>{formatDate(announcement.createdAt)}</span>
                                                <span className="mx-1">•</span>
                                                <FontAwesomeIcon icon={faBullhorn} className="h-3 w-3" />
                                                <span>{announcement.category}</span>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {announcement.summary}
                                    </p>
                                </CardContent>
                                <CardFooter className="pt-0 justify-end">
                                    <Button variant="ghost" size="sm" onClick={() => handleAnnouncementClick(announcement)} className="cursor-pointer">
                                        <FontAwesomeIcon icon={faEye} className="mr-2 h-4 w-4" /> Duyuruyu Oku
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="text-center p-12 border rounded-lg">
                        <FontAwesomeIcon icon={faBullhorn} className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">Duyuru Bulunamadı</h3>
                        <p className="text-muted-foreground">Aradığınız kriterlere uygun duyuru bulunmamaktadır.</p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-8">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={prevPage}
                            disabled={currentPage === 1}
                            className="w-24"
                        >
                            Önceki
                        </Button>
                        <div className="flex gap-1">
                            {paginationItems}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={nextPage}
                            disabled={currentPage === totalPages}
                            className="w-24"
                        >
                            Sonraki
                        </Button>
                    </div>
                )}

                {/* Duyuru Detay Dialog */}
                <Dialog open={!!selectedAnnouncement} onOpenChange={closeAnnouncementDetail}>
                    <DialogContent className="sm:max-w-2xl">
                        {selectedAnnouncement && (
                            <>
                                <DialogHeader>
                                    <DialogTitle className="text-xl md:text-2xl">{selectedAnnouncement.title}</DialogTitle>
                                    <DialogDescription className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-2">
                                        <span className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faCalendarDays} className="h-3 w-3" />
                                            <span>{formatDate(selectedAnnouncement.createdAt)}</span>
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <FontAwesomeIcon icon={faBullhorn} className="h-3 w-3" />
                                            <span>{selectedAnnouncement.category}</span>
                                        </span>
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4 text-sm space-y-4 overflow-auto max-h-96 prose prose-sm prose-p:text-muted-foreground prose-a:text-primary hover:prose-a:text-primary/80 hover:prose-a:underline prose-li:text-muted-foreground prose-strong:text-foreground">
                                    {/* HTML içeriği dangerouslySetInnerHTML ile render ediyoruz */}
                                    <div
                                        className="text-muted-foreground rich-html"
                                        dangerouslySetInnerHTML={{ __html: selectedAnnouncement.content }}
                                    />
                                </div>
                                <div className="mt-4 flex justify-end">
                                    <Button onClick={closeAnnouncementDetail} className="cursor-pointer">Kapat</Button>
                                </div>
                            </>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </main>
    );
}