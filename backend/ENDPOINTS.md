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

## Kullanıcı Yönetimi (Admin) - YAPILDI

Yönetim panelindeki diğer yöneticileri yönetmek için kullanılır.

- **GET** `/users`
  - **Açıklama:** Sistemdeki tüm yönetici kullanıcıları listeler.
  - **Gerekli Header:** `Authorization: Bearer <token>`

- **POST** `/users`
  - **Açıklama:** Yeni bir yönetici kullanıcı oluşturur.
  - **Gerekli Header:** `Authorization: Bearer <token>`
  - **Request Body:** `{ "name": "string", "email": "string", "password": "string", "role": "string" }`

- **PUT** `/users/:id`
  - **Açıklama:** Belirtilen ID'ye sahip yöneticinin bilgilerini günceller.
  - **Gerekli Header:** `Authorization: Bearer <token>`
  - **Request Body:** `{ "name": "string", "email": "string", "role": "string" }`

- **DELETE** `/users/:id`
  - **Açıklama:** Belirtilen ID'ye sahip yöneticiyi siler.
  - **Gerekli Header:** `Authorization: Bearer <token>`

## Başvuru Formları Yönetimi (Recruitments)

Yönetim panelinden dinamik olarak teknik takım başvuru formları oluşturmak için kullanılır.

- **GET** `/recruitments`
  - **Açıklama:** Aktif olan tüm teknik takım başvuru formlarını listeler. (Public)

- **GET** `/recruitments/:slug`
  - **Açıklama:** Belirtilen `slug`'a sahip başvuru formunun detaylarını getirir. (Public)

- **POST** `/recruitments`
  - **Açıklama:** Yeni bir teknik takım başvuru formu oluşturur.
  - **Gerekli Header:** `Authorization: Bearer <token>`
  - **Request Body:** `{ "title": "string", "slug": "string", "description": "string", "questions": ["string"], "isOpen": "boolean" }`

- **PUT** `/recruitments/:slug`
  - **Açıklama:** Bir başvuru formunu günceller.
  - **Gerekli Header:** `Authorization: Bearer <token>`
  - **Request Body:** `{ "title": "string", "slug": "string", "description": "string", "questions": ["string"], "isOpen": "boolean" }`

- **DELETE** `/recruitments/:id`
  - **Açıklama:** Bir başvuru formunu siler.
  - **Gerekli Header:** `Authorization: Bearer <token>`

## Gelen Başvurular (Submissions)

Kullanıcıların doldurduğu genel ve teknik başvuruları yönetmek için kullanılır.

- **POST** `/submissions/general`
  - **Açıklama:** Genel üyelik başvurusunu alır ve kaydeder.
  - **Request Body:** `{ "name": "string", "studentId": "string", "email": "string", "phone": "string", "faculty": "string", "department": "string", "grade": "number" }`

- **POST** `/submissions/technical/:recruitmentId`
  - **Açıklama:** Teknik takım başvurusunu alır ve kaydeder.
  - **Request Body:** `{ "answers": ["string"] }`

- **GET** `/submissions`
  - **Açıklama:** Tüm gelen başvuruları listeler. Filtreleme için query parametreleri kullanılabilir.
  - **Gerekli Header:** `Authorization: Bearer <token>`

- **GET** `/submissions/:id`
  - **Açıklama:** Tek bir başvurunun detaylarını görüntüler.
  - **Gerekli Header:** `Authorization: Bearer <token>`

- **GET** `/submissions/export`
  - **Açıklama:** Başvuruları CSV formatında dışa aktarır.
  - **Gerekli Header:** `Authorization: Bearer <token>`

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
