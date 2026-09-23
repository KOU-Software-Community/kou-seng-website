# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proje Hakkında

KOU SENG - Kocaeli Üniversitesi Yazılım Kulübü web sitesi. Monorepo: `frontend/` (Next.js) + `backend/` (Express.js).

## Komutlar

### Frontend (`cd frontend`)
```bash
npm run dev        # Geliştirme sunucusu (Turbopack, port 3000)
npm run build      # Production build (Turbopack)
npm run start      # Production sunucusu (port 3000)
npm run lint       # ESLint
```

### Backend (`cd backend`)
```bash
npm run dev        # Geliştirme sunucusu (nodemon, port 3001)
npm start          # Production sunucusu
```

### PM2 (Production)
```bash
npm run pm2:start / pm2:stop / pm2:restart   # Her iki serviste de mevcut
```

Test altyapısı henüz implemente edilmemiştir.

## Paket yöneticisi: npm

Bu proje **npm** ile çalışır: tek lockfile `package-lock.json`, CI `npm ci`
kullanıyor. `packageManager` alanı, `pnpm-workspace.yaml` veya `.npmrc`
yok — yani pnpm'e geçiş yapılmış değil.

Bir dönem `pnpm-lock.yaml` dosyaları da repoya girmişti (lokalde pnpm denenmiş).
İki lockfile bir arada kurulumların ayrışmasına yol açtığı için kaldırıldı;
`pnpm-lock.yaml` ve `yarn.lock` artık `.gitignore`'da. Lokalde pnpm denersen
ürettiği lockfile commit'e girmez.

**Turbopack workspace kökü sabitlendi.** Next, kökü ağaçta yukarı doğru lockfile
arayarak tahmin ediyor; geliştiricinin **ev dizininde** başıboş bir
`package-lock.json` varsa (bu makinede `/Users/abdulkadir/package-lock.json`
vardı) kökü oraya çözüp her build'de uyarı basıyordu. `next.config.ts` içindeki
`turbopack.root` bunu makineden bağımsız hâle getirdi. Uyarıyı depodaki
lockfile'ları silerek kovalama — sebep repo dışında olabilir.

## Environment Variables

**Frontend (`.env`):**
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

**Backend (`.env`):**
```
PORT=3001
MONGODB_URI=...
JWT_SECRET=...
KEY=...                        # İlk admin oluşturma için özel anahtar
CORS_ALLOWED_ORIGINS=http://localhost:3000,https://kouseng.com
MEDIUM_RSS_URLS=https://medium.com/feed/@...
LOG_LEVEL=info
```

## Mimari

### Frontend Yapısı

Next.js 15 App Router kullanılır. Sayfalar layout gruplarına göre organize edilir:

- `app/(main-layout)/` — Ana site sayfaları (Header + Footer)
- `app/(admin-layout)/admin/` — Admin paneli sayfaları (AdminSidebar)
- `app/(apply-layout)/apply/[applySlug]/` — Başvuru formu sayfaları

Her route, business logic'i `src/components/pages/` altındaki client component'e devreder. `app/` klasöründeki page.tsx dosyaları çoğunlukla yalnızca bu component'leri render eder.

