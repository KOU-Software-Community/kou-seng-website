# Uygulama Tasarım Dili — Tasarım

**Tarih:** 2026-10-01 · **Branch:** `feature/uygulama-tasarim-dili` (PR #64)

- **Tur 1 (uygulandı):** yazı tipi, renk, köşe, gölge ve gradyanlı birincil düğmeler.
- **Tur 2 (bu güncelleme):** piksel havası, koyu bantlar, kutusuz logo ve tanıtım videosu. Tur 1'deki `bg-hero` kare logo paneli kalkıyor.

## Amaç

Site, KOU SENG mobil uygulamasının (app_seng) ve uygulamanın tanıtım videosunun görsel dilini kullansın. Böylece daha çok bir yazılım kulübü sitesi gibi görünsün.

Kaynaklar (app_seng):
- `src/theme.ts`: renk, yazı tipi, köşe, gölge,
- `src/components/Pixel.tsx`: piksel öğeleri,
- `design-source/KOU Yazilim Kulubu App.dc.html`: Claude Design dışa aktarımı,
- tanıtım videosu.

Videodan ve uygulamadan alınan öğeler:
- koyu lacivert zemin ve nokta ızgarası,
- dağılan piksel kareler,
- kutusuz, arkası parlayan logo,
- yanıp sönen blok imleç,
- başlık üstündeki ■■□ işareti,
- 4 kareli yükleniyor animasyonu.

## Kapsam dışı

- Backend, API ve başvuru akışı.
- Sayfa düzenleri ve içerik. İstisnalar: ana sayfa hero'su ve yeni "Mobil uygulama" bölümü.
- Karanlık temanın renkleri ve footer'ın görünümü.
- `src/components/ui/` dosyaları: shadcn bileşenleri doğrudan düzenlenmez (CLAUDE.md).
- Admin paneline özel tasarım; admin'deki yükleniyor durumları da bu kapsamda değil.
- Google Play bağlantısı: link gelene kadar düğme "Yakında" olarak kalır.

## Tasarım kuralları

Dosyalar: `frontend/src/app/globals.css` ve `frontend/src/app/layout.tsx`.

| Kural | Değer |
|---|---|
| Yazı tipi | Plus Jakarta Sans (`font-sans`), `latin` + `latin-ext` |
| Piksel font | Press Start 2P (`font-pixel`), `latin` + `latin-ext` |
| Zemin / metin (açık tema) | #F4F9FB / #0B1F3A |
| İkincil metin / soluk zemin | #41586B / #D2E7EC |
| Kenarlık (`--border`) | **#CBD9E1**, form alanı kenarlığıyla (`--input`) aynı |
| `--radius` | 12 px: kart 16, düğme/input 10, küçük 8 |
| `shadow-sm` / `shadow-featured` / `shadow-cta` | Tur 1'deki değerler |
| `bg-cta` | `linear-gradient(135deg, #014576, #0389BC)` |

Kenarlık neden değişti: uygulamadaki #E4EEF3, sitenin açık zemininde (#F4F9FB) neredeyse görünmüyor. Çerçeveli düğmeler, ayırıcılar, header ve footer çizgileri ve zaman çizelgesi kayboluyordu (Tur 1'in final incelemesi). Bu, uygulamadan bilinçli bir sapma.

Yeni sınıflar:

- **`bg-night`:** koyu bant.
  - Zemin: `radial-gradient(ellipse 85% 95% at 72% 42%, #043D71 0%, #002658 36%, #001B4A 68%, #00102F 100%)`. Videonun zemininden ölçüldü.
  - Üstünde nokta ızgarası: `radial-gradient(rgb(147 203 220 / .22) 1.5px, transparent 1.6px)`, 16 px aralık (design-source). Izgara sağ ortadan kenarlara doğru soluyor.
  - İki temada da aynı.
- **`pixel-edge`:** koyu bandın açık zemine piksel piksel dağılarak geçtiği 24 px'lik kenar.
  - Üç sıra 8 px kare: üstte seyrek, ortada yarı, altta dolu. Renk `--background`.
  - Bandın altında `bottom-0`, üstünde `top-0 rotate-180`.
- **Animasyonlar:**
  - `animate-pxspin`: uygulamanın `pxspin`'i. Kare %25 opaklıkta durur, döngünün bir çeyreğinde tam opak olur; `steps(1)`, 1 sn.
  - `animate-blink`: imleç, 1,1 sn.
  - İkisi de yalnızca `motion-safe:` ile kullanılır; hareket azaltma açıkken durur.
- **Kalkan:** `bg-hero`.

## Piksel öğelerinin kuralları

**Piksel fontta Türkçe büyük harf yok.** Press Start 2P İ, Ç, Ş, Ğ, Ü, Ö harflerini küçük harf gibi çiziyor; Tur 1'deki rozet "Kocaeli üniversitesi" görünüyordu.
- Piksel fontlu metin küçük harfle yazılır. Tek istisna ASCII marka adı "KOU SENG".
- JSON'dan gelen metne `lowercase` sınıfı verilir. `<html lang="tr">` sayesinde İ→i ve I→ı doğru dönüşür.

**Piksel font yalnızca kısa etiketlerde kullanılır:**
- header'daki marka adı,
- hero rozeti,
- bölüm üst etiketi ("mobil uygulama"),
- "sesi aç" düğmesi,
- yükleniyor etiketleri,
- RSS boş durum başlığı ("henüz yayın yok").

Başlıklar, gövde metni, formlar ve diğer düğmeler Plus Jakarta Sans'ta kalır.

**`PixelMark` (■■□):** dekoratif üç kare (`aria-hidden`), başlığın hizasını izler. Public sayfalardaki bölüm başlıklarının üstüne gelir:
- ana sayfa: Kulüp Tanıtımı, Mobil uygulama, Duyurular, Son Yayınlarımız,
- hakkında: 5 bölüm,
- takım sayfası: 4 bölüm,
- başvurular, iletişim, KVKK,
- yayınlar ve duyurular sayfa başlıkları.

Footer başlığına gelmez.

**`PixelLoader`:**
- Dört kare sırayla yanıp söner; `role="status"`, altında küçük harf piksel etiket.
- Public bölüm düzeyindeki yükleniyor durumlarında kullanılır: `/apply` ("başvurular yükleniyor"), başvuru formu ("başvuru bilgileri yükleniyor") ve footer.
- Düğme içindeki spinner'lar ve admin paneli olduğu gibi kalır.

## Ana sayfa hero'su: koyu bant

- Bölüm `bg-night`, iki temada da koyu; altında `pixel-edge`.
- **Sol sütun:**
  - rozet: piksel font, küçük harf, kare nokta, açık mavi yarı saydam kenarlık,
  - başlık: beyaz; vurgulu kelime açık maviden turkuaza gradyan,
  - başlığın sonunda yanıp sönen turkuaz blok imleç (`aria-hidden`),
  - açıklama: #C4D9E6,
  - birincil düğme: aynen (`bg-cta`),
  - ikinci düğme: koyu zemine uygun, yarı saydam ve açık mavi kenarlı.
- **Sağ sütun:**
  - kutusuz logo; `next/image` `preload` ile önceden yüklenir,
  - arkasında turkuaz parıltı,
  - çevresinde 11 dağınık piksel kare; bir kısmı `animate-pxspin` ile yanıp söner.
  - Kare panel ve kutu yok.
- **Mobil:** metin üstte ve ortalı, logo altta (yaklaşık 300 px).

## Mobil uygulama bölümü ve tanıtım videosu

**Yeri ve görünümü:**
- Ana sayfada, Kulüp Tanıtımı'ndan sonra ve Duyurular'dan önce.
- `bg-night`; üstte ve altta `pixel-edge`.
- **Sol:**
  - `PixelMark` ve "mobil uygulama" (piksel font),
  - başlık "Kulüpten hiçbir şey kaçmasın.",
  - açıklama,
  - mağaza düğmeleri: App Store beyaz zeminli; Google Play'in `url`'i `null` iken "Google Play · Yakında" yazar ve pasiftir.
- **Sağ:**
  - 16:9 video çerçevesi: 16 px köşe, açık mavi yarı saydam kenarlık, koyu gölge,
  - sol üstte piksel fontlu "sesi aç" düğmesi.

**İçerik:**
- `public/data/home/data.json` → `app`: `kicker`, `title`, `description`, `stores`, `video.src`, `video.poster`.
- `stores`, `teams/mobil-web.json`'daki KOU SENG projesinin `stores`'uyla aynı olmalı; `check:content` bunu denetler. Google Play linki gelince iki yer birlikte güncellenir.

**Barındırma: YouTube değil, sitenin kendisi (`public/video/`).** Nedenler:
- 15 saniyelik video 1,8 MB'a iniyor.
- YouTube oynatıcısının logosu ve önerilen videoları tasarımı bozmaz.
- Üçüncü taraf çerezi yok, KVKK metnine ek gerekmiyor.
- CSP değişmez: `default-src 'self'` yetiyor.
- `next start` byte-range isteklerini destekliyor (206), Safari videoyu oynatır.

**Dosyalar:**
- `public/video/kou-seng-tanitim.mp4`: 1280×720, 30 fps, H.264 High, CRF 24, AAC 128 kbps, `+faststart`; yaklaşık 1,8 MB.
- `public/video/kou-seng-tanitim.jpg`: poster, videonun son karesi (logo ve "App Store ve Google Play'de"), 1280×720.
- Kaynak dosya (1080p60, 19,5 MB) repoya girmez. Dönüştürme komutu CLAUDE.md'ye yazılır.

**Davranış:**
- `muted loop playsInline controls preload="none"`.
- Bölümün yarısı görününce oynar, ekrandan çıkınca durur (IntersectionObserver). Video yalnızca görününce iner.
- Hareket azaltma açıksa kendiliğinden oynamaz; poster ve kontroller görünür.
- "sesi aç" düğmesi sesi açar, video durmuşsa oynatır ve gizlenir.
- Duraklatma, ses ve tam ekran tarayıcının kendi kontrollerinde. Bu gerekli: kendiliğinden başlayan, 5 saniyeden uzun hareketli içerik durdurulabilmeli (WCAG 2.2.2).

**Erişilebilirlik:**
- Videonun `aria-label`'ı bölüm başlığı.
- Videoda konuşma olmadığı (yalnızca müzik) varsayıldı, bu yüzden altyazı yok. Konuşma varsa WebVTT altyazı gerekir.

**Not:** Cloudflare `.mp4` dosyalarını varsayılan olarak önbelleğe alıyor. Ücretsiz plan şartları büyük video sunumunu ücretli ürünlere (Stream, R2) yönlendiriyor. 1,8 MB'lık tek bir tanıtım videosu pratikte sorun yaratmaz; video sayısı ya da boyutu büyürse YouTube veya Stream düşünülmeli.

## Header

- Logo (32 px) ve piksel fontla "KOU SENG", `/`'ya bağlı.
- Masaüstünde solda durur. Yazı yalnızca `lg` ve üstünde görünür; `md`'de ortalanmış menüyle çakışmasın.
- Mobilde ortada: hamburger solda, tema düğmesi sağda.

## Diğer düzeltmeler

Tur 1'in final incelemesinden:
- **Kart üzerine gelince gölge:** `hover:shadow-md`, yeni `shadow-sm`'den küçük ve sert. `hover:shadow-featured` olur; dört yerde: hakkında, duyurular, başvurular, yayınlar.
- **Soluk kenarlıklar:** çerçeveli düğmeler, ayırıcılar ve çizgiler yeni `--border` değeriyle düzelir.

## Erişilebilirlik

- **Kontrast:**
  - #C4D9E6 açıklama metni, koyu bantta en az 9:1,
  - #93CBDC rozet metni, #002658 zemin üstünde yaklaşık 7:1,
  - başlıklar beyaz.
- **Hareket:** `pxspin`, imleç ve videonun kendiliğinden oynaması `prefers-reduced-motion`'a uyar.
- **Dekoratif öğeler** `aria-hidden`: `PixelMark`, piksel kareler, parıltı, imleç ve `pixel-edge`.

## Doğrulama

**Oturum içi Playwright stil kontrolü (`style-check.js`), önce kırmızı. Kontrol ettikleri:**
- Hero `bg-night` ve arka planı radial-gradient. Hero'da kod editörü ve `bg-hero` yok; logonun hiçbir atasında arka plan, kenarlık ya da köşe kutusu yok.
- İmleç `blink` animasyonlu; `prefers-reduced-motion: reduce` emülasyonunda imleç ve kareler animasyonsuz.
- Home, `/apply` ve hakkında sayfasında, Türkçe büyük harf içeren her `.font-pixel` metninin computed `text-transform`'u `lowercase`.
- Header'da `/`'ya giden ve piksel fontlu "KOU SENG" yazan marka bağlantısı var.
- Ana sayfa bölüm başlıklarının üstünde `PixelMark` var.
- **Video:**
  - `src`, `poster`, `muted`, `loop`, `playsinline`, `preload="none"` ve `controls` doğru.
  - `play()` bölüm görünmeden çağrılmıyor, görününce çağrılıyor. Test bunu `play` yerine geçen bir kayıt fonksiyonuyla ölçer, çünkü test tarayıcısında H.264 çözücü yok.
  - Hareket azaltma açıkken `play()` çağrılmıyor.
  - "sesi aç" tıklanınca `muted === false`.
- `--border` #CBD9E1; çerçeveli düğmenin kenarlığı `rgb(203, 217, 225)`.

**Diğer kontroller:**
- **`check:content`:**
  - `home.app.video.src` ve `poster` diskte var,
  - video en fazla 5 MB, poster en fazla 300 KB,
  - `home.app.stores` biçimi doğru ve KOU SENG projesinin `stores`'uyla aynı.
- **ffprobe:** h264, 1280×720, 30 fps; `moov` dosyanın başında (`faststart`).
- **`curl -r 0-99 /video/kou-seng-tanitim.mp4`:** 206 döner.
- **Önce/sonra ekran görüntüleri:** ana sayfa, `/apply`, hakkında ve takım sayfası; masaüstü ve iPhone; açık ve karanlık tema.
- **Regresyon:** `windows-e2e`, `admin-windows-e2e`, `check:content`, lint ve build.

## Deploy

Yalnızca frontend değişiyor. Video dosyası repoda.
