# Başvuru Dönemleri — Uygulama Planı

**Hedef:** Başvuru formlarının açık/kapalı durumu backend'de tutulsun ve uygulansın. Admin tarihleri panelden ayarlasın, sayfalar durumu backend'den okusun.

**Mimari:**
- Durum MongoDB'de `ApplicationWindow` kaydında tutulur (form başına bir kayıt). Kayıt yoksa varsayılan geçerli.
- Açık/kapalı kararı saf bir yardımcıda (`helpers/applicationWindow.js`) verilir; bu yardımcı birim testlidir.
- Backend iki endpoint sunar ve iki başvuru handler'ında 403 kontrolü yapar.
- Frontend durumu tek bir hook'tan okur; admin paneline yeni bir sayfa eklenir.

**Teknoloji:** Express 5 + Mongoose 9 (ESM), `node:test`, Next.js 16 + React, mevcut shadcn bileşenleri.

**Spec:** `docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md`

## Global Constraints

- **Slug'lar:** `general`, `mobil-web`, `ai`, `game`. Mevcut kimlikler, değişmez.
- **Açık kuralı:** `opensAt !== null && opensAt <= now && (closesAt === null || now < closesAt)`.
- **Varsayılan:** `general` → `{ opensAt: new Date(0), closesAt: null }`; diğerleri → `{ opensAt: null, closesAt: null }`.
- **Kapalı başvuru:** HTTP 403 ve `{ success: false, message: "Bu başvuru şu anda kapalı." }`.
- **PATCH:** yalnızca admin (`protect`, `adminOnly`). 400 mesajları spec'teki tabloyla birebir.
- **Tarih gösterimi:** `new Intl.DateTimeFormat('tr-TR', { dateStyle: 'long', timeStyle: 'short', timeZone: 'Europe/Istanbul' })`.
- **Bağımlılık:** yeni npm bağımlılığı yok. Backend ESM; CI ve production Node 22.11.
- **Mongoose 9 upsert:** `findOneAndUpdate(filter, update, { upsert: true, returnDocument: 'after', runValidators: true })`.
- **graphify:** her kod commit'inden önce `graphify update .` çalıştırılır ve `graphify-out/` commit'e eklenir.
- **Push öncesi:** `cd frontend && npm run check:content && npm run lint && npm run build`.
- **Metinler:** UI metinleri spec'tekiyle birebir, Türkçe karakterler doğru.

## Review Focus

1. **Saat dilimi:** admin 18:00 girerse API'de `15:00:00.000Z`, sitede 18:00 görünmeli. → Task 6, Adım 4
2. **Form doldurulurken pencere kapanırsa:** gönderim 403 almalı ve formda "Bu başvuru şu anda kapalı." yazmalı; genel bir hata değil. → Task 5, Adım 4
3. **Backend'e ulaşılamazsa:** `/apply` ve `/apply/<slug>` kapalı görünmeli ve uyarı metni çıkmalı; sonsuz yükleme ya da "Başvur" düğmesi olmamalı. → Task 5, Adım 4
4. **Kenar değerleri:** açılış anında açık, kapanış anında kapalı. → Task 1, birim testleri
5. **Admin olmayan roller:** PATCH 403 dönmeli. Kenar menüsünde öğe olmamalı; adrese gidilince kendi sayfasına yönlendirilmeli. → Task 2 smoke adım 4, Task 6 Adım 1

---

### Task 1: Pencere kuralı (saf fonksiyonlar) ve birim testleri

