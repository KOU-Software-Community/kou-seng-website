// Sponsor maili girdileri (/mail/send ve /mail/queue ortak doğrulaması).
// Amaç iki şey: tek alana birden fazla alıcı sığdırılamasın (nodemailer , ve ;
// ile listeyi böler) ve kuyruk dokümanı MongoDB'nin 16 MB sınırının çok altında
// kalsın (ekler ≤10 MB + aşağıdaki sınırlar).

export const MAX_RECIPIENTS = 500; // Gmail kişisel hesap günlük gönderim sınırı
// Kullanıcı başına bekleyen + çalışan görev. Kuyruk tüm kullanıcılar için ortak ve
// sıralı (15-30 sn aralık): 500 alıcılı bir görev ~3 saat, sonrakiler bekler.
export const MAX_ACTIVE_JOBS = 5;
export const MAX_SUBJECT_LENGTH = 300;
export const MAX_TOTAL_ATTACHMENT_BYTES = 10 * 1024 * 1024; // ekler toplamı
// Gövde sınırı: ekler + metin alanları ve multipart payı. Daha büyüğü belleğe
// alınmadan 413 alır (multer tek tek dosyaya bakıyor; 10 × 10 MB yüklenebiliyordu).
export const MAX_REQUEST_BYTES = MAX_TOTAL_ATTACHMENT_BYTES + 1024 * 1024;

/**
 * multer'dan önce: Content-Length sınırı aşıyorsa 413. Başlık yoksa (chunked)
 * gövde akarken sayılır, sınır aşılınca bağlantı kesilir. Başlığı zorunlu
 * tutmak tünelin chunked ilettiği meşru gönderimi de keserdi.
 */
export function limitUploadBody(req, res, next) {
    if (Number(req.headers['content-length']) > MAX_REQUEST_BYTES) {
        return res.status(413).json({ success: false, message: 'Ekler toplamda 10 MB\'ı aşıyor.' });
    }
    let seen = 0;
    req.on('data', (chunk) => {
        seen += chunk.length;
        if (seen > MAX_REQUEST_BYTES) req.destroy();
    });
    next();
}
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
