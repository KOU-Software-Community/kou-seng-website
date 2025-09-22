# Backend - KOU SENG Website API

Kocaeli Üniversitesi Yazılım Kulübü web sitesinin backend API servisi. Node.js ve Express.js kullanılarak geliştirilmiş RESTful API.

## 🏗️ Teknoloji Stack'i

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT
- **Password Hashing**: bcrypt
- **Rate Limiting**: Express Rate Limit

## 📋 Gereksinimler

- Node.js
- MongoDB
- npm

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleme

```bash
cd backend
npm install
```

### 2. Environment Variables

`.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Log level
LOG_LEVEL=info

# Server Configuration
PORT=3001

# Database Configuration
MONGODB_URI=<mongo_db_url>

# JWT Configuration
JWT_SECRET=<jwt_secret>
KEY=<first_creation_key>

# CORS Configuration
SERVER_IP=<frontend_server_ip>
CORS_ALLOWED_ORIGINS=https://kouseng.com,http://localhost:3000

# Medium RSS URL
MEDIUM_RSS_URLS=https://medium.com/feed/@metehansenyer
```

### 3. Server'ı Başlatma

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

Server `http://localhost:3001` adresinde çalışacaktır.

## 📚 API Endpoints

### Health Check
- **GET** `/health` - Server durumu kontrolü

### Authentication
- **POST** `/auth/register` - Yeni kullanıcı kaydı
- **POST** `/auth/login` - Kullanıcı girişi
- **POST** `/auth/logout` - Çıkış
- **GET** `/auth/me` - Mevcut kullanıcı bilgileri
- **PUT** `/auth/update-profile` - Profil güncelleme

### Users
- **GET** `/users` - Kullanıcı listesi (Admin only)
- **GET** `/users/:id` - Belirli kullanıcı bilgileri
- **PUT** `/users/:id` - Kullanıcı güncelleme (Admin only)
- **DELETE** `/users/:id` - Kullanıcı silme (Admin only)

### Announcements
- **GET** `/announcements` - Duyuru listesi
- **GET** `/announcements/:id` - Belirli duyuru
- **POST** `/announcements` - Yeni duyuru (Admin only)
- **PUT** `/announcements/:id` - Duyuru güncelleme (Admin only)
- **DELETE** `/announcements/:id` - Duyuru silme (Admin only)

### Contact
- **GET** `/contact` - İletişim mesajları (Admin only)
- **POST** `/contact` - Yeni iletişim mesajı
- **DELETE** `/contact/:id` - Mesaj silme (Admin only)

### Publications (RSS)
- **GET** `/rss` - RSS yayınları
- **GET** `/rss/:category` - Kategori bazlı RSS

### Submissions
- **GET** `/submissions` - Başvuru listesi (Admin only)
- **POST** `/submissions` - Yeni başvuru
- **GET** `/submissions/:id` - Belirli başvuru (Admin only)
- **PUT** `/submissions/:id` - Başvuru güncelleme (Admin only)
- **DELETE** `/submissions/:id` - Başvuru silme (Admin only)

## 🛡️ Güvenlik Özellikleri

- **Rate Limiting**: IP başına 100 istek/15 dakika
- **CORS Protection**: Belirli origin'lerden gelen isteklere izin
- **Password Hashing**: bcrypt ile şifre hash'leme
- **JWT Authentication**: Stateless kimlik doğrulama
- **Input Validation**: Mongoose schema validation
- **SQL Injection Protection**: MongoDB/Mongoose kullanımı

## 📝 Logging

Winston logger kullanılarak log'lar tutulur:

- **INFO**: Genel bilgi log'ları
- **DEBUG**: Debug bilgileri
- **ERROR**: Hata log'ları

## 🚨 Error Handling

API standart hata formatı kullanır:

```json
{
  "success": false,
  "error": {
    "message": "Hata mesajı",
    "code": "ERROR_CODE"
  },
}
```

## 📦 Package Yapılandırması

### Ana Package Dosyaları
- `package.json` - Proje bağımlılıkları ve script'ler
- `package-lock.json` - Lock file

### Environment
- `.env` - Environment variables
- `.env.example` - Environment template

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

Sorularınız için:
- **Email**: info@kouseng.com
- **GitHub Issues**: [GitHub Issues](https://github.com/KOU-Software-Community/kou-seng-website/issues)

---

**Geliştirici**: Kocaeli Üniversitesi Yazılım Kulübü Web Takımı
