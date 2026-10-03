# Backend API Endpoints

Bu doküman, Kocaeli Üniversitesi Yazılım Kulübü web sitesinin backend API'si için gerekli olan tüm endpoint'leri tanımlamaktadır.

## Kimlik Doğrulama (Authentication) - YAPILDI

Yönetim paneline erişim için kullanılır.

- **POST** `/auth/login`
  - **Açıklama:** Yönetici girişi için kullanılır. Başarılı girişte JWT (JSON Web Token) döndürür.
  - **Request Body:** `{ "email": "string", "password": "string" }`

- **GET** `/auth/me`
  - **Açıklama:** Mevcut token'a sahip yöneticinin bilgilerini döndürür. Oturum kontrolü için kullanılır.
  - **Gerekli Header:** `Authorization: Bearer <token>`

- **PATCH** `/auth/password`
  - **Açıklama:** Oturumdaki kullanıcının şifresini değiştirir. Yeni şifre en az 10 karakter. Hatalı denemeler login ile aynı limite (15 dakikada 10) sayılır.
  - **Gerekli Header:** `Authorization: Bearer <token>`
  - **Request Body:** `{ "currentPassword": "string", "newPassword": "string" }`
  - Değişiklikten önce verilmiş token'lar (bu oturumunki dahil) artık 401 alır; panel çıkış yaptırıp yeniden giriş ister.

- **GET** `/auth/status`
  - **Açıklama:** Başvuru ve iletişim mesajı sayıları (dashboard özeti). Yalnızca admin.
  - **Gerekli Header:** `Authorization: Bearer <token>`

## Kullanıcı Yönetimi (Admin) - YAPILDI

Yönetim panelindeki diğer yöneticileri yönetmek için kullanılır.

- **GET** `/users`
  - **Açıklama:** Sistemdeki tüm yönetici kullanıcıları listeler.
  - **Gerekli Header:** `Authorization: Bearer <token>`

- **POST** `/users`
  - **Açıklama:** Yeni bir yönetici kullanıcı oluşturur. Şifre en az 10 karakter.
  - **Gerekli Header:** `Authorization: Bearer <token>`
  - **Request Body:** `{ "name": "string", "email": "string", "password": "string", "role": "string" }`

- **PUT** `/users/:id`
  - **Açıklama:** Belirtilen ID'ye sahip yöneticinin bilgilerini günceller.
  - **Gerekli Header:** `Authorization: Bearer <token>`
  - **Request Body:** `{ "name": "string", "email": "string", "role": "string" }`

- **DELETE** `/users/:id`
  - **Açıklama:** Belirtilen ID'ye sahip yöneticiyi siler.
  - **Gerekli Header:** `Authorization: Bearer <token>`

## Gelen Başvurular (Submissions)

Kullanıcıların doldurduğu genel ve teknik başvuruları yönetmek için kullanılır.
Başvuru formlarının kendisi backend'de değil, `frontend/public/data/applications/<slug>.json`
dosyalarında tanımlı; forma alan eklerken CLAUDE.md'deki "Başvuru formuna alan ekleme"
listesine bak.

- **POST** `/submissions/general`
  - **Açıklama:** Genel üyelik başvurusunu alır ve kaydeder. Form kapalıysa (bkz. `/submissions/windows`) 403 döner.
  - **Request Body:** `{ "name": "string", "studentId": "string", "email": "string", "phone": "string", "faculty": "string", "department": "string", "grade": "number" }`

- **POST** `/submissions/technical/:slug`
  - **Açıklama:** Teknik takım başvurusunu alır ve kaydeder. `slug`: `mobil-web`, `ai` veya `game` (form dosyasının adı).
  - **Request Body:** Genel başvurudaki öğrenci alanları + formdaki diğer her alan için `"question_<id>": "string"` (en fazla 5000 karakter). Kabul edilen anahtarlar `controllers/submissionsController.js` → `allowedCustomFields`; listede olmayan anahtar 400 döner.
  - **Yanıtlar:** 201 kaydedildi; 400 eksik veya geçersiz alan; 403 form şu anda kapalı (`"Bu başvuru şu anda kapalı."`); 409 aynı kategoride aynı öğrenci no, e-posta ya da telefonla önceki başvuru; 429 istek sınırı.