**Katman Ayrımı:**
- `src/hooks/` — Tüm API çağrıları ve state yönetimi burada yapılır
- `src/components/pages/` — Sayfa düzeyi bileşenler (hook'ları kullanır)
- `src/components/layout/` — Header, Footer, AdminSidebar gibi paylaşılan layout bileşenleri
- `src/components/ui/` — Shadcn/UI primitive bileşenleri (doğrudan düzenlenmez)
- `src/lib/api.ts` — Tiplendirilmiş fetch fonksiyonları (RSS için 5 dk, duyurular için 1 dk önbellek)
- `src/lib/*Data.ts` — Statik sayfa içerikleri için veri yükleyiciler

Path alias: `@/*` → `src/*`

### Backend Yapısı

Standart Express.js katmanlı mimari (routes → controllers → models).

**Route Prefix'leri:** `/health`, `/auth`, `/users`, `/announcements`, `/contact`, `/rss`, `/submissions`

**Kimlik Doğrulama Akışı:**
1. `POST /auth/login` JWT token döndürür
2. Frontend token'ı localStorage'da saklar
3. Korunan istekler `Authorization: Bearer <token>` header'ı gönderir
4. `authMiddleware.js` token'ı doğrular: `protect`, `adminOnly`, `roleOnlyForCategory`, `roleOnlyForSubmission`

**Kullanıcı Rolleri:** `admin`, `web`, `ai`, `game`, `user`
`web`/`ai`/`game` rolleri yalnızca kendi kategorilerinin başvurularını yönetebilir.

**İlk Admin Oluşturma:** Sistemde hiç kullanıcı yoksa `POST /users` endpoint'i `.env` dosyasındaki `KEY` değeriyle kullanılabilir.

**Logging:** `helpers/logger.js` — `logger.debug()`, `logger.info()`, `logger.error()` metotları; `LOG_LEVEL=debug` olmadıkça debug logları gösterilmez.

### Veri Modelleri (MongoDB/Mongoose)

- **User:** `name`, `email`, `password` (bcrypt), `role`
- **Announcement:** `title`, `content`, `summary`, `category`, `author`
- **Contact:** `name`, `email`, `subject`, `message`, `isRead`
- **Submission:** `submissionType` (general/technical), öğrenci alanları, `technicalCategory`, `customFields` (dinamik alanlar için), `status` (pending/reviewed/accepted/rejected)

### Stil Sistemi

Tailwind CSS v4 + CSS değişkenleri. Özel marka renkleri `globals.css` içinde tanımlıdır:
- `--koyu-lacivert: #001B4A`, `--lacivert: #014576`, `--turkuaz: #0389BC`, `--acik-mavi: #93CBDC`

Dark/Light mod `next-themes` ile sağlanır; root layout'ta `ThemeProvider` bulunur.

Tailwind class çakışmalarını çözmek için `src/lib/utils.ts`'deki `cn()` yardımcı fonksiyonu (`clsx` + `tailwind-merge`) kullanın.

Yeni UI bileşenleri eklemek için Shadcn/UI kullanılır (`new-york` stili, CSS değişkenleri etkin).

### Deployment

Deploy repo dışında, Coolify üzerinden yönetiliyor. Eski SSH + PM2 workflow'u (`deploy.yml`) kaldırıldı; repoda yalnızca CI (`ci.yml`) var.

Detaylı API endpoint'leri için `backend/ENDPOINTS.md` dosyasına bakın.

## Ajan çalışma ortamı

`.claude/` altında oturum disiplini kurulu:

- `settings.json` — `SessionStart` hook'unu `.claude/hooks/session-start.sh`'e bağlar.
- `hooks/session-start.sh` — idempotent bootstrap: graphify'ı kurar/kaydeder,
  `node_modules` yoksa `frontend` ve `backend` için `npm ci` çalıştırır.
- `skills/` — vendor edilmiş prompt-disiplin skill'leri (`native-core.md`,
  `lean-build`, `surgical-patch`, `verify-and-stop`, `investigate-first`).
  Kaynak ve lisans için `skills/NOTICE.md`.

`.claude/` **`.gitignore`'da** — yerel kalır, depoya girmez. Sonuç: skill'ler ve
hook yalnızca bu makinede geçerli; başka bir klonda, bulut/ephemeral oturumda
veya başka bir geliştiricide **yüklenmez**. Oraya da isteniyorsa `.claude/`
ignore'dan çıkarılmalı.

### graphify

`graphify-out/` build çıktısıdır, `.gitignore`'da. Grafik **AST-only** üretilir
(`graphify update .`) — LLM çağrısı ve subagent yok, sıfır token.

**Bilinen sınır:** AST çıkarımı `.json` dosyalarından düğüm üretmiyor. Site
içeriğinin büyük kısmı (`frontend/public/data/**.json` — yönetim kurulu, takım
üyeleri, başvuru formları) grafikte **yok**. İçerik/roster soruları için
`graphify query` değil, doğrudan dosya okuması gerekir. Grafik yalnızca kod
ilişkileri için güvenilirdir.

### İçerik nerede duruyor

Statik site içeriği koda gömülü değil, `frontend/public/data/` altındaki JSON
dosyalarında; `src/lib/*Data.ts` bunları okuyup tiplendirir.

- Yönetim kurulu: `frontend/public/data/about/data.json` → `boardMembers[]`,
  görseller `frontend/public/profile/boardMembers/`
- Takım üyeleri: `frontend/public/data/teams/{web,ai,game}.json` → `members[]`
  ve `leaderMessage.author`, görseller `frontend/public/profile/teams/<takım>/`

Bir kişinin adı değişince `leaderMessage.author` alanı da kontrol edilmeli —
lider ismi `members[]` dışında ikinci bir yerde daha tekrar ediyor.

Görsel yolları JSON'da elle yazılı. Bunlar `next/image` `<Image>` ile
`public/` altından servis edilir (`about.tsx`, `teamDetail.tsx`); Next bu
yolların varlığını **build sırasında doğrulamaz** — yanlış yol build'i geçer ve
çalışma zamanında 404 olur. Dosya adı değişikliğinde JSON yolu ile dosya adını
birlikte değiştir ve sayfayı gerçekten aç.

Uyarı: `boardMembers/serhat_can_bakır.jpeg` dosya adında Türkçe `ı` karakteri
var. Bu tür adlar Unicode normalizasyon (NFC/NFD) farkı yüzünden macOS'ta
çalışıp Linux sunucuda 404 verebilir — yeni dosyalarda ASCII kullan.

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

Web → Mobil Web geçişinde `backend/scripts/migrate-web-to-mobil-web.js`
yazıldı (`--dry-run` ve `--rollback` destekli). **Kod deploy edilip migration
çalıştırılmazsa role'ü `web` kalan yönetici hesapları teknik takım sayfasına
erişemez** ve `User.save()` enum doğrulamasında patlar. İkisi aynı bakım
penceresinde yapılmalı.

### İlk admin oluşturma (deploy edilmiş sunucuda)

