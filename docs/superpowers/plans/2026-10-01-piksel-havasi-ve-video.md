# Piksel Havası ve Tanıtım Videosu — Uygulama Planı

**Hedef:** Siteye uygulamanın ve tanıtım videosunun piksel havasını taşımak: koyu bant hero, kutusuz logo, site geneli piksel parçaları ve ana sayfada sitenin kendisinden sunulan tanıtım videosu.

**Mimari:**
- Görsel kurallar `globals.css`'te Tailwind v4 `@utility` ve `@theme` animasyonları olarak tanımlanır: `bg-night`, `pixel-edge`, `animate-pxspin`, `animate-blink`.
- Tekrar eden piksel parçaları tek dosyada: `src/components/layout/Pixel.tsx` (`PixelMark`, `PixelLoader`).
- Video bölümü tek bir istemci bileşeni: `src/components/layout/AppSection.tsx`.
- Bölümün içeriği `public/data/home/data.json` → `app`'ten gelir; projenin mevcut deseni bu.

**Teknoloji:** Next.js 16, Tailwind CSS v4, `next/image`, yerel `<video>` ve `IntersectionObserver`, yerel Playwright. ffmpeg yalnızca dönüştürme aracı; repoya girmez.

**Spec:** `docs/superpowers/specs/2026-10-01-uygulama-tasarim-dili-design.md` (Tur 2 bölümleri)

## Global Constraints

- **Kapsam:**
  - Yalnızca `frontend/`, `CLAUDE.md` ve dokümanlar değişir.
  - Backend ve `src/components/ui/` dosyaları değişmez.
  - Admin panelinin yükleniyor durumları değişmez.
- **Piksel font:**
  - Türkçe büyük harf (İ Ç Ş Ğ Ü Ö) yazılmaz. Piksel metin küçük harfle yazılır; JSON'dan gelen metne `lowercase` sınıfı verilir. Tek istisna "KOU SENG".
  - Yalnızca spec'teki kısa etiketlerde kullanılır.
- **Hareket ve erişilebilirlik:**
  - Animasyonlar yalnızca `motion-safe:` ile verilir.
  - Dekoratif öğeler `aria-hidden="true"` taşır: `PixelMark`, kareler, parıltı, imleç, `pixel-edge`.
- **Renk:** karanlık temanın renkleri değişmez. Koyu bantlar iki temada da aynı.
- **Değerler:** spec'ten birebir alınır.
  - `bg-night` gradyanı ve nokta ızgarası,
  - `pixel-edge`,
  - `--border: #CBD9E1`,
  - video: 1280×720, 30 fps, H.264 High, CRF 24, AAC 128 kbps, `+faststart`.
- **Build:** `cd frontend && NEXT_PUBLIC_API_URL=http://127.0.0.1:3001 npm run build`. Yerel ortam: frontend :3000, backend :3001, boş bir Mongo veritabanı.
- **Commit:** her kod commit'inden önce `graphify update .` çalışır ve `graphify-out/` commit'e eklenir.
- **Push öncesi:** `cd frontend && npm run check:content && npm run lint && npm run build`.

## Review Focus

1. **iPhone Safari'de video:** sessiz kendiliğinden oynatma için `muted` ve `playsinline` gerekir; Safari byte-range ister. Test tarayıcısında H.264 çözücü olmadığı için bunlar dolaylı doğrulanır. → Task 3: öznitelik kontrolü, ffmpeg ile codec ve `faststart` kontrolü, `curl -r` ile 206.
2. **Dar ekran (320 ve 390 px):**
   - ana sayfada yatay kaydırma olmamalı,
   - header'daki marka hamburger ve tema düğmesiyle çakışmamalı.

   → Task 2: style-check'e genişlik ve kesişim kontrolü.
3. **Karanlık tema:** hero'nun ikinci düğmesi ve video bölümünün düğmeleri koyu zeminde okunur kalmalı. → Task 2 ve 3: karanlık temada renk kontrolü ve ekran görüntüleri.
4. **Hareket azaltma:** yükleniyor kareleri, imleç ve hero kareleri durmalı; video kendiliğinden başlamamalı. → Task 1, 2 ve 3: `reducedMotion: 'reduce'` bağlamında kontrol.
5. **Kenarlık değişikliğinin admin paneline etkisi:** tablolar, ayırıcılar ve formlar kalın ya da kaba görünmemeli. → Task 4: admin kabul senaryosu ve ekran görüntüsünü gözle inceleme.

