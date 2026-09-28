# Graph Report - kou-seng-website  (2026-09-28)

## Corpus Check
- 157 files · ~88,977 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 914 nodes · 1926 edges · 43 communities (41 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 83 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0af77215`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- applyDetail.tsx
- cn
- frontend/package.json
- purge-submissions.js
- Projeye özel kurallar
- mailQueueProcessor.js
- mailController.js
- Frontend - KOU SENG Website
- dependencies
- aboutData.ts
- Backend - KOU SENG Website API
- useMailDrafts.ts
- backend/package.json
- index.js
- components.json
- compilerOptions
- mongoose
- homeData.ts
- react
- announcementsController.js
- KOU SENG Website
- submissionsController.js
- dependencies
- authMiddleware.js
- Başvuru Dönemleri — Tasarım
- useSubmissions.ts
- publicationsController.js
- mailQueueRoutes.js
- useUser.ts
- useContact.ts
- loadtest.js
- contactRoutes.js
- Backend API Endpoints
- userRoutes.js
- clientIp.js
- useAuth
- MailQueueContext.tsx
- api.ts
- Review Focus
- (admin-layout)/layout.tsx
- useAuth.ts
- Backend
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 79 edges
2. `react` - 47 edges
3. `useAuth()` - 34 edges
4. `Button()` - 26 edges
5. `next` - 24 edges
6. `@fortawesome/free-solid-svg-icons` - 22 edges
7. `Card()` - 22 edges
8. `@fortawesome/react-fontawesome` - 21 edges
9. `CardHeader()` - 20 edges
10. `CardTitle()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Güvenlik` --references--> `adminOnly()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/middlewares/authMiddleware.js
- `Başvuru formuna alan ekleme` --references--> `createGeneralSubmission()`  [INFERRED]
  CLAUDE.md → backend/controllers/submissionsController.js
- `İlk admin oluşturma (deploy edilmiş sunucuda)` --references--> `createUser()`  [INFERRED]
  CLAUDE.md → backend/controllers/userController.js
- `Endpoint'ler` --references--> `adminOnly()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/middlewares/authMiddleware.js
- `Takım slug'ı üç kimliği birden taşıyor` --references--> `roleOnlyForCategory()`  [INFERRED]
  CLAUDE.md → backend/middlewares/authMiddleware.js

## Import Cycles
- None detected.

## Communities (43 total, 2 thin omitted)

### Community 0 - "applyDetail.tsx"
Cohesion: 0.06
Nodes (56): AnnouncementsSection(), AnnouncementsSectionProps, formSchema, FormValues, RssSection(), RssSectionProps, AboutProps, AdminLogin() (+48 more)

### Community 1 - "cn"
Cohesion: 0.05
Nodes (63): Takım slug'ı üç kimliği birden taşıyor, DashboardLayoutProps, AdminSidebar(), NavItem, navItems, CardAction(), DialogOverlay(), DialogTrigger() (+55 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.04
Nodes (44): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node (+36 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.05
Nodes (40): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+32 more)

### Community 4 - "Projeye özel kurallar"
Cohesion: 0.07
Nodes (26): Backend ESM — `node --check` yalan söylüyor, Başvuruları silme (saklama süresi), Branch'ler, `check:content`, Duyuru HTML'i ve CSP, Frontend (`frontend/`), graphify, Görsel hazırlama (+18 more)

### Community 5 - "mailQueueProcessor.js"
Cohesion: 0.26
Nodes (12): blockToHtml(), buildMailHtml(), escapeHtml(), parseInline(), assetsDir, __dirname, processJob(), processJobs() (+4 more)

### Community 6 - "mailController.js"
Cohesion: 0.19
Nodes (10): assetsDir, __dirname, sendSponsorMail(), getTransporter(), initTransporter(), router, upload, multer (+2 more)

### Community 7 - "Frontend - KOU SENG Website"
Cohesion: 0.07
Nodes (27): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Development Server'ı Başlatma, 4. Production Build, Admin Paneli, 📊 Analytics ve Monitoring, Code Style, 🚀 Deployment (+19 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, class-variance-authority, clsx, date-fns, @fortawesome/fontawesome-svg-core, @fortawesome/free-brands-svg-icons, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons (+17 more)

### Community 9 - "aboutData.ts"
Cohesion: 0.07
Nodes (30): AboutRoute(), KvkkRoute(), metadata, TeamDetailRoute(), About(), Kvkk(), TeamDetail(), BoardMember (+22 more)

### Community 10 - "Backend - KOU SENG Website API"
Cohesion: 0.08
Nodes (23): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Server'ı Başlatma, Ana Package Dosyaları, Announcements, 📚 API Endpoints, Authentication, Backend - KOU SENG Website API (+15 more)

### Community 11 - "useMailDrafts.ts"
Cohesion: 0.21
Nodes (10): DraftInput, idbOp(), MailDraft, MailDraftAttachment, openDB(), useMailDrafts(), MailBlock, SendMailPayload (+2 more)

### Community 12 - "backend/package.json"
Cohesion: 0.10
Nodes (20): author, description, devDependencies, nodemon, keywords, license, main, name (+12 more)

### Community 13 - "index.js"
Cohesion: 0.16
Nodes (15): ConnectDB(), getHealthStatus(), logger, TODO: Telegram ile loglama yapılacak, rateSkip(), rateSkipAuth(), rateSkipIP(), app (+7 more)

### Community 14 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 15 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "mongoose"
Cohesion: 0.15
Nodes (12): changePassword(), getMe(), loginUser(), getSystemStatus(), generateToken(), announcementSchema, contactSchema, submissionSchema (+4 more)

### Community 17 - "homeData.ts"
Cohesion: 0.08
Nodes (24): RootPage(), Footer(), Header(), NavItem, navItems, NavLinkItem, Home(), ThemeToggle() (+16 more)

### Community 18 - "react"
Cohesion: 0.06
Nodes (59): RichTextEditor, RichTextEditorProps, RichTextEditorRef, AdminAnnouncements(), AnnouncementFormData, announcementSchema, formatDate(), AdminDataManagement() (+51 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.30
Nodes (9): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), toSearchPattern(), router (+1 more)

### Community 20 - "KOU SENG Website"
Cohesion: 0.14
Nodes (13): Admin Paneli, Backend, Backend Kurulumu, Frontend, Frontend Kurulumu, Genel Sayfalar, 📋 Gereksinimler, 📞 İletişim (+5 more)

### Community 21 - "submissionsController.js"
Cohesion: 0.20
Nodes (16): createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV(), getAllSubmissions(), getSubmissionById(), isText(), PURGE_SCOPES (+8 more)

### Community 22 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, json2csv, jsonwebtoken (+5 more)

### Community 23 - "authMiddleware.js"
Cohesion: 0.23
Nodes (12): adminOnly(), firstUserCreation(), matchesSystemKey(), protect(), roleOnlyForCategory(), roleOnlyForSubmission(), sponsorOrAdmin(), Backend (`backend/`) (+4 more)

### Community 24 - "Başvuru Dönemleri — Tasarım"
Cohesion: 0.15
Nodes (12): Admin paneli, Amaç, Başvuru Dönemleri — Tasarım, Başvuru sayfaları, Deploy, Dokümantasyon, Frontend, Güvenlik (+4 more)

### Community 25 - "useSubmissions.ts"
Cohesion: 0.15
Nodes (12): BaseSubmissionData, GeneralSubmissionData, ListSubmissionsParams, PurgeScope, SubmissionData, SubmissionListItem, SubmissionListResponse, SubmissionPagination (+4 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.33
Nodes (8): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), router

### Community 27 - "mailQueueRoutes.js"
Cohesion: 0.22
Nodes (10): cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob(), attachmentSchema, MailJob, mailJobSchema (+2 more)

### Community 28 - "useUser.ts"
Cohesion: 0.20
Nodes (7): AdminManagement(), formatRole(), CreateUserRequest, UpdateUserRequest, UserResponse, useUser(), UseUserReturn

### Community 29 - "useContact.ts"
Cohesion: 0.18
Nodes (8): ContactForm(), AdminContact(), ContactFormValues, ContactListResponse, ContactMessage, ContactResponse, useContact(), UseContactReturn

### Community 30 - "loadtest.js"
Cohesion: 0.22
Nodes (7): BASE, body(), C, N, one(), RUN, SUBMIT

### Community 31 - "contactRoutes.js"
Cohesion: 0.48
Nodes (5): createContactMessage(), deleteContactMessage(), getContactMessages(), updateContactIsRead(), router

### Community 32 - "Backend API Endpoints"
Cohesion: 0.25
Nodes (7): Backend API Endpoints, Duyurular (Announcements) - YAPILDI, Gelen Başvurular (Submissions), İletişim Mesajları (Contact Messages) - YAPILDI, Kimlik Doğrulama (Authentication) - YAPILDI, Kullanıcı Yönetimi (Admin) - YAPILDI, Yayınlar (Publications) - YAPILDI

### Community 33 - "userRoutes.js"
Cohesion: 0.31
Nodes (7): createUser(), deleteUser(), getAllUsers(), updateUser(), MIN_PASSWORD_LENGTH, UserSchema, router

### Community 34 - "clientIp.js"
Cohesion: 0.29
Nodes (7): clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, keyGenerator(), ref_node_net

### Community 35 - "useAuth"
Cohesion: 0.20
Nodes (9): AdminDashboardLayout(), ChangePasswordDialog(), AdminDashboard(), setStoredToken(), useAuth(), StatusData, StatusResponse, useStatus() (+1 more)

### Community 36 - "MailQueueContext.tsx"
Cohesion: 0.25
Nodes (8): authHeaders(), EnqueueInput, MailQueueContext, MailQueueContextValue, MailQueueProvider(), QueueJob, QueueJobResult, QueueJobStatus

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 38 - "Review Focus"
Cohesion: 0.25
Nodes (8): Review Focus, Task 1: Pencere kuralı (saf fonksiyonlar) ve birim testleri, Task 2: Model, GET/PATCH endpoint'leri ve smoke betiğinin yetki/doğrulama kısmı, Task 4: Frontend veri katmanı, Task 5: Başvuru sayfaları durumu backend'den okur, JSON temizliği, Task 6: Admin paneli "Başvuru Dönemleri" sayfası, ok(), Application

### Community 40 - "useAuth.ts"
Cohesion: 0.25
Nodes (7): AuthError, AuthUser, getStoredToken(), LoginRequestBody, LoginResponse, MIN_PASSWORD_LENGTH, UseAuthReturn

### Community 41 - "Backend"
Cohesion: 0.40
Nodes (5): Backend, Endpoint'ler, Mantık, Veri, User

## Knowledge Gaps
- **355 isolated node(s):** `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES`, `CLOUDFLARE_RANGES` (+350 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 408 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `applyDetail.tsx`, `cn`, `frontend/package.json`, `useAuth`, `MailQueueContext.tsx`, `useAuth.ts`, `useMailDrafts.ts`, `homeData.ts`, `useSubmissions.ts`, `useUser.ts`, `useContact.ts`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `next` connect `applyDetail.tsx` to `cn`, `frontend/package.json`, `purge-submissions.js`, `Projeye özel kurallar`, `MailQueueContext.tsx`, `aboutData.ts`, `homeData.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `@fortawesome/free-solid-svg-icons` connect `applyDetail.tsx` to `cn`, `frontend/package.json`, `aboutData.ts`, `homeData.ts`, `react`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `__dirname`, `assetsDir`, `customFields` to the rest of the system?**
  _355 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `applyDetail.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06374085684430512 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.052614052614052616 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._