'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSubmissions } from '@/hooks/useSubmissions';
import { useAuth } from '@/hooks/useAuth';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

const TYPE = 'general';
const PAGE_SIZE = 8;

const formatStatus = (status: string): string => {
  switch (status) {
    case 'reviewed':
      return 'İncelelendi';
    case 'pending':
      return 'Beklemede';
    case 'approved':
      return 'Onaylandı';
    case 'rejected':
      return 'Reddedildi';
    default:
      return status;
  }
};

const formatCustomFields = (field: string): string => {
    switch (field) {
      case 'question_interests':
        return 'İlgi Alanları';
      case 'question_github':
        return 'GitHub URL';
      case 'question_experience':
        return 'Deneyim';
      case 'question_motivation':
        return 'Motivasyon';
      case 'question_portfolio':
        return 'Portfolyo URL';
      case 'question_linkedin':
        return 'Linkedin URL';
      case 'question_itchio':
        return 'Itch.io URL';
      default:
        return field;
    }
  };

  const isProbablyUrl = (value: string): boolean => {
    if (!value) return false;
    return /^(https?:\/\/|www\.)/i.test(value);
  };

  const isEmail = (value: string): boolean => {
    if (!value) return false;
    // Basit e-posta kontrolü
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isPhone = (value: string): boolean => {
    if (!value) return false;
    return /^(0|\+90|5)[\d\s().-]{6,}$/.test(value);
  };

  const renderValue = (value: string) => {
    if (!value) return '';
    if (isProbablyUrl(value)) {
      const href = /^https?:\/\//i.test(value) ? value : `https://${value}`;
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 break-words"
          aria-label="Bağlantıyı yeni sekmede aç"
        >
          {value}
        </a>
      );
    }
    if (isEmail(value)) {
      return (
        <a
          href={`mailto:${value}`}
          className="text-primary underline underline-offset-2 break-words"
          aria-label="E-posta adresine mail gönder"
        >
          {value}
        </a>
      );
    }
    if (isPhone(value)) {
      const telHref = `tel:${value.replace(/[^\d+]/g, '')}`;
      return (
        <a
          href={telHref}
          className="text-primary underline underline-offset-2 break-words"
          aria-label="Telefon numarasını ara"
        >
          {value}
        </a>
      );
    }
    return value;
  };

