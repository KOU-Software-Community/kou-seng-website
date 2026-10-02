# Uygulama Tasarım Dili — Uygulama Planı

**Hedef:** Sitenin görünümünü app_seng'in tasarım diline geçirmek. Sayfa yapıları ve içerik aynı kalır.

**Mimari:**
- Tasarım kuralları tek yerden değişir: `globals.css` (Tailwind v4 tema değişkenleri) ve `layout.tsx` (next/font).
- shadcn bileşenleri değişikliği bu kurallar üzerinden alır.
- Uygulamaya özgü dokunuşlar dört dosyada sınıf olarak eklenir.

**Teknoloji:** Next.js 16, Tailwind CSS v4, `next/font/google`, Playwright (yerel kontrol, repoya girmez).

**Spec:** `docs/superpowers/specs/2026-10-01-uygulama-tasarim-dili-design.md`

## Global Constraints

- **Kapsam:** yalnızca `frontend/`. Backend'e ve `src/components/ui/` dosyalarına dokunulmaz.
- **Değerler:** spec'teki tablodan birebir alınır.
- **Yazı tipleri:**
  - `Plus_Jakarta_Sans`: 400–800, `latin` ve `latin-ext`, değişken `--font-jakarta-sans`.
  - `Press_Start_2P`: 400, `latin` ve `latin-ext`, değişken `--font-press-start`.
  - Tema bağlantısı: `--font-sans: var(--font-jakarta-sans)` ve `--font-pixel: var(--font-press-start)`.
- **Piksel font:** yalnızca spec'teki dört yerde.
- **Karanlık tema:** `.dark` renkleri değişmez.
- **Commit:** her kod commit'inden önce `graphify update .` çalışır ve `graphify-out/` commit'e eklenir.
- **Push öncesi:** `cd frontend && npm run check:content && npm run lint && npm run build`.

## Review Focus

