# CLAUDE.md

## Proje

KOU SENG — Kocaeli Üniversitesi Yazılım Kulübü web sitesi: tanıtım ve takım
sayfaları, duyurular, Medium yayınları (RSS), üyelik ve teknik takım
başvuruları, iletişim formu, admin paneli, sponsorluk maili.

Monorepo, kökte `package.json` yok: `frontend/` (Next.js 16) + `backend/`
(Express.js + MongoDB). Deploy repo dışında, Coolify üzerinden; repoda yalnızca
CI (`.github/workflows/ci.yml`) var.

## Komutlar

```bash
# frontend/
npm run dev             # Turbopack, port 3000
npm run build           # production build (Turbopack)
npm run start           # production sunucusu, port 3000
npm run lint            # ESLint
npm run check:content   # public/data JSON'ları + görseller

# backend/
npm run dev             # nodemon, port 3001
npm start               # production komutu: node --experimental-require-module index.js
node scripts/loadtest.js --n 150           # GET /health, rate limit duvarını bulur
node scripts/loadtest.js --submit --n 40   # gerçek kayıt yazar — production DB'ye ASLA
```

İki pakette de `pm2:start` / `pm2:stop` / `pm2:restart` script'leri var;
production deploy'u Coolify'da.

Unit test altyapısı yok. Push'tan önce:

```bash
cd frontend && npm run check:content && npm run lint && npm run build
```

CI her PR'da ve `main`'e push'ta frontend'de bu üçünü koşturur; backend'i
geçici bir MongoDB ile `npm start` üzerinden gerçekten ayağa kaldırıp
`scripts/loadtest.js`'i (`--submit --n 40`, ardından `/health`'e `--n 100`)
smoke test olarak çalıştırır; iki pakette `npm audit --omit=dev
--audit-level=high` koşar.

## Klasör yapısı

### Frontend (`frontend/`)

Next.js App Router. Route'lar `src/app/(routes)/` altında layout gruplarında:

- `(main-layout)/` — ana site sayfaları (Header + Footer)
- `(admin-layout)/admin/` — admin paneli (AdminSidebar)
- `(apply-layout)/apply/[applySlug]/` — başvuru formları

`page.tsx` dosyaları çoğunlukla yalnızca `src/components/pages/` altındaki
client component'i render eder; business logic orada.

