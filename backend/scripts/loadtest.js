// Yük testi. Bağımlılık yok, Node'un yerleşik fetch'i.
//
//   node scripts/loadtest.js --n 150                    # GET /health — rate limit duvarını bulur
//   node scripts/loadtest.js --n 200 --c 20 --submit    # POST /submissions/general — uçtan uca
//   node scripts/loadtest.js --url https://api.kouseng.com --n 120
//
// --submit gerçek kayıt yazar. ASLA production veritabanına çalıştırma:
// MONGODB_URI'yi ayrı bir db adına yönlendir (ör. .../loadtest?retryWrites=true).

const arg = (f, d) => {
  const i = process.argv.indexOf(f);
  return i !== -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : d;
};
const BASE = arg('--url', 'http://127.0.0.1:3001').replace(/\/$/, '');
const N = Number(arg('--n', 150));
const C = Number(arg('--c', 10));
const SUBMIT = process.argv.includes('--submit');

const body = (i) => ({
  firstName: 'Yuk', lastName: `Test${i}`, studentNumber: String(200000000 + i),
  email: `loadtest+${i}@example.invalid`, phone: '5000000000',
  faculty: 'Mühendislik', department: 'Yazılım Mühendisliği', grade: 2,
});

async function one(i) {
  const t = performance.now();
  try {
    const res = SUBMIT
      ? await fetch(`${BASE}/submissions/general`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body(i)),
        })
      : await fetch(`${BASE}/health`);
    // Rate limit başlıkları: kalan kota ve pencere sıfırlanması
    return {
      ms: performance.now() - t, status: res.status,
      remaining: res.headers.get('ratelimit-remaining'),
      limit: res.headers.get('ratelimit-limit'),
    };
  } catch (e) {
    return { ms: performance.now() - t, status: 0, err: e.message };
  }
}

const pct = (a, p) => a[Math.min(a.length - 1, Math.floor(a.length * p))];

(async () => {
  console.log(`${SUBMIT ? 'POST /submissions/general' : 'GET /health'}  ${BASE}`);
  console.log(`${N} istek, ${C} eşzamanlı\n`);

  const out = [];
  const t0 = performance.now();
  // Sabit boyutlu havuz: C tane worker kuyruğu tüketir.
  let next = 0;
  await Promise.all(Array.from({ length: C }, async () => {
    while (next < N) out.push(await one(next++));
  }));
  const secs = (performance.now() - t0) / 1000;

  const codes = out.reduce((a, r) => ((a[r.status] = (a[r.status] || 0) + 1), a), {});
  const lat = out.filter((r) => r.status).map((r) => r.ms).sort((a, b) => a - b);

  console.log('durum kodları :', codes);
  console.log('süre          :', secs.toFixed(1), 's →', (N / secs).toFixed(1), 'istek/sn');
  if (lat.length) {
    console.log('gecikme       : p50', pct(lat, 0.5).toFixed(0), 'ms | p95', pct(lat, 0.95).toFixed(0),
                'ms | p99', pct(lat, 0.99).toFixed(0), 'ms | max', lat[lat.length - 1].toFixed(0), 'ms');
  }

  const first429 = out.findIndex((r) => r.status === 429);
  const lim = out.find((r) => r.limit)?.limit;
  if (first429 !== -1) {
    console.log(`\nRATE LIMIT: ${first429 + 1}. istekte 429 başladı (limit=${lim ?? '?'}/pencere).`);
    console.log(`${codes[429]} istek reddedildi — bu IP pencere dolana kadar bloklu.`);
  } else {
    console.log(`\n429 yok. Kalan kota: ${out[out.length - 1]?.remaining ?? '?'}/${lim ?? '?'}`);
  }
  const errs = out.filter((r) => r.status === 0);
  if (errs.length) console.log(`\n${errs.length} bağlantı hatası, ilki: ${errs[0].err}`);
  const server5xx = out.filter((r) => r.status >= 500).length;
  if (server5xx) console.log(`\n${server5xx} adet 5xx — sunucu tarafı patladı, logları kontrol et.`);
})();
