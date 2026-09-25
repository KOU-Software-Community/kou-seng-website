'use client';

import { useState } from 'react';
import { useSubmissions, type PurgeScope } from '@/hooks/useSubmissions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';

type ScopeOption = { key: PurgeScope; label: string; type?: 'general' | 'technical'; category?: string };

// Liste/dışa aktarma filtreleri backend'deki PURGE_SCOPES ile birebir aynı
// kayıtları seçmeli; yoksa indirilen yedek silinen kayıtları kapsamaz.
const SCOPES: ScopeOption[] = [
    { key: 'general', label: 'Genel Üyelik', type: 'general' },
    { key: 'mobil-web', label: 'Mobil Web', type: 'technical', category: 'mobil-web' },
    { key: 'ai', label: 'AI', type: 'technical', category: 'ai' },
    { key: 'game', label: 'Game', type: 'technical', category: 'game' },
    { key: 'all', label: 'Tümü' },
];

type Notice = { kind: 'success' | 'error'; text: string };

export default function AdminDataManagement() {
    const { listSubmissions, isFetchingSubmissions, downloadSubmissionsCsv, purgeSubmissions } = useSubmissions();

    // Kapsam bilerek boş başlar: silinecek küme her seferinde açıkça seçilir.
    const [scope, setScope] = useState<ScopeOption | null>(null);
    const [count, setCount] = useState<number | null>(null);
    const [hasBackup, setHasBackup] = useState<boolean>(false);
    const [isDownloading, setIsDownloading] = useState<boolean>(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);
    const [typedCount, setTypedCount] = useState<string>('');
    const [isPurging, setIsPurging] = useState<boolean>(false);
    const [notice, setNotice] = useState<Notice | null>(null);

    const loadCount = async (option: ScopeOption) => {
        setCount(null);
        const result = await listSubmissions({ type: option.type, category: option.category, limit: 1 });
        if (result.success) setCount(result.count);
        else setNotice({ kind: 'error', text: result.message });
    };

    const handleScopeChange = (option: ScopeOption) => {
        setScope(option);
        setHasBackup(false);
        setNotice(null);
        void loadCount(option);
    };

    const handleDownload = async () => {
        if (!scope) return;
        setIsDownloading(true);
        const error = await downloadSubmissionsCsv(
            { type: scope.type, category: scope.category },
            `basvurular-${scope.key}-${new Date().toISOString().slice(0, 10)}.csv`
        );
        setIsDownloading(false);
        if (error) {
            setNotice({ kind: 'error', text: error });
            return;
        }
        setHasBackup(true);
        setNotice({ kind: 'success', text: 'Yedek indirildi. Dosyayı açıp kontrol ettikten sonra silebilirsiniz.' });
    };

    const handleConfirmOpenChange = (open: boolean) => {
        setIsConfirmOpen(open);
        if (!open) setTypedCount('');
    };

    const handlePurge = async () => {
        if (!scope || count === null) return;
        setIsPurging(true);
        const result = await purgeSubmissions(scope.key, count);
        setIsPurging(false);
        handleConfirmOpenChange(false);
        // Başarılı da olsa (kayıt kalmadı), 409 da olsa (sayı değişti) eldeki yedek artık geçersiz.
        setHasBackup(false);
        setNotice({ kind: result.success ? 'success' : 'error', text: result.message });
        void loadCount(scope);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Veri Yönetimi</h1>
                <p className="text-muted-foreground mt-2">
                    Başvuruların yedeğini alın ve saklama süresi dolan kayıtları silin.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Başvuruları sil</CardTitle>
                    <CardDescription>
                        Önce kapsamı seçin, ardından yedeği indirin. Silme yalnızca yedek indirildikten sonra açılır ve geri alınamaz.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-6">
                    <fieldset className="grid gap-2" disabled={isFetchingSubmissions || isDownloading || isPurging}>
                        <legend className="mb-2 text-sm font-medium">1. Kapsam</legend>
                        {SCOPES.map((option) => (
                            <label key={option.key} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="radio"
                                    name="purge-scope"
                                    value={option.key}
                                    checked={scope?.key === option.key}
                                    onChange={() => handleScopeChange(option)}
                                />
                                {option.label}
                            </label>
                        ))}
                    </fieldset>

                    {scope && (
                        <p className="text-sm" aria-live="polite">
                            {scope.label} kapsamındaki kayıt sayısı:{' '}
                            <strong>{isFetchingSubmissions ? 'sayılıyor…' : count ?? '—'}</strong>
                        </p>
                    )}

                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleDownload} disabled={!count || isDownloading || isPurging} className="cursor-pointer">
                            {isDownloading ? 'İndiriliyor...' : '2. Yedeği indir (CSV)'}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={() => setIsConfirmOpen(true)}
                            disabled={!hasBackup || !count || isPurging}
                            className="cursor-pointer"
                        >
                            3. Sil
                        </Button>
                    </div>

                    {notice && (
                        <div
                            role={notice.kind === 'error' ? 'alert' : 'status'}
                            className={`rounded-md px-3 py-2 text-sm ${
                                notice.kind === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                            }`}
                        >
                            {notice.text}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isConfirmOpen} onOpenChange={handleConfirmOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Başvuruları kalıcı olarak sil</DialogTitle>
                        <DialogDescription>
                            {scope?.label} kapsamındaki {count} başvuru silinecek. Bu işlem geri alınamaz.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label htmlFor="purge-count">Onaylamak için kayıt sayısını ({count}) yazın</Label>
                        <Input
                            id="purge-count"
                            inputMode="numeric"
                            autoComplete="off"
                            value={typedCount}
                            onChange={(e) => setTypedCount(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => handleConfirmOpenChange(false)} className="cursor-pointer">
                            Vazgeç
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handlePurge}
                            disabled={isPurging || typedCount.trim() !== String(count)}
                            className="cursor-pointer"
                        >
                            {isPurging ? 'Siliniyor...' : 'Kalıcı olarak sil'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
