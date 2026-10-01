# Uygulama Tasarım Dili — Tasarım

**Tarih:** 2026-10-01 · **Branch:** `feature/uygulama-tasarim-dili`

## Amaç

Site, KOU SENG mobil uygulamasının (app_seng) görsel dilini kullansın. Sayfa
yapıları ve içerik olduğu gibi kalır; değişen yazı tipi, renk dengesi, köşe,
gölge ve birkaç vurgu. Kaynak: app_seng `src/theme.ts`. Uygulamanın tasarım
kuralları orada toplanmış, Claude Design dışa aktarımından türetilmiş.

Sitenin beş marka rengi uygulamayla zaten aynı: #001B4A, #014576, #0389BC,
#93CBDC, #D2E7EC. Bu yüzden iş, çoğunlukla kuralların tek yerden
değiştirilmesi.

## Kapsam dışı

- Backend, API ve başvuru akışı.
- Sayfa düzenleri ve içerik. Tek istisna ana sayfadaki logo alanı.
- Karanlık temanın renkleri: zaten aynı paletten türetilmiş.
- `src/components/ui/` dosyaları: shadcn bileşenleri doğrudan düzenlenmez
  (CLAUDE.md). Değişiklik onlara tasarım kuralları üzerinden geçer.
- Admin paneline özel tasarım. Admin aynı kuralları kullandığı için kendiliğinden
  güncellenir.

## Tasarım kuralları

Dosyalar: `frontend/src/app/globals.css` ve `frontend/src/app/layout.tsx`.

| Kural | Şimdi | Yeni (app_seng `theme.ts`) |
|---|---|---|
| Yazı tipi | Sistem fontu (Inter indiriliyor ama bağlı değil) | Plus Jakarta Sans 400–800, `latin` + `latin-ext` |
| Piksel font | yok | Press Start 2P, `font-pixel` sınıfı |
| Zemin (açık tema) | #D2E7EC | #F4F9FB |
| Ana metin | #001B4A | #0B1F3A |
| İkincil metin (`muted-foreground`) | #014576 | #41586B |
| Soluk zemin (`muted`) | #93CBDC | #D2E7EC |
| Kenarlık | lacivert %20 | #E4EEF3 |
| Form alanı kenarlığı (`input`) | lacivert %20 | #CBD9E1 |
| `--radius` | 10 px | 12 px: kart 16, düğme/input 10, küçük 8 |
| `shadow-sm` (kartlar) | Tailwind varsayılanı | `0 6px 16px rgb(0 27 74 / 0.07)` |
| Yeni `shadow-featured` | — | `0 10px 24px rgb(0 27 74 / 0.13)` |
| Yeni `shadow-cta` | — | `0 10px 22px rgb(3 137 188 / 0.30)` |
| Yeni `bg-hero` | — | `linear-gradient(140deg, #001B4A, #0389BC)` |
| Yeni `bg-cta` | — | `linear-gradient(135deg, #014576, #0389BC)` |

Karanlık temanın renkleri değişmez. Yazı tipi, köşe ve gölge iki temada
ortak.

## Uygulamaya özgü dokunuşlar

- **Ana sayfa logo alanı (`home.tsx`):** Sağ sütundakiler kalkar: kod editörü
  çizimi, logo kutusu ve iki süs kutusu. Yerine `bg-hero` gradyanlı, köşeleri
  16 px kare bir panel gelir:
  - ortada logo, kutusuz ve büyük,
  - arkasında yumuşak turkuaz parıltı,
  - altında `font-pixel` ile "KOU SENG".
- **Birincil düğmeler** (`bg-cta shadow-cta`, uygulamadaki gradyanlı düğme):
  - ana sayfadaki birincil hero düğmesi,
  - `/apply` "Başvur",
  - başvuru formunun gönder düğmesi.
- **Piksel font:** Yalnızca şu kısa etiketlerde kullanılır:
  - hero rozeti,
  - logo altı yazı,
  - `/apply` "Başvurular yükleniyor...",
  - RSS "Henüz Yayın Yok" başlığı.

  Uzun cümleler, gövde metni, form ve düğmeler Plus Jakarta Sans'ta kalır;
  uygulamadaki kuralın aynısı.

## Erişilebilirlik

- Yeni metin renkleri zemin üzerinde AA kontrastını geçer:
  - #41586B / #F4F9FB yaklaşık 7:1,
  - #0B1F3A / #F4F9FB yaklaşık 16:1.
- Form alanı kenarlığı bugünkü kadar görünür kalır (#CBD9E1).

## Doğrulama

- **Oturum içi Playwright stil kontrolü**, önce kırmızı. Kontrol ettikleri:
  - gövdenin yazı tipi Plus Jakarta Sans,
  - zemin `rgb(244, 249, 251)`,
  - kart köşesi 16 px,
  - hero'da kod editörü çizimi yok, logo panelinde `font-pixel` yazı var,
  - birincil düğmelerde gradyan.
- **Önce/sonra ekran görüntüleri:** ana sayfa, `/apply`, `/apply/general` ve
  hakkında; masaüstü ve iPhone; açık ve karanlık tema.
- **Regresyon:**
  - başvuru ve admin kabul senaryoları,
  - `check:content`, lint ve build.

## Deploy

Yalnızca frontend değişiyor. Backend'e dokunulmadığı için deploy sırası yok.
