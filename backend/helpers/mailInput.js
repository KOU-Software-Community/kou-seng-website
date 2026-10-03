// Sponsor maili girdileri (/mail/send ve /mail/queue ortak doğrulaması).
// Amaç iki şey: tek alana birden fazla alıcı sığdırılamasın (nodemailer , ve ;
// ile listeyi böler) ve kuyruk dokümanı MongoDB'nin 16 MB sınırının çok altında
// kalsın (ekler ≤10 MB + aşağıdaki sınırlar).

export const MAX_RECIPIENTS = 500; // Gmail kişisel hesap günlük gönderim sınırı
export const MAX_ACTIVE_JOBS = 5; // kullanıcı başına bekleyen + çalışan görev
export const MAX_SUBJECT_LENGTH = 300;
export const MAX_BLOCKS = 100;
export const MAX_BLOCKS_JSON_LENGTH = 100_000; // ham JSON, ~100 KB
const MAX_LIST_ITEMS = 50;

// Tek adres: boşluk, virgül, noktalı virgül, <, > ve " yok.
const EMAIL_RE = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>"]+$/;

export const isSingleEmail = (value) =>
    typeof value === 'string' && value.length <= 254 && EMAIL_RE.test(value);

export const isValidSubject = (value) =>
    typeof value === 'string' && value.trim().length > 0 && value.length <= MAX_SUBJECT_LENGTH;

const str = (v) => typeof v === 'string';

// Şablonun (mailTemplateBuilder) gerçekten çizdiği alanlar; başka alan saklanmaz.
const BLOCK_FIELDS = {
    paragraph: (b) => str(b.text) && { type: 'paragraph', text: b.text },
    heading: (b) => str(b.text) && { type: 'heading', text: b.text },
    list: (b) =>
        Array.isArray(b.items) &&
        b.items.length <= MAX_LIST_ITEMS &&
        b.items.every((i) => i && typeof i === 'object' && str(i.title) && str(i.description)) && {
            type: 'list',
            items: b.items.map((i) => ({ title: i.title, description: i.description })),
        },
    signature: (b) =>
        str(b.name) && str(b.title) && str(b.email) && {
            type: 'signature', name: b.name, title: b.title, email: b.email,
        },
};

/**
 * FormData'dan gelen `blocks` alanını ayrıştırır ve doğrular.
 * @returns {{ blocks: Array } | { error: string }}
 */
export function parseBlocks(raw) {
    // Aynı alan birden çok kez gönderilirse multer dizi verir; kabul etme.
    if (typeof raw !== 'string' || raw.length > MAX_BLOCKS_JSON_LENGTH) {
        return { error: 'İçerik blokları çok büyük ya da geçersiz.' };
    }
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch {
        return { error: 'Geçersiz blok verisi.' };
    }
    if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > MAX_BLOCKS) {
        return { error: `En az bir, en fazla ${MAX_BLOCKS} içerik bloğu gönderilebilir.` };
    }
    const blocks = [];
    for (const b of parsed) {
        const block = b && typeof b === 'object' && Object.hasOwn(BLOCK_FIELDS, b.type) && BLOCK_FIELDS[b.type](b);
        if (!block) return { error: 'Geçersiz içerik bloğu.' };
        blocks.push(block);
    }
    return { blocks };
}
