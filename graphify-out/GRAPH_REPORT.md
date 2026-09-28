# Graph Report - kou-seng-website  (2026-09-28)

## Corpus Check
- 164 files · ~91,576 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 957 nodes · 2030 edges · 44 communities (39 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 106 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6b0d8f60`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- applyDetail.tsx
- cn
- frontend/package.json
- purge-submissions.js
- Projeye özel kurallar
- general-membership.tsx
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
- homeData.ts
- react
- announcementsController.js
- KOU SENG Website
- devDependencies
- dependencies
- authMiddleware.js
- Başvuru Dönemleri — Tasarım
- useSubmissions.ts
- publicationsController.js
- mailQueueRoutes.js
- useAuth
- scripts
- loadtest.js
- contactRoutes.js
- Backend API Endpoints
- windows-smoke.js
- eslint.config.mjs
- overrides
- tailwindcss
- api.ts
- submissionsController.js
- (admin-layout)/layout.tsx
- postcss.config.mjs
- technical-team.tsx
- admin/announcements.tsx
- data-management.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 79 edges
2. `react` - 48 edges
3. `useAuth()` - 36 edges
4. `Button()` - 26 edges
5. `next` - 24 edges
6. `@fortawesome/free-solid-svg-icons` - 22 edges
7. `Card()` - 22 edges
8. `@fortawesome/react-fontawesome` - 21 edges
9. `CardHeader()` - 20 edges
10. `CardTitle()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Veri katmanı` --references--> `updateWindow()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/controllers/applicationWindowsController.js
- `Başvuru formuna alan ekleme` --references--> `createGeneralSubmission()`  [INFERRED]
  CLAUDE.md → backend/controllers/submissionsController.js
- `Güvenlik` --references--> `adminOnly()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/middlewares/authMiddleware.js
- `Global Constraints` --references--> `adminOnly()`  [INFERRED]
  docs/superpowers/plans/2026-09-28-basvuru-donemleri.md → backend/middlewares/authMiddleware.js
- `Takım slug'ı üç kimliği birden taşıyor` --references--> `roleOnlyForCategory()`  [INFERRED]
  CLAUDE.md → backend/middlewares/authMiddleware.js

## Import Cycles
- None detected.

## Communities (44 total, 5 thin omitted)

### Community 0 - "applyDetail.tsx"
Cohesion: 0.06
Nodes (61): AnnouncementsSection(), AnnouncementsSectionProps, ContactForm(), formSchema, FormValues, RssSection(), RssSectionProps, AboutProps (+53 more)

### Community 1 - "cn"
Cohesion: 0.05
Nodes (61): DashboardLayoutProps, AdminSidebar(), NavItem, navItems, CardAction(), DialogOverlay(), DialogTrigger(), DropdownMenu() (+53 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.09
Nodes (21): name, private, version, class-variance-authority, clsx, date-fns, eslint, @fortawesome/free-regular-svg-icons (+13 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.05
Nodes (41): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+33 more)

### Community 4 - "Projeye özel kurallar"
Cohesion: 0.05
Nodes (32): Backend ESM — `node --check` yalan söylüyor, Başvuru formuna alan ekleme, Başvuruları silme (saklama süresi), Branch'ler, `check:content`, Duyuru HTML'i ve CSP, Frontend (`frontend/`), graphify (+24 more)

### Community 5 - "general-membership.tsx"
Cohesion: 0.33
Nodes (8): AdminGeneralMembership(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue()

### Community 6 - "mailQueueProcessor.js"
Cohesion: 0.13
Nodes (21): assetsDir, __dirname, sendSponsorMail(), blockToHtml(), buildMailHtml(), escapeHtml(), parseInline(), getTransporter() (+13 more)

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

### Community 11 - "MailQueueContext.tsx"
Cohesion: 0.12
Nodes (18): authHeaders(), EnqueueInput, MailQueueContext, MailQueueContextValue, MailQueueProvider(), QueueJob, QueueJobResult, QueueJobStatus (+10 more)

### Community 12 - "backend/package.json"
Cohesion: 0.09
Nodes (21): author, description, devDependencies, nodemon, keywords, license, main, name (+13 more)

### Community 13 - "index.js"
Cohesion: 0.11
Nodes (22): ConnectDB(), getHealthStatus(), clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, logger (+14 more)

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
Cohesion: 0.08
Nodes (24): RootPage(), Footer(), Header(), NavItem, navItems, NavLinkItem, Home(), ThemeToggle() (+16 more)

### Community 18 - "react"
Cohesion: 0.15
Nodes (13): AdminSponsorMail(), BLOCK_LABELS, BlockType, createBlock(), formatDate(), parseEmails(), QueueJobCard(), Input() (+5 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.28
Nodes (9): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), toSearchPattern(), announcementSchema (+1 more)

### Community 20 - "KOU SENG Website"
Cohesion: 0.14
Nodes (13): Admin Paneli, Backend, Backend Kurulumu, Frontend, Frontend Kurulumu, Genel Sayfalar, 📋 Gereksinimler, 📞 İletişim (+5 more)

### Community 21 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node, @types/react (+2 more)

### Community 22 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, json2csv, jsonwebtoken (+5 more)

### Community 23 - "authMiddleware.js"
Cohesion: 0.16
Nodes (19): createUser(), deleteUser(), getAllUsers(), updateUser(), adminOnly(), firstUserCreation(), matchesSystemKey(), protect() (+11 more)

### Community 24 - "Başvuru Dönemleri — Tasarım"
Cohesion: 0.17
Nodes (11): Admin paneli, Amaç, Başvuru Dönemleri — Tasarım, Başvuru sayfaları, Deploy, Frontend, Güvenlik, Kapsam dışı (+3 more)

### Community 25 - "useSubmissions.ts"
Cohesion: 0.15
Nodes (12): BaseSubmissionData, GeneralSubmissionData, ListSubmissionsParams, PurgeScope, SubmissionData, SubmissionListItem, SubmissionListResponse, SubmissionPagination (+4 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.26
Nodes (10): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), router (+2 more)

### Community 27 - "mailQueueRoutes.js"
Cohesion: 0.19
Nodes (12): cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob(), attachmentSchema, MailJob, mailJobSchema (+4 more)

### Community 28 - "useAuth"
Cohesion: 0.11
Nodes (23): Veri, AdminDashboardLayout(), ChangePasswordDialog(), AdminManagement(), formatRole(), AuthError, AuthUser, getStoredToken() (+15 more)

### Community 29 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, check:content, dev, lint, pm2:restart, pm2:start, pm2:stop (+1 more)

### Community 30 - "loadtest.js"
Cohesion: 0.22
Nodes (7): BASE, body(), C, N, one(), RUN, SUBMIT

### Community 31 - "contactRoutes.js"
Cohesion: 0.33
Nodes (6): createContactMessage(), deleteContactMessage(), getContactMessages(), updateContactIsRead(), contactSchema, router

### Community 32 - "Backend API Endpoints"
Cohesion: 0.25
Nodes (7): Backend API Endpoints, Duyurular (Announcements) - YAPILDI, Gelen Başvurular (Submissions), İletişim Mesajları (Contact Messages) - YAPILDI, Kimlik Doğrulama (Authentication) - YAPILDI, Kullanıcı Yönetimi (Admin) - YAPILDI, Yayınlar (Publications) - YAPILDI

### Community 33 - "windows-smoke.js"
Cohesion: 0.22
Nodes (9): api(), applicant(), BASE, expectClosed(), expectStatus(), RUN, setWindow(), submit() (+1 more)

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 38 - "submissionsController.js"
Cohesion: 0.07
Nodes (48): getWindow(), getWindows(), toDate(), updateWindow(), createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV() (+40 more)

### Community 43 - "technical-team.tsx"
Cohesion: 0.26
Nodes (10): AdminTechnicalTeam(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue() (+2 more)

### Community 44 - "admin/announcements.tsx"
Cohesion: 0.14
Nodes (18): RichTextEditor, RichTextEditorProps, RichTextEditorRef, AdminAnnouncements(), AnnouncementFormData, announcementSchema, formatDate(), Announcements() (+10 more)

### Community 46 - "data-management.tsx"
Cohesion: 0.16
Nodes (11): AdminContact(), AdminDataManagement(), Notice, ScopeOption, SCOPES, Dialog(), DialogContent(), DialogDescription() (+3 more)

## Knowledge Gaps
- **359 isolated node(s):** `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES`, `T` (+354 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 416 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `applyDetail.tsx`, `cn`, `frontend/package.json`, `Projeye özel kurallar`, `general-membership.tsx`, `submissionsController.js`, `technical-team.tsx`, `admin/announcements.tsx`, `MailQueueContext.tsx`, `data-management.tsx`, `homeData.ts`, `useSubmissions.ts`, `useAuth`?**
  _High betweenness centrality (0.131) - this node is a cross-community bridge._
- **Why does `next` connect `applyDetail.tsx` to `cn`, `frontend/package.json`, `purge-submissions.js`, `Projeye özel kurallar`, `aboutData.ts`, `MailQueueContext.tsx`, `homeData.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `@fortawesome/free-solid-svg-icons` connect `applyDetail.tsx` to `cn`, `frontend/package.json`, `aboutData.ts`, `admin/announcements.tsx`, `data-management.tsx`, `homeData.ts`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `__dirname`, `assetsDir`, `customFields` to the rest of the system?**
  _359 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `applyDetail.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.058672276764843385 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05473684210526316 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._