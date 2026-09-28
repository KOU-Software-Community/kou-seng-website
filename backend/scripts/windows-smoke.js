// Başvuru dönemleri smoke testi: GET/PATCH /submissions/windows, yetki ve
// doğrulama. Bağımlılık yok, Node'un yerleşik fetch'i.
//
//   KEY=<ilk admin anahtarı> node scripts/windows-smoke.js
//   API_URL varsayılanı http://127.0.0.1:3001
//
// Yalnızca yerelde ve kullanıcısı olmayan boş bir veritabanında çalışır: ilk
// admini KEY ile oluşturur (kullanıcı varsa 3. adım 401 alır), pencere
// tarihlerini değiştirir, başvuru kaydı yazar. CI'da loadtest'ten önce koşar:
// 7 form isteği harcar (form limiti 15 dk'da 100) ve genel formu açık bırakır.
// Kampüs adımı ayrı bir istemci IP'siyle (CF-Connecting-IP) genel limiti doldurur;
// CI'daki loadtest'in kovalarına dokunmaz.
//
// Çıkış kodu: 0 hepsi geçti, 1 bir adım başarısız, 2 ortam uygun değil.

import assert from 'node:assert/strict';

const BASE = (process.env.API_URL || 'http://127.0.0.1:3001').replace(/\/$/, '');
const { KEY } = process.env;
if (!['localhost', '127.0.0.1'].includes(new URL(BASE).hostname) || !KEY) {
  console.error('API_URL yerel olmalı (localhost ya da 127.0.0.1) ve KEY tanımlı olmalı.');
  process.exit(2);
}

const api = async (method, path, { token, body, headers } = {}) => {
  const res = await fetch(BASE + path, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token && { Authorization: `Bearer ${token}` }), ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: res.status, body: await res.json().catch(() => null) };
};

const step = async (name, fn) => {
  try {
    await fn();
    console.log(`ok   ${name}`);
  } catch (err) {
    console.log(`FAIL ${name}\n     ${err.message}`);
    process.exit(1);
  }
};

const expectStatus = (res, status) =>
  assert.equal(res.status, status, `${status} beklendi, ${res.status} geldi: ${JSON.stringify(res.body)}`);
const H = 3600e3;
const iso = (offsetMs) => new Date(Date.now() + offsetMs).toISOString();
const bySlug = (list) => Object.fromEntries(list.map((w) => [w.slug, w]));
const PASSWORD = 'smoke-password-123';
let adminToken;

// loadtest.js'teki başvuru gövdesiyle aynı alanlar; başka alan (ör. surname)
// teknik uçta allowlist'e takılır. Öğrenci no / e-posta / telefon her başvuruda farklı.
const RUN = Date.now().toString(36);
let seq = 0;
const applicant = () => {
  const id = `${RUN}-${++seq}`;
  return {
    name: `Smoke Aday${seq}`, studentId: id, email: `smoke+${id}@example.invalid`, phone: id,
    faculty: 'Mühendislik', department: 'Yazılım Mühendisliği', grade: 2,
  };
};
const submit = (path) => api('POST', `/submissions/${path}`, { body: applicant() });
const expectClosed = (res) => {
  expectStatus(res, 403);
  assert.equal(res.body.message, 'Bu başvuru şu anda kapalı.');
};
const setWindow = async (slug, opensAt, closesAt) =>
  expectStatus(await api('PATCH', `/submissions/windows/${slug}`, { token: adminToken, body: { opensAt, closesAt } }), 200);

await step('GET /submissions/windows: varsayılanlar (genel açık, teknikler kapalı)', async () => {
  const res = await api('GET', '/submissions/windows');
  expectStatus(res, 200);
  assert.deepEqual(res.body.data.map((w) => w.slug), ['general', 'mobil-web', 'ai', 'game']);
  const w = bySlug(res.body.data);
  assert.equal(w.general.isOpen, true);
  for (const s of ['mobil-web', 'ai', 'game']) assert.equal(w[s].state, 'closed');
});

await step('PATCH token olmadan → 401', async () => {
  expectStatus(await api('PATCH', '/submissions/windows/ai', { body: { opensAt: null, closesAt: null } }), 401);
});

await step('ilk admin KEY ile oluşturulur ve giriş yapar', async () => {
  const body = { name: 'Smoke Admin', email: 'smoke-admin@example.com', password: PASSWORD, role: 'admin' };
  expectStatus(await api('POST', '/users', { token: KEY, body }), 201);
  const login = await api('POST', '/auth/login', { body: { email: body.email, password: PASSWORD } });
  expectStatus(login, 200);
  adminToken = login.body.token;
});

