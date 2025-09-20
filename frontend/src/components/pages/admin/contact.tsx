'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useContact } from '@/hooks/useContact';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';

const PAGE_SIZE = 3;

export default function AdminContact() {
    const {
        contacts,
        totalCount,
        isFetchingContacts,
        listErrorMessage,
        isTogglingId,
        isDeletingId,
        fetchContacts,
        toggleReadStatus,
        deleteContact,
    } = useContact();
    const { isAuthenticated } = useAuth();

    const [searchQuery, setSearchQuery] = useState<string>('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [selectedMessageId, setSelectedMessageId] = useState<string | null>(null);
    const [isMessageDialogOpen, setIsMessageDialogOpen] = useState<boolean>(false);

    // StrictMode'da çift çalışmayı önlemek için guard
    const hasFetchedRef = useRef<boolean>(false);
    useEffect(() => {
        if (hasFetchedRef.current) return;
        if (!isAuthenticated) return;
        hasFetchedRef.current = true;
        void fetchContacts();
    }, [isAuthenticated, fetchContacts]);

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
        setCurrentPage(1);
    };

    const filteredContacts = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return contacts;
        return contacts.filter((item) => {
            const haystack = [
                item.name,
                item.email,
                item.subject,
                item.message,
            ]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return haystack.includes(query);
        });
    }, [contacts, searchQuery]);

    const totalPages = useMemo(() => {
        if (!filteredContacts.length) return 1;
        return Math.max(1, Math.ceil(filteredContacts.length / PAGE_SIZE));
    }, [filteredContacts.length]);

    const paginatedContacts = useMemo(() => {
        const start = (currentPage - 1) * PAGE_SIZE;
        const end = start + PAGE_SIZE;
        return filteredContacts.slice(start, end);
    }, [filteredContacts, currentPage]);

    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(1, prev - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(totalPages, prev + 1));
    };

    const handleOpenMessage = (id: string) => {
        setSelectedMessageId(id);
        setIsMessageDialogOpen(true);
    };

    const selectedMessage = useMemo(() => {
        if (!selectedMessageId) return null;
        return contacts.find((c) => c._id === selectedMessageId) || null;
    }, [contacts, selectedMessageId]);

    const handleToggleRead = async (id: string) => {
        await toggleReadStatus(id);
    };

    const handleDelete = async (id: string) => {
        const confirmed = window.confirm('Bu mesajı silmek istediğinize emin misiniz?');
        if (!confirmed) return;
        await deleteContact(id);
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-center w-full">
                <Input
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="Ara: isim, e-posta, konu, mesaj"
                    aria-label="İletişim mesajlarında ara"
                    className="max-w-md"
                />
            </div>

            <Separator />

            {listErrorMessage && (
                <div className="rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm" role="alert">
                    {listErrorMessage}
                </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>
                    Toplam kayıt: {totalCount}
                </span>
            </div>

            <div className="grid gap-3">
                {isFetchingContacts && !contacts.length ? (
                    <div className="text-sm text-muted-foreground">Yükleniyor...</div>
                ) : paginatedContacts.length ? (
                    paginatedContacts.map((item) => (
                        <Card key={item._id} className="gap-3">
                            <CardHeader className="pb-2">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="min-w-0">
                                        <CardTitle className="truncate">
                                            {item.subject || 'Konu yok'}
                                        </CardTitle>
                                        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                                            <span className="font-medium text-foreground truncate max-w-[18rem]" title={item.name}>{item.name}</span>
                                            <span aria-hidden>•</span>
                                            <span className="truncate max-w-[18rem]" title={item.email}>{item.email}</span>
                                            <span aria-hidden>•</span>
                                            <time dateTime={item.createdAt} title={new Date(item.createdAt).toLocaleString()}>
                                                {new Date(item.createdAt).toLocaleDateString()}
                                            </time>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={
                                                item.isRead
                                                    ? 'inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground'
                                                    : 'inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs text-primary'
                                            }
                                            aria-label={item.isRead ? 'Okundu' : 'Okunmadı'}
                                        >
                                            {item.isRead ? 'Okundu' : 'Okunmadı'}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <p className="line-clamp-2 text-sm text-foreground/90" title={item.message}>{item.message}</p>
                            </CardContent>
                            <CardFooter className="flex items-center justify-end gap-2">
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    className='cursor-pointer'
                                    onClick={() => handleOpenMessage(item._id)}
                                    aria-label="Mesajı görüntüle"
                                >
                                    Tamamını Gör
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className='cursor-pointer'
                                    onClick={() => handleToggleRead(item._id)}
                                    disabled={isTogglingId === item._id}
                                    aria-label={item.isRead ? 'Okunmadı yap' : 'Okundu yap'}
                                >
                                    {isTogglingId === item._id ? 'Güncelleniyor...' : item.isRead ? 'Okunmadı Yap' : 'Okundu Yap'}
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    className='cursor-pointer'
                                    onClick={() => handleDelete(item._id)}
                                    disabled={isDeletingId === item._id}
                                    aria-label="Mesajı sil"
                                >
                                    {isDeletingId === item._id ? 'Siliniyor...' : 'Sil'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))
                ) : (
                    <div className="text-sm text-muted-foreground">Kayıt bulunamadı.</div>
                )}
            </div>

            <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage <= 1}
                    aria-label="Önceki sayfa"
                >
                    Önceki
                </Button>
                <div className="text-sm text-muted-foreground">
                    Sayfa {currentPage} / {totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                    aria-label="Sonraki sayfa"
                >
                    Sonraki
                </Button>
            </div>

            <Dialog open={isMessageDialogOpen} onOpenChange={setIsMessageDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{selectedMessage?.subject || 'Mesaj'}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 text-sm">
                        {selectedMessage && (
                            <>
                                <div className="text-muted-foreground">
                                    <span className="font-medium text-foreground">Gönderen:</span> {selectedMessage.name} ({selectedMessage.email})
                                </div>
                                <div className="text-muted-foreground">
                                    <span className="font-medium text-foreground">Tarih:</span> {new Date(selectedMessage.createdAt).toLocaleString()}
                                </div>
                                <Separator />
                                <div className="whitespace-pre-wrap text-foreground" aria-label="Mesaj içeriği">
                                    {selectedMessage.message}
                                </div>
                            </>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}