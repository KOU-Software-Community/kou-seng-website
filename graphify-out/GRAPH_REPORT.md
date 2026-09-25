# Graph Report - kou-seng-website  (2026-09-25)

## Corpus Check
- 155 files · ~83,704 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 886 nodes · 1883 edges · 37 communities (35 shown, 2 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 69 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4dfac1d4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- cn
- frontend/package.json
- purge-submissions.js
- Projeye özel kurallar
- mailQueueProcessor.js
- technical-team.tsx
- Frontend - KOU SENG Website
- dependencies
- authMiddleware.js
- Backend - KOU SENG Website API
- sponsor-mail.tsx
- backend/package.json
- index.js
- components.json
- compilerOptions
- authController.js
- homeData.ts
- admin/announcements.tsx
- announcementsController.js
- KOU SENG Website
- submissionsController.js
- dependencies
- aboutData.ts
- general-membership.tsx
- useSubmissions.ts
- publicationsController.js
- mailQueueRoutes.js
- admin-management.tsx
- loadtest.js
- contactRoutes.js
- Backend API Endpoints
- clientIp.js
- useAuth
- api.ts
- (admin-layout)/layout.tsx
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
- `Takım slug'ı üç kimliği birden taşıyor` --references--> `roleOnlyForCategory()`  [INFERRED]
  CLAUDE.md → backend/middlewares/authMiddleware.js
- `Takım slug'ı üç kimliği birden taşıyor` --references--> `AdminSidebar()`  [INFERRED]
  CLAUDE.md → frontend/src/components/layout/AdminSidebar.tsx
- `Takım slug'ı üç kimliği birden taşıyor` --references--> `getTeamDetail()`  [INFERRED]
  CLAUDE.md → frontend/src/lib/teamData.ts
- `Frontend (`frontend/`)` --references--> `cn()`  [INFERRED]
  CLAUDE.md → frontend/src/lib/utils.ts
- `Başvuru formuna alan ekleme` --references--> `createGeneralSubmission()`  [INFERRED]
  CLAUDE.md → backend/controllers/submissionsController.js

## Import Cycles
- None detected.

## Communities (37 total, 2 thin omitted)

### Community 0 - "react"
Cohesion: 0.06
Nodes (64): AnnouncementsSection(), AnnouncementsSectionProps, ContactForm(), formSchema, FormValues, NavItem, navItems, NavLinkItem (+56 more)

### Community 1 - "cn"
Cohesion: 0.05
Nodes (62): DashboardLayoutProps, AdminSidebar(), NavItem, navItems, CardAction(), DialogOverlay(), DialogTrigger(), DropdownMenu() (+54 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.04
Nodes (43): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node (+35 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.05
Nodes (41): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+33 more)

### Community 4 - "Projeye özel kurallar"
Cohesion: 0.05
Nodes (30): Backend ESM — `node --check` yalan söylüyor, Başvuruları silme (saklama süresi), `check:content`, Duyuru HTML'i ve CSP, Frontend (`frontend/`), graphify, Görsel hazırlama, İçerik (`frontend/public/data/`) (+22 more)

### Community 5 - "mailQueueProcessor.js"
Cohesion: 0.13
Nodes (22): assetsDir, __dirname, sendSponsorMail(), blockToHtml(), buildMailHtml(), escapeHtml(), parseInline(), getTransporter() (+14 more)

### Community 6 - "technical-team.tsx"
Cohesion: 0.22
Nodes (10): AdminTechnicalTeam(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue() (+2 more)

### Community 7 - "Frontend - KOU SENG Website"
Cohesion: 0.07
Nodes (27): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Development Server'ı Başlatma, 4. Production Build, Admin Paneli, 📊 Analytics ve Monitoring, Code Style, 🚀 Deployment (+19 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, class-variance-authority, clsx, date-fns, @fortawesome/fontawesome-svg-core, @fortawesome/free-brands-svg-icons, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons (+17 more)

### Community 9 - "authMiddleware.js"
Cohesion: 0.14
Nodes (20): createUser(), deleteUser(), getAllUsers(), updateUser(), adminOnly(), firstUserCreation(), matchesSystemKey(), protect() (+12 more)

### Community 10 - "Backend - KOU SENG Website API"
Cohesion: 0.08
Nodes (23): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Server'ı Başlatma, Ana Package Dosyaları, Announcements, 📚 API Endpoints, Authentication, Backend - KOU SENG Website API (+15 more)

### Community 11 - "sponsor-mail.tsx"
Cohesion: 0.09
Nodes (26): AdminSponsorMail(), BLOCK_LABELS, BlockType, createBlock(), formatDate(), parseEmails(), QueueJobCard(), authHeaders() (+18 more)

### Community 12 - "backend/package.json"
Cohesion: 0.12
Nodes (15): author, description, devDependencies, nodemon, keywords, license, main, name (+7 more)

### Community 13 - "index.js"
Cohesion: 0.15
Nodes (15): ConnectDB(), getHealthStatus(), logger, TODO: Telegram ile loglama yapılacak, rateSkip(), rateSkipAuth(), rateSkipIP(), app (+7 more)

### Community 14 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 15 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "authController.js"
Cohesion: 0.21
Nodes (9): changePassword(), getMe(), loginUser(), getSystemStatus(), generateToken(), submissionSchema, router, bcryptjs (+1 more)

### Community 17 - "homeData.ts"
Cohesion: 0.10
Nodes (20): RootPage(), Footer(), Header(), Home(), MainLayout(), MainLayoutProps, FooterData, getFooterData() (+12 more)

### Community 18 - "admin/announcements.tsx"
Cohesion: 0.13
Nodes (16): RichTextEditor, RichTextEditorProps, RichTextEditorRef, AdminAnnouncements(), AnnouncementFormData, announcementSchema, formatDate(), Announcements() (+8 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.28
Nodes (9): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), toSearchPattern(), announcementSchema (+1 more)

### Community 20 - "KOU SENG Website"
Cohesion: 0.14
Nodes (13): Admin Paneli, Backend, Backend Kurulumu, Frontend, Frontend Kurulumu, Genel Sayfalar, 📋 Gereksinimler, 📞 İletişim (+5 more)

### Community 21 - "submissionsController.js"
Cohesion: 0.26
Nodes (12): createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV(), getAllSubmissions(), getSubmissionById(), isText(), PURGE_SCOPES (+4 more)

### Community 22 - "dependencies"
Cohesion: 0.10
Nodes (19): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, json2csv, jsonwebtoken (+11 more)

### Community 23 - "aboutData.ts"
Cohesion: 0.06
Nodes (36): AboutRoute(), KvkkRoute(), metadata, TeamDetailRoute(), About(), AboutProps, Contact(), Kvkk() (+28 more)

### Community 24 - "general-membership.tsx"
Cohesion: 0.26
Nodes (10): AdminGeneralMembership(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue() (+2 more)

### Community 25 - "useSubmissions.ts"
Cohesion: 0.15
Nodes (12): BaseSubmissionData, GeneralSubmissionData, ListSubmissionsParams, PurgeScope, SubmissionData, SubmissionListItem, SubmissionListResponse, SubmissionPagination (+4 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.26
Nodes (10): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), router (+2 more)

### Community 27 - "mailQueueRoutes.js"
Cohesion: 0.31
Nodes (8): cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob(), router, upload, wakeProcessor()

### Community 28 - "admin-management.tsx"
Cohesion: 0.17
Nodes (14): AdminManagement(), formatRole(), Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogTitle() (+6 more)

### Community 30 - "loadtest.js"
Cohesion: 0.22
Nodes (7): BASE, body(), C, N, one(), RUN, SUBMIT

### Community 31 - "contactRoutes.js"
Cohesion: 0.33
Nodes (6): createContactMessage(), deleteContactMessage(), getContactMessages(), updateContactIsRead(), contactSchema, router

### Community 32 - "Backend API Endpoints"
Cohesion: 0.22
Nodes (8): Backend API Endpoints, Başvuru Formları Yönetimi (Recruitments), Duyurular (Announcements) - YAPILDI, Gelen Başvurular (Submissions), İletişim Mesajları (Contact Messages) - YAPILDI, Kimlik Doğrulama (Authentication) - YAPILDI, Kullanıcı Yönetimi (Admin) - YAPILDI, Yayınlar (Publications) - YAPILDI

### Community 34 - "clientIp.js"
Cohesion: 0.29
Nodes (7): clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, keyGenerator(), ref_node_net

### Community 35 - "useAuth"
Cohesion: 0.10
Nodes (21): AdminDashboardLayout(), ChangePasswordDialog(), AdminDashboard(), AuthError, AuthUser, getStoredToken(), LoginRequestBody, LoginResponse (+13 more)

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

## Knowledge Gaps
- **343 isolated node(s):** `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES`, `CLOUDFLARE_RANGES` (+338 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 394 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `react` to `cn`, `frontend/package.json`, `purge-submissions.js`, `Projeye özel kurallar`, `sponsor-mail.tsx`, `homeData.ts`, `aboutData.ts`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `cn`, `frontend/package.json`, `useAuth`, `Projeye özel kurallar`, `technical-team.tsx`, `sponsor-mail.tsx`, `homeData.ts`, `admin/announcements.tsx`, `general-membership.tsx`, `useSubmissions.ts`, `admin-management.tsx`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `@fortawesome/free-solid-svg-icons` connect `react` to `cn`, `frontend/package.json`, `homeData.ts`, `admin/announcements.tsx`, `aboutData.ts`, `admin-management.tsx`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **What connects `__dirname`, `assetsDir`, `customFields` to the rest of the system?**
  _343 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.06455445544554456 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05365686944634313 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.043478260869565216 - nodes in this community are weakly interconnected._