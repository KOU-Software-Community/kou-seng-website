// Başvuru dönemleri: backend'in döndürdüğü durum (GET /submissions/windows) ve
// tarih biçimleri. Açık/kapalı kararı backend'de; burada yalnızca gösterim.
// Import yok: Node'da --experimental-strip-types ile doğrudan çalıştırılabiliyor.

export type WindowState = 'open' | 'scheduled' | 'closed';

export type ApplicationWindow = {
  slug: string;
  opensAt: string | null;
  closesAt: string | null;
  state: WindowState;
  isOpen: boolean;
};

export const APPLICATION_LABELS: Record<string, string> = {
  general: 'Genel Üyelik',
  'mobil-web': 'Mobil ve Web Geliştirme Takımı',
  ai: 'Yapay Zeka Takımı',
  game: 'Oyun Geliştirme Takımı',
};

// Sitede tarih her zaman Türkiye saatiyle: "5 Ekim 2026 23:59"
const dateFormat = new Intl.DateTimeFormat('tr-TR', {
  dateStyle: 'long',
  timeStyle: 'short',
  timeZone: 'Europe/Istanbul',
});

export const formatWindowDate = (iso: string): string => dateFormat.format(new Date(iso));

export const windowSummary = (w: ApplicationWindow): string => {
  if (w.state === 'open') {
    return w.closesAt ? `Son başvuru: ${formatWindowDate(w.closesAt)}` : 'Son başvuru tarihi belirtilmedi';
  }
  if (w.state === 'scheduled' && w.opensAt) return `${formatWindowDate(w.opensAt)} tarihinde açılacak`;
  return 'Başvurular kapalı';
};

// <input type="datetime-local"> tarayıcının yerel saatiyle çalışır; API UTC ISO.
const pad = (n: number) => String(n).padStart(2, '0');

export const toLocalInput = (iso: string | null): string => {
  if (!iso) return '';
  const d = new Date(iso);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Tarayıcının kabul edip Date'in anlamadığı değer (ör. 5 haneli yıl) olduğu gibi gider;
// backend "Tarih geçersiz." der ve admin mesajı görür.
export const fromLocalInput = (value: string): string | null => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};
