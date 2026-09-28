'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useApplicationWindows } from '@/hooks/useApplicationWindows';
import {
    APPLICATION_LABELS,
    fromLocalInput,
    toLocalInput,
    windowSummary,
    type ApplicationWindow,
    type WindowState,
} from '@/lib/applicationWindow';

const STATE_BADGE: Record<WindowState, { label: string; className: string }> = {
    open: { label: 'Açık', className: 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300' },
    scheduled: { label: 'Planlandı', className: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300' },
    closed: { label: 'Kapalı', className: 'bg-muted text-muted-foreground' },
};

type Message = { ok: boolean; text: string };

function WindowCard({
    item,
    message,
    onSave,
}: {
    item: ApplicationWindow;
    message?: Message;
    onSave: (opensAt: string | null, closesAt: string | null) => Promise<void>;
}) {
    // Kayıttan sonra kart yeniden kurulur (key), alanlar sunucudaki değere döner
    const [opens, setOpens] = useState(toLocalInput(item.opensAt));
    const [closes, setCloses] = useState(toLocalInput(item.closesAt));
    const [isSaving, setIsSaving] = useState(false);
    const badge = STATE_BADGE[item.state];

    const save = async (opensAt: string | null, closesAt: string | null) => {
        setIsSaving(true);
        await onSave(opensAt, closesAt);
        setIsSaving(false);
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle>{APPLICATION_LABELS[item.slug]}</CardTitle>
                    <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium', badge.className)}>{badge.label}</span>
                </div>
                <CardDescription>{windowSummary(item)}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                        <Label htmlFor={`${item.slug}-opens`}>Açılış</Label>
                        <Input id={`${item.slug}-opens`} type="datetime-local" value={opens} onChange={(e) => setOpens(e.target.value)} />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor={`${item.slug}-closes`}>Kapanış</Label>
                        <Input id={`${item.slug}-closes`} type="datetime-local" value={closes} onChange={(e) => setCloses(e.target.value)} />
                    </div>
                </div>
                {message && (
                    <p
                        role={message.ok ? 'status' : 'alert'}
                        className={cn('text-sm', message.ok ? 'text-green-700 dark:text-green-400' : 'text-destructive')}
                    >
                        {message.text}
                    </p>
                )}
                <div className="flex justify-end gap-2">
                    <Button variant="outline" disabled={isSaving} onClick={() => save(null, null)}>
                        Kapat
                    </Button>
                    <Button disabled={isSaving} onClick={() => save(fromLocalInput(opens), fromLocalInput(closes))}>
                        Kaydet
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function AdminApplicationWindows() {
    const { windows, isLoading, error, refresh, updateWindow } = useApplicationWindows();
    const [messages, setMessages] = useState<Record<string, Message>>({});

    const save = async (slug: string, opensAt: string | null, closesAt: string | null) => {
        const result = await updateWindow(slug, opensAt, closesAt);
        if (result.ok) await refresh();
        setMessages((prev) => ({
            ...prev,
            [slug]: result.ok ? { ok: true, text: 'Kaydedildi' } : { ok: false, text: result.message ?? 'Kaydedilemedi.' },
        }));
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Başvuru Dönemleri</h1>
                <p className="text-muted-foreground mt-2">
                    Form açılış tarihinde kendiliğinden açılır, kapanış tarihinde kapanır; kapanış boşsa açık kalır.
                    &quot;Kapat&quot; iki tarihi de siler ve formu hemen kapatır.
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                    Tarihleri bu cihazın saatine göre girin; sitede Türkiye saatiyle gösterilir.
                </p>
            </div>

            {isLoading ? (
                <p className="text-muted-foreground">Yükleniyor...</p>
            ) : error || !windows ? (
                <p className="text-destructive" role="alert">{error}</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2">
                    {Object.keys(APPLICATION_LABELS)
                        .filter((slug) => windows[slug])
                        .map((slug) => (
                            <WindowCard
                                key={`${slug}-${windows[slug].opensAt}-${windows[slug].closesAt}`}
                                item={windows[slug]}
                                message={messages[slug]}
                                onSave={(opensAt, closesAt) => save(slug, opensAt, closesAt)}
                            />
                        ))}
                </div>
            )}
        </div>
    );
}
