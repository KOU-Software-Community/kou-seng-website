# Başvuru Dönemleri — Tasarım

**Tarih:** 2026-09-28 · **Branch:** `feature/basvuru-donemi-yonetimi` · **Önce merge edilmesi gereken:** #61

## Amaç

Başvuru formlarının açık ya da kapalı olmasına **backend** karar versin ve bunu
her başvuruda uygulasın. Admin, her formun açılış ve kapanış tarihini **admin
panelinden** ayarlasın. Form bu tarihlerde kendiliğinden açılıp kapansın.

Bugünkü sorun: açık/kapalı bilgisi yalnızca iki JSON dosyasındaki `isOpen`
değerinde duruyor ve yalnızca ekrandaki formu gizliyor. Backend buna hiç
bakmıyor, API'ye doğrudan atılan istek kapalı forma da başvuru kaydettirebiliyor.

## Kapsam dışı

- Takım liderlerinin kendi formlarını yönetmesi: tarihleri yalnızca `admin` rolü değiştirir.
- Form alanlarını panelden düzenlemek: formlar `public/data/applications/*.json`'da kalır.
- Değişiklik geçmişi ve bildirimler: yalnızca son değiştiren admin saklanır.

## Kurallar

- **Formlar** (slug): `general`, `mobil-web`, `ai`, `game`. Slug'lar mevcut kimliklerdir, değişmez.
- **Pencere:** her formun `opensAt` ve `closesAt` alanı var. İkisi de tarih ya da `null` olabilir.
- **Açık olma kuralı:** `opensAt` doluysa, `opensAt ≤ şimdi` ise ve `closesAt` boş ya da `şimdi < closesAt` ise form açıktır.
  - `opensAt` boşsa form kapalıdır.
  - `closesAt` boşsa form açıldıktan sonra süresiz açık kalır.
  - Sınırlar: açılış anında açık, kapanış anında kapalı (`[opensAt, closesAt)`).
- **Durum:** arayüz için üç durum türetilir.
  - `open` (Açık): form açık.
  - `scheduled` (Planlandı): `opensAt` henüz gelmedi.
  - `closed` (Kapalı): geri kalan her durum.
- **Varsayılanlar** (veritabanında o form için kayıt yoksa):
  - `general`: açık ve süresiz (`opensAt` = 1970-01-01, `closesAt` = `null`). Bugünkü davranış bu; CI smoke testi de genel forma başvuru gönderiyor.
  - Teknik formlar kapalı (`opensAt` = `null`). Bugünkü davranış bu.
- **Saat:**
  - Veritabanında ve API'de tarihler UTC ISO 8601.
  - Sitede Türkiye saatiyle gösterilir (`Europe/Istanbul`, `tr-TR`, ör. "5 Ekim 2026 23:59").
  - Admin tarihi tarayıcının yerel saatiyle girer (`datetime-local`).
- **Karar yeri:** açık/kapalı kararı her zaman sunucu saatiyle backend'de verilir. Frontend yalnızca backend'in döndürdüğü durumu gösterir.

## Backend

### Veri

`models/ApplicationWindow.js`:

| Alan | Tip | Kural |
|---|---|---|
| `slug` | String | zorunlu, tekil, `enum: ['general', 'mobil-web', 'ai', 'game']` |
| `opensAt` | Date | varsayılan `null` |
| `closesAt` | Date | varsayılan `null` |
| `updatedBy` | ObjectId → `User` | varsayılan `null`; son değiştiren admin |
| — | timestamps | `createdAt`, `updatedAt` |

Migration gerekmez. Kayıt yoksa varsayılan geçerli, admin ilk kaydettiğinde kayıt oluşur (upsert).

### Mantık

- `helpers/applicationWindow.js`: saf fonksiyonlar, veritabanına dokunmaz; birim testlenir.
  - `APPLICATION_SLUGS`: form listesi.
  - `DEFAULT_WINDOWS`: yukarıdaki varsayılanlar.
  - `isWindowOpen(window, now)`: açık olma kuralı.
  - `windowState(window, now)`: `open`, `scheduled` ya da `closed`.
  - `toPublicWindow(slug, window, now)`: API'nin döndürdüğü biçim.
