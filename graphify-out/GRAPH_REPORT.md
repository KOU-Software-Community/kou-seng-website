# Graph Report - kou-seng-website  (2026-10-08)

## Corpus Check
- 174 files · ~102,887 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 1031 nodes · 2566 edges · 53 communities (50 shown, 3 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 132 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `345710e2`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Card
- mailQueueController.js
- devDependencies
- purge-submissions.js
- teamData.ts
- general-membership.tsx
- mailQueueProcessor.js
- Frontend - KOU SENG Website
- dependencies
- aboutData.ts
- Backend - KOU SENG Website API
- sponsor-mail.tsx
- backend/package.json
- index.js
- components.json
- compilerOptions
- authController.js
- application-windows.tsx
- app/layout.tsx
- announcementsController.js
- KOU SENG Website
- kvkk/page.tsx
- dependencies
- authMiddleware.js
- contactData.ts
- useAuth
- publicationsController.js
- cn
- Input
- tailwindcss
- loadtest.js
- submissionsController.js
- Backend API Endpoints
- windows-smoke.js
- Button
- contactRoutes.js
- scripts
- api.ts
- Projeye özel kurallar
- (admin-layout)/layout.tsx
- react
- Header.tsx
- postcss.config.mjs
- Başvuru Dönemleri — Tasarım
- admin/contact.tsx
- technical-team.tsx
- eslint.config.mjs
- homeData.ts
- useSubmissions.ts
- Uygulama Tasarım Dili — Tasarım
- frontend/package.json
- clientIp.js
- ApplyLayout.tsx

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
- `Güvenlik` --references--> `adminOnly()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/middlewares/authMiddleware.js
- `Doğrulama` --references--> `PixelMark()`  [INFERRED]
  docs/superpowers/specs/2026-10-01-uygulama-tasarim-dili-design.md → frontend/src/components/layout/Pixel.tsx
- `Erişilebilirlik` --references--> `PixelMark()`  [INFERRED]
  docs/superpowers/specs/2026-10-01-uygulama-tasarim-dili-design.md → frontend/src/components/layout/Pixel.tsx
- `Mobil uygulama bölümü ve tanıtım videosu` --references--> `PixelMark()`  [INFERRED]
  docs/superpowers/specs/2026-10-01-uygulama-tasarim-dili-design.md → frontend/src/components/layout/Pixel.tsx
- `Başvuru dönemleri` --references--> `ApplicationWindow`  [INFERRED]
  CLAUDE.md → frontend/src/lib/applicationWindow.ts

## Import Cycles
- None detected.

## Communities (53 total, 3 thin omitted)

### Community 0 - "Card"
Cohesion: 0.07
Nodes (74): Global Constraints, Piksel Havası ve Tanıtım Videosu — Uygulama Planı, Review Focus, Task 1: Site geneli piksel parçaları ve kenarlık, Task 2: Koyu hero ve header markası, Task 4: Regresyon, CLAUDE.md, görüntüler ve PR, Piksel öğelerinin kuralları, AdminDashboardRoute() (+66 more)

### Community 1 - "mailQueueController.js"
Cohesion: 0.12
Nodes (25): assetsDir, __dirname, sendSponsorMail(), cancelMailJob(), createMailJob(), creatingFor, deleteMailJob(), getMailJobs() (+17 more)

### Community 2 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node, @types/react (+2 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.05
Nodes (39): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+31 more)

### Community 4 - "teamData.ts"
Cohesion: 0.25
Nodes (8): Takım slug'ı üç kimliği birden taşıyor, Achievement, Competition, getTeamDetail(), getTeamSlugs(), LeaderMessage, Project, TeamMember

### Community 5 - "general-membership.tsx"
Cohesion: 0.24
Nodes (12): AdminGeneralMembershipRoute(), AdminGeneralMembership(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl() (+4 more)

### Community 6 - "mailQueueProcessor.js"
Cohesion: 0.14
Nodes (19): blockToHtml(), buildMailHtml(), escapeHtml(), parseInline(), getTransporter(), initTransporter(), attachmentSchema, MailJob (+11 more)

### Community 7 - "Frontend - KOU SENG Website"
Cohesion: 0.07
Nodes (27): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Development Server'ı Başlatma, 4. Production Build, Admin Paneli, 📊 Analytics ve Monitoring, Code Style, 🚀 Deployment (+19 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, class-variance-authority, clsx, date-fns, @fortawesome/fontawesome-svg-core, @fortawesome/free-brands-svg-icons, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons (+17 more)

### Community 9 - "aboutData.ts"
Cohesion: 0.22
Nodes (9): AboutRoute(), AboutProps, AboutData, BoardMember, FocusArea, getAboutData(), iconMap, PageContent (+1 more)

### Community 10 - "Backend - KOU SENG Website API"
Cohesion: 0.08
Nodes (23): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Server'ı Başlatma, Ana Package Dosyaları, Announcements, 📚 API Endpoints, Authentication, Backend - KOU SENG Website API (+15 more)

### Community 11 - "sponsor-mail.tsx"
Cohesion: 0.10
Nodes (27): AdminSponsorMailRoute(), AdminSponsorMail(), BLOCK_LABELS, BlockType, createBlock(), formatDate(), parseEmails(), QueueJobCard() (+19 more)

### Community 12 - "backend/package.json"
Cohesion: 0.10
Nodes (20): author, description, devDependencies, nodemon, keywords, license, main, name (+12 more)

### Community 13 - "index.js"
Cohesion: 0.13
Nodes (16): ConnectDB(), getHealthStatus(), logger, rateSkip(), rateSkipAuth(), rateSkipIP(), app, corsOptions (+8 more)

### Community 14 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 15 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "authController.js"
Cohesion: 0.19
Nodes (10): changePassword(), DUMMY_HASH, getMe(), loginUser(), getSystemStatus(), generateToken(), submissionSchema, router (+2 more)

### Community 17 - "application-windows.tsx"
Cohesion: 0.13
Nodes (24): Başvuru Dönemleri — Uygulama Planı, Global Constraints, Review Focus, Task 1: Pencere kuralı (saf fonksiyonlar) ve birim testleri, Task 4: Frontend veri katmanı, Task 5: Başvuru sayfaları durumu backend'den okur, JSON temizliği, Task 6: Admin paneli "Başvuru Dönemleri" sayfası, AdminApplicationWindowsRoute() (+16 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.12
Nodes (13): Frontend (`frontend/`), İçerik (`frontend/public/data/`), Klasör yapısı, Komutlar, Ortam değişkenleri, Proje, jakarta, metadata (+5 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.29
Nodes (9): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), announcementSchema, router (+1 more)

### Community 20 - "KOU SENG Website"
Cohesion: 0.14
Nodes (13): Admin Paneli, Backend, Backend Kurulumu, Frontend, Frontend Kurulumu, Genel Sayfalar, 📋 Gereksinimler, 📞 İletişim (+5 more)

### Community 21 - "kvkk/page.tsx"
Cohesion: 0.33
Nodes (6): KvkkRoute(), metadata, Kvkk(), getKvkkData(), KvkkData, KvkkSection

### Community 22 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, json2csv, jsonwebtoken (+5 more)

### Community 23 - "authMiddleware.js"
Cohesion: 0.18
Nodes (16): createUser(), deleteUser(), getAllUsers(), updateUser(), adminOnly(), firstUserCreation(), matchesSystemKey(), protect() (+8 more)

### Community 24 - "contactData.ts"
Cohesion: 0.29
Nodes (5): ContactData, ContactInfo, MapData, PageContent, SocialMediaLink

### Community 25 - "useAuth"
Cohesion: 0.13
Nodes (16): Announcement, ApiResponse, CreateAnnouncementRequest, UpdateAnnouncementRequest, AuthError, AuthUser, getStoredToken(), LoginRequestBody (+8 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.26
Nodes (10): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), router (+2 more)

### Community 27 - "cn"
Cohesion: 0.06
Nodes (64): AdminDashboardLayout(), DashboardLayoutProps, AdminSidebar(), NavItem, navItems, ThemeToggle(), DropdownMenu(), DropdownMenuCheckboxItem() (+56 more)

### Community 28 - "Input"
Cohesion: 0.21
Nodes (18): AdminDataRoute(), AnnouncementsRoute(), ChangePasswordDialog(), AdminDataManagement(), Notice, ScopeOption, SCOPES, Announcements() (+10 more)

### Community 30 - "loadtest.js"
Cohesion: 0.12
Nodes (13): BASE, body(), C, N, one(), RUN, SUBMIT, Global Constraints (+5 more)

### Community 31 - "submissionsController.js"
Cohesion: 0.09
Nodes (37): getWindow(), getWindows(), toDate(), updateWindow(), createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV() (+29 more)

### Community 32 - "Backend API Endpoints"
Cohesion: 0.25
Nodes (7): Backend API Endpoints, Duyurular (Announcements) - YAPILDI, Gelen Başvurular (Submissions), İletişim Mesajları (Contact Messages) - YAPILDI, Kimlik Doğrulama (Authentication) - YAPILDI, Kullanıcı Yönetimi (Admin) - YAPILDI, Yayınlar (Publications) - YAPILDI

### Community 33 - "windows-smoke.js"
Cohesion: 0.24
Nodes (8): api(), applicant(), BASE, expectClosed(), expectStatus(), RUN, setWindow(), submit()

### Community 34 - "Button"
Cohesion: 0.21
Nodes (15): AdminAnnouncementsRoute(), RichTextEditor, RichTextEditorProps, RichTextEditorRef, AdminAnnouncements(), AnnouncementFormData, announcementSchema, formatDate() (+7 more)

### Community 35 - "contactRoutes.js"
Cohesion: 0.33
Nodes (6): createContactMessage(), deleteContactMessage(), getContactMessages(), updateContactIsRead(), contactSchema, router

### Community 36 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, check:content, dev, lint, pm2:restart, pm2:start, pm2:stop (+1 more)

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 38 - "Projeye özel kurallar"
Cohesion: 0.12
Nodes (17): Backend ESM — `node --check` yalan söylüyor, Başvuru dönemleri, Başvuruları silme (saklama süresi), Branch'ler, `check:content`, Commit, PR ve dokümanlarda yapay zekâ izi yok, Duyuru HTML'i ve CSP, graphify (+9 more)

### Community 39 - "(admin-layout)/layout.tsx"
Cohesion: 0.60
Nodes (3): RoutesLayout(), EmptyLayout(), EmptyLayoutProps

### Community 40 - "react"
Cohesion: 0.23
Nodes (11): AdminManagementRoute(), AdminManagement(), formatRole(), DialogFooter(), Label(), CreateUserRequest, UpdateUserRequest, UserResponse (+3 more)

### Community 41 - "Header.tsx"
Cohesion: 0.20
Nodes (12): RoutesLayout(), Footer(), Header(), NavItem, navItems, NavLinkItem, MainLayout(), MainLayoutProps (+4 more)

### Community 43 - "Başvuru Dönemleri — Tasarım"
Cohesion: 0.15
Nodes (12): Amaç, Backend, Başvuru Dönemleri — Tasarım, Deploy, Dokümantasyon, Endpoint'ler, Güvenlik, Kapsam dışı (+4 more)

### Community 44 - "admin/contact.tsx"
Cohesion: 0.23
Nodes (9): AdminContactRoute(), AdminContact(), Separator(), ContactFormValues, ContactListResponse, ContactMessage, ContactResponse, useContact() (+1 more)

### Community 45 - "technical-team.tsx"
Cohesion: 0.29
Nodes (10): AdminTechnicalTeamRoute(), AdminTechnicalTeam(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl() (+2 more)

### Community 47 - "homeData.ts"
Cohesion: 0.14
Nodes (15): Task 3: Mobil uygulama bölümü ve tanıtım videosu, RootPage(), AnnouncementsData, AppData, ClubFeature, ClubIntroductionData, getHomeData(), HeroButton (+7 more)

### Community 48 - "useSubmissions.ts"
Cohesion: 0.15
Nodes (12): BaseSubmissionData, GeneralSubmissionData, ListSubmissionsParams, PurgeScope, SubmissionData, SubmissionListItem, SubmissionListResponse, SubmissionPagination (+4 more)

### Community 49 - "Uygulama Tasarım Dili — Tasarım"
Cohesion: 0.17
Nodes (11): Amaç, Ana sayfa hero'su: koyu bant, Deploy, Diğer düzeltmeler, Doğrulama, Erişilebilirlik, Header, Kapsam dışı (+3 more)

### Community 50 - "frontend/package.json"
Cohesion: 0.09
Nodes (21): name, overrides, postcss, private, version, class-variance-authority, date-fns, eslint (+13 more)

### Community 51 - "clientIp.js"
Cohesion: 0.29
Nodes (6): clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, keyGenerator()

### Community 52 - "ApplyLayout.tsx"
Cohesion: 0.60
Nodes (3): RoutesLayout(), ApplyLayout(), ApplyLayoutProps

## Knowledge Gaps
- **382 isolated node(s):** `DUMMY_HASH`, `__dirname`, `assetsDir`, `creatingFor`, `customFields` (+377 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 422 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `Card`, `Button`, `general-membership.tsx`, `Header.tsx`, `sponsor-mail.tsx`, `admin/contact.tsx`, `technical-team.tsx`, `useSubmissions.ts`, `application-windows.tsx`, `frontend/package.json`, `useAuth`, `cn`, `Input`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `next` connect `Card` to `purge-submissions.js`, `Header.tsx`, `sponsor-mail.tsx`, `app/layout.tsx`, `frontend/package.json`, `ApplyLayout.tsx`, `kvkk/page.tsx`, `cn`?**
  _High betweenness centrality (0.069) - this node is a cross-community bridge._
- **Why does `ApplicationWindow` connect `application-windows.tsx` to `Başvuru Dönemleri — Tasarım`, `teamData.ts`, `Projeye özel kurallar`, `submissionsController.js`?**
  _High betweenness centrality (0.067) - this node is a cross-community bridge._
- **What connects `DUMMY_HASH`, `__dirname`, `assetsDir` to the rest of the system?**
  _382 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Card` be split into smaller, more focused modules?**
  _Cohesion score 0.07356235997012696 - nodes in this community are weakly interconnected._
- **Should `mailQueueController.js` be split into smaller, more focused modules?**
  _Cohesion score 0.11596638655462185 - nodes in this community are weakly interconnected._
- **Should `purge-submissions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.053877551020408164 - nodes in this community are weakly interconnected._