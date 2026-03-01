'use client';

import { useState, useId, useRef, useEffect } from 'react';
import type { MailBlock } from '@/hooks/useSponsorMail';
import { useMailDrafts, type MailDraft } from '@/hooks/useMailDrafts';
import { useMailQueue, type QueueJob } from '@/contexts/MailQueueContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type BlockType = MailBlock['type'];

const BLOCK_LABELS: Record<BlockType, string> = {
  heading: 'Başlık',
  paragraph: 'Paragraf',
  list: 'Liste',
  signature: 'İmza',
};

const createBlock = (type: BlockType): MailBlock => {
  switch (type) {
    case 'paragraph':
      return { type: 'paragraph', text: '' };
    case 'heading':
      return { type: 'heading', text: '' };
    case 'list':
      return { type: 'list', items: [{ title: '', description: '' }] };
    case 'signature':
      return { type: 'signature', name: '', title: '', email: '' };
  }
};

const formatDate = (ts: string | number) =>
  new Date(ts).toLocaleDateString('tr-TR', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

/** Basic email regex — rejects obvious typos. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parseEmails(raw: string): string[] {
  return raw.split(',').map((e) => e.trim()).filter(Boolean);
}

export default function AdminSponsorMail() {
  const { enqueueJob, jobs, cancelJob, dismissJob } = useMailQueue();
  const { drafts, loading: draftsLoading, saveDraft, removeDraft } = useMailDrafts();
  const formId = useId();

  // Form alanları
  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [blocks, setBlocks] = useState<MailBlock[]>([]);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [fileInputKey, setFileInputKey] = useState(0);

  // Durum mesajları
  const [enqueuedMsg, setEnqueuedMsg] = useState(false);

  // Taslak kaydetme
  const [isDraftNameOpen, setIsDraftNameOpen] = useState(false);
  const [draftNameInput, setDraftNameInput] = useState('');
  const [draftSavedMsg, setDraftSavedMsg] = useState(false);

  // E-posta listesini parse et
  const parsedEmails = parseEmails(to);
  const validEmails = parsedEmails.filter((e) => EMAIL_RE.test(e));
  const invalidEmails = parsedEmails.filter((e) => !EMAIL_RE.test(e));

  // --- Blok işlemleri ---
  const addBlock = (type: BlockType) => {
    setBlocks((prev) => [...prev, createBlock(type)]);
    setAddMenuOpen(false);
  };

  const removeBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    setBlocks((prev) => {
      const next = [...prev];
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const updateBlock = (index: number, updated: MailBlock) => {
    setBlocks((prev) => prev.map((b, i) => (i === index ? updated : b)));
  };

  // --- Gönder (kuyruğa ekle) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validEmails.length === 0 || blocks.length === 0) return;
    await enqueueJob({ subject, recipients: validEmails, blocks, attachments });
    setEnqueuedMsg(true);
    setTimeout(() => setEnqueuedMsg(false), 4000);
  };

  // --- Taslak kaydet ---
  const handleOpenDraftSave = () => {
    setDraftNameInput(subject.trim() || '');
    setIsDraftNameOpen(true);
  };

  const handleConfirmSaveDraft = async () => {
    const name = draftNameInput.trim();
    if (!name) return;
    await saveDraft({ name, to, subject, blocks, attachments });
    setIsDraftNameOpen(false);
    setDraftNameInput('');
    setDraftSavedMsg(true);
    setTimeout(() => setDraftSavedMsg(false), 3000);
  };

  const handleCancelDraftSave = () => {
    setIsDraftNameOpen(false);
    setDraftNameInput('');
  };

  // --- Taslak yükle ---
  const handleLoadDraft = (draft: MailDraft) => {
    setTo(draft.to);
    setSubject(draft.subject);
    setBlocks(draft.blocks);
    setAttachments(draft.attachments.map((a) => new File([a.blob], a.name, { type: a.type })));
    setFileInputKey((k) => k + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const sendBtnLabel = () => {
    if (validEmails.length > 1) return `Toplu Gönder (${validEmails.length} alıcı)`;
    return 'Gönder';
  };

  return (
    <div className="flex gap-6 items-start">
      {/* Sol sütun: form + bloklar */}
      <div className="flex flex-col gap-6 min-w-0 flex-1 max-w-2xl pb-20">
        <h1 className="text-xl font-semibold">Sponsor Mail Gönder</h1>

        <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="mail-to" className="text-sm font-medium">
              Alıcı E-posta
              <span className="font-normal text-muted-foreground ml-1">
                (birden fazla için virgülle ayırın)
              </span>
            </label>
            <Input
              id="mail-to"
              type="text"
              placeholder="ornek@sirket.com, diger@sirket.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
            {parsedEmails.length > 0 && (
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-0.5">
                {validEmails.length > 0 && (
                  <span className="text-xs text-green-700">
                    ✓ {validEmails.length} geçerli adres
                  </span>
                )}
                {invalidEmails.length > 0 && (
                  <span className="text-xs text-destructive">
                    ✕ geçersiz: {invalidEmails.join(', ')}
                  </span>
                )}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="mail-subject" className="text-sm font-medium">
              Konu
            </label>
            <Input
              id="mail-subject"
              type="text"
              placeholder="Mail konusu"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="mail-attachment" className="text-sm font-medium">
              Dosya Ekleri{' '}
              <span className="font-normal text-muted-foreground">(opsiyonel · PDF, görsel veya Word · maks. 10 MB/dosya)</span>
            </label>
            <Input
              key={fileInputKey}
              id="mail-attachment"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="cursor-pointer"
              onChange={(e) => {
                const incoming = Array.from(e.target.files ?? []);
                if (incoming.length > 0) {
                  setAttachments((prev) => {
                    const existingNames = new Set(prev.map((f) => f.name));
                    return [...prev, ...incoming.filter((f) => !existingNames.has(f.name))];
                  });
                }
                setFileInputKey((k) => k + 1);
              }}
            />
            {attachments.length > 0 && (
              <div className="flex flex-col gap-1 mt-1">
                {attachments.map((file, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground flex-1 truncate">
                      {file.name} · {(file.size / 1024).toFixed(0)} KB
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-destructive hover:text-destructive cursor-pointer shrink-0"
                      onClick={() => setAttachments((prev) => prev.filter((_, idx) => idx !== i))}
                      aria-label={`${file.name} dosyasını kaldır`}
                    >
                      ✕
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </form>

        <Separator />

        <div className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            İçerik Blokları
          </h2>

          {blocks.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Henüz blok eklenmedi. Aşağıdaki butonu kullanarak içerik ekleyebilirsiniz.
            </p>
          )}

          {blocks.map((block, index) => (
            <Card key={index}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium">{BLOCK_LABELS[block.type]}</CardTitle>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 cursor-pointer"
                      onClick={() => moveBlock(index, 'up')}
                      disabled={index === 0}
                      aria-label="Yukarı taşı"
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 cursor-pointer"
                      onClick={() => moveBlock(index, 'down')}
                      disabled={index === blocks.length - 1}
                      aria-label="Aşağı taşı"
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 p-0 text-destructive hover:text-destructive cursor-pointer"
                      onClick={() => removeBlock(index)}
                      aria-label="Bloğu sil"
                    >
                      ✕
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <BlockEditor block={block} onChange={(updated) => updateBlock(index, updated)} />
              </CardContent>
            </Card>
          ))}

          {/* Blok ekleme butonu — dropdown yukarı açılır */}
          <div className="relative self-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setAddMenuOpen((prev) => !prev)}
            >
              + Blok Ekle
            </Button>
            {addMenuOpen && (
              <div className="absolute left-0 bottom-full mb-1 z-10 flex flex-col bg-background border rounded-md shadow-md min-w-[130px]">
                {(Object.keys(BLOCK_LABELS) as BlockType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    className="px-4 py-2 text-sm text-left hover:bg-muted cursor-pointer"
                    onClick={() => addBlock(type)}
                  >
                    {BLOCK_LABELS[type]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky action bar */}
        <div className="sticky bottom-0 z-10 bg-background border-t flex items-center gap-3 py-3">
          {isDraftNameOpen ? (
            <>
              <Input
                className="h-8 text-sm flex-1"
                placeholder="Taslak adı..."
                value={draftNameInput}
                onChange={(e) => setDraftNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmSaveDraft();
                  if (e.key === 'Escape') handleCancelDraftSave();
                }}
                autoFocus
              />
              <Button
                type="button"
                size="sm"
                className="cursor-pointer shrink-0"
                disabled={!draftNameInput.trim()}
                onClick={handleConfirmSaveDraft}
              >
                Kaydet
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="cursor-pointer shrink-0"
                onClick={handleCancelDraftSave}
              >
                İptal
              </Button>
            </>
          ) : (
            <>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="cursor-pointer shrink-0"
                onClick={handleOpenDraftSave}
              >
                Taslak Kaydet
              </Button>
              <div className="flex-1 min-w-0 text-sm">
                {draftSavedMsg && (
                  <span className="text-green-700" role="status">Taslak kaydedildi.</span>
                )}
                {!draftSavedMsg && enqueuedMsg && (
                  <span className="text-green-700" role="status">
                    {validEmails.length > 1
                      ? `${validEmails.length} alıcı için görev kuyruğa eklendi.`
                      : 'Görev kuyruğa eklendi.'}
                  </span>
                )}
              </div>
            </>
          )}
          <Button
            type="submit"
            form={formId}
            disabled={validEmails.length === 0 || blocks.length === 0}
            className="cursor-pointer shrink-0"
          >
            {sendBtnLabel()}
          </Button>
        </div>
      </div>

      {/* Sağ sütun: taslaklar + görev kuyruğu */}
      {!draftsLoading && (
        <div className="w-72 shrink-0 sticky top-6 flex flex-col gap-3 self-start max-h-[calc(100vh-3rem)] overflow-y-auto">
          {/* Taslaklar */}
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Taslaklar {drafts.length > 0 && `(${drafts.length})`}
          </h2>

          {drafts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz kayıtlı taslak yok.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {drafts.map((draft) => (
                <Card key={draft.id}>
                  <CardContent className="py-3 px-3">
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-sm truncate">{draft.name}</span>
                        {draft.to && (
                          <span className="text-xs text-muted-foreground truncate">{draft.to}</span>
                        )}
                        {draft.subject && (
                          <span className="text-xs text-muted-foreground truncate">{draft.subject}</span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {draft.attachments.length > 0 && (
                            draft.attachments.length === 1
                              ? `📎 ${draft.attachments[0].name} · `
                              : `📎 ${draft.attachments.length} dosya eki · `
                          )}
                          {formatDate(draft.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="cursor-pointer flex-1"
                          onClick={() => handleLoadDraft(draft)}
                        >
                          Yükle
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="cursor-pointer text-destructive hover:text-destructive"
                          onClick={() => removeDraft(draft.id)}
                        >
                          Sil
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Görev Kuyruğu */}
          <Separator className="my-1" />
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Görevler {jobs.length > 0 && `(${jobs.length})`}
          </h2>

          {jobs.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz görev yok.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {jobs.map((job) => (
                <QueueJobCard
                  key={job.id}
                  job={job}
                  onCancel={() => cancelJob(job.id)}
                  onDismiss={() => dismissJob(job.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Kuyruk Görev Kartı ─────────────────────────────────────────────────────

function QueueJobCard({
  job,
  onCancel,
  onDismiss,
}: {
  job: QueueJob;
  onCancel: () => void;
  onDismiss: () => void;
}) {
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!job.nextSendAt) {
      setSecondsLeft(null);
      return;
    }
    const targetMs = new Date(job.nextSendAt!).getTime();
    const update = () => {
      const diff = Math.ceil((targetMs - Date.now()) / 1000);
      setSecondsLeft(diff > 0 ? diff : null);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [job.nextSendAt]);

  const total = job.recipients.length;
  const done = job.results.length;
  const sentCount = job.results.filter((r) => r.status === 'sent').length;
  const failedCount = job.results.filter((r) => r.status === 'failed').length;
  const progressPct = total > 0 ? Math.round((done / total) * 100) : 0;

  const statusLabel: Record<typeof job.status, string> = {
    pending: 'Bekliyor',
    running: 'Çalışıyor',
    done: 'Tamamlandı',
    cancelled: 'İptal Edildi',
  };

  const statusColor: Record<typeof job.status, string> = {
    pending: 'text-muted-foreground',
    running: 'text-blue-600',
    done: 'text-green-700',
    cancelled: 'text-muted-foreground',
  };

  const isActive = job.status === 'pending' || job.status === 'running';

  return (
    <Card>
      <CardContent className="py-3 px-3">
        <div className="flex flex-col gap-2">
          {/* Konu + durum */}
          <div className="flex items-start justify-between gap-1">
            <span className="font-medium text-sm truncate flex-1">{job.subject || '(konusuz)'}</span>
            <span className={`text-xs shrink-0 ${statusColor[job.status]}`}>
              {statusLabel[job.status]}
            </span>
          </div>

          {/* İlerleme */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{done} / {total} alıcı</span>
              {sentCount > 0 && (
                <span className="text-green-700">{sentCount} ✓</span>
              )}
              {failedCount > 0 && (
                <span className="text-destructive ml-1">{failedCount} ✗</span>
              )}
            </div>
            {/* İlerleme çubuğu */}
            <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all bg-primary"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>

          {/* Sonraki gönderim geri sayımı */}
          {secondsLeft !== null && (
            <p className="text-xs text-muted-foreground">
              Sonraki gönderim: {secondsLeft}s
            </p>
          )}

          {/* Oluşturulma tarihi */}
          <p className="text-xs text-muted-foreground">{formatDate(job.createdAt)}</p>

          {/* Aksiyonlar */}
          <div className="flex gap-1">
            {isActive ? (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="cursor-pointer flex-1 text-destructive hover:text-destructive"
                onClick={onCancel}
              >
                İptal
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="cursor-pointer flex-1"
                onClick={onDismiss}
              >
                Kapat
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ─── Biçimlendirilebilir Textarea ───────────────────────────────────────────

function FormatableTextarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  const ref = useRef<HTMLTextAreaElement>(null);

  const applyFormat = (open: string, close: string) => {
    const el = ref.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const next =
      value.slice(0, start) + open + value.slice(start, end) + close + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + open.length, end + open.length);
    });
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          title="Kalın — seçili metni kalın yap"
          className="inline-flex items-center justify-center h-6 px-2 text-xs font-bold border rounded hover:bg-muted cursor-pointer select-none"
          onMouseDown={(e) => { e.preventDefault(); applyFormat('**', '**'); }}
        >
          B
        </button>
        <button
          type="button"
          title="Vurgu — seçili metni vurgula"
          className="inline-flex items-center justify-center h-6 px-2 text-xs border rounded cursor-pointer select-none font-semibold"
          style={{ color: '#142850', background: '#eef4ff' }}
          onMouseDown={(e) => { e.preventDefault(); applyFormat('[[', ']]'); }}
        >
          Vurgu
        </button>
        <span className="text-xs text-muted-foreground">**kalın** · [[vurgu]]</span>
      </div>
      <Textarea
        ref={ref}
        placeholder={placeholder}
        value={value}
        rows={rows}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

function BlockEditor({
  block,
  onChange,
}: {
  block: MailBlock;
  onChange: (updated: MailBlock) => void;
}) {
  if (block.type === 'paragraph') {
    return (
      <FormatableTextarea
        placeholder="Paragraf metni... (**kalın** veya [[vurgu]] kullanabilirsiniz)"
        value={block.text}
        rows={3}
        onChange={(text) => onChange({ ...block, text })}
      />
    );
  }

  if (block.type === 'heading') {
    return (
      <Input
        placeholder="Başlık metni..."
        value={block.text}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
      />
    );
  }

  if (block.type === 'list') {
    const updateItem = (i: number, field: 'title' | 'description', value: string) => {
      const items = block.items.map((item, idx) =>
        idx === i ? { ...item, [field]: value } : item
      );
      onChange({ ...block, items });
    };

    const addItem = () =>
      onChange({ ...block, items: [...block.items, { title: '', description: '' }] });

    const removeItem = (i: number) =>
      onChange({ ...block, items: block.items.filter((_, idx) => idx !== i) });

    return (
      <div className="flex flex-col gap-3">
        {block.items.map((item, i) => (
          <div key={i} className="flex flex-col gap-1.5 rounded-md border p-3">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Başlık (opsiyonel, otomatik kalın)"
                value={item.title}
                onChange={(e) => updateItem(i, 'title', e.target.value)}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer shrink-0"
                onClick={() => removeItem(i)}
                disabled={block.items.length <= 1}
                aria-label="Maddeyi sil"
              >
                ✕
              </Button>
            </div>
            <FormatableTextarea
              placeholder="Açıklama..."
              value={item.description}
              rows={2}
              onChange={(desc) => updateItem(i, 'description', desc)}
            />
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="self-start cursor-pointer"
          onClick={addItem}
        >
          + Madde Ekle
        </Button>
      </div>
    );
  }

  if (block.type === 'signature') {
    return (
      <div className="flex flex-col gap-2">
        <Input
          placeholder="Ad Soyad"
          value={block.name}
          onChange={(e) => onChange({ ...block, name: e.target.value })}
        />
        <Input
          placeholder="Unvan (ör. Hackathon İletişim Sorumlusu)"
          value={block.title}
          onChange={(e) => onChange({ ...block, title: e.target.value })}
        />
        <Input
          placeholder="E-posta"
          type="email"
          value={block.email}
          onChange={(e) => onChange({ ...block, email: e.target.value })}
        />
      </div>
    );
  }

  return null;
}