Mantık `firstUserCreation()`'da değil, `protect` içinde
(`authMiddleware.js:66-77`). `POST /users` isteğinde **dört koşul birden**
aranır: `req.originalUrl === '/users'` (birebir), `req.method === 'POST'`,
`token === process.env.KEY`, ve `User.countDocuments() === 0`. Biri tutmazsa
istek `jwt.verify` yoluna düşer ve **401** döner — hata hangi koşulun
tutmadığını söylemez.

Sunucuda, localhost'a karşı çalıştır (KEY internete çıkmaz, CORS'a takılmaz,
ters proxy yolu değiştiremez):

```bash
cd ~/kou-seng-website/backend && KEY=$(grep '^KEY=' .env | cut -d= -f2-) && read -rsp "Sifre: " PW && echo && curl -sS -X POST http://localhost:3001/users -H "Authorization: Bearer $KEY" -H "Content-Type: application/json" -d "{\"name\":\"Ad Soyad\",\"email\":\"admin@kouseng.com\",\"password\":\"$PW\",\"role\":\"admin\"}"
```

**Tek atış hakkı var.** `createUser` `role: role || 'user'` diyor; gövdeye
`"role": "admin"` koymazsan sıradan bir `user` oluşur, `usersCount` artık 0
olmadığı için KEY yolu **kalıcı olarak kapanır** ve geriye yalnızca veritabanına
elle müdahale kalır.

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

### Kişi kartlarındaki runtime tuzağı

`teamDetail.tsx` `member.skills.length` yazıyor — optional chaining **yok**.
Bir üyeden `skills` alanı eksikse takım sayfası çalışma zamanında patlar, build
sorunsuz geçer. Yeni üye eklerken `skills` en azından `[]` olmalı.

`github`, `linkedin`, `kaggle`, `skills` alanlarının hepsi bileşende truthy
kontrolüyle sarılı — bilinmeyen değerler için `""` / `[]` yaz, alanı **silme**.

Görseli olmayan üye için yolda **`placeholder`** kelimesi geçen bir değer kullan
(ör. `/profile/boardMembers/placeholder.jpeg`). `about.tsx` ve `teamDetail.tsx`
`!member.image.includes("placeholder")` kontrolüyle o kaydı hiç yüklemeyip
FontAwesome ikon fallback'i render eder — dosyanın var olması gerekmez.

## Verify before pushing

```bash
cd frontend && npm run check:content && npm run lint && npm run build
```

CI (`.github/workflows/ci.yml`) her PR'da ve `main`'e push'ta bunları (lint hariç)
koşturur; backend'i geçici bir MongoDB ile gerçekten ayağa kaldırıp
`scripts/loadtest.js`'i (`--submit` + `/health`) smoke test olarak çalıştırır.

`npm run build` `public/data/` JSON'larını doğrulamaz; `check:content` bunun
için var (`frontend/scripts/check-content.mjs`). Kontrol ettikleri ve neden:

| Kontrol | Neden var |
|---|---|
| Görsel yolu diskte var mı | Next `public/` yollarını build'de doğrulamıyor → sessiz 404 |
| Dosyanın **gerçek** formatı (magic byte) | Bir kez `.jpeg` uzantılı HEIC dosyası geldi; tarayıcı render edemez, build geçer |
| Görsel kare mi | Kartlar `AspectRatio 1/1` + `object-cover`; kare olmayan görsel sessizce kırpılır |
| Dosya boyutu < 300KB | Telefon fotoğrafları 2MB+ geliyor |
| `leaderMessage.author` ∈ `members[]` | Lider adı iki yerde duruyor; biri unutulursa ayrılmış kişi sayfada kalır |
| `skills` dizi mi | Yukarıdaki runtime tuzağı |

Betik hiçbir zaman sessizce atlamaz: ölçemediği her durum FAIL, çıkış kodu 1.
Beş hata sınıfının da gerçekten kırmızı verdiği kasten bozularak doğrulandı.

Kontrol yeşilken bile içerik değiştirdikten sonra ilgili sayfayı `npm run dev`
ile aç — kırpma/çerçeveleme kalitesini betik ölçmez.

**Bilinen kırık:** `npm run lint` şu an çalışmıyor. ESLint, extend edilen bir
paylaşılan config'i doğrularken dairesel yapı hatasıyla çöküyor
(`config-validator.js` → `JSON.stringify` circular). Hata dosyalardan bağımsız,
config yükleme aşamasında; `eslint.config.mjs` ilk commit'ten beri değişmemiş,
yani bir bağımlılık sürümü kayması. Bunu kendi değişikliğinin sonucu sanma —
`scripts/` klasörünü tamamen kaldırıp denedim, aynı hata.

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
400×400 JPEG'e indir, **EXIF'i düşür** (GPS konumu gerçek kişilerin fotoğrafında
yayımlanmamalı). `sips` HEIC okur; Python tarafında `pillow_heif` + `PIL` kurulu.

Uzantıya güvenme: bu depoya bir kez `.jpeg` uzantılı ama içeriği HEIC olan dosya
geldi. `check:content` artık magic byte'a bakıyor.