await step('admin olmayan rol (ai) PATCH → 403', async () => {
  const body = { name: 'Smoke AI', email: 'smoke-ai@example.com', password: PASSWORD, role: 'ai' };
  expectStatus(await api('POST', '/users', { token: adminToken, body }), 201);
  const login = await api('POST', '/auth/login', { body: { email: body.email, password: PASSWORD } });
  expectStatus(login, 200);
  const res = await api('PATCH', '/submissions/windows/ai', { token: login.body.token, body: { opensAt: null, closesAt: null } });
  expectStatus(res, 403);
});

await step('PATCH 400 doğrulamaları', async () => {
  const t = iso(H);
  const cases = [
    ['foo', { opensAt: null, closesAt: null }, 'Geçersiz başvuru formu.'],
    ['ai', { opensAt: 'yarin', closesAt: null }, 'Tarih geçersiz.'],
    ['ai', { opensAt: {}, closesAt: null }, 'Tarih geçersiz.'],
    // Saat dilimi olmayan metin sunucu saatine göre okunurdu; reddedilir.
    ['ai', { opensAt: '2026-10-05T18:00', closesAt: null }, 'Tarih geçersiz.'],
    ['ai', { opensAt: null, closesAt: t }, 'Kapanış tarihi için açılış tarihi gerekli.'],
    ['ai', { opensAt: t, closesAt: t }, 'Kapanış tarihi açılış tarihinden sonra olmalı.'],
  ];
  for (const [slug, body, message] of cases) {
    const res = await api('PATCH', `/submissions/windows/${slug}`, { token: adminToken, body });
    expectStatus(res, 400);
    assert.equal(res.body.message, message, JSON.stringify(body));
  }
});

await step('game planlandı: açılış 1 sa sonra', async () => {
  const res = await api('PATCH', '/submissions/windows/game', { token: adminToken, body: { opensAt: iso(H), closesAt: iso(2 * H) } });
  expectStatus(res, 200);
  assert.equal(res.body.data.state, 'scheduled');
  assert.equal(res.body.data.isOpen, false);
  const game = bySlug((await api('GET', '/submissions/windows')).body.data).game;
  assert.deepEqual(game, res.body.data);
});

await step('ai açık: açılış 1 dk önce, kapanış 1 sa sonra', async () => {
  const res = await api('PATCH', '/submissions/windows/ai', { token: adminToken, body: { opensAt: iso(-60e3), closesAt: iso(H) } });
  expectStatus(res, 200);
  assert.equal(res.body.data.isOpen, true);
});

await step('açık teknik forma (ai) başvuru → 201', async () => {
  expectStatus(await submit('technical/ai'), 201);
});

await step('ai kapatılınca başvuru → 403', async () => {
  await setWindow('ai', null, null);
  expectClosed(await submit('technical/ai'));
});

await step('planlanmış forma (game) başvuru → 403', async () => {
  expectClosed(await submit('technical/game'));
});

await step('genel üyelik kapatılınca 403, yeniden açılınca 201', async () => {
  await setWindow('general', null, null);
  expectClosed(await submit('general'));
  await setWindow('general', new Date(0).toISOString(), null);
  expectStatus(await submit('general'), 201);
});

await step('geçersiz sınıf ve JSON olmayan gövde → 400 (500 değil)', async () => {
  expectStatus(await api('POST', '/submissions/general', { body: { ...applicant(), grade: 99 } }), 400);
  const res = await fetch(`${BASE}/submissions/general`, { method: 'POST', headers: { 'Content-Type': 'text/plain' }, body: 'merhaba' });
  assert.equal(res.status, 400, `text/plain gövde: ${res.status}`);
});

// Kampüs Wi-Fi'ı gibi paylaşılan IP: genel limit dolsa da başvuru akışı çalışmalı.
// 127.0.0.1 iç ağ sayıldığı için backend CF-Connecting-IP'yi ziyaretçi adresi olarak okur.
await step('genel limit dolunca durum isteği ve başvuru yine çalışır', async () => {
  const campus = { 'CF-Connecting-IP': '203.0.113.10' };
  let status;
  for (let i = 0; i < 150 && status !== 429; i++) status = (await fetch(`${BASE}/health`, { headers: campus })).status;
  assert.equal(status, 429, 'genel limit dolmadı');
  expectStatus(await api('GET', '/submissions/windows', { headers: campus }), 200);
  expectStatus(await api('POST', '/submissions/general', { body: applicant(), headers: campus }), 201);
});
