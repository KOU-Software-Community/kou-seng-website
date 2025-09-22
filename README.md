# KOU SENG Website

Kocaeli Üniversitesi Yazılım Kulübü'nün resmi web sitesi. Kulüp üyelerine ve potansiyel üyelere hitap eden modern ve kullanıcı dostu bir platform.

## 🚀 Özellikler

- **Responsive Tasarım**: Mobil, tablet ve desktop cihazlarda mükemmel görünüm
- **Admin Paneli**: Kulüp yöneticileri için kapsamlı yönetim arayüzü
- **Başvuru Sistemi**: Yeni üyelik başvurularının online yönetimi
- **Duyuru Sistemi**: Kulüp duyurularının dinamik paylaşımı
- **İletişim Formu**: Ziyaretçilerle etkili iletişim
- **Teknik Takım Sayfaları**: AI, Game ve Web geliştirme ekiplerinin tanıtımı
- **RSS Feed Entegrasyonu**: Haber ve güncelleme takibi
- **Koyu/Açık Tema**: Kullanıcı tercihine göre tema seçimi

## 🏗️ Proje Yapısı

Bu proje iki ana bölümden oluşmaktadır:

### Backend
- **Teknoloji**: Node.js, Express.js
- **Veritabanı**: MongoDB
- **Kimlik Doğrulama**: JWT Token
- **API Endpoints**: RESTful API

### Frontend
- **Teknoloji**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui, FontAwesome
- **State Management**: React Hooks
- **Form Management**: React Hook Form + Zod

## 📋 Gereksinimler

- Node.js
- MongoDB
- npm

## 🚀 Kurulum ve Çalıştırma

### Backend Kurulumu

```bash
cd backend
npm install
npm run dev
```

### Frontend Kurulumu

```bash
cd frontend
npm install
npm run dev
```

## 📚 Kullanım Kılavuzu

### Admin Paneli
- `/admin/login` - Admin giriş sayfası
- `/admin/dashboard` - Ana yönetim paneli
- `/admin/announcements` - Duyuru yönetimi
- `/admin/contact` - İletişim mesajları
- `/admin/technical-team` - Teknik ekip yönetimi

### Genel Sayfalar
- `/` - Ana sayfa
- `/about` - Hakkımızda
- `/technical-team/[web/ai/game]` - Teknik ekipler
- `/announcements` - Duyurular
- `/publications` - Yayınlar
- `/apply` - Başvuru formu
- `/contact` - İletişim

## 📞 İletişim

- **Email**: info@kouseng.com
- **Website**: [kouseng.com](https://kouseng.com)

---

**Geliştirici**: Kocaeli Üniversitesi Yazılım Kulübü Web Takımı