- `src/hooks/` — tüm API çağrıları ve state yönetimi
- `src/components/pages/` — sayfa düzeyi bileşenler (hook'ları kullanır)
- `src/components/layout/` — Header, Footer, AdminSidebar gibi paylaşılan layout
- `src/components/ui/` — Shadcn/UI primitive'leri, doğrudan düzenlenmez; yenisi
  Shadcn ile eklenir (`new-york` stili, CSS değişkenleri açık)
- `src/lib/api.ts` — tiplendirilmiş fetch'ler (RSS 5 dk, duyurular 1 dk önbellek)
- `src/lib/*Data.ts` — `public/data/` JSON'larını okuyup tiplendirir
- `scripts/check-content.mjs` — `check:content`

Path alias: `@/*` → `src/*`.

Stil: Tailwind CSS v4 + CSS değişkenleri. Marka renkleri
`src/app/globals.css`'te: `--koyu-lacivert: #001B4A`, `--lacivert: #014576`,
`--turkuaz: #0389BC`, `--acik-mavi: #93CBDC`. Dark/Light `next-themes` ile (root
layout'ta `ThemeProvider`). Tailwind class çakışmaları için `src/lib/utils.ts`
→ `cn()` (`clsx` + `tailwind-merge`).

### Backend (`backend/`)

Express.js, routes → controllers → models; ayrıca `middlewares/`, `helpers/`,
`config/`, `scripts/`. Endpoint ayrıntıları: `backend/ENDPOINTS.md`.

Route prefix'leri: `/health`, `/auth`, `/users`, `/announcements`, `/contact`,
`/rss`, `/submissions`, `/mail`, `/mail/queue`.

Kimlik doğrulama: `POST /auth/login` JWT döndürür, frontend token'ı
localStorage'da saklar, korunan istekler `Authorization: Bearer <token>`
gönderir. `middlewares/authMiddleware.js`: `protect`, `adminOnly`,
`roleOnlyForCategory`, `roleOnlyForSubmission`, `sponsorOrAdmin`.

Roller (`User.role`): `admin`, `mobil-web`, `ai`, `game`, `sponsor`, `user`.
Takım rolleri yalnızca kendi kategorilerinin başvurularını yönetir; `sponsor`
yalnızca sponsor mailine (`/mail`, `/mail/queue`) erişir.

Logging: `helpers/logger.js` — `logger.debug()`, `logger.info()`,
`logger.error()`; `LOG_LEVEL=debug` olmadıkça debug logları gösterilmez.

Modeller (`models/`, Mongoose):

- **User:** `name`, `email`, `password` (bcrypt), `role`
- **Announcement:** `title`, `content`, `summary`, `category`, `author`
- **Contact:** `name`, `email`, `subject`, `message`, `isRead`
- **Submission:** `submissionType` (general/technical), öğrenci alanları,
  `technicalCategory`, `customFields` (dinamik alanlar), `status`
  (pending/reviewed/accepted/rejected)
- **MailJob:** sponsor mail kuyruğu

### İçerik (`frontend/public/data/`)

Statik site içeriği koda gömülü değil, JSON dosyalarında; `src/lib/*Data.ts`
bunları okuyup tiplendirir.

- Yönetim kurulu: `about/data.json` → `boardMembers[]`, görseller
  `public/profile/boardMembers/`
- Takım üyeleri: `teams/{mobil-web,ai,game}.json` → `members[]` ve
  `leaderMessage.author`, görseller `public/profile/teams/<takım>/`
- Başvuru formları: `applications/<slug>.json`
- KVKK aydınlatma metni (`/kvkk`): `kvkk/data.json`

## Ortam değişkenleri

Şablonlar: `frontend/.env.example`, `backend/.env.example`. Şablonda olmayan
backend değişkenleri: `MAIL_USER`, `MAIL_APP_PASSWORD`, `MAIL_SENDER_NAME`
(sponsor maili).

- `NEXT_PUBLIC_ENABLE_RSS=0`: Yayınlar (Medium RSS) bölümü, menü/footer
  bağlantısı ve `/publications` kalkar.
- `NEXT_PUBLIC_*` değerleri build sırasında koda gömülür: Coolify'da build'de de
  erişilebilir olmalı ve değiştirince yeniden deploy gerekir.
- `KEY` en az 32 karakter olmalı (bkz. İlk admin oluşturma).

## Projeye özel kurallar

### Paket yöneticisi: npm

Her pakette tek lockfile `package-lock.json`, CI `npm ci` kullanıyor.
`pnpm-lock.yaml` ve `yarn.lock` `.gitignore`'da: iki lockfile bir arada
kurulumların ayrışmasına yol açıyordu.

**Turbopack workspace kökü sabitlendi.** Next, kökü ağaçta yukarı doğru lockfile
arayarak tahmin ediyor; geliştiricinin ev dizininde başıboş bir
`package-lock.json` varsa kökü oraya çözüp her build'de uyarı basıyordu.
`next.config.ts` içindeki `turbopack.root` bunu makineden bağımsız hâle getirdi.
Uyarıyı depodaki lockfile'ları silerek kovalama — sebep repo dışında olabilir.

### graphify

AST çıkarımı `.json` dosyalarından düğüm üretmiyor. Site içeriğinin büyük kısmı
(`frontend/public/data/**.json` — yönetim kurulu, takım üyeleri, başvuru
formları) grafikte **yok**. İçerik/roster soruları için `graphify query` değil,
doğrudan dosya okuması gerekir. Grafik yalnızca kod ilişkileri için güvenilir.

### İçerik ve kişi kartları

- Bir kişinin adı değişince `leaderMessage.author` alanı da kontrol edilmeli —
  lider ismi `members[]` dışında ikinci bir yerde daha tekrar ediyor.
- Görsel yolları JSON'da elle yazılı ve `next/image` `<Image>` ile `public/`
  altından servis edilir (`about.tsx`, `teamDetail.tsx`). Next bu yolların
  varlığını **build sırasında doğrulamaz** — yanlış yol build'i geçer ve çalışma
  zamanında 404 olur. Dosya adı değişikliğinde JSON yolu ile dosya adını
  birlikte değiştir ve sayfayı gerçekten aç.
- Dosya adlarında ASCII kullan: Türkçe karakterli adlar (`ı`, `ü` …) Unicode
  normalizasyon (NFC/NFD) farkı yüzünden macOS'ta çalışıp Linux sunucuda 404
  verebilir.
- `teamDetail.tsx` `member.skills.length` yazıyor — optional chaining **yok**.
  Bir üyeden `skills` eksikse takım sayfası çalışma zamanında patlar, build
  sorunsuz geçer. `skills` en azından `[]` olmalı.
- `github`, `linkedin`, `kaggle`, `skills` alanlarının hepsi bileşende truthy
  kontrolüyle sarılı — bilinmeyen değerler için `""` / `[]` yaz, alanı
  **silme**.
- Görseli olmayan üye için yolda **`placeholder`** kelimesi geçen bir değer
  kullan (ör. `/profile/boardMembers/placeholder.jpeg`). `about.tsx` ve
  `teamDetail.tsx` `!member.image.includes("placeholder")` kontrolüyle o kaydı
  hiç yüklemeyip FontAwesome ikon fallback'i render eder — dosyanın var olması
  gerekmez.
- KVKK metni sitenin gerçekte topladığı veriyi anlatmalı: başvuru veya iletişim
  formuna yeni bir alan eklenirse, verinin paylaşıldığı ya da saklandığı yer
  değişirse `kvkk/data.json`'daki ilgili bölüm ve `lastUpdated` da
  güncellenmeli.

### Sosyal medya linkleri

Üyeler linklerini telefondan paylaşıyor; gelen hâli işlenmeden yazılmamalı:

- `?utm_source=share_via&utm_content=profile&utm_medium=member_ios` kuyruğunu at.
- Yol segmentindeki Türkçe karakterleri percent-encode et
  (`bengüsu-levent` → `beng%C3%BCsu-levent`). Ham unicode tarayıcıda çalışıyor
  ama kopyalanıp taşınırken bozulabiliyor; kayıtlı üyelerde de encode'lu hâl
  kullanılmış.
- GitHub çoğu zaman çıplak kullanıcı adı olarak geliyor (`duyguuzent`);
  `https://github.com/<kullanıcı>` hâline getir. `check:content` mutlak URL
  olmayan değeri reddeder.

### Görsel hazırlama

Gelen fotoğraflar telefon çıktısı: HEIC, 2–4MB, dikey, EXIF'inde GPS var.
Yayımlamadan önce: kareye kırp (yüz merkezli, yüz karenin ~%42 yüksekliğinde),
400×400 JPEG'e indir, **EXIF'i düşür** (GPS konumu gerçek kişilerin
fotoğrafında yayımlanmamalı). HEIC okumak için macOS'ta `sips`, Python'da
`pillow_heif` + Pillow.

Uzantıya güvenme: bu depoya bir kez `.jpeg` uzantılı ama içeriği HEIC olan dosya
geldi. `check:content` bu yüzden magic byte'a bakıyor.

### `check:content`

`npm run build` `public/data/` JSON'larını doğrulamaz; bunu
`frontend/scripts/check-content.mjs` yapar:

| Kontrol | Neden var |
|---|---|
| Görsel yolu diskte var mı | Next `public/` yollarını build'de doğrulamıyor → sessiz 404 |
| Dosyanın **gerçek** formatı (magic byte) | `.jpeg` uzantılı HEIC tarayıcıda render edilmez, build geçer |
| Görsel kare mi | Kartlar `AspectRatio 1/1` + `object-cover`; kare olmayan görsel sessizce kırpılır |
| Dosya boyutu < 300KB | Telefon fotoğrafları 2MB+ geliyor |
| `leaderMessage.author` ∈ `members[]` | Lider adı iki yerde duruyor; biri unutulursa ayrılmış kişi sayfada kalır |
| `skills` dizi mi | `member.skills.length` runtime tuzağı |
| `github` / `linkedin` / `kaggle` mutlak URL mi | Çıplak kullanıcı adı kırık link olur |

Betik hiçbir zaman sessizce atlamaz: ölçemediği her durum FAIL, çıkış kodu 1.
Kontrol yeşilken bile içerik değiştirdikten sonra ilgili sayfayı `npm run dev`
ile aç — kırpma/çerçeveleme kalitesini betik ölçmez.

### Takım slug'ı üç kimliği birden taşıyor

`mobil-web` / `ai` / `game` değeri aynı anda **URL slug'ı**, **`User.role`** ve
**`Submission.technicalCategory`**. `roleOnlyForCategory` doğrudan
`req.user.role === req.query.category` karşılaştırması yapıyor
(`backend/middlewares/authMiddleware.js`), yani üçü ayrışırsa yetkilendirme
sessizce 403'e döner.

Dosya adı da slug'ın kendisi: `getTeamDetail` `teams/${slug}.json`,
`useApplyDetail` `/data/applications/${slug}.json` okuyor. Slug değişimi =
dosya adı değişimi. Takım slug'ları `teams/` dizin listesinden türetildiği için
sitemap kendiliğinden güncelleniyor.

**Slug değiştirirken sırayla:** JSON dosya adları → `slug` alanları → görsel
klasörü + JSON yolları → `User.js` role enum → `submissionsController`
`validCategories` → `statusController` sorgusu → frontend tip birleşimleri
(`useUser.ts`, `admin-management.tsx`) → `AdminSidebar` `limitedRoles`/
`roleToSlug`/alt menü → dashboard `layout.tsx` rol listesi → `Header.tsx` →
`next.config.ts` redirect → **veritabanı migration'ı**.

Migration örneği: Web → Mobil Web geçişi için
`backend/scripts/migrate-web-to-mobil-web.js` (`--dry-run` ve `--rollback`
destekli). **Kod deploy edilip migration çalıştırılmazsa role'ü eski slug'da
kalan yönetici hesapları teknik takım sayfasına erişemez** ve `User.save()` enum
doğrulamasında patlar. İkisi aynı bakım penceresinde yapılmalı.

### İlk admin oluşturma (deploy edilmiş sunucuda)

Sistemde hiç kullanıcı yokken `POST /users`, `KEY` ortam değişkeniyle
çağrılabilir. Mantık `firstUserCreation()`'da değil, `protect` içinde
(`authMiddleware.js`, `isFirstUserRequest` + `matchesSystemKey`). `POST /users`
isteğinde **dört koşul birden** aranır: `req.originalUrl === '/users'`
(birebir), `req.method === 'POST'`, token'ın `KEY` ile eşleşmesi ve
`User.countDocuments() === 0`. Biri tutmazsa istek `jwt.verify` yoluna düşer ve
**401** döner — hata hangi koşulun tutmadığını söylemez.

**`KEY` en az 32 karakter olmalı** (`openssl rand -hex 32`). Tanımsız veya daha
kısa bir `KEY` bu yolu tamamen kapatır; kısaysa backend logunda "KEY 32
karakterden kısa" hatası görünür. Karşılaştırma sabit sürede yapılır.

İsteği public adrese değil, backend container'ının içinden `localhost`'a gönder
(KEY internete çıkmaz, CORS'a takılmaz, ters proxy yolu değiştiremez).
Coolify'da `KEY` panelden tanımlanan bir ortam değişkeni; container'da `.env`
dosyası olduğunu varsayma.

**Tek atış hakkı var.** `createUser` `role: role || 'user'` diyor; gövdeye
`"role": "admin"` koymazsan sıradan bir `user` oluşur, `usersCount` artık 0
olmadığı için KEY yolu **kalıcı olarak kapanır** ve geriye yalnızca veritabanına
elle müdahale kalır. Şifre en az 10 karakter olmalı; daha kısası 400 döner ve
kullanıcı oluşmadığı için KEY yolunu tüketmez.

Diğer iki tuzak: sonda slash veya sorgu dizesi (`/users/`, `/users?x=1`)
eşleşmeyi bozar; nginx `/api/` gibi bir önek ile proxy'liyorsa `originalUrl`
`/api/users` olur ve koşul tutmaz.

### Backend ESM — `node --check` yalan söylüyor

`backend/package.json` içinde `"type": "module"` var; tüm backend ESM.
`require()` ile yazılmış bir `.js` dosyası **çalışma anında** patlar:
`ReferenceError: require is not defined in ES module scope`.

`node --check dosya.js` bunu **yakalamaz** — dosyayı CommonJS varsayarak
denetler ve yeşil verir. Yeni bir backend betiği yazdıktan sonra doğrulama
yöntemi onu gerçekten çalıştırmaktır. DB'ye dokunmadan denemek için gerekli
ortam değişkenini boşalt, betik guard'ında dursun:

```bash
cd backend && MONGODB_URI="" node scripts/<betik>.js --dry-run   # exit 2 beklenir
```

`dotenv` mevcut ortam değişkenlerini ezmediği için bu güvenli bir kuru deneme.
Betikler `scripts/` altından çalıştığından `dotenv.config()` çıplak
çağrılmamalı — `.env` backend kökünde, yol açıkça verilmeli.

**Production Node 22.11 ve `require(esm)`.** Coolify (Nixpacks) backend'i Node
22.11.0 ile çalıştırıyor. Bu sürümde bir CommonJS paketinin yalnızca ESM olan
bir paketi `require()` etmesi bayraksız kapalı (Node 22.12'de varsayılan
açıldı). `sanitize-html` 2.17.6+ `htmlparser2` 12'yi böyle yüklüyor; bu yüzden
`npm start` `node --experimental-require-module index.js` çalıştırıyor. Sunucuyu
`node index.js` ile doğrudan başlatırsan Node < 22.12'de açılışta
`ERR_REQUIRE_ESM` ile çöker. CI, production'daki Node sürümü (`ci.yml`
`NODE_VERSION`) ve `npm start` ile koşuyor. Production 22.12+'ya geçerse bayrak
kaldırılabilir; `NODE_VERSION` da güncellenmeli.

### Mongoose `sanitizeFilter` açık — operatörlü sorgu `trusted()` ister

`config/dbConnection.js` global `sanitizeFilter`'ı açıyor: filtre içinde `$`
anahtarlı her nesne `$eq` ile sarılır, istek gövdesinden gelen değer operatör
olarak çalışamaz. Bedeli: **bilerek** operatör kullanan yeni bir filtre
(`$regex`, `$gte`, `$in` …) `mongoose.trusted({...})` ile sarılmazsa hata
vermez, sessizce eşitlik aramasına döner ve **boş sonuç** gelir. Örnek:
`announcementsController` / `submissionsController` arama kodu. `$or`/`$and`
dokunulmadan geçer; update nesneleri (`$set`, `$push`) etkilenmez.
`scripts/` ayrı süreç olduğu için bu ayardan etkilenmez. `trusted()` filtrenin
tamamını değil operatör nesnesini sarar: `{ _id: mongoose.trusted({ $in: ids }) }`.
Tüm filtre sarılırsa koruma yine devreye girer: ObjectId alanında CastError,
string alanında boş sonuç.

### Başvuruları silme (saklama süresi)

Başvurular kişisel veri içeriyor; değerlendirme dönemi bitince silinmeli. Yol
panelde: **Veri Yönetimi** (`/admin/dashboard/data`, yalnızca admin). Kapsam
seçilir, CSV yedek indirilir; silme ancak ondan sonra açılır ve kayıt sayısının
yazılmasını ister. `POST /submissions/purge` sayı tutmazsa 409 döner ve yalnızca
o an saydığı kayıtları siler. JSON yedek gerekirse CLI betiği
`scripts/purge-submissions.js` (`--dry-run`, `--expect`) aynen duruyor.

### Duyuru HTML'i ve CSP

Duyuru içeriği HTML olarak gösteriliyor ve iki yerde aynı izin listesinden
geçiyor: kaydederken `announcementsController` (`sanitize-html`), gösterirken
`frontend/src/lib/sanitizeHTML.ts` (public sayfa, admin önizleme, editör).
Listeyi değiştirirsen ikisini birlikte değiştir.

`next.config.ts` bir Content-Security-Policy gönderiyor. Yeni bir dış kaynak
(script, iframe, API adresi) eklenirse oraya da eklenmeli; yoksa tarayıcı onu
engeller ve yalnızca konsola "Refused to …" yazar. Görseller `next/image`
üzerinden geldiği için `img-src 'self'` yeterli.

### Rate limit ve Cloudflare

`backend/index.js`: genel limit IP başına 15 dk'da 100 istek (geçerli token'lı
istekler sayılmaz, mail kuyruğu sık yokluyor). Ek olarak, muafiyetsiz:
`POST /auth/login` ve `PATCH /auth/password` birlikte 15 dk'da 10 **hatalı**
deneme, başvuru ve iletişim formları birlikte 15 dk'da 30. Smoke testte
`--submit --n 40`'ın son 10'u bu yüzden 429 alır; loadtest 429'u hata saymaz.

Site ve API Cloudflare arkasında. Production'da istek Express'e
`ziyaretçi → Cloudflare → 10.0.1.1 → Coolify proxy` yoluyla ulaşıyor; `10.0.1.1`
Coolify Docker ağının geçidi (Cloudflare Tunnel ya da Docker'ın port
yönlendirmesi). `trust proxy 1` ile `req.ip` bu hop olur; limit onunla sayılırsa
bütün site tek kovayı paylaşır: formlar tüm site için 15 dk'da 30 gönderimde
kilitlenir, tek kişi herkesin girişini kilitler. Bu yüzden limitler
`helpers/clientIp.js` ile sayılır: `req.ip` bir Cloudflare adresi ya da iç ağ
adresiyse (10/8, 172.16/12, 192.168/16, 127/8, ::1, fc00::/7)
`CF-Connecting-IP`, değilse `req.ip`. Cloudflare'i atlayıp doğrudan gelen biri
Coolify proxy'sinde kendi public adresiyle görünür, başlığı uyduramaz.
Cloudflare IP listesi o dosyada; Cloudflare değiştirirse güncellenmeli.

Kontrol: `LOG_LEVEL=debug` ile her istek `[ziyaretçi] (req.ip: hop)` biçiminde
loglanır; köşeli parantezde `10.0.1.1` görünüyorsa ziyaretçi adresi okunamıyor.
Dışarıdan: `curl -sI https://api.kouseng.com/health` yeni bir istemcide
`ratelimit-remaining: 99` civarı vermeli; düşükse herkes aynı kovada.

### Lint

`eslint.config.mjs`, `eslint-config-next`'in flat config export'larını
doğrudan kullanıyor. Eski `FlatCompat.extends("next/...")` hâli
`eslint-config-next` 16'dan sonra dairesel JSON hatasıyla çöküyordu; o yola geri
dönme. `react-hooks/set-state-in-effect` ve `react-hooks/purity` React Compiler
kuralları; proje compiler kullanmadığı için uyarı seviyesinde. CI hata (error)
çıkarsa kırmızı verir, uyarılar geçer.
