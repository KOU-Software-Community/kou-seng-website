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

GitHub Actions (`deploy.yml`) `main` branch'e push edildiğinde SSH üzerinden sunucuya deploy eder: PM2'yi durdurur, git pull yapar, bağımlılıkları kurar, build alır ve PM2'yi yeniden başlatır.

Detaylı API endpoint'leri için `backend/ENDPOINTS.md` dosyasına bakın.