export default function AdminGeneralMembership() {
    const { listSubmissions, submissions, isFetchingSubmissions, pagination, updateSubmission, isUpdatingSubmission, submissionsError } = useSubmissions();
    const { isAuthenticated } = useAuth();

    const [page, setPage] = useState<number>(1);
    const [searchValue, setSearchValue] = useState<string>('');
    const [statusFilter, setStatusFilter] = useState<'' | 'pending' | 'reviewed' | 'approved' | 'rejected'>('');

    // Dialog state
    const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
    const [reviewOpen, setReviewOpen] = useState<boolean>(false);
    const [selectedId, setSelectedId] = useState<string | null>(null);

    // Review form state
    const [reviewStatus, setReviewStatus] = useState<'pending' | 'approved' | 'rejected' | string>('pending');
    const [reviewNotes, setReviewNotes] = useState<string>('');

    const selectedSubmission = useMemo(() => submissions.find((s) => s._id === selectedId) || null, [selectedId, submissions]);

    // StrictMode tekrarlı çağrıyı engellemek için guard
    const hasFetchedRef = useRef<boolean>(false);

    // İlk yükleme ve sayfa değişimlerinde listele (auth sonrası)
    useEffect(() => {
        if (!isAuthenticated) return;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = { type: TYPE, page, limit: PAGE_SIZE, search: searchValue ?? '' };
        if (statusFilter) params.status = statusFilter;
        listSubmissions(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, page]);

    // Debounced arama (auth sonrası)
    useEffect(() => {
        if (!isAuthenticated) return;
        const handle = setTimeout(() => {
            setPage(1);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params: any = { type: TYPE, page: 1, limit: PAGE_SIZE, search: searchValue ?? '' };
            if (statusFilter) params.status = statusFilter;
            listSubmissions(params);
        }, 400);
        return () => clearTimeout(handle);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, searchValue]);

    // Durum filtresi değiştiğinde anında uygula
    useEffect(() => {
        if (!isAuthenticated) return;
        setPage(1);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = { type: TYPE, page: 1, limit: PAGE_SIZE, search: searchValue ?? '' };
        if (statusFilter) params.status = statusFilter;
        listSubmissions(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, statusFilter]);

    // Auth oldu ama henüz hiç çekilmediyse, bir kez tetikle (özellikle initial mount için)
    useEffect(() => {
        if (!isAuthenticated) return;
        if (hasFetchedRef.current) return;
        hasFetchedRef.current = true;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const params: any = { type: TYPE, page: 1, limit: PAGE_SIZE, search: '' };
        if (statusFilter) params.status = statusFilter;
        void listSubmissions(params);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const handlePrevPage = () => {
        if (isFetchingSubmissions) return;
        if (page <= 1) return;
        setPage((p) => Math.max(1, p - 1));
    };

    const handleNextPage = () => {
        if (isFetchingSubmissions) return;
        if (pagination.totalPages && page >= pagination.totalPages) return;
        setPage((p) => p + 1);
    };

    const handleOpenDetails = (id: string) => {
        setSelectedId(id);
        setDetailsOpen(true);
    };

    const handleOpenReview = (id: string) => {
        setSelectedId(id);
        const current = submissions.find((s) => s._id === id);
        setReviewStatus((current?.status as 'pending' | 'approved' | 'rejected' | string) || 'pending');
        setReviewNotes(current?.reviewNotes || '');
        setReviewOpen(true);
    };

    const handleSubmitReview = async () => {
        if (!selectedId) return;
        const res = await updateSubmission(selectedId, { status: reviewStatus, reviewNotes });
        if (res.success) {
            setReviewOpen(false);
            // Listeyi güncel tutmak için sayfayı mevcut parametrelerle yenile
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const params: any = { type: TYPE, page, limit: PAGE_SIZE, search: searchValue ?? '' };
            if (statusFilter) params.status = statusFilter;
            await listSubmissions(params);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Search + Status filter (centered) */}
            <div className="flex justify-center w-full">
                <div className="flex w-full max-w-2xl items-center gap-3">
                    <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Ara: isim, numara, e-posta..."
                        className="flex-1"
                        aria-label="Genel başvurular arama"
                    />
                    <select
                        className="h-9 w-[180px] rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
                        aria-label="Durum filtresi"
                    >
                        <option value="">Tümü</option>
                        <option value="pending">Beklemede</option>
                        <option value="reviewed">İncelelendi</option>
                        <option value="approved">Onaylandı</option>
                        <option value="rejected">Reddedildi</option>
                    </select>
                </div>
            </div>

            <Separator />

            {submissionsError && (
                <div className="rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm" role="alert">
                    {submissionsError}
                </div>
            )}

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>Toplam kayıt: {pagination.count || 0}</span>
            </div>

            {/* Liste */}
            <div className="grid gap-3">
                {isFetchingSubmissions && submissions.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Yükleniyor...</div>
                ) : submissions.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Gösterilecek başvuru bulunamadı.</div>
                ) : (
                    submissions.map((item) => (
                        <Card key={item._id} className="flex items-center justify-between px-4 py-3">
                            <div className="grid w-full grid-cols-12 items-center gap-2">
                                <div className="col-span-3 truncate text-sm font-medium" aria-label="Öğrenci numarası">
                                    {item.studentId}
                                </div>
                                <div className="col-span-6 truncate text-sm" aria-label="Ad soyad">
                                    {item.name}
                                </div>
                                <div className="col-span-3 flex items-center justify-end gap-2">
                                    <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground" aria-label="Durum">
                                        {formatStatus(item.status)}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="cursor-pointer"
                                        onClick={() => handleOpenDetails(item._id)}
                                        aria-label="Başvuru detaylarını görüntüle"
                                    >
                                        Detay
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        className="cursor-pointer"
                                        onClick={() => handleOpenReview(item._id)}
                                        aria-label="Başvuruyu incele"
                                    >
                                        İncele
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination (footer-like) */}
            <div className="flex items-center justify-between gap-3 pt-2">
                <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={handlePrevPage}
                    disabled={isFetchingSubmissions || (pagination.page || page) <= 1}
                    aria-label="Önceki sayfa"
                >
                    Önceki
                </Button>
                <div className="text-sm text-muted-foreground">
                    Sayfa {pagination.page || page} / {Math.max(1, pagination.totalPages || 1)}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={handleNextPage}
                    disabled={
                        isFetchingSubmissions ||
                        (pagination.totalPages ? (pagination.page || page) >= pagination.totalPages : false)
                    }
                    aria-label="Sonraki sayfa"
                >
                    Sonraki
                </Button>
            </div>

            {/* Detay Dialog */}
            <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
                <DialogContent aria-describedby={undefined} className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Başvuru Detayı</DialogTitle>
                        <DialogDescription>
                            Başvuruya ait temel bilgiler aşağıdadır.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedSubmission ? (
                        <div className="grid grid-cols-2 gap-3 text-sm">
                            {[
                                { label: "Öğrenci No", value: selectedSubmission.studentId },
                                { label: "Ad Soyad", value: selectedSubmission.name },
                                { label: "E-posta", value: selectedSubmission.email },
                                { label: "Telefon", value: selectedSubmission.phone },
                                { label: "Fakülte", value: selectedSubmission.faculty },
                                { label: "Bölüm", value: selectedSubmission.department },
                                { label: "Sınıf", value: selectedSubmission.grade },
                                { label: "Durum", value: formatStatus(selectedSubmission.status) }
                            ].map((item, index) => (
                                <div key={index}>
                                    <div className="text-muted-foreground">{item.label}</div>
                                    <div className="font-medium break-words break-all">{renderValue(String(item.value))}</div>
                                </div>
                            ))}
                            {selectedSubmission.customFields ?
                                Object.entries(selectedSubmission.customFields).map(([key, value]) => (
                                    <div key={key}>
                                        <div className="text-muted-foreground">{formatCustomFields(key)}</div>
                                        <div className="font-medium break-words break-all">{renderValue(String(value))}</div>
                                    </div>
                                ))
                            : null}
                            {selectedSubmission.reviewNotes ? (
                                <div className="col-span-2">
                                    <div className="text-muted-foreground">İnceleme Notu</div>
                                    <div className="font-medium whitespace-pre-wrap break-words break-all">{selectedSubmission.reviewNotes}</div>
                                </div>
                            ) : null}
                        </div>
                    ) : (
                        <div className="text-sm text-muted-foreground">Kayıt yüklenemedi.</div>
                    )}
                </DialogContent>
            </Dialog>

            {/* İncele Dialog */}
            <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
                <DialogContent aria-describedby={undefined} className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Başvuruyu İncele</DialogTitle>
                        <DialogDescription>
                            Durumu güncelleyin ve gerekirse not ekleyin.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-3">
                        <div className="grid gap-1.5">
                            <Label htmlFor="status">Durum</Label>
                            <select
                                id="status"
                                className="h-9 rounded-md border bg-background px-3 text-sm shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
                                value={reviewStatus}
                                onChange={(e) => setReviewStatus(e.target.value)}
                                aria-label="Başvuru durumu seçimi"
                            >
                                <option value="pending">Beklemede</option>
                                <option value="reviewed">İncelelendi</option>
                                <option value="approved">Onaylandı</option>
                                <option value="rejected">Reddedildi</option>
                            </select>
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="notes">İnceleme Notu</Label>
                            <Textarea
                                id="notes"
                                value={reviewNotes}
                                onChange={(e) => setReviewNotes(e.target.value)}
                                placeholder="Not ekleyin (opsiyonel)"
                                className="min-h-[96px]"
                                aria-label="İnceleme notu"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            className="cursor-pointer"
                            onClick={handleSubmitReview}
                            disabled={isUpdatingSubmission}
                            aria-label="Kaydet"
                        >
                            {isUpdatingSubmission ? 'Kaydediliyor...' : 'Kaydet'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}