'use client';

import { useState, useId, useRef } from 'react';
import { useSponsorMail, type MailBlock } from '@/hooks/useSponsorMail';
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

export default function AdminSponsorMail() {
  const { isSending, isSuccess, errorMessage, sendMail, resetStatus } = useSponsorMail();
  const formId = useId();

  const [to, setTo] = useState('');
  const [subject, setSubject] = useState('');
  const [blocks, setBlocks] = useState<MailBlock[]>([]);
  const [addMenuOpen, setAddMenuOpen] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);

  const addBlock = (type: BlockType) => {
    setBlocks((prev) => [...prev, createBlock(type)]);
    setAddMenuOpen(false);
    resetStatus();
  };

  const removeBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
    resetStatus();
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
    resetStatus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await sendMail({ to, subject, blocks, attachment });
    if (success) {
      setAttachment(null);
      setFileInputKey((k) => k + 1);
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl pb-20">
      <h1 className="text-xl font-semibold">Sponsor Mail Gönder</h1>

      <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="mail-to" className="text-sm font-medium">
            Alıcı E-posta
          </label>
          <Input
            id="mail-to"
            type="email"
            placeholder="ornek@sirket.com"
            value={to}
            onChange={(e) => { setTo(e.target.value); resetStatus(); }}
            required
          />
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
            onChange={(e) => { setSubject(e.target.value); resetStatus(); }}
            required
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="mail-attachment" className="text-sm font-medium">
            Dosya Eki{' '}
            <span className="font-normal text-muted-foreground">(opsiyonel · PDF, görsel veya Word · maks. 10 MB)</span>
          </label>
          <div className="flex items-center gap-2">
            <Input
              key={fileInputKey}
              id="mail-attachment"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="cursor-pointer"
              onChange={(e) => { setAttachment(e.target.files?.[0] ?? null); resetStatus(); }}
            />
            {attachment && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-destructive hover:text-destructive cursor-pointer shrink-0"
                onClick={() => { setAttachment(null); setFileInputKey((k) => k + 1); }}
                aria-label="Dosyayı kaldır"
              >
                ✕
              </Button>
            )}
          </div>
          {attachment && (
            <p className="text-xs text-muted-foreground">
              {attachment.name} · {(attachment.size / 1024).toFixed(0)} KB
            </p>
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

        {/* Blok ekleme butonu — listenin altında, dropdown yukarı açılır */}
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

      {/* Sticky action bar — sayfanın neresinde olunursa olunsun erişilebilir */}
      <div className="sticky bottom-0 z-10 bg-background border-t flex items-center gap-3 py-3">
        <div className="flex-1 min-w-0 text-sm">
          {errorMessage && (
            <span className="text-destructive" role="alert">{errorMessage}</span>
          )}
          {isSuccess && (
            <span className="text-green-700" role="status">Mail başarıyla gönderildi.</span>
          )}
        </div>
        <Button
          type="submit"
          form={formId}
          disabled={isSending || blocks.length === 0}
          className="cursor-pointer shrink-0"
        >
          {isSending ? 'Gönderiliyor...' : 'Mail Gönder'}
        </Button>
      </div>
    </div>
  );
}

// Seçili metni biçimlendirme işaretleriyle saran textarea bileşeni
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
    // Seçimi işaretlerin içinde tut
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