---

### Task 1: Site geneli piksel parçaları ve kenarlık

**Files:**
- Modify: `frontend/src/app/globals.css`
  - `:root` → `--border: #CBD9E1;`
  - yeni `@theme` bloğu: `--animate-pxspin` ve `@keyframes pxspin`
- Create: `frontend/src/components/layout/Pixel.tsx`
- Modify, `PixelMark`: bölüm başlığının (`h2`, sayfa başlığı `h1`) hemen önüne, aynı `text-center` kabın içine.
  - `home.tsx`: Kulüp Tanıtımı
  - `layout/AnnouncementsSection.tsx`, `layout/RssSection.tsx`
  - `about.tsx`: 5 başlık
  - `teamDetail.tsx`: 4 başlık
  - `apply.tsx`, `publications.tsx` (h1), `announcements.tsx` (h1), `contact.tsx`, `kvkk.tsx`
- Modify, `PixelLoader`:
  - `apply.tsx` "Başvurular yükleniyor..." → `label="başvurular yükleniyor"`
  - `applyDetail.tsx` spinner ve "Başvuru bilgileri yükleniyor..." → `label="başvuru bilgileri yükleniyor"`. Gönder düğmesinin `faSpinner`'ı kalır.
  - `layout/Footer.tsx` "Yükleniyor..." → `label="yükleniyor"`
