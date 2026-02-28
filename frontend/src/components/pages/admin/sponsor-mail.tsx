'use client';

import { useState, useId } from 'react';
import { useSponsorMail, type MailBlock } from '@/hooks/useSponsorMail';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

type BlockType = MailBlock['type'];

const BLOCK_LABELS: Record<BlockType, string> = {
  paragraph: 'Paragraf',
  heading: 'Başlık',
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
    await sendMail({ to, subject, blocks });
  };

  return (
    <div className="flex flex-col gap-6 max-w-2xl">
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
      </form>

      <Separator />

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            İçerik Blokları
          </h2>
          <div className="relative">
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
              <div className="absolute right-0 mt-1 z-10 flex flex-col bg-background border rounded-md shadow-md min-w-[130px]">
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

        {blocks.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Henüz blok eklenmedi. Yukarıdaki butonu kullanarak içerik ekleyebilirsiniz.
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
      </div>

      <Separator />

      {errorMessage && (
        <div className="rounded-md bg-destructive/10 text-destructive px-3 py-2 text-sm" role="alert">
          {errorMessage}
        </div>
      )}
      {isSuccess && (
        <div className="rounded-md bg-green-100 text-green-800 px-3 py-2 text-sm" role="status">
          Mail başarıyla gönderildi.
        </div>
      )}

      <Button
        type="submit"
        form={formId}
        disabled={isSending || blocks.length === 0}
        className="self-start cursor-pointer"
      >
        {isSending ? 'Gönderiliyor...' : 'Mail Gönder'}
      </Button>
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
      <Textarea
        placeholder="Paragraf metni..."
        value={block.text}
        rows={3}
        onChange={(e) => onChange({ ...block, text: e.target.value })}
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
      <div className="flex flex-col gap-2">
        {block.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              placeholder="Başlık (opsiyonel)"
              value={item.title}
              className="w-1/3"
              onChange={(e) => updateItem(i, 'title', e.target.value)}
            />
            <Input
              placeholder="Açıklama"
              value={item.description}
              className="flex-1"
              onChange={(e) => updateItem(i, 'description', e.target.value)}
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
