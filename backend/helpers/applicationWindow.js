// Başvuru formlarının açık/kapalı kuralı. Veritabanına dokunmaz; testi yanında
// (applicationWindow.test.js, `node --test`).

export const APPLICATION_SLUGS = ['general', 'mobil-web', 'ai', 'game'];

// Veritabanında kayıt yoksa geçerli olan: genel üyelik süresiz açık, teknik
// formlar kapalı (bu özellikten önceki davranış).
export const DEFAULT_WINDOWS = {
  general: { opensAt: new Date(0), closesAt: null },
  'mobil-web': { opensAt: null, closesAt: null },
  ai: { opensAt: null, closesAt: null },
  game: { opensAt: null, closesAt: null },
};

// [opensAt, closesAt): açılış anında açık, kapanış anında kapalı; kapanış yoksa süresiz.
export const isWindowOpen = ({ opensAt, closesAt }, now = new Date()) =>
  opensAt != null && opensAt <= now && (closesAt == null || now < closesAt);

export const windowState = (window, now = new Date()) => {
  if (isWindowOpen(window, now)) return 'open';
  return window.opensAt != null && now < window.opensAt ? 'scheduled' : 'closed';
};

export const toPublicWindow = (slug, window, now = new Date()) => ({
  slug,
  opensAt: window.opensAt?.toISOString() ?? null,
  closesAt: window.closesAt?.toISOString() ?? null,
  state: windowState(window, now),
  isOpen: isWindowOpen(window, now),
});
