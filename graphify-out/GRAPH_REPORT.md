# Graph Report - kou-seng-website  (2026-09-28)

## Corpus Check
- 166 files · ~92,330 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 964 nodes · 2078 edges · 49 communities (45 shown, 4 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 106 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `583b9e8d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- card.tsx
- sidebar.tsx
- frontend/package.json
- purge-submissions.js
- react
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
- Projeye özel kurallar
- announcementsController.js
- KOU SENG Website
- devDependencies
- dependencies
- authMiddleware.js
- Başvuru Dönemleri — Tasarım
- applyDetail.tsx
- publicationsController.js
- cn
- useAuth
- scripts
- loadtest.js
- logger.js
- Backend API Endpoints
- windows-smoke.js
- eslint.config.mjs
- dropdown-menu.tsx
- tailwindcss
- api.ts
- submissionsController.js
- (admin-layout)/layout.tsx
- mongoose
- sponsor-mail.tsx
- postcss.config.mjs
- technical-team.tsx
- admin/announcements.tsx
- next
- data-management.tsx
- rateSkip.js
- admin/contact.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 81 edges
2. `react` - 49 edges
3. `useAuth()` - 36 edges
4. `Button()` - 27 edges
5. `next` - 24 edges
6. `Card()` - 23 edges
7. `@fortawesome/free-solid-svg-icons` - 22 edges
8. `@fortawesome/react-fontawesome` - 21 edges
9. `CardHeader()` - 21 edges
10. `CardTitle()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Veri katmanı` --references--> `updateWindow()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/controllers/applicationWindowsController.js
- `Başvuru formuna alan ekleme` --references--> `createGeneralSubmission()`  [INFERRED]
  CLAUDE.md → backend/controllers/submissionsController.js
- `Güvenlik` --references--> `adminOnly()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/middlewares/authMiddleware.js
- `Takım slug'ı üç kimliği birden taşıyor` --references--> `roleOnlyForCategory()`  [INFERRED]
  CLAUDE.md → backend/middlewares/authMiddleware.js
- `Task 2: Model, GET/PATCH endpoint'leri ve smoke betiğinin yetki/doğrulama kısmı` --references--> `protect()`  [INFERRED]
  docs/superpowers/plans/2026-09-28-basvuru-donemleri.md → backend/middlewares/authMiddleware.js

## Import Cycles
- None detected.

## Communities (49 total, 4 thin omitted)

### Community 0 - "card.tsx"
Cohesion: 0.24
Nodes (19): AnnouncementsSection(), AnnouncementsSectionProps, RssSection(), RssSectionProps, HomeProps, AspectRatio(), Card(), CardContent() (+11 more)

### Community 1 - "sidebar.tsx"
Cohesion: 0.11
Nodes (30): Takım slug'ı üç kimliği birden taşıyor, DashboardLayoutProps, AdminSidebar(), NavItem, navItems, Sidebar(), SidebarContent(), SidebarContext (+22 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.09
Nodes (21): name, overrides, postcss, private, version, class-variance-authority, clsx, eslint (+13 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.06
Nodes (35): all, args, BACKEND_ROOT, category, confirmed, __dirname, dryRun, expect (+27 more)

### Community 4 - "react"
Cohesion: 0.13
Nodes (21): Task 6: Admin paneli "Başvuru Dönemleri" sayfası, AdminApplicationWindows(), Message, STATE_BADGE, WindowCard(), Apply(), getIconByName(), ApplyDetail() (+13 more)

### Community 5 - "general-membership.tsx"
Cohesion: 0.14
Nodes (17): AdminGeneralMembership(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue() (+9 more)

### Community 6 - "mailQueueProcessor.js"
Cohesion: 0.10
Nodes (30): assetsDir, __dirname, sendSponsorMail(), cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob() (+22 more)

### Community 7 - "Frontend - KOU SENG Website"
Cohesion: 0.07
Nodes (27): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Development Server'ı Başlatma, 4. Production Build, Admin Paneli, 📊 Analytics ve Monitoring, Code Style, 🚀 Deployment (+19 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, class-variance-authority, clsx, date-fns, @fortawesome/fontawesome-svg-core, @fortawesome/free-brands-svg-icons, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons (+17 more)

### Community 9 - "aboutData.ts"
Cohesion: 0.06
Nodes (36): AboutRoute(), KvkkRoute(), metadata, TeamDetailRoute(), About(), AboutProps, Contact(), Kvkk() (+28 more)

### Community 10 - "Backend - KOU SENG Website API"
Cohesion: 0.08
Nodes (23): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Server'ı Başlatma, Ana Package Dosyaları, Announcements, 📚 API Endpoints, Authentication, Backend - KOU SENG Website API (+15 more)

### Community 11 - "MailQueueContext.tsx"
Cohesion: 0.09
Nodes (20): AdminSponsorMail(), createBlock(), formatDate(), parseEmails(), QueueJobCard(), authHeaders(), EnqueueInput, MailQueueContext (+12 more)

### Community 12 - "backend/package.json"
Cohesion: 0.10
Nodes (20): author, description, devDependencies, nodemon, keywords, license, main, name (+12 more)

### Community 13 - "index.js"
Cohesion: 0.11
Nodes (19): getHealthStatus(), clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, app, corsOptions (+11 more)

### Community 14 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 15 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "authController.js"
Cohesion: 0.29
Nodes (7): changePassword(), getMe(), loginUser(), getSystemStatus(), generateToken(), router, bcryptjs

### Community 17 - "homeData.ts"
Cohesion: 0.10
Nodes (20): RootPage(), Footer(), Header(), Home(), MainLayout(), MainLayoutProps, FooterData, getFooterData() (+12 more)

### Community 18 - "Projeye özel kurallar"
Cohesion: 0.06
Nodes (27): Backend ESM — `node --check` yalan söylüyor, Başvuru formuna alan ekleme, Başvuruları silme (saklama süresi), Branch'ler, `check:content`, Duyuru HTML'i ve CSP, Frontend (`frontend/`), graphify (+19 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.30
Nodes (9): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), toSearchPattern(), router (+1 more)

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
Cohesion: 0.13
Nodes (22): createUser(), deleteUser(), getAllUsers(), updateUser(), adminOnly(), firstUserCreation(), matchesSystemKey(), protect() (+14 more)

### Community 24 - "Başvuru Dönemleri — Tasarım"
Cohesion: 0.17
Nodes (11): Admin paneli, Amaç, Başvuru Dönemleri — Tasarım, Başvuru sayfaları, Deploy, Frontend, Güvenlik, Kapsam dışı (+3 more)

### Community 25 - "applyDetail.tsx"
Cohesion: 0.13
Nodes (22): formSchema, FormValues, AdminLogin(), loginFormSchema, LoginFormValues, frontend_src_components_ui_form_form, FormControl(), FormDescription() (+14 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.36
Nodes (8): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), rss-parser

### Community 27 - "cn"
Cohesion: 0.12
Nodes (17): Label(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+9 more)

### Community 28 - "useAuth"
Cohesion: 0.05
Nodes (45): AdminDashboardLayout(), ChangePasswordDialog(), AdminManagement(), formatRole(), AdminDashboard(), AuthError, AuthUser, getStoredToken() (+37 more)

### Community 29 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, check:content, dev, lint, pm2:restart, pm2:start, pm2:stop (+1 more)

### Community 30 - "loadtest.js"
Cohesion: 0.22
Nodes (7): BASE, body(), C, N, one(), RUN, SUBMIT

### Community 31 - "logger.js"
Cohesion: 0.23
Nodes (8): ConnectDB(), createContactMessage(), deleteContactMessage(), getContactMessages(), updateContactIsRead(), logger, TODO: Telegram ile loglama yapılacak, router

### Community 32 - "Backend API Endpoints"
Cohesion: 0.25
Nodes (7): Backend API Endpoints, Duyurular (Announcements) - YAPILDI, Gelen Başvurular (Submissions), İletişim Mesajları (Contact Messages) - YAPILDI, Kimlik Doğrulama (Authentication) - YAPILDI, Kullanıcı Yönetimi (Admin) - YAPILDI, Yayınlar (Publications) - YAPILDI

### Community 33 - "windows-smoke.js"
Cohesion: 0.22
Nodes (9): api(), applicant(), BASE, expectClosed(), expectStatus(), RUN, setWindow(), submit() (+1 more)

### Community 35 - "dropdown-menu.tsx"
Cohesion: 0.13
Nodes (13): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+5 more)

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 38 - "submissionsController.js"
Cohesion: 0.11
Nodes (35): getWindow(), getWindows(), toDate(), updateWindow(), createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV() (+27 more)

### Community 40 - "mongoose"
Cohesion: 0.13
Nodes (10): announcementSchema, contactSchema, submissionSchema, args, __dirname, dryRun, rollback, dotenv (+2 more)

### Community 41 - "sponsor-mail.tsx"
Cohesion: 0.21
Nodes (6): BLOCK_LABELS, BlockType, Button(), buttonVariants, ApplyLayout(), ApplyLayoutProps

### Community 43 - "technical-team.tsx"
Cohesion: 0.21
Nodes (12): AdminTechnicalTeam(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue() (+4 more)

### Community 44 - "admin/announcements.tsx"
Cohesion: 0.13
Nodes (17): RichTextEditor, RichTextEditorProps, RichTextEditorRef, AdminAnnouncements(), AnnouncementFormData, announcementSchema, formatDate(), Announcements() (+9 more)

### Community 45 - "next"
Cohesion: 0.18
Nodes (7): NavItem, navItems, NavLinkItem, Publications(), ThemeToggle(), RSS_ENABLED, next

### Community 46 - "data-management.tsx"
Cohesion: 0.32
Nodes (5): AdminDataManagement(), Notice, ScopeOption, SCOPES, useSubmissions()

### Community 47 - "rateSkip.js"
Cohesion: 0.47
Nodes (5): rateSkip(), rateSkipAuth(), rateSkipIP(), limiter, jsonwebtoken

### Community 48 - "admin/contact.tsx"
Cohesion: 0.47
Nodes (3): ContactForm(), AdminContact(), useContact()

## Knowledge Gaps
- **359 isolated node(s):** `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES`, `T` (+354 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 417 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `card.tsx`, `sidebar.tsx`, `frontend/package.json`, `dropdown-menu.tsx`, `general-membership.tsx`, `sponsor-mail.tsx`, `technical-team.tsx`, `admin/announcements.tsx`, `next`, `data-management.tsx`, `MailQueueContext.tsx`, `admin/contact.tsx`, `homeData.ts`, `applyDetail.tsx`, `cn`, `useAuth`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `ApplicationWindow` connect `submissionsController.js` to `sidebar.tsx`, `react`, `authMiddleware.js`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `next` connect `next` to `card.tsx`, `sidebar.tsx`, `frontend/package.json`, `purge-submissions.js`, `react`, `aboutData.ts`, `sponsor-mail.tsx`, `MailQueueContext.tsx`, `homeData.ts`, `Projeye özel kurallar`, `applyDetail.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **What connects `__dirname`, `assetsDir`, `customFields` to the rest of the system?**
  _359 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1051693404634581 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `purge-submissions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06341463414634146 - nodes in this community are weakly interconnected._