- Modify: `RssSection.tsx` boş durum başlığı → "henüz yayın yok"
- Modify: kart üzerine gelince gölge `hover:shadow-md` → `hover:shadow-featured`; dört yerde: `about.tsx`, `announcements.tsx`, `apply.tsx` ve `publications.tsx`'teki `Card`
- Test (yerel, repoya girmez): Playwright betikleri `style-check.js` (Tur 1'den, genişletilir) ve `shots.js` (sayfa listesine `team: '/technical-team/mobil-web'` eklenir)

**Interfaces:**
- **`PixelMark({ className?: string })`**
  - `<span aria-hidden="true" data-slot="pixel-mark">`, `inline-flex gap-1 mb-3`.
  - Üç adet `size-2` kare: ikisi `bg-(--turkuaz)`, üçüncüsü `bg-(--acik-mavi) opacity-60`.
  - `inline-flex` olduğu için kabın `text-center`'ını izler.
- **`PixelLoader({ label: string; className?: string })`**
  - `<div role="status" data-slot="pixel-loader">`, dikey ve ortalı.
  - Dört adet `size-2.5 bg-(--turkuaz) motion-safe:animate-pxspin` kare. Kare `i`'nin gecikmesi `${(i - 4) * 0.25}s`; negatif gecikme açılışta hepsinin birden yanmasını önler.
  - Altında `font-pixel text-xs lowercase text-muted-foreground` ile `label`.
- **`animate-pxspin`:** `pxspin 1s steps(1) infinite`, keyframes `0% { opacity: 1 } 25%, 100% { opacity: .25 }`.
  - Her kare döngünün ilk çeyreğinde yanar; uygulamadaki `BlinkSquare` ve videodaki tek parlak kare bu.
  - design-source'taki CSS bunun tersini, yani üç yanık bir sönük kareyi veriyor.

- [ ] **Adım 1: Ortam ve önce görüntüleri.**
  - Yerel ortamda mevcut build'i (Tur 1) aç.
  - `node shots.js tur1` ile görüntü al: `/`, `/apply`, `/apply/general`, `/about` ve takım sayfası; masaüstü ve iPhone; açık ve karanlık.
- [ ] **Adım 2: style-check'e Task 1 kontrollerini ekle.**
  - `getComputedStyle(documentElement).getPropertyValue('--border').trim().toUpperCase() === '#CBD9E1'`.
  - `/apply`: "Açık" filtre düğmesinin (`exact`) `borderTopColor` değeri `rgb(203, 217, 225)`.
  - `/apply`: ilk karta hover yapılıp 400 ms beklenince `boxShadow`, `rgba(0, 27, 74, 0.13)` içerir.
  - `/` ve `/about`: başlığın önceki kardeşinin `dataset.slot`'u `'pixel-mark'`.
    - `/`: "Kulüp Tanıtımı", "Duyurular", "Son Yayınlarımız".
    - `/about`: `main` içindeki bütün `h2`'ler; sayısı 5 olmalı. Footer başlığı dışarıda kalır.
  - `/apply` yükleniyor durumu: `page.route('**/submissions/windows', r => setTimeout(() => r.continue(), 3000))`. Bu sürede şunlar doğru olmalı:
    - `[data-slot="pixel-loader"]` görünür, `role="status"` ve metni "başvurular yükleniyor".
    - Karelerin `animationName` değeri `'pxspin'`.
    - `reducedMotion: 'reduce'` bağlamında `'none'`.
- [ ] **Adım 3: Çalıştır.** Beklenen: bu kontroller FAIL; `--border` `#E4EEF3`, işaret ve yükleniyor parçası yok.
- [ ] **Adım 4: Uygula.** Dosyalar yukarıdaki listede. `PixelMark`'ı başlığın hemen önüne koy; başlık sınıflarına dokunma.
- [ ] **Adım 5: Build ve kontrol.** `style-check.js` çalışır. Beklenen: PASS; Tur 1'in kontrolleri de geçer.
- [ ] **Adım 6: Commit.**
  - `graphify update .` çalışır.
  - Mesaj: `"Piksel parçaları: başlık işareti, yükleniyor animasyonu, belirgin kenarlık"`.

### Task 2: Koyu hero ve header markası

**Files:**
- Modify: `frontend/src/app/globals.css`
  - `@utility bg-night` ve `@utility pixel-edge`,
  - `@theme`'e `--animate-blink` ve `@keyframes blink { 50% { opacity: 0 } }`,
  - `@utility bg-hero` silinir.
- Modify: `frontend/src/components/pages/home.tsx`, hero bölümü
- Modify: `frontend/src/components/layout/Header.tsx`, marka bağlantısı
- Test: `style-check.js`. Tur 1'in "bg-hero paneli" ve "panelde piksel KOU SENG" kontrolleri aşağıdakilerle değişir.

**Interfaces:**
- Consumes: `animate-pxspin` (Task 1).
- Produces:
  - **`bg-night`:**
    - `position: relative; isolation: isolate`.
    - Zemin: `radial-gradient(ellipse 85% 95% at 72% 42%, #043D71 0%, #002658 36%, #001B4A 68%, #00102F 100%)`.
    - `&::before` nokta ızgarası, `z-index: -1`: `radial-gradient(rgb(147 203 220 / .22) 1.5px, transparent 1.6px)`, `background-size: 16px 16px`, `mask-image: radial-gradient(ellipse 70% 80% at 70% 45%, #000 20%, transparent 75%)`.
  - **`pixel-edge`:**
    - `position: absolute; left: 0; right: 0; height: 24px; pointer-events: none`.
    - Üç katman (`var(--background)`):
      - dolu,
      - `90deg 50%` / `16px 8px`,
      - `90deg 25%` / `32px 8px`.
    - Konumlar `0 16px`, `0 8px`, `8px 0`; tekrarlar `no-repeat`, `repeat-x`, `repeat-x`.
    - Kullanım: `<div aria-hidden="true" className="pixel-edge bottom-0" />`, üstte `top-0 rotate-180`.
  - **`animate-blink`:** `blink 1.1s steps(1) infinite`.

**Hero'nun sınıfları** (taslaktaki A ile aynı):
- **Bölüm:** `bg-night overflow-hidden text-white py-16 md:py-28 lg:py-32`; en sonda alt `pixel-edge`. Eski `bg-gradient-to-br from-background...` kalkar.
- **Rozet:**
  - `border-(--acik-mavi)/30 bg-white/5 text-(--acik-mavi) lowercase font-pixel text-[10px] sm:text-xs`,
  - yuvarlak nokta yerine `size-2 bg-(--turkuaz)` kare, `gap-2`.
- **Başlık:**
  - vurgu `from-(--acik-mavi) to-[#3FB0DC]` (`bg-clip-text`),
  - başlığın sonunda `<span aria-hidden="true">` imleç: `ml-1 inline-block h-[0.8em] w-[0.42em] translate-y-[0.06em] bg-(--turkuaz) motion-safe:animate-blink`.
- **Açıklama:** `text-[#C4D9E6]`.
- **İkinci düğme:** `border-(--acik-mavi)/35 bg-white/5 text-white hover:bg-white/10 hover:text-white`, aynısı `dark:` önekiyle. Outline varyantının `dark:bg-input/30 dark:border-input`'unu ezmesi için gerekli.
- **Sağ sütun:**
  - Kap: `relative mx-auto grid aspect-square w-full max-w-[300px] sm:max-w-[340px] md:max-w-md lg:max-w-lg place-items-center lg:justify-self-center xl:justify-self-end`.
  - Parıltı: `aria-hidden`, `absolute inset-0 m-auto size-[62%] rounded-full bg-(--turkuaz)/55 blur-[60px]`.
  - 11 kare: `aria-hidden`, `absolute bg-(--acik-mavi)`. Değerler `[left%, top%, px, opaklık]`:
    - [8,18,12,.7], [16,30,8,.4], [4,56,10,.55], [14,72,6,.8],
    - [84,14,14,.5], [92,30,8,.85], [78,8,10,.3], [90,64,12,.6],
    - [80,80,6,.45], [26,6,8,.35], [66,92,6,.5].
  - Yanıp sönen kareler: 2., 6. ve 9. kare `motion-safe:animate-pxspin [animation-duration:2.4s]` alır; gecikmeleri -0,4 sn, -1,2 sn ve -2 sn.
  - Logo: `<Image src="/kouseng-logo.svg" alt="KOU SENG Logo" width={300} height={300} preload className="relative h-auto w-[58%]" />`. Next 16'da `priority` kullanımdan kalktı, yerine `preload` geldi.

**Header markası:**
- `<Link href="/" aria-label="KOU SENG ana sayfa">`, sınıflar `absolute left-1/2 -translate-x-1/2 md:left-4 md:translate-x-0 flex items-center gap-2`.
- İçinde `<Image src="/kouseng-logo.svg" alt="" width={32} height={32} className="size-8" />` ve `<span className="font-pixel text-[11px] md:hidden lg:inline">KOU SENG</span>`.
- Hamburger düğmesinin kabından sonra durur.

- [ ] **Adım 1: style-check'i güncelle.** Tur 1'in "bg-hero paneli" ve "panelde piksel KOU SENG" kontrolleri silinir. Yerine eklenenler:
  - **Hero zemini** (`main section` ilk): `backgroundImage` içinde `radial-gradient` ve `rgb(4, 61, 113)` var.
  - **Eski panel yok:** hero'da `.bg-hero` ve `.bg-red-500` yok.
  - **Logo kutusuz:** `img[alt="KOU SENG Logo"]`'dan bölüme kadar hiçbir atanın `backgroundColor`'ı opak değil; `backgroundImage` `none`, `borderRadius` `0px`.
  - **Piksel kenarı:** hero'da tek `.pixel-edge` var, yüksekliği `24px`.
  - **İmleç:** `h1 [aria-hidden="true"]`'nin `animationName` değeri `'blink'`. `reducedMotion: 'reduce'`'da imleç ve hero kareleri `'none'`.
  - **Rozet:** "Kocaeli Üniversitesi" metni Press Start 2P ve `textTransform: 'lowercase'`.
  - **Küçük harf kuralı:** `/`, `/apply` ve `/about`'ta fontu Press Start 2P olan ve kendi metninde `/[İÇŞĞÜÖ]/` geçen her elemanın `textTransform`'u `lowercase`.
  - **Header markası:** `header a[href="/"]`'nin erişilebilir adı `/KOU SENG/` ve 1280 px'te "KOU SENG" metni piksel fontta.
  - **Review Focus 2:** 320 ve 390 px'te `/`'da `scrollWidth <= innerWidth`. Marka kutusu menü düğmesiyle ("Menüyü aç") ve tema düğmesiyle kesişmiyor.
  - **Review Focus 3:** karanlık temada "Daha Fazla Bilgi" `color` değeri `rgb(255, 255, 255)`; hero zemini yine radial-gradient.
- [ ] **Adım 2: Çalıştır.** Beklenen: bu kontroller FAIL; hero açık zeminde, kare panel duruyor, marka yok.
- [ ] **Adım 3: Uygula.** Değerler yukarıdaki Interfaces ve sınıf listesinde. `faArrowRight` importu kalır.
- [ ] **Adım 4: Build, kontrol ve görüntü.**
  - `style-check.js` PASS vermeli; Tur 1'in CTA kontrolleri dahil.
  - Hero görüntüsü taslaktaki A ile gözle karşılaştırılır: masaüstü ve iPhone, açık ve karanlık.
- [ ] **Adım 5: Commit.**
  - `graphify update .` çalışır.
  - Mesaj: `"Koyu hero: kutusuz logo, piksel kareler, imleç; header'da KOU SENG markası"`.

### Task 3: Mobil uygulama bölümü ve tanıtım videosu

**Files:**
- Create: `frontend/public/video/kou-seng-tanitim.mp4` ve `kou-seng-tanitim.jpg`. `.gitignore`'a takılmadıkları doğrulandı.
- Modify: `frontend/public/data/home/data.json`, yeni `app` bloğu
- Modify: `frontend/src/lib/teamData.ts`
  - `export type StoreLink = { name: 'App Store' | 'Google Play'; url: string | null }`,
  - `Project.stores?: StoreLink[]`.
- Modify: `frontend/src/lib/homeData.ts`
  - `export type AppData = { kicker: string; title: string; description: string; stores: StoreLink[]; video: { src: string; poster: string } }`,
  - `HomeData.app: AppData`.
  - `getHomeData` `...data` ile zaten geçiriyor.
- Create: `frontend/src/components/layout/AppSection.tsx` (`'use client'`)
- Modify: `frontend/src/components/pages/home.tsx` → Kulüp Tanıtımı bölümünden sonra `<AppSection app={homeData.app} />`
- Modify: `frontend/scripts/check-content.mjs`
  - teams döngüsündeki stores kontrolü `checkStores(label, stores)` fonksiyonuna çıkarılır; davranış aynı.
  - yeni "home/data.json — mobil uygulama" bloğu eklenir.

**`app` içeriği** (metin videonun kendi cümlelerinden):
- `kicker`: "mobil uygulama".
- `title`: "Kulüpten hiçbir şey kaçmasın."
- `description`: "Etkinliklere tek dokunuşla kaydol, yoklamanı QR ile ver, sertifikan hesabına düşsün; teknoloji gündemi her sabah üç maddede. KOU SENG, kulübümüzün resmi uygulaması."
- `stores`: `teams/mobil-web.json`'daki KOU SENG projesinin `stores`'unun birebir kopyası.
- `video`: `{ "src": "/video/kou-seng-tanitim.mp4", "poster": "/video/kou-seng-tanitim.jpg" }`.

**Interfaces:**
- Consumes: `PixelMark` (Task 1); `bg-night` ve `pixel-edge` (Task 2).
- Produces: `AppSection({ app }: { app: AppData })` ve `StoreLink`.

**`AppSection` davranışı:**
- **Video elemanı:** `<video ref src poster muted loop playsInline controls preload="none" aria-label={app.title}>`, `onVolumeChange` ile `muted` state'i eşitler.
- **Görününce oynatma:** `useEffect`, `matchMedia('(prefers-reduced-motion: reduce)')` eşleşirse hiçbir şey yapmaz. Aksi hâlde `IntersectionObserver` (`threshold: 0.5`):
  - görünürken `play().catch(() => {})`,
  - görünmezken `pause()`,
  - temizlikte `disconnect`.
- **"sesi aç" düğmesi:**
  - yalnızca `muted` iken görünür,
  - `absolute left-3 top-3`, `font-pixel text-[9px]`, `bg-[#00102F]/75`, `border-(--acik-mavi)/35`, `shadow-[3px_3px_0_var(--koyu-lacivert)]`,
  - 8×8 piksel hoparlör SVG'si: taslaktaki path,
  - tıklanınca `muted = false`; video durmuşsa `play()`.
- **Düzen:**
  - `<section className="bg-night overflow-hidden text-white py-20">`, üstte ve altta `pixel-edge`,
  - `container grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr]`,
  - sol sütun: `PixelMark`, kicker (`font-pixel text-[10px] lowercase text-(--acik-mavi)`), `h2` (`text-3xl md:text-4xl font-bold`), açıklama `text-[#C4D9E6]`, mağaza düğmeleri,
  - video çerçevesi: `relative aspect-video overflow-hidden rounded-2xl border border-(--acik-mavi)/30 shadow-[0_24px_60px_rgb(0_0_0/0.4)]`.
- **Mağaza düğmeleri:**
  - `url` varsa: `<Button asChild size="lg" className="bg-white text-(--koyu-lacivert) hover:bg-white/90"><a href target="_blank" rel="noopener noreferrer">`, ikon `faApple`/`faGooglePlay`.
  - `url` `null` ise: `<Button size="lg" variant="outline" disabled className="border-(--acik-mavi)/30 bg-transparent text-white/60 dark:bg-transparent">`, metin "{name} · Yakında".

- [ ] **Adım 1: check:content'e yeni kontrolleri yaz.** "home/data.json — mobil uygulama" bloğu şunları denetler:
  - **`app`:** yoksa FAIL.
  - **`checkStores('home/app', app.stores)`.**
  - **Eşitlik:** `JSON.stringify(app.stores)`, `teams/mobil-web.json` içinde `stores`'u olan bir projeninkiyle aynı olmalı. Değilse FAIL: "stores teams/mobil-web.json'daki KOU SENG projesiyle aynı değil; Google Play linki iki yerde birlikte güncellenir".
  - **`video.src`:**
    - `/video/` ile başlar,
    - diskte var,
    - `sniff` sonucu `iso(` ile başlıyor ve `heif` değil,
    - en fazla 5 MB.
  - **`video.poster`:** diskte var, `sniff === 'jpeg'`, en fazla 300 KB.
  - Betiğin başındaki "yakaladığı gerçek hatalar" listesine iki satır eklenir.
- [ ] **Adım 2: Çalıştır.** `npm run check:content`. Beklenen: FAIL "home/app: app yok".
- [ ] **Adım 3: Video dosyalarını üret.** `FF` = ffmpeg, `SRC` = kaynak video.

  ```bash
  $FF -i $SRC -vf "scale=1280:-2,fps=30" -c:v libx264 -preset slow -crf 24 -profile:v high -pix_fmt yuv420p \
      -movflags +faststart -map_metadata -1 -c:a aac -b:a 128k frontend/public/video/kou-seng-tanitim.mp4
  $FF -ss 14.2 -i $SRC -frames:v 1 -vf scale=1280:-2 -q:v 3 -map_metadata -1 frontend/public/video/kou-seng-tanitim.jpg
  ```

  Doğrulama:
  - **Akış bilgisi:** `$FF -i …mp4` çıktısı `h264 (High)`, `1280x720` ve `30 fps` içerir.
  - **`faststart`:** Python ile üst düzey kutular okunur; `moov`, `mdat`'tan önce gelir.
  - **Boyut:** mp4 yaklaşık 1,8 MB, jpg en fazla 300 KB.
- [ ] **Adım 4: `app` bloğunu ve tipleri ekle.** `check:content` çalışır. Beklenen: PASS.
- [ ] **Adım 5: style-check'e video bölümü kontrollerini yaz.**
  - **Bölüm:** "Kulüpten hiçbir şey kaçmasın." başlıklı bölüm radial-gradient zeminli. Başlığın önünde `pixel-mark` var; "mobil uygulama" piksel fontta.
  - **Video öznitelikleri:**
    - `src` `/video/kou-seng-tanitim.mp4` ile, `poster` `/video/kou-seng-tanitim.jpg` ile biter,
    - `muted`, `loop`, `playsInline` ve `controls` `true`,
    - `preload === 'none'`,
    - `aria-label` başlıkla aynı.
  - **Oynatma ve duraklatma kaydı:**
    - `addInitScript` ile `play` ve `pause` sayaçlı stub'larla değişir: `play` `Promise.resolve()` döner.
    - Açılışta `play === 0`.
    - Video görünür kaydırılıp 600 ms beklenince `play >= 1`.
    - Sayfanın başına dönülüp 600 ms beklenince `pause >= 1`.
  - **Review Focus 4:** `reducedMotion: 'reduce'` bağlamında görünür kaydırınca `play === 0`.
  - **"sesi aç":** tıklanınca `video.muted === false` olur ve düğme kaybolur.
  - **Mağaza bağlantıları:**
    - "App Store" bağlantısının `href`'i `https://apps.apple.com/tr/app/kou-seng/id6800271760`, `target` `_blank`.
    - "Google Play · Yakında" düğmesi `disabled`.
    - Karanlık temada App Store düğmesinin `color` değeri `rgb(0, 27, 74)`.
- [ ] **Adım 6: Çalıştır.** Beklenen: FAIL, bölüm yok.
- [ ] **Adım 7: Uygula.** `AppSection` ve `home.tsx` ekleme.
- [ ] **Adım 8: Build ve kontrol.**
  - `style-check.js` beklenen: PASS.
  - `curl -s -o /dev/null -w '%{http_code}' -r 0-99 localhost:3000/video/kou-seng-tanitim.mp4` beklenen: `206`.
- [ ] **Adım 9: Commit.**
  - `graphify update .` çalışır.
  - Mesaj: `"Ana sayfaya mobil uygulama bölümü ve tanıtım videosu"`.

### Task 4: Regresyon, CLAUDE.md, görüntüler ve PR

**Files:**
- Modify: `CLAUDE.md`
  - "Stil" bölümü,
  - `check:content` tablosu.

- [ ] **Adım 1: CLAUDE.md'yi güncelle.**
  - **Piksel font:** küçük harf kuralı ve nedeni (Press Start 2P Türkçe büyük harfleri küçük harf gibi çiziyor), kullanıldığı yerler.
  - **Sınıflar ve bileşenler:** `bg-night`, `pixel-edge`, `animate-pxspin`, `animate-blink`, `PixelMark` ve `PixelLoader` (`layout/Pixel.tsx`). `bg-hero` satırı silinir.
  - **`--border` #CBD9E1:** uygulamadan bilinçli sapma ve nedeni.
  - **Tanıtım videosu:**
    - dosyalar `public/video/` altında,
    - dönüştürme komutu (Task 3 Adım 3),
    - boyut sınırı,
    - davranış: görününce sessiz oynar; hareket azaltmada kendiliğinden başlamaz; durdurma için native kontroller (WCAG 2.2.2),
    - neden YouTube değil.
  - **Google Play linki:** `home/data.json` → `app.stores` ve `teams/mobil-web.json` birlikte güncellenir; `check:content` denetler.
  - **`check:content` tablosu:** video ve poster dosyaları ile `app.stores` eşitliği için yeni satır.
- [ ] **Adım 2: Regresyon.**
  - **Komutlar:**
    - boş veritabanıyla `windows-e2e.js` ve `admin-windows-e2e.js`,
    - `check:content`, `lint` ve `build`,
    - `style-check.js`.
  - **Beklenen:** hepsi geçer.
  - **Review Focus 5:** admin ekran görüntüsü gözle incelenir.
- [ ] **Adım 3: Sonra görüntüleri.**
  - `node shots.js tur2` çalışır.
  - `tur1` ve `tur2` için montaj üretilir: ana sayfa (masaüstü ve iPhone, açık ve karanlık), `/apply`, hakkında ve takım sayfası.
- [ ] **Adım 4: Commit, push, PR.**
  - `graphify update .` çalışır; mesaj `"CLAUDE.md: piksel kuralları, tanıtım videosu"`.
  - Push edilir.
  - PR #64'ün başlığı ve açıklaması Tur 2'yi de anlatacak şekilde güncellenir.

**Bitiş:**
- Tur 2 commit'leri son bir kod incelemesinden geçer; kritik bulgular düzeltilir.
- Önce ve sonra görüntüleri kullanıcıya gösterilir. PR merge edilmez.
