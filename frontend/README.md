# Frontend - KOU SENG Website

Kocaeli Üniversitesi Yazılım Kulübü web sitesinin frontend uygulaması. Next.js ve modern React teknolojileri kullanılarak geliştirilmiş responsive web uygulaması.

## 🏗️ Teknoloji Stack'i

- **Framework**: Next.js 15
- **Runtime**: React 19
- **Language**: TypeScript
- **Styling**: Shadcn/UI, Tailwind CSS
- **UI Components**: Radix UI
- **Icons**: Lucide React, FontAwesome
- **Forms**: React Hook Form + Zod
- **State Management**: React Hooks
- **HTTP Client**: Fetch API
- **Build Tool**: Turbopack
- **Linting**: ESLint

## 📋 Gereksinimler

- Node.js
- npm

## 🚀 Kurulum

### 1. Bağımlılıkları Yükleme

```bash
cd frontend
npm install
```

### 2. Environment Variables

`.env` dosyası oluşturun:

```env
# Application Configuration
NEXT_PUBLIC_APP_NAME=KOU-SENG
NEXT_PUBLIC_APP_URL=http://localhost:3000

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 3. Development Server'ı Başlatma

```bash
npm run dev
```

Uygulama `http://localhost:3000` adresinde çalışacaktır.

### 4. Production Build

```bash
npm run build
npm start
```

## 📁 Proje Yapısı

```
frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (routes)/          # Route Groups
│   │   │   ├── (admin-layout) # Admin sayfaları
│   │   │   ├── (apply-layout) # Başvuru sayfaları
│   │   │   └── (main-layout)  # Ana sayfalar
│   │   ├── globals.css        # Global stiller
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Ana sayfa
│   ├── components/            # React bileşenleri
│   │   ├── layout/           # Layout bileşenleri
│   │   ├── pages/            # Sayfa bileşenleri
│   │   ├── theme/            # Tema bileşenleri
│   │   └── ui/               # UI bileşenleri
│   ├── hooks/                # Custom React hooks
│   ├── layouts/              # Sayfa layout'ları
│   ├── lib/                  # Utility fonksiyonları
│   └── providers/            # Context providers
├── public/                   # Static dosyalar
└── data/                     # Statik veri dosyaları
```

## 🎨 UI/UX Özellikleri

### Responsive Tasarım
- Breakpoint'ler: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexbox ve Grid layout sistemleri

### Tema Sistemi
- Koyu/Açık tema desteği
- `next-themes` paketi ile tema yönetimi
- Sistem teması algılama
- Local storage ile tema kalıcılığı

### UI Bileşenleri
- **Shadcn/UI** tabanlı bileşenler
- **Tailwind CSS** ile stillendirme
- **Lucide React** ve **FontAwesome** icon'ları
- Form validation (React Hook Form + Zod)
- Loading states ve skeleton'lar

## 📄 Sayfalar ve Route'lar

### Genel Sayfalar
- `/` - Ana sayfa (Home)
- `/about` - Hakkımızda
- `/technical-team/[slug]` - Ekip detay sayfası
- `/announcements` - Duyurular
- `/publications` - Yayınlar
- `/apply` - Başvurular
- `/apply/[applySlug]` - Başvuru detay
- `/contact` - İletişim

### Admin Paneli
- `/admin/login` - Admin giriş
- `/admin/dashboard` - Ana dashboard
- `/admin/announcements` - Duyuru yönetimi
- `/admin/contact` - İletişim yönetimi
- `/admin/general-membership` - Genel üyelik
- `/admin/technical-team` - Teknik ekip yönetimi
- `/admin/technical-team/[category]` - Ekip kategori yönetimi
- `/admin/admin-management` - Admin yönetimi

## 🎯 Performans Optimizasyonları

- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic code splitting
- **Lazy Loading**: Route-based lazy loading
- **Caching**: Static generation ve ISR
- **Bundle Analysis**: Build-time optimization

## 🚀 Deployment

### Vercel Deployment
```bash
npm run build
# Vercel CLI ile deploy
vercel --prod
```

### Environment Variables (Production)
```env
# Application Configuration
NEXT_PUBLIC_APP_NAME=KOU-SENG
NEXT_PUBLIC_APP_URL=http://kouseng.com

# API Configuration
NEXT_PUBLIC_API_URL=http://api.kouseng.com
```

## 🧪 Geliştirme

### Development Scripts
```bash
npm run dev      # Development server
npm run build    # Production build
npm start        # Production server
npm run lint     # ESLint kontrolü
```

### Code Style
- **TypeScript**: Strict mode aktif
- **ESLint**: Next.js ve TypeScript kuralları
- **Prettier**: Kod formatlaması
- **Import Order**: Gruplandırılmış import'lar

## 🔒 Güvenlik

- **Content Security Policy**: XSS koruması
- **HTTPS Only**: Secure cookies
- **Input Validation**: Form validation
- **Authentication**: JWT token yönetimi

## 📊 Analytics ve Monitoring

- **Error Tracking**: Console error logging
- **Performance**: Web vitals tracking
- **User Analytics**: Sayfa görüntüleme takibi

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📞 İletişim

- **Email**: info@mail.kouseng.com
- **GitHub Issues**: [GitHub Issues](https://github.com/KOU-Software-Community/kou-seng-website/issues)

---

**Geliştirici**: Kocaeli Üniversitesi Yazılım Kulübü Web Takımı
