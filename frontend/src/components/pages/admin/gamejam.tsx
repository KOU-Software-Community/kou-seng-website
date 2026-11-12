'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PixelLoader } from '@/components/layout/Pixel';
import { useGameJam } from '@/hooks/useGameJam';
import { ANSWER_KEYS, QUESTIONS, ageOf, disciplineLabel, type JamApplication, type JamPerson } from '@/lib/gameJam';

type Notice = { kind: 'success' | 'error'; text: string };

const dateTime = new Intl.DateTimeFormat('tr-TR', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Istanbul' });

// Bağlantılar backend'de http(s) olarak doğrulanıyor; yine de başka şema link olmaz
const ExternalLink = ({ href, children }: { href: string; children: React.ReactNode }) =>
    /^https?:\/\//i.test(href) ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:text-primary break-all">{children}</a>
    ) : (
        <span className="break-all">{href}</span>
    );

function PersonRow({ person, role, email, phone }: { person: JamPerson; role: string; email?: string; phone?: string }) {
    const disciplines = person.disciplines
        .map((d) => (d === 'other' && person.otherDiscipline ? `Diğer: ${person.otherDiscipline}` : disciplineLabel(d)))
        .join(', ');
    return (
        <div className="grid gap-1 rounded-md border p-3 text-sm">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-medium">
                    {person.name} <span className="text-muted-foreground font-normal">· {role} · {ageOf(person.birthDate)} yaş</span>
                </p>
                {email && (
                    <span className="text-xs text-muted-foreground">Fotoğraf/video izni: {person.mediaConsent ? 'Var' : 'Yok'}</span>
                )}
            </div>
            {email && <p>{email} · {phone}</p>}
            <p className="text-muted-foreground">{person.university} · {person.department}</p>
            <p>{disciplines}</p>
            <p className="flex flex-wrap gap-x-4">
                <ExternalLink href={person.cvUrl}>CV</ExternalLink>
                {person.projectUrl && <ExternalLink href={person.projectUrl}>Oyun projesi</ExternalLink>}
            </p>
        </div>
    );
}

export default function AdminGameJam() {
    const { list, downloadCsv, purge } = useGameJam();
    const [applications, setApplications] = useState<JamApplication[] | null>(null);
    const [notice, setNotice] = useState<Notice | null>(null);
    const [hasBackup, setHasBackup] = useState(false);
    const [isBusy, setIsBusy] = useState(false);
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [typedCount, setTypedCount] = useState('');

    const load = useCallback(async () => {
        const result = await list();
        setApplications(result.data);
        setNotice(result.success ? null : { kind: 'error', text: result.message });
    }, [list]);

    useEffect(() => {
        void load();
    }, [load]);

    const count = applications?.length ?? 0;
    const people = applications?.reduce((n, a) => n + 1 + a.members.length, 0) ?? 0;

    const handleDownload = async () => {
        setIsBusy(true);
        const error = await downloadCsv(`gamejam-${new Date().toISOString().slice(0, 10)}.csv`);
        setIsBusy(false);
        setHasBackup(!error);
        setNotice(error ? { kind: 'error', text: error } : { kind: 'success', text: 'CSV indirildi.' });
    };

    const closeConfirm = () => {
        setIsConfirmOpen(false);
        setTypedCount('');
    };

    const handlePurge = async () => {
        setIsBusy(true);
        const result = await purge(count);
        setIsBusy(false);
        closeConfirm();
        // Başarılı da olsa, sayı değişmiş (409) de olsa eldeki yedek artık geçersiz
        setHasBackup(false);
        setNotice({ kind: result.success ? 'success' : 'error', text: result.message });
        void load();
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Game Jam</h1>
                <p className="text-muted-foreground mt-2">
                    Takım başvuruları. Formun açılış ve kapanışı <strong>Başvuru Dönemleri</strong> sayfasından ayarlanır.
                </p>
            </div>

            <Card className="mb-6">
                <CardHeader>
                    <CardTitle>{count} takım · {people} kişi</CardTitle>
                    <CardDescription>
                        CSV kişi başına bir satırdır; senaryo cevapları lider satırındadır. Etkinlik bitince yedeği alıp başvuruları silin.
                    </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4">
                    <div className="flex flex-wrap gap-2">
                        <Button onClick={handleDownload} disabled={!count || isBusy} className="cursor-pointer">
                            CSV indir
                        </Button>
                        <Button variant="destructive" onClick={() => setIsConfirmOpen(true)} disabled={!hasBackup || !count || isBusy} className="cursor-pointer">
                            Tümünü sil
                        </Button>
                    </div>
                    {!hasBackup && count > 0 && (
                        <p className="text-xs text-muted-foreground">Silme, CSV indirildikten sonra açılır.</p>
                    )}
                    {notice && (
                        <div
                            role={notice.kind === 'error' ? 'alert' : 'status'}
                            className={`rounded-md px-3 py-2 text-sm ${notice.kind === 'error' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'}`}
                        >
                            {notice.text}
                        </div>
                    )}
                </CardContent>
            </Card>

            {applications === null ? (
                <div className="py-12"><PixelLoader label="başvurular yükleniyor" /></div>
            ) : count === 0 ? (
                <p className="py-12 text-center text-muted-foreground">Henüz başvuru yok.</p>
            ) : (
                <div className="grid gap-6">
                    {applications.map((a) => (
                        <Card key={a._id}>
                            <CardHeader>
                                <div className="flex flex-wrap items-baseline justify-between gap-2">
                                    <CardTitle>{a.teamName}</CardTitle>
                                    <span className="text-sm text-muted-foreground">{dateTime.format(new Date(a.createdAt))}</span>
                                </div>
                                <CardDescription>{1 + a.members.length} kişi</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-3">
                                <PersonRow person={a.leader} role="Lider" email={a.leader.email} phone={a.leader.phone} />
                                {a.members.map((m, i) => <PersonRow key={i} person={m} role="Üye" />)}
                                <details className="text-sm">
                                    <summary className="cursor-pointer font-medium">Liderin senaryo cevapları</summary>
                                    <ol className="mt-2 grid gap-2 pl-4 list-decimal">
                                        {QUESTIONS.map((q) => {
                                            const key = a.answers[q.id];
                                            return (
                                                <li key={q.id}>
                                                    <span className="text-muted-foreground">{q.title}:</span>{' '}
                                                    <strong>{key})</strong> {q.options[ANSWER_KEYS.indexOf(key)] ?? ''}
                                                </li>
                                            );
                                        })}
                                    </ol>
                                </details>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isConfirmOpen} onOpenChange={(open) => (open ? setIsConfirmOpen(true) : closeConfirm())}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Game jam başvurularını kalıcı olarak sil</DialogTitle>
                        <DialogDescription>{count} takım başvurusu silinecek. Bu işlem geri alınamaz.</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-2">
                        <Label htmlFor="jam-purge-count">Onaylamak için takım sayısını ({count}) yazın</Label>
                        <Input id="jam-purge-count" inputMode="numeric" autoComplete="off" value={typedCount} onChange={(e) => setTypedCount(e.target.value)} />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={closeConfirm} className="cursor-pointer">Vazgeç</Button>
                        <Button variant="destructive" onClick={handlePurge} disabled={isBusy || typedCount.trim() !== String(count)} className="cursor-pointer">
                            {isBusy ? 'Siliniyor...' : 'Kalıcı olarak sil'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