- `controllers/applicationWindowsController.js`:
  - `getWindow(slug)`: veritabanındaki kaydı ya da varsayılanı döndürür.
  - `getWindows` ve `updateWindow`: endpoint handler'ları.

### Endpoint'ler

`routes/submissionsRoutes.js` içinde, `/:id` rotasından **önce** tanımlanırlar.

- **`GET /submissions/windows`** (herkese açık)
  - Yanıt: `{ success: true, data: [{ slug, opensAt, closesAt, state, isOpen }] }`. Dört form `APPLICATION_SLUGS` sırasıyla gelir.
  - `Cache-Control: no-store`. Genel istek sınırına tabi (IP başına 15 dk'da 100).
  - Başvuru gönderimi zaten aynı sınıra tabi olduğu için kapasite değişmez. Sınır dolarsa ziyaretçi, formu doldurmadan önce "Başvuru durumu alınamadı" uyarısını görür.
- **`PATCH /submissions/windows/:slug`** (`protect`, `adminOnly`)
  - Gövde: `{ opensAt: string | null, closesAt: string | null }`.
  - Doğrulama (hepsi 400):

    | Durum | Mesaj |
    |---|---|
    | slug listede değil | "Geçersiz başvuru formu." |
    | değer ne `null` ne de geçerli bir ISO tarih metni | "Tarih geçersiz." |
    | `closesAt` dolu, `opensAt` boş | "Kapanış tarihi için açılış tarihi gerekli." |
    | `closesAt ≤ opensAt` | "Kapanış tarihi açılış tarihinden sonra olmalı." |

  - Başarılıysa kaydı günceller ya da oluşturur ve `updatedBy` alanına isteği yapan admini yazar. Yanıt: `{ success: true, data: { slug, opensAt, closesAt, state, isOpen } }`.
  - `logger.info` ile kimin neyi değiştirdiği loglanır.

### Başvurulara uygulanması

`createGeneralSubmission` ve `createTechnicalSubmission`, form kapalıysa gövdeye
bakmadan **403** döner: `{ success: false, message: "Bu başvuru şu anda kapalı." }`.

- Genel başvuruda kontrol en başta yapılır.
- Teknik başvuruda önce slug geçerliliğine bakılır (`validCategories`, geçersizse yine 400), hemen ardından pencereye.

## Frontend

### Veri katmanı

- `src/lib/applicationWindow.ts`:
  - `formatWindowDate(iso)`: "5 Ekim 2026 23:59" biçimi, Türkiye saati.
  - `windowSummary(window)`: kısa açıklama metni.
  - `toLocalInput(iso)` / `fromLocalInput(value)`: `datetime-local` alanı ile ISO arasında çeviri.
  - `APPLICATION_LABELS`: formların görünen adları.
- `src/hooks/useApplicationWindows.ts`:
  - GET isteğini `cache: 'no-store'` ile atar.
  - Admin için `updateWindow` fonksiyonunu sağlar; mevcut `getAuthHeader` desenini kullanır.

### Başvuru sayfaları

- **`/apply` listesi (`apply.tsx`):** "Başvur" düğmesi, açık/kapalı filtresi ve alt satırdaki metin backend'den gelen duruma göre belirlenir.
- **`/apply/<slug>` (`applyDetail.tsx`):** form yalnızca `isOpen` ise gösterilir.
  - Kapalıysa: "Bu başvuru şu anda kapalı." ve özet metni.
  - Planlandıysa: "Başvurular henüz açılmadı." ve açılış tarihi.
  - Formun üst satırında "Son Başvuru Tarihi" yerine özet metni yer alır.
- **Özet metinleri:**

  | Durum | Metin |
  |---|---|
  | açık, kapanış var | "Son başvuru: <tarih>" |
  | açık, kapanış yok | "Son başvuru tarihi belirtilmedi" |
  | planlandı | "<tarih> tarihinde açılacak" |
  | kapalı | "Başvurular kapalı" |

- **Backend'e ulaşılamazsa:** formlar kapalı gösterilir ve "Başvuru durumu alınamadı. Lütfen daha sonra tekrar deneyiniz." uyarısı çıkar.
- **Başvuru sırasında form kapanırsa:** gönderim 403 alır ve form backend'in mesajını gösterir.
- **JSON temizliği:** `isOpen` ve `deadline` alanları `public/data/applications/index.json` ile dört `<slug>.json` dosyasından ve TypeScript tiplerinden kalkar. CLAUDE.md'deki "iki dosyada birlikte güncelle" tuzağı da böylece ortadan kalkar.

### Admin paneli

- **Route:** `/admin/dashboard/application-windows` → `components/pages/admin/application-windows.tsx`.
- **Kenar menüsü:** "Başvuru Dönemleri", "Teknik Takım"ın altında.
- **Erişim:** yalnızca admin görür. Mevcut rol filtresi ve layout yönlendirmesi diğer rolleri kendi sayfalarına gönderiyor.
- **Sayfa:** başlık "Başvuru Dönemleri". Her form için bir kart:
  - form adı,
  - durum rozeti (Açık / Planlandı / Kapalı),
  - "Açılış" ve "Kapanış" `datetime-local` alanları,
  - "Kaydet" ve "Kapat" düğmeleri. "Kapat", iki tarihi de `null` yapar.
  - Açıklama satırı: "Tarihleri bu cihazın saatine göre girin; sitede Türkiye saatiyle gösterilir."
- **Mesajlar:** backend'in 400 mesajı kartta gösterilir. Kayıttan sonra liste yenilenir ve "Kaydedildi" mesajı çıkar.

## Güvenlik

- Yazma yalnızca admin: backend'de `adminOnly`, frontend'de mevcut layout yönlendirmesi.
- Gövde değerleri yalnızca metin ya da `null` olabilir; nesne ya da dizi 400 döner.
- Sorgular doğrulanmış slug ile eşitlik araması yapar; `sanitizeFilter` ile uyumlu.
- Herkese açık GET yalnızca tarihleri ve durumu döndürür, kişisel veri yok.

## Deploy

1. Önce **backend**: yeni endpoint'ler ve 403 kontrolü devreye girer. Teknik formlar zaten kapalı olduğundan davranış değişmez, genel üyelik açık kalır.
2. Sonra **frontend**: sayfalar durumu backend'den okumaya başlar. Frontend önce deploy edilirse, backend gelene kadar `/apply` sayfası "Başvuru durumu alınamadı" gösterir.
3. Bundan sonra formlar admin panelinden açılıp kapatılır; kod değişikliği ya da deploy gerekmez.

## Test

- **Birim (backend, `node:test`, yeni bağımlılık yok):** `helpers/applicationWindow.test.js` şunları kapsar: kural, sınırlar (açılış anı açık, kapanış anı kapalı), boş değerler, varsayılanlar, durum türetme.
- **CI smoke (`backend/scripts/windows-smoke.js`):** çalışan backend'e karşı sırayla şunlara bakar:
  - varsayılanlar (genel açık, teknikler kapalı),
  - yetki (token yok → 401, admin olmayan rol → 403),
  - 400 doğrulamaları,
  - planlanmış durum,
  - açık pencerede teknik başvurunun 201, kapalıyken 403 dönmesi,
  - genel formu kapatıp açma.

  Genel formu açık bırakarak biter. CI'da `loadtest`'ten önce koşar; sonrasında form limiti tükenmiş oluyor.
- **Oturum içi kabul testi (Playwright, repoya girmez):**
  - admin panelinden tarih girme: 18:00 yerel saat girilince API'de 15:00Z olmalı, sitede 18:00 gösterilmeli,
  - başvuru sayfalarının üç durumu,
  - backend'e ulaşılamaması,
  - form doldurulurken pencerenin kapanması,
  - admin olmayan rolün sayfaya girememesi.
- `check:content`, lint ve build.

## Dokümantasyon

- **CLAUDE.md:**
  - Yeni bölüm "Başvuru dönemleri": kural, varsayılanlar, admin sayfası, deploy sırası, CI notu.
  - "Başvuru formuna alan ekleme" bölümünden `isOpen`/`deadline` tuzağı çıkarılır.
  - Slug değiştirme sırasına `ApplicationWindow` enum'u ve `APPLICATION_SLUGS` eklenir.
  - Rate limit bölümündeki smoke sayıları güncellenir.
- **`backend/ENDPOINTS.md`:** iki yeni endpoint ve başvurulardaki 403 eklenir.