- **GET** `/submissions/windows`
  - **Açıklama:** Başvuru formlarının açık/kapalı durumu, herkese açık. Form `[opensAt, closesAt)` aralığında açık: `opensAt` yoksa kapalı, `closesAt` yoksa süresiz açık. Veritabanında kayıt yoksa genel üyelik açık, teknik formlar kapalı. Karar sunucu saatiyle verilir; yanıt önbelleğe alınmaz.
  - **Yanıt:** `{ "success": true, "data": [{ "slug": "general" | "mobil-web" | "ai" | "game", "opensAt": "ISO 8601" | null, "closesAt": "ISO 8601" | null, "state": "open" | "scheduled" | "closed", "isOpen": boolean }] }`

- **PATCH** `/submissions/windows/:slug`
  - **Açıklama:** Formun açılış ve kapanış tarihini ayarlar (yalnızca admin). İkisi de `null` ise form kapalıdır. Tarih, saat dilimi belirtilmiş ISO 8601 metni olmalı (`2026-10-05T15:00:00.000Z` ya da `2026-10-05T18:00:00+03:00`).
  - **Gerekli Header:** `Authorization: Bearer <token>`
  - **Request Body:** `{ "opensAt": "string" | null, "closesAt": "string" | null }`
  - **Yanıtlar:** 200 `{ "success": true, "data": { ... } }` (GET'teki biçim); 400 geçersiz form, geçersiz tarih, açılışsız kapanış ya da kapanış ≤ açılış; 401 token yok; 403 admin değil.

- **GET** `/submissions`
  - **Açıklama:** Tüm gelen başvuruları listeler. Filtreleme için query parametreleri kullanılabilir.
  - **Gerekli Header:** `Authorization: Bearer <token>`

- **GET** `/submissions/:id`
  - **Açıklama:** Tek bir başvurunun detaylarını görüntüler.
  - **Gerekli Header:** `Authorization: Bearer <token>`

- **GET** `/submissions/export`
  - **Açıklama:** Başvuruları CSV formatında dışa aktarır.
  - **Gerekli Header:** `Authorization: Bearer <token>`

- **POST** `/submissions/purge`
  - **Açıklama:** Seçilen kapsamdaki başvuruları kalıcı olarak siler (yalnızca admin). `scope`: `all`, `general`, `mobil-web`, `ai` veya `game`. `expectedCount` kapsamdaki güncel kayıt sayısıyla tutmazsa hiçbir şey silinmez, 409 döner. Paneldeki "Veri Yönetimi" sayfası silmeden önce `/submissions/export` ile yedek indirtir.
  - **Gerekli Header:** `Authorization: Bearer <token>`
  - **Request Body:** `{ "scope": "string", "expectedCount": number }`

## Duyurular (Announcements) - YAPILDI

Anasayfa ve duyurular sayfasında gösterilecek duyuruları yönetmek için kullanılır.

- **GET** `/announcements`
  - **Açıklama:** Herkese açık tüm duyuruları listeler. Anasayfa için `?limit=3` gibi bir parametre alabilir.

- **GET** `/announcements/:id`
  - **Açıklama:** Tek bir duyurunun detayını getirir.

- **POST** `/announcements`
  - **Açıklama:** Yeni bir duyuru oluşturur.
  - **Gerekli Header:** `Authorization: Bearer <token>`
  - **Request Body:** `{ "title": "string", "summary": "string", "content": "string", "category": "string" }`

- **PUT** `/announcements/:id`
  - **Açıklama:** Bir duyuruyu günceller.
  - **Gerekli Header:** `Authorization: Bearer <token>`
  - **Request Body:** `{ "title": "string", "summary": "string", "content": "string", "category": "string" }`

- **DELETE** `/announcements/:id`
  - **Açıklama:** Bir duyuruyu siler.
  - **Gerekli Header:** `Authorization: Bearer <token>`

## İletişim Mesajları (Contact Messages) - YAPILDI

İletişim formu üzerinden gönderilen mesajları yönetmek için kullanılır.

- **POST** `/contact`
  - **Açıklama:** İletişim formundan gelen mesajı kaydeder.
  - **Request Body:** `{ "name": "string", "email": "string", "subject": "string", "message": "string" }`

- **GET** `/contact`
  - **Açıklama:** Tüm iletişim mesajlarını listeler.
  - **Gerekli Header:** `Authorization: Bearer <token>`

- **DELETE** `/contact/:id`
  - **Açıklama:** Belirtilen ID'ye sahip mesajı siler.
  - **Gerekli Header:** `Authorization: Bearer <token>`

## Yayınlar (Publications) - YAPILDI

Medium'daki yayınları çekmek için kullanılır. Bu endpoint, backend-for-frontend (BFF) görevi görür.

- **GET** `/rss`
  - **Açıklama:** Medium RSS feed'ini çekip parse ederek makalelerin listesini JSON formatında döndürür.