**Files:**
- Create: `backend/helpers/applicationWindow.js`
- Test: `backend/helpers/applicationWindow.test.js`
- Modify: `.github/workflows/ci.yml` (backend işi, `npm ci`'dan sonra `- run: node --test`)

**Interfaces:**
- Produces:
  - `APPLICATION_SLUGS: string[]`: `['general', 'mobil-web', 'ai', 'game']`
  - `DEFAULT_WINDOWS: Record<slug, { opensAt: Date|null, closesAt: Date|null }>`
  - `isWindowOpen(window: { opensAt: Date|null, closesAt: Date|null }, now = new Date()): boolean`
  - `windowState(window, now = new Date()): 'open' | 'scheduled' | 'closed'`
  - `toPublicWindow(slug, window, now = new Date()): { slug, opensAt: string|null, closesAt: string|null, state, isOpen }`; tarihler `toISOString()`

- [ ] **Adım 1: Başarısız testi yaz** (`node:test` + `node:assert/strict`, `T = new Date('2026-10-01T12:00:00Z')`)

```js
test('opensAt yoksa kapalı', () => { assert.equal(isWindowOpen({ opensAt: null, closesAt: null }, T), false); assert.equal(windowState({ opensAt: null, closesAt: null }, T), 'closed'); });
test('açılış anında açık', () => assert.equal(isWindowOpen({ opensAt: T, closesAt: null }, T), true));
test('açılıştan önce planlandı', () => { const w = { opensAt: new Date(+T + 1), closesAt: null }; assert.equal(isWindowOpen(w, T), false); assert.equal(windowState(w, T), 'scheduled'); });
test('kapanış anında kapalı', () => { const w = { opensAt: new Date(+T - 3600e3), closesAt: T }; assert.equal(isWindowOpen(w, T), false); assert.equal(windowState(w, T), 'closed'); });
test('kapanıştan hemen önce açık', () => assert.equal(isWindowOpen({ opensAt: new Date(+T - 3600e3), closesAt: new Date(+T + 1) }, T), true));
test('kapanış yoksa süresiz açık', () => assert.equal(isWindowOpen({ opensAt: new Date('2025-01-01T00:00:00Z'), closesAt: null }, T), true));
test('varsayılanlar: genel açık, teknikler kapalı', () => {
  assert.deepEqual(Object.keys(DEFAULT_WINDOWS), APPLICATION_SLUGS);
  assert.equal(isWindowOpen(DEFAULT_WINDOWS.general, T), true);
  for (const s of ['mobil-web', 'ai', 'game']) assert.equal(isWindowOpen(DEFAULT_WINDOWS[s], T), false);
});
test('toPublicWindow ISO döndürür', () => assert.deepEqual(
  toPublicWindow('ai', { opensAt: new Date('2026-10-01T06:00:00Z'), closesAt: null }, T),
  { slug: 'ai', opensAt: '2026-10-01T06:00:00.000Z', closesAt: null, state: 'open', isOpen: true }));
```

- [ ] **Adım 2: Testi çalıştırıp başarısız olduğunu gör.** `cd backend && node --test helpers/`
  - Beklenen: FAIL, `Cannot find module '.../applicationWindow.js'`.
- [ ] **Adım 3: `helpers/applicationWindow.js`'i yaz.** Dışa aktarılanlar Interfaces bloğundaki gibi olacak; mongoose import edilmeyecek.
- [ ] **Adım 4: Testi yeniden çalıştır.** `cd backend && node --test helpers/`
  - Beklenen: `# pass 8`, `# fail 0`.
- [ ] **Adım 5: CI'a adım ekle.** `ci.yml` backend işinde `npm ci`'dan hemen sonra `- run: node --test` gelecek. `cd backend && node --test` yerelde de `# pass 8` vermeli.
- [ ] **Adım 6: Commit.** `graphify update .` → `git add backend/helpers .github/workflows/ci.yml graphify-out` → `git commit -m "Başvuru dönemi kuralı: saf fonksiyonlar ve node:test birim testleri"`

### Task 2: Model, GET/PATCH endpoint'leri ve smoke betiğinin yetki/doğrulama kısmı

**Files:**
- Create: `backend/models/ApplicationWindow.js`, `backend/controllers/applicationWindowsController.js`, `backend/scripts/windows-smoke.js`
- Modify: `backend/routes/submissionsRoutes.js` (iki rota `router.route('/:id')`'den önce), `backend/ENDPOINTS.md`

**Interfaces:**
- Consumes: Task 1'in dışa aktardıkları.
- Produces:
  - `getWindow(slug): Promise<{ opensAt: Date|null, closesAt: Date|null }>`: kayıt varsa onu, yoksa `DEFAULT_WINDOWS[slug]`'ı döndürür (`.lean()`).
  - `getWindows(req, res)` ve `updateWindow(req, res)`: handler'lar.
  - HTTP sözleşmesi spec'teki gibi.
  - `windows-smoke.js` → çalıştırma: `API_URL` (varsayılan `http://127.0.0.1:3001`) ve `KEY` ortam değişkenleri.
    - Hostname `localhost` ya da `127.0.0.1` değilse exit 2 ile durur; production'a koşulmaz.
    - Kullanıcısı olmayan boş bir veritabanı ister, ilk admini `KEY` ile oluşturur.
    - Her başarılı adımda `ok  <açıklama>` basar; ilk hatada `FAIL <açıklama>` basar ve exit 1 verir.

- [ ] **Adım 1: Smoke betiğini yaz** (Node yerleşik `fetch` + `node:assert/strict`, adımlar sırayla):
  1. `GET /submissions/windows` → 200; `data` içindeki slug'lar `['general','mobil-web','ai','game']`; `general.isOpen === true`; diğer üçü `state === 'closed'`.
  2. `PATCH /submissions/windows/ai` token olmadan → 401.
  3. `POST /users`, `Authorization: Bearer ${KEY}` ve `{ name, email: 'smoke-admin@example.com', password: 'smoke-password-123', role: 'admin' }` → 201. `POST /auth/login` → admin token.
  4. Admin `POST /users` ile `role: 'ai'` bir kullanıcı oluşturur, o kullanıcıyla giriş yapılır. `PATCH .../ai` → 403.
  5. Admin, 400 durumları (mesajlar birebir):

     | Gönderilen | Beklenen mesaj |
     |---|---|
     | slug `foo` | "Geçersiz başvuru formu." |
     | `opensAt: 'yarin'` | "Tarih geçersiz." |
     | `opensAt: {}` | "Tarih geçersiz." |
     | `{ opensAt: null, closesAt: <ISO> }` | "Kapanış tarihi için açılış tarihi gerekli." |
     | `closesAt ≤ opensAt` | "Kapanış tarihi açılış tarihinden sonra olmalı." |

  6. `PATCH .../game` `{ opensAt: şimdi+1sa, closesAt: şimdi+2sa }` → 200, `state === 'scheduled'`, `isOpen === false`. GET de aynısını gösterir.
  7. `PATCH .../ai` `{ opensAt: şimdi−1dk, closesAt: şimdi+1sa }` → 200, `isOpen === true`.
- [ ] **Adım 2: Geçici ortamda çalıştırıp başarısız olduğunu gör.**
  - Ortam: `docker run -d --name ws-mongo -p 27017:27017 mongo:8` ve `cd backend && MONGODB_URI=mongodb://127.0.0.1:27017/ws JWT_SECRET=dev KEY=<32+ karakter> CORS_ALLOWED_ORIGINS=http://localhost:3000 npm start`.
  - Çalıştır: `KEY=<aynı> node scripts/windows-smoke.js`.
  - Beklenen: 1. adımda FAIL, 401. İstek henüz `/:id` rotasına düşüyor ve `protect` token istiyor.
- [ ] **Adım 3: Modeli yaz.** Alanlar spec'teki tabloyla aynı: `slug` enum `APPLICATION_SLUGS` ile, `timestamps: true`, model adı `ApplicationWindow`.
- [ ] **Adım 4: Controller'ı yaz.**
  - `getWindows`, dört formu `APPLICATION_SLUGS` sırasıyla `toPublicWindow` ile döndürür ve `Cache-Control: no-store` yazar.
  - `updateWindow` doğrulama sırası: slug → iki değerin tipi (`null` ya da `Date.parse` geçerli string) → açılış/kapanış ilişkisi. Ardından `findOneAndUpdate` upsert yapar, `updatedBy: req.user._id` yazar ve `logger.info` ile loglar.
- [ ] **Adım 5: Rotaları ekle.** `router.get('/windows', getWindows)` ve `router.patch('/windows/:slug', protect, adminOnly, updateWindow)`, ikisi de `/:id`'den önce.
- [ ] **Adım 6: Smoke'u yeniden çalıştır.** Backend'i yeniden başlat, veritabanını sıfırla (`docker rm -f ws-mongo`, yeniden çalıştır), sonra betiği çalıştır.
  - Beklenen: 7 `ok` satırı, exit 0.
- [ ] **Adım 7: `ENDPOINTS.md`'yi güncelle.** "Gelen Başvurular" bölümüne iki endpoint eklenir. İki başvuru girişine "form kapalıysa 403" yazılır.
- [ ] **Adım 8: Commit.** `graphify update .` sonrası model, controller, rotalar, smoke betiği, ENDPOINTS ve `graphify-out` → `"Başvuru dönemleri: model ve GET/PATCH endpoint'leri"`

### Task 3: Başvurulara 403 uygulaması, smoke'un kalanı ve CI

**Files:**
- Modify: `backend/controllers/submissionsController.js`, `backend/scripts/windows-smoke.js`, `.github/workflows/ci.yml`, `CLAUDE.md`

**Interfaces:**
- Consumes: `getWindow` (Task 2), `isWindowOpen` (Task 1).

- [ ] **Adım 1: Smoke'a uygulama adımlarını ekle.** 7. adımdan sonra devam eder.
  - Gövde `loadtest.js`'teki `body(i)` alanlarıdır: `name, studentId, email, phone, faculty, department, grade`.
  - Her başvuruda öğrenci no, e-posta ve telefon farklıdır.
  - Başka alan gönderilmez; örneğin `surname` teknik uçta allowlist'e takılır.
  8. Teknik başvuru `ai` (7. adımda açıldı) → 201.
  9. `PATCH .../ai` `{ null, null }` → yeni bir `ai` başvurusu → 403 ve mesaj "Bu başvuru şu anda kapalı.".
  10. `game` (planlandı) başvurusu → 403.
  11. `PATCH .../general` `{ null, null }` → genel başvuru 403. Ardından `PATCH .../general` `{ opensAt: new Date(0).toISOString(), closesAt: null }` → genel başvuru 201. Betik genel formu açık bırakarak biter.
- [ ] **Adım 2: Smoke'u çalıştırıp başarısız olduğunu gör.** Ortam Task 2'deki gibi, veritabanı sıfırlanmış.
  - Beklenen: 9. adımda FAIL (201 geldi, 403 bekleniyordu).
- [ ] **Adım 3: Kontrolü uygula.**
  - `createGeneralSubmission`'ın en başında: `if (!isWindowOpen(await getWindow('general'))) return res.status(403).json({ success: false, message: "Bu başvuru şu anda kapalı." })`.
  - `createTechnicalSubmission`'da `validCategories` kontrolü fonksiyonun başına taşınır ve hemen ardından aynı kontrol `slug` için yapılır.
- [ ] **Adım 4: Smoke'u yeniden çalıştır.**
  - Beklenen: 11 `ok` satırı, exit 0.
  - Ardından `node scripts/loadtest.js --submit --n 40`: exit 0 ve `15 istek reddedildi`.
    - Genel form açık kaldığı için gönderimler geçer.
    - `formLimiter` başarılı ve başarısız isteği ayırmadan sayar. Smoke 5 form isteği harcadığından sonuç 25×201 + 15×429 olur.
- [ ] **Adım 5: CI'ı güncelle.**
  - Backend işinin `env` bölümüne test değerleri eklenir: `JWT_SECRET: ci-jwt-secret` ve `KEY: ci-ilk-admin-anahtari-0123456789abcdef` (en az 32 karakter; geçici veritabanı içindir).
  - Health bekleme adımından sonra, `loadtest`'lerden **önce** `- run: node scripts/windows-smoke.js` eklenir. Sonrası olmaz, çünkü loadtest form limitini tüketiyor.
  - `ci.yml:78-79`'daki yorum şöyle olur: `--submit 40 → 25×201 + 15×429; smoke önce 5 form isteği harcıyor`.
- [ ] **Adım 6: CLAUDE.md'yi güncelle.**
  - Yeni "### Başvuru dönemleri" bölümü: kural, varsayılanlar, 403, smoke betiği ve neden loadtest'ten önce koştuğu, betiğin yalnızca yerel ve boş veritabanında çalıştığı.
  - Rate limit bölümünde "`--submit --n 40`'ın son 10'u bu yüzden 429 alır" cümlesi "son 15'i" olur; gerekçe: `windows-smoke` önce 5 form isteği harcıyor.
  - Slug değiştirme sırasına `ApplicationWindow` enum'u ve `APPLICATION_SLUGS` eklenir.
- [ ] **Adım 7: Commit.** `graphify update .` → `"Başvurular kapalı pencerede 403 döner; smoke betiği CI'da"`

### Task 4: Frontend veri katmanı

**Files:**
- Create: `frontend/src/lib/applicationWindow.ts`, `frontend/src/hooks/useApplicationWindows.ts`

**Interfaces:**
- Produces:
  - `type WindowState = 'open' | 'scheduled' | 'closed'`
  - `type ApplicationWindow = { slug: string; opensAt: string | null; closesAt: string | null; state: WindowState; isOpen: boolean }`
  - `APPLICATION_LABELS`:

    | Anahtar | Görünen ad |
    |---|---|
    | `general` | Genel Üyelik |
    | `mobil-web` | Mobil ve Web Geliştirme Takımı |
    | `ai` | Yapay Zeka Takımı |
    | `game` | Oyun Geliştirme Takımı |

  - `formatWindowDate(iso: string): string`: Global Constraints'teki `Intl` biçimi.
  - `windowSummary(w: ApplicationWindow): string`: spec'teki özet tablosuyla birebir.
  - `toLocalInput(iso: string | null): string`: `null` için `''`, değilse tarayıcı yerel saatinde `YYYY-MM-DDTHH:mm`.
  - `fromLocalInput(value: string): string | null`: `''` için `null`, değilse `new Date(value).toISOString()`.
  - `useApplicationWindows(): { windows: Record<string, ApplicationWindow> | null; isLoading: boolean; error: string | null; refresh(): Promise<void>; updateWindow(slug, opensAt, closesAt): Promise<{ ok: boolean; message?: string }> }`
    - GET `cache: 'no-store'` ile atılır. API'nin döndürdüğü dizi, slug'a göre nesneye çevrilir.
    - PATCH `useAuth().getAuthHeader()` ile atılır.
    - Hata olursa `error` dolar ve `windows` `null` kalır.

- [ ] **Adım 1: Doğrulama komutunu yaz ve çalıştır; modül olmadığı için başarısız olmalı.**
  - Komut: `cd frontend && TZ=Europe/Istanbul node --experimental-strip-types -e "import('./src/lib/applicationWindow.ts').then(m => { console.log(m.formatWindowDate('2026-10-05T20:59:00Z')); console.log(m.fromLocalInput('2026-10-05T18:00')); console.log(m.toLocalInput('2026-10-05T15:00:00.000Z')); console.log(m.windowSummary({ slug: 'ai', opensAt: null, closesAt: null, state: 'closed', isOpen: false })); })"`
  - Beklenen: modül bulunamadı hatası.
- [ ] **Adım 2: `lib/applicationWindow.ts`'i yaz.** Node'un dosyayı doğrudan çalıştırabilmesi için:
  - Dosya hiçbir şey import etmez.
  - Yalnızca silinebilir TS sözdizimi kullanılır (enum yok).
- [ ] **Adım 3: Aynı komutu çalıştır.** Beklenen dört satır:
  - `5 Ekim 2026 23:59`
  - `2026-10-05T15:00:00.000Z`
  - `2026-10-05T18:00`
  - `Başvurular kapalı`

  stderr'de `MODULE_TYPELESS_PACKAGE_JSON` uyarısı çıkması beklenir; frontend `package.json`'da `type` alanı yok. Komut Node 22.22'de denendi.
- [ ] **Adım 4: `hooks/useApplicationWindows.ts`'i yaz.** API çağrısı deseni `useSubmissions.ts` ile aynı: `process.env.NEXT_PUBLIC_API_URL`, `getAuthHeader()`, JSON gövde.
- [ ] **Adım 5: Lint ve build.** `cd frontend && npm run lint && npm run build`
  - Beklenen: 0 hata, build exit 0.
- [ ] **Adım 6: Commit.** `graphify update .` → `"Frontend: başvuru dönemi hook'u ve tarih yardımcıları"`

### Task 5: Başvuru sayfaları durumu backend'den okur, JSON temizliği

**Files:**
- Modify:
  - `frontend/src/components/pages/apply.tsx` (`Application` arayüzünden `isOpen`, `deadline` çıkar)
  - `frontend/src/components/pages/applyDetail.tsx`
  - `frontend/src/hooks/useApplyDetail.ts` (tipten `isOpen`, `deadline` çıkar)
  - `frontend/public/data/applications/{index,general,mobil-web,ai,game}.json` (`isOpen`, `deadline` çıkar)
  - `CLAUDE.md` ("Başvuru formuna alan ekleme"deki `isOpen`/`deadline` tuzağı yerine "açık/kapalı durumu admin panelindeki Başvuru Dönemleri'nden")

**Interfaces:**
- Consumes: `useApplicationWindows`, `windowSummary`, `ApplicationWindow` (Task 4).

- [ ] **Adım 1: Kabul senaryosunu yaz** (yerel Playwright; repoya girmez). Geçici Mongo, backend ve `npm run build && npm run start` (`NEXT_PUBLIC_API_URL=http://127.0.0.1:3001`) ile:
  - (a) Varsayılan durum:
    - `/apply`'da genel kartta "Başvur" ve "Son başvuru tarihi belirtilmedi" görünür.
    - Teknik kartlarda "Başvuru Kapalı" ve "Başvurular kapalı" görünür.
    - `/apply/ai`'de form yok, "Bu başvuru şu anda kapalı." var.
  - (b) Admin API ile `ai`'yi açar (kapanış yarın 23:59 Türkiye saati):
    - `/apply` → "Son başvuru: <tarih> 23:59".
    - `/apply/ai` → form görünür, üstte aynı özet metni var.
  - (c) `game` planlanmış → `/apply/game`'de "Başvurular henüz açılmadı." ve "<tarih> tarihinde açılacak".
  - (d) `/apply/ai` formu doldurulurken admin API ile `ai`'yi kapatır, sonra gönderim yapılır → "Başvuru Gönderilirken Hata Oluştu" kartında "Bu başvuru şu anda kapalı." görünür.
  - (e) Windows isteği iptal edilir (`page.route(... abort)`):
    - `/apply`'da "Başvuru durumu alınamadı. Lütfen daha sonra tekrar deneyiniz." görünür, hiçbir kartta "Başvur" düğmesi yoktur.
    - `/apply/ai` kapalı görünür.
- [ ] **Adım 2: Senaryoyu çalıştırıp başarısız olduğunu gör.**
  - Beklenen: (a)'da FAIL. Sayfa hâlâ JSON'daki `isOpen`'ı okuyor ve özet metni yok.
- [ ] **Adım 3: Sayfaları değiştir ve JSON'ları temizle.**
  - `apply.tsx`: açık/kapalı filtresi `windows[slug]?.isOpen === true` olur. Alt satır `windowSummary` ile yazılır. `error` varsa üstte uyarı metni çıkar.
  - `applyDetail.tsx`: `windows[slug]?.isOpen` değilse kapalı kartı gösterir: `scheduled` için "Başvurular henüz açılmadı.", diğerleri için "Bu başvuru şu anda kapalı." ve altında özet. Formun üst satırında özet yer alır.
  - Gönderim hatası için değişiklik gerekmez: `submitApplication` backend'in `message` alanını döndürüyor (`useSubmissions.ts:160`), `applyDetail` bunu hata kartında gösteriyor (`applyDetail.tsx:337`). Senaryo (d) bunu doğrular.
- [ ] **Adım 4: Senaryoyu yeniden çalıştır.**
  - Beklenen: (a)–(e) geçer.
  - Ardından `cd frontend && npm run check:content && npm run lint && npm run build` exit 0 vermeli.
- [ ] **Adım 5: Commit.** `graphify update .` → `"Başvuru sayfaları açık/kapalı durumunu backend'den okuyor"`

### Task 6: Admin paneli "Başvuru Dönemleri" sayfası

**Files:**
- Create:
  - `frontend/src/app/(routes)/(admin-layout)/admin/dashboard/application-windows/page.tsx`: yalnızca bileşeni render eder, diğer admin sayfalarındaki gibi.
  - `frontend/src/components/pages/admin/application-windows.tsx`
- Modify:
  - `frontend/src/components/layout/AdminSidebar.tsx`: `{ label: 'Başvuru Dönemleri', href: '/admin/dashboard/application-windows' }`, "Teknik Takım"ın altına.
  - `CLAUDE.md`: "Başvuru dönemleri" bölümüne admin sayfası ve deploy sırası (önce backend, sonra frontend) eklenir.

**Interfaces:**
- Consumes: `useApplicationWindows`, `APPLICATION_LABELS`, `toLocalInput`, `fromLocalInput`, `formatWindowDate` (Task 4).

- [ ] **Adım 1: Kabul senaryosunu yaz** (yerel Playwright, `timezoneId: 'Europe/Istanbul'`):
  - Admin olarak giriş yapılır → kenar menüsünde "Başvuru Dönemleri" var → sayfada dört kart ve durum rozetleri görünür.
  - Yapay Zeka kartına Açılış olarak bugün 18:00, Kapanış olarak yarın 18:00 girilir → "Kaydet" → "Kaydedildi" mesajı çıkar.
  - API'de `opensAt` değeri `...T15:00:00.000Z` olmalı. `/apply/ai`'de "Son başvuru: <yarın> 18:00" görünmeli.
  - Kapanış açılıştan önce girilip "Kaydet" → kartta "Kapanış tarihi açılış tarihinden sonra olmalı." görünür.
  - "Kapat" → rozet "Kapalı" olur.
  - `role: 'ai'` kullanıcısıyla giriş yapılır → kenar menüsünde öğe yoktur. `/admin/dashboard/application-windows`'a gidilince `/admin/dashboard/technical-team/ai`'ye yönlendirilir.
- [ ] **Adım 2: Senaryoyu çalıştırıp başarısız olduğunu gör.** Beklenen: menü öğesi yok, FAIL.
- [ ] **Adım 3: Sayfayı, rotayı ve menü öğesini yaz.**
  - Kart düzeni ve metinler spec'teki gibi.
  - "Kaydet", `updateWindow(slug, fromLocalInput(açılış), fromLocalInput(kapanış))` çağırır. "Kapat" `(slug, null, null)` çağırır. Başarıda `refresh()` çalışır ve "Kaydedildi" görünür; hatada backend mesajı görünür.
  - Rol filtresine ve layout'a dokunulmaz.
    - `AdminSidebar.tsx:199-208`'deki filtre beyaz liste; admin dışı roller yeni öğeyi zaten görmez.
    - Dashboard `layout.tsx` takım rollerini kendi teknik sayfalarına, sponsor'u sponsor-mail sayfasına yönlendiriyor.
- [ ] **Adım 4: Senaryoyu yeniden çalıştır.**
  - Beklenen: bütün adımlar geçer, 18:00 gidiş-dönüşü doğru.
  - Ardından `cd frontend && npm run check:content && npm run lint && npm run build` exit 0 vermeli.
- [ ] **Adım 5: Commit.** `graphify update .` → `"Admin paneli: Başvuru Dönemleri sayfası"`

---

**Bitiş:**
- Branch'in tamamı son bir kod incelemesinden geçer; kritik bulgular düzeltilir.
- PR #62 açıklaması güncellenir; merge edilmez.
- Deploy notu kullanıcıya iletilir: önce #61, sonra #62; önce backend, sonra frontend.
