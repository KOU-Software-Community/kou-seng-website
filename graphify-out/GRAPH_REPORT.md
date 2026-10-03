# Graph Report - kou-seng-website  (2026-10-03)

## Corpus Check
- 174 files · ~102,498 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 1026 nodes · 2554 edges · 45 communities (43 shown, 2 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 130 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `695fe3c4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- mailQueueController.js
- devDependencies
- purge-submissions.js
- teamData.ts
- logger.js
- mailQueueProcessor.js
- Frontend - KOU SENG Website
- dependencies
- aboutData.ts
- Backend - KOU SENG Website API
- MailQueueContext.tsx
- backend/package.json
- index.js
- components.json
- compilerOptions
- authController.js
- application-windows.tsx
- Projeye özel kurallar
- announcementsController.js
- KOU SENG Website
- next
- dependencies
- authMiddleware.js
- rateSkip.js
- useAuth.ts
- publicationsController.js
- cn
- MainLayout.tsx
- sitemap.ts
- loadtest.js
- submissionsController.js
- Backend API Endpoints
- windows-smoke.js
- Footer.tsx
- contactRoutes.js
- scripts
- api.ts
- ApplyLayout.tsx
- (admin-layout)/layout.tsx
- Uygulama Tasarım Dili — Tasarım
- postcss.config.mjs
- eslint.config.mjs
- homeData.ts
- frontend/package.json

## God Nodes (most connected - your core abstractions)
1. `cn()` - 87 edges
2. `Button()` - 56 edges
3. `react` - 50 edges
4. `Card()` - 46 edges
5. `CardHeader()` - 40 edges
6. `CardTitle()` - 40 edges
7. `CardContent()` - 39 edges
8. `useAuth()` - 36 edges
9. `PixelMark()` - 34 edges
10. `Input()` - 33 edges

## Surprising Connections (you probably didn't know these)
- `Başvuru formuna alan ekleme` --references--> `createGeneralSubmission()`  [INFERRED]
  CLAUDE.md → backend/controllers/submissionsController.js
- `Global Constraints` --references--> `PixelMark()`  [INFERRED]
  docs/superpowers/plans/2026-10-01-piksel-havasi-ve-video.md → frontend/src/components/layout/Pixel.tsx
- `Doğrulama` --references--> `PixelMark()`  [INFERRED]
  docs/superpowers/specs/2026-10-01-uygulama-tasarim-dili-design.md → frontend/src/components/layout/Pixel.tsx
- `Erişilebilirlik` --references--> `PixelMark()`  [INFERRED]
  docs/superpowers/specs/2026-10-01-uygulama-tasarim-dili-design.md → frontend/src/components/layout/Pixel.tsx
- `Mobil uygulama bölümü ve tanıtım videosu` --references--> `PixelMark()`  [INFERRED]
  docs/superpowers/specs/2026-10-01-uygulama-tasarim-dili-design.md → frontend/src/components/layout/Pixel.tsx

## Import Cycles
- None detected.

## Communities (45 total, 2 thin omitted)

### Community 0 - "Button"
Cohesion: 0.05
Nodes (135): AdminManagementRoute(), AdminAnnouncementsRoute(), AdminContactRoute(), AdminDataRoute(), AdminGeneralMembershipRoute(), AdminDashboardRoute(), AdminSponsorMailRoute(), AdminTechnicalTeamRoute() (+127 more)

### Community 1 - "mailQueueController.js"
Cohesion: 0.16
Nodes (19): assetsDir, __dirname, sendSponsorMail(), cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob() (+11 more)

### Community 2 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node, @types/react (+2 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.06
Nodes (35): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+27 more)

### Community 4 - "teamData.ts"
Cohesion: 0.21
Nodes (10): TeamDetailRoute(), TeamDetailProps, Achievement, Competition, getTeamDetail(), getTeamSlugs(), LeaderMessage, Project (+2 more)

### Community 5 - "logger.js"
Cohesion: 0.15
Nodes (9): ConnectDB(), getHealthStatus(), getSystemStatus(), logger, announcementSchema, contactSchema, submissionSchema, router (+1 more)

### Community 6 - "mailQueueProcessor.js"
Cohesion: 0.13
Nodes (19): blockToHtml(), buildMailHtml(), escapeHtml(), parseInline(), getTransporter(), initTransporter(), attachmentSchema, MailJob (+11 more)

### Community 7 - "Frontend - KOU SENG Website"
Cohesion: 0.07
Nodes (27): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Development Server'ı Başlatma, 4. Production Build, Admin Paneli, 📊 Analytics ve Monitoring, Code Style, 🚀 Deployment (+19 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, class-variance-authority, clsx, date-fns, @fortawesome/fontawesome-svg-core, @fortawesome/free-brands-svg-icons, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons (+17 more)

### Community 9 - "aboutData.ts"
Cohesion: 0.09
Nodes (21): AboutRoute(), KvkkRoute(), metadata, AboutProps, Kvkk(), AboutData, BoardMember, FocusArea (+13 more)

### Community 10 - "Backend - KOU SENG Website API"
Cohesion: 0.08
Nodes (23): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Server'ı Başlatma, Ana Package Dosyaları, Announcements, 📚 API Endpoints, Authentication, Backend - KOU SENG Website API (+15 more)

### Community 11 - "MailQueueContext.tsx"
Cohesion: 0.11
Nodes (19): authHeaders(), EnqueueInput, MailQueueContext, MailQueueContextValue, MailQueueProvider(), QueueJob, QueueJobResult, QueueJobStatus (+11 more)

### Community 12 - "backend/package.json"
Cohesion: 0.12
Nodes (15): author, description, devDependencies, nodemon, keywords, license, main, name (+7 more)

### Community 13 - "index.js"
Cohesion: 0.13
Nodes (14): clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, app, corsOptions, formLimiter (+6 more)

### Community 14 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 15 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "authController.js"
Cohesion: 0.27
Nodes (8): changePassword(), DUMMY_HASH, getMe(), loginUser(), generateToken(), router, bcryptjs, jsonwebtoken

### Community 17 - "application-windows.tsx"
Cohesion: 0.11
Nodes (28): Başvuru Dönemleri — Uygulama Planı, Global Constraints, Review Focus, Task 1: Pencere kuralı (saf fonksiyonlar) ve birim testleri, Task 4: Frontend veri katmanı, Task 5: Başvuru sayfaları durumu backend'den okur, JSON temizliği, Task 6: Admin paneli "Başvuru Dönemleri" sayfası, AdminApplicationWindowsRoute() (+20 more)

### Community 18 - "Projeye özel kurallar"
Cohesion: 0.06
Nodes (31): Backend ESM — `node --check` yalan söylüyor, Başvuru dönemleri, Başvuru formuna alan ekleme, Başvuruları silme (saklama süresi), Branch'ler, `check:content`, Commit, PR ve dokümanlarda yapay zekâ izi yok, Duyuru HTML'i ve CSP (+23 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.42
Nodes (7): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), router

### Community 20 - "KOU SENG Website"
Cohesion: 0.14
Nodes (13): Admin Paneli, Backend, Backend Kurulumu, Frontend, Frontend Kurulumu, Genel Sayfalar, 📋 Gereksinimler, 📞 İletişim (+5 more)

### Community 21 - "next"
Cohesion: 0.22
Nodes (6): PublicationsRoute(), NavItem, navItems, NavLinkItem, RSS_ENABLED, next

### Community 22 - "dependencies"
Cohesion: 0.10
Nodes (19): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, json2csv, jsonwebtoken (+11 more)

### Community 23 - "authMiddleware.js"
Cohesion: 0.12
Nodes (21): createUser(), deleteUser(), getAllUsers(), updateUser(), adminOnly(), firstUserCreation(), matchesSystemKey(), protect() (+13 more)

### Community 24 - "rateSkip.js"
Cohesion: 0.24
Nodes (7): rateSkip(), rateSkipAuth(), rateSkipIP(), limiter, issuedBeforePasswordChange(), changed, sec

### Community 25 - "useAuth.ts"
Cohesion: 0.05
Nodes (35): Veri, Announcement, ApiResponse, CreateAnnouncementRequest, UpdateAnnouncementRequest, AuthError, AuthUser, getStoredToken() (+27 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.36
Nodes (8): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), rss-parser

### Community 27 - "cn"
Cohesion: 0.06
Nodes (64): AdminDashboardLayout(), DashboardLayoutProps, AdminSidebar(), NavItem, navItems, ThemeToggle(), DropdownMenu(), DropdownMenuCheckboxItem() (+56 more)

### Community 28 - "MainLayout.tsx"
Cohesion: 0.39
Nodes (6): RootPage(), RoutesLayout(), Header(), MainLayout(), MainLayoutProps, getHomeData()

### Community 29 - "sitemap.ts"
Cohesion: 0.43
Nodes (6): ApplicationEntry, getApplicationSlugs(), getBaseUrl(), getTeamSlugs(), sitemap(), TeamFileEntry

### Community 30 - "loadtest.js"
Cohesion: 0.12
Nodes (13): BASE, body(), C, N, one(), RUN, SUBMIT, Global Constraints (+5 more)

### Community 31 - "submissionsController.js"
Cohesion: 0.08
Nodes (42): getWindow(), getWindows(), toDate(), updateWindow(), createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV() (+34 more)

### Community 32 - "Backend API Endpoints"
Cohesion: 0.25
Nodes (7): Backend API Endpoints, Duyurular (Announcements) - YAPILDI, Gelen Başvurular (Submissions), İletişim Mesajları (Contact Messages) - YAPILDI, Kimlik Doğrulama (Authentication) - YAPILDI, Kullanıcı Yönetimi (Admin) - YAPILDI, Yayınlar (Publications) - YAPILDI

### Community 33 - "windows-smoke.js"
Cohesion: 0.24
Nodes (8): api(), applicant(), BASE, expectClosed(), expectStatus(), RUN, setWindow(), submit()

### Community 34 - "Footer.tsx"
Cohesion: 0.60
Nodes (4): Footer(), FooterData, getFooterData(), iconMap

### Community 35 - "contactRoutes.js"
Cohesion: 0.48
Nodes (5): createContactMessage(), deleteContactMessage(), getContactMessages(), updateContactIsRead(), router

### Community 36 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, check:content, dev, lint, pm2:restart, pm2:start, pm2:stop (+1 more)

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 38 - "ApplyLayout.tsx"
Cohesion: 0.60
Nodes (3): RoutesLayout(), ApplyLayout(), ApplyLayoutProps

### Community 39 - "(admin-layout)/layout.tsx"
Cohesion: 0.60
Nodes (3): RoutesLayout(), EmptyLayout(), EmptyLayoutProps

### Community 41 - "Uygulama Tasarım Dili — Tasarım"
Cohesion: 0.10
Nodes (19): Global Constraints, Piksel Havası ve Tanıtım Videosu — Uygulama Planı, Review Focus, Task 1: Site geneli piksel parçaları ve kenarlık, Task 2: Koyu hero ve header markası, Task 4: Regresyon, CLAUDE.md, görüntüler ve PR, Amaç, Ana sayfa hero'su: koyu bant (+11 more)

### Community 47 - "homeData.ts"
Cohesion: 0.17
Nodes (11): AnnouncementsData, AppData, ClubFeature, ClubIntroductionData, HeroButton, HeroData, HeroStat, HomeData (+3 more)

### Community 50 - "frontend/package.json"
Cohesion: 0.09
Nodes (21): name, overrides, postcss, private, version, class-variance-authority, date-fns, eslint (+13 more)

## Knowledge Gaps
- **380 isolated node(s):** `DUMMY_HASH`, `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES` (+375 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 419 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Button` to `Footer.tsx`, `MailQueueContext.tsx`, `application-windows.tsx`, `frontend/package.json`, `next`, `useAuth.ts`, `cn`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `Button`, `Footer.tsx`, `purge-submissions.js`, `teamData.ts`, `ApplyLayout.tsx`, `aboutData.ts`, `MailQueueContext.tsx`, `application-windows.tsx`, `Projeye özel kurallar`, `frontend/package.json`, `cn`, `sitemap.ts`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Why does `ApplicationWindow` connect `application-windows.tsx` to `Projeye özel kurallar`, `submissionsController.js`, `authMiddleware.js`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **What connects `DUMMY_HASH`, `__dirname`, `assetsDir` to the rest of the system?**
  _380 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.0510216203373723 - nodes in this community are weakly interconnected._
- **Should `purge-submissions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05757575757575758 - nodes in this community are weakly interconnected._
- **Should `logger.js` be split into smaller, more focused modules?**
  _Cohesion score 0.14619883040935672 - nodes in this community are weakly interconnected._