1. **Türkçe karakterler** (ğ ş ı İ ç ö ü) iki fontta da yedek fonta düşmeden çizilmeli. Örnek: "İletişim" ve piksel fonttaki "BAŞVURULAR". → Task 2, ekran görüntüleri
2. **Karanlık tema:** gölgeler, gradyanlar ve logo paneli koyu zeminde düzgün görünmeli. → Task 2, ekran görüntüleri
3. **iPhone genişliği:** logo panelinin boyu, piksel yazının satır kırılması ve hero düzeni. → Task 2, ekran görüntüleri
4. **Admin paneli:** yeni köşe ve renklerle kullanılabilir kalmalı. → Task 3, admin kabul senaryosu ve bir ekran görüntüsü
5. **Kontrast:** soluk zemin üstündeki ikincil metin (#41586B / #D2E7EC, yaklaşık 5.8:1) ve turkuaz bağlantılar yeni zeminde bugünkünden kötü olmamalı. → Task 1, değerler

---

### Task 1: Tasarım kuralları ve yazı tipleri

**Files:**
- Modify: `frontend/src/app/layout.tsx`, `frontend/src/app/globals.css`
- Test (yerel, repoya girmez): Playwright betikleri `style-check.js` ve `shots.js`

**Interfaces:**
- Produces: `font-pixel`, `shadow-featured`, `shadow-cta`, `bg-hero` ve `bg-cta` sınıfları. `shadow-sm` ve `--radius` yeni değerleriyle.

- [ ] **Adım 1: Ortam ve önce görüntüleri.**
  - Yerel ortamda (boş Mongo veritabanı) mevcut build'i aç.
  - `node shots.js once` ile ekran görüntüleri al: `/`, `/apply`, `/apply/general` ve `/about`; masaüstü ve iPhone; açık ve karanlık tema. Karanlık tema için localStorage'a `theme=dark` yazılır.
- [ ] **Adım 2: Stil kontrolünü yaz** (`style-check.js`, `/about`):
  - `getComputedStyle(body).fontFamily` "Plus Jakarta Sans" içermeli.
  - `body` arka planı `rgb(244, 249, 251)` olmalı.
  - İlk `[data-slot="card"]`'ın `borderRadius`'u `16px`, `boxShadow`'u `rgba(0, 27, 74, 0.07)` içermeli.
- [ ] **Adım 3: Çalıştır.** Beklenen: FAIL, yazı tipi sistem fontu ve zemin `rgb(210, 231, 236)`.
- [ ] **Adım 4: Uygula.**
  - `layout.tsx`: Inter yerine iki next/font geliyor; değişkenleri `body`'ye ekle.
  - `globals.css`:
    - `@theme inline` bloğunda font bağlantıları, `--shadow-sm`, `--shadow-featured` ve `--shadow-cta`.
    - `:root`'ta spec tablosundaki renkler ve `--radius: 0.75rem`.
    - `@utility bg-hero` ve `@utility bg-cta`.
- [ ] **Adım 5: Build ve kontrol.**
  - Komut: `NEXT_PUBLIC_API_URL=http://127.0.0.1:3001 npm run build`, ardından `style-check.js`.
  - Beklenen: PASS.
- [ ] **Adım 6: Commit.** `graphify update .` → `"Tasarım dili: app_seng yazı tipi, renk, köşe ve gölge kuralları"`

### Task 2: Logo paneli, birincil düğmeler, piksel font

**Files:**
- Modify:
  - `frontend/src/components/pages/home.tsx`: hero sağ sütunu (`aspect-square` div; `bg-red-500` noktalı kod editörü burada) ve rozet
  - `frontend/src/components/pages/apply.tsx`: "Başvur" düğmesi ve yükleniyor satırı
  - `frontend/src/components/pages/applyDetail.tsx`: gönder düğmesi
  - `frontend/src/components/layout/RssSection.tsx`: "Henüz Yayın Yok" başlığı

**Interfaces:**
- Consumes: Task 1'in sınıfları.

- [ ] **Adım 1: Stil kontrolüne ekle.**
  - `/`: hero'da `.bg-red-500` sayısı 0 olmalı.
  - `/`: `bg-hero` paneli olmalı; computed `backgroundImage` `linear-gradient` içermeli.
  - `/`: panelde "KOU SENG" metni olmalı, `fontFamily` "Press Start 2P" içermeli.
  - `/`: hero rozetinin `fontFamily` değeri "Press Start 2P" içermeli.
  - `/apply`: genel üyelik kartındaki "Başvur" bağlantısının `backgroundImage` değeri `linear-gradient` içermeli.
- [ ] **Adım 2: Çalıştır.** Beklenen: FAIL, kod editörü çizimi duruyor ve panel yok.
- [ ] **Adım 3: Uygula.**
  - **Hero sağ sütunu:** kod editörü, logo kutusu ve iki süs kutusu kalkıyor. Yerine:
    - bir `bg-hero shadow-featured rounded-2xl` kare panel,
    - içinde bulanık turkuaz parıltı (`aria-hidden`),
    - logo (`Image`, kutusuz),
    - altında `font-pixel` ile "KOU SENG".
  - **Birincil düğmeler:** üç düğmeye `bg-cta shadow-cta` ekleniyor; hero düğmesindeki eski gradyan sınıfları siliniyor.
  - **Piksel font:** üç kısa metne `font-pixel` ekleniyor. Piksel font geniş olduğu için gerekirse metin boyutu küçültülüyor.
- [ ] **Adım 4: Build, kontrol ve sonra görüntüleri.**
  - Kontrol: `style-check.js` PASS vermeli.
  - Görüntüler: `node shots.js sonra`.
  - Review Focus 1–3 için görüntüleri gözle karşılaştır: Türkçe karakterler, karanlık tema, iPhone.
- [ ] **Adım 5: Commit.** `graphify update .` → `"Ana sayfa logo paneli, gradyanlı birincil düğmeler, piksel rozet"`

### Task 3: Regresyon, CLAUDE.md, PR

**Files:**
- Modify: `CLAUDE.md`, "Stil" paragrafı.

- [ ] **Adım 1: CLAUDE.md "Stil" paragrafını güncelle.** Eklenecekler:
  - yazı tipleri ve piksel font kuralı (yalnızca rozet, boş durum ve logo yazısı; gövde, form ve düğmede asla),
  - `bg-hero`, `bg-cta`, `shadow-cta` ve `shadow-featured` sınıfları,
  - tasarım kaynağı: app_seng `src/theme.ts`. Marka rengi değişirse iki repo birlikte güncellenir.
- [ ] **Adım 2: Regresyon.**
  - Komutlar: temiz veritabanıyla `windows-e2e.js` ve `admin-windows-e2e.js`; `check:content`, `lint` ve `build`; admin panelinden bir ekran görüntüsü.
  - Beklenen: hepsi geçer.
- [ ] **Adım 3: Commit, push, taslak PR.** `graphify update .` → `"CLAUDE.md: tasarım dili kuralları"`

**Bitiş:**
- Branch'in tamamı son bir kod incelemesinden geçer; kritik bulgular düzeltilir.
- Önce/sonra görüntüleri kullanıcıya gösterilir. PR merge edilmez.
