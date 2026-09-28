# Graph Report - kou-seng-website  (2026-09-28)

## Corpus Check
- 159 files · ~89,375 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 924 nodes · 1945 edges · 53 communities (49 shown, 4 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 85 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3d3a6a8c`
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
- sponsor-mail.tsx
- backend/package.json
- index.js
- components.json
- compilerOptions
- authController.js
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
- useAuth
- useContact.ts
- loadtest.js
- contactRoutes.js
- Backend API Endpoints
- userRoutes.js
- clientIp.js
- useStatus.ts
- dropdown-menu.tsx
- api.ts
- applicationWindow.test.js
- (admin-layout)/layout.tsx
- useAuth.ts
- adminOnly
- postcss.config.mjs
- AdminTechnicalTeam
- rich-text-editor.tsx
- app/layout.tsx
- devDependencies
- scripts
- CLAUDE.md
- useAnnouncements.ts
- useUser.ts
- eslint.config.mjs
- login/page.tsx

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
- `Başvuru formuna alan ekleme` --references--> `createGeneralSubmission()`  [INFERRED]
  CLAUDE.md → backend/controllers/submissionsController.js
- `Task 3: Başvurulara 403 uygulaması, smoke'un kalanı ve CI` --references--> `createGeneralSubmission()`  [INFERRED]
  docs/superpowers/plans/2026-09-28-basvuru-donemleri.md → backend/controllers/submissionsController.js
- `Task 3: Başvurulara 403 uygulaması, smoke'un kalanı ve CI` --references--> `createTechnicalSubmission()`  [INFERRED]
  docs/superpowers/plans/2026-09-28-basvuru-donemleri.md → backend/controllers/submissionsController.js
- `İlk admin oluşturma (deploy edilmiş sunucuda)` --references--> `createUser()`  [INFERRED]
  CLAUDE.md → backend/controllers/userController.js
- `Backend (`backend/`)` --references--> `adminOnly()`  [INFERRED]
  CLAUDE.md → backend/middlewares/authMiddleware.js

## Import Cycles
- None detected.

## Communities (53 total, 4 thin omitted)

### Community 0 - "applyDetail.tsx"
Cohesion: 0.06
Nodes (62): AnnouncementsSection(), AnnouncementsSectionProps, ContactForm(), formSchema, FormValues, NavItem, navItems, NavLinkItem (+54 more)

### Community 1 - "cn"
Cohesion: 0.07
Nodes (50): DashboardLayoutProps, AdminSidebar(), NavItem, navItems, CardAction(), DialogOverlay(), DialogTrigger(), Sheet() (+42 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.09
Nodes (21): name, overrides, postcss, private, version, class-variance-authority, clsx, eslint (+13 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.05
Nodes (40): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+32 more)

### Community 4 - "Projeye özel kurallar"
Cohesion: 0.14
Nodes (14): Backend ESM — `node --check` yalan söylüyor, Başvuruları silme (saklama süresi), Branch'ler, `check:content`, Duyuru HTML'i ve CSP, graphify, Görsel hazırlama, İçerik ve kişi kartları (+6 more)

### Community 5 - "general-membership.tsx"
Cohesion: 0.18
Nodes (12): AdminDataManagement(), AdminGeneralMembership(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl() (+4 more)

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

### Community 11 - "sponsor-mail.tsx"
Cohesion: 0.09
Nodes (26): AdminSponsorMail(), BLOCK_LABELS, BlockType, createBlock(), formatDate(), parseEmails(), QueueJobCard(), authHeaders() (+18 more)

### Community 12 - "backend/package.json"
Cohesion: 0.09
Nodes (21): author, description, devDependencies, nodemon, keywords, license, main, name (+13 more)

### Community 13 - "index.js"
Cohesion: 0.16
Nodes (15): ConnectDB(), getHealthStatus(), logger, TODO: Telegram ile loglama yapılacak, rateSkip(), rateSkipAuth(), rateSkipIP(), app (+7 more)

### Community 14 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 15 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "authController.js"
Cohesion: 0.33
Nodes (6): changePassword(), getMe(), loginUser(), getSystemStatus(), generateToken(), router

### Community 17 - "homeData.ts"
Cohesion: 0.10
Nodes (20): RootPage(), Footer(), Header(), Home(), MainLayout(), MainLayoutProps, FooterData, getFooterData() (+12 more)

### Community 18 - "react"
Cohesion: 0.26
Nodes (15): AnnouncementFormData, announcementSchema, Notice, ScopeOption, SCOPES, Dialog(), DialogContent(), DialogDescription() (+7 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.29
Nodes (9): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), announcementSchema, router (+1 more)

### Community 20 - "KOU SENG Website"
Cohesion: 0.14
Nodes (13): Admin Paneli, Backend, Backend Kurulumu, Frontend, Frontend Kurulumu, Genel Sayfalar, 📋 Gereksinimler, 📞 İletişim (+5 more)

### Community 21 - "submissionsController.js"
Cohesion: 0.19
Nodes (16): createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV(), getAllSubmissions(), getSubmissionById(), isText(), PURGE_SCOPES (+8 more)

### Community 22 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, json2csv, jsonwebtoken (+5 more)

### Community 23 - "authMiddleware.js"
Cohesion: 0.23
Nodes (11): firstUserCreation(), matchesSystemKey(), protect(), roleOnlyForCategory(), roleOnlyForSubmission(), sponsorOrAdmin(), submissionSchema, Backend (`backend/`) (+3 more)

### Community 24 - "Başvuru Dönemleri — Tasarım"
Cohesion: 0.17
Nodes (11): Admin paneli, Amaç, Başvuru Dönemleri — Tasarım, Başvuru sayfaları, Deploy, Dokümantasyon, Frontend, Kapsam dışı (+3 more)

### Community 25 - "useSubmissions.ts"
Cohesion: 0.15
Nodes (12): BaseSubmissionData, GeneralSubmissionData, ListSubmissionsParams, PurgeScope, SubmissionData, SubmissionListItem, SubmissionListResponse, SubmissionPagination (+4 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.33
Nodes (8): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), router

### Community 27 - "mailQueueRoutes.js"
Cohesion: 0.19
Nodes (12): cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob(), attachmentSchema, MailJob, mailJobSchema (+4 more)

### Community 28 - "useAuth"
Cohesion: 0.25
Nodes (7): AdminDashboardLayout(), ChangePasswordDialog(), AdminManagement(), formatRole(), getStoredToken(), useAuth(), useUser()

### Community 29 - "useContact.ts"
Cohesion: 0.20
Nodes (7): AdminContact(), ContactFormValues, ContactListResponse, ContactMessage, ContactResponse, useContact(), UseContactReturn

### Community 30 - "loadtest.js"
Cohesion: 0.22
Nodes (7): BASE, body(), C, N, one(), RUN, SUBMIT

### Community 31 - "contactRoutes.js"
Cohesion: 0.33
Nodes (6): createContactMessage(), deleteContactMessage(), getContactMessages(), updateContactIsRead(), contactSchema, router

### Community 32 - "Backend API Endpoints"
Cohesion: 0.25
Nodes (7): Backend API Endpoints, Duyurular (Announcements) - YAPILDI, Gelen Başvurular (Submissions), İletişim Mesajları (Contact Messages) - YAPILDI, Kimlik Doğrulama (Authentication) - YAPILDI, Kullanıcı Yönetimi (Admin) - YAPILDI, Yayınlar (Publications) - YAPILDI

### Community 33 - "userRoutes.js"
Cohesion: 0.27
Nodes (8): createUser(), deleteUser(), getAllUsers(), updateUser(), MIN_PASSWORD_LENGTH, UserSchema, router, bcryptjs

### Community 34 - "clientIp.js"
Cohesion: 0.29
Nodes (7): clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, keyGenerator(), ref_node_net

### Community 35 - "useStatus.ts"
Cohesion: 0.25
Nodes (5): AdminDashboard(), StatusData, StatusResponse, useStatus(), UseStatusReturn

### Community 36 - "dropdown-menu.tsx"
Cohesion: 0.13
Nodes (13): DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator(), DropdownMenuShortcut() (+5 more)

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 38 - "applicationWindow.test.js"
Cohesion: 0.16
Nodes (17): APPLICATION_SLUGS, DEFAULT_WINDOWS, isWindowOpen(), T, toPublicWindow(), windowState(), Review Focus, Task 1: Pencere kuralı (saf fonksiyonlar) ve birim testleri (+9 more)

### Community 40 - "useAuth.ts"
Cohesion: 0.29
Nodes (6): AuthError, AuthUser, LoginRequestBody, LoginResponse, setStoredToken(), UseAuthReturn

### Community 41 - "adminOnly"
Cohesion: 0.20
Nodes (9): adminOnly(), Başvuru Dönemleri — Uygulama Planı, Global Constraints, Backend, Endpoint'ler, Güvenlik, Mantık, Veri (+1 more)

### Community 43 - "AdminTechnicalTeam"
Cohesion: 0.13
Nodes (12): AdminTechnicalTeam(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue() (+4 more)

### Community 44 - "rich-text-editor.tsx"
Cohesion: 0.21
Nodes (8): RichTextEditor, RichTextEditorProps, RichTextEditorRef, AdminAnnouncements(), formatDate(), ALLOWED_TAGS, cleanNode(), sanitizeHTML()

### Community 45 - "app/layout.tsx"
Cohesion: 0.22
Nodes (7): Frontend (`frontend/`), frontend_src_app_globals, inter, metadata, ThemeProvider(), ThemeProviderProps, next-themes

### Community 46 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node, @types/react (+2 more)

### Community 47 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, check:content, dev, lint, pm2:restart, pm2:start, pm2:stop (+1 more)

### Community 48 - "CLAUDE.md"
Cohesion: 0.29
Nodes (5): İçerik (`frontend/public/data/`), Klasör yapısı, Komutlar, Ortam değişkenleri, Proje

### Community 49 - "useAnnouncements.ts"
Cohesion: 0.40
Nodes (4): Announcement, ApiResponse, CreateAnnouncementRequest, UpdateAnnouncementRequest

### Community 50 - "useUser.ts"
Cohesion: 0.40
Nodes (4): CreateUserRequest, UpdateUserRequest, UserResponse, UseUserReturn

## Knowledge Gaps
- **356 isolated node(s):** `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES`, `T` (+351 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 411 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `applyDetail.tsx`, `cn`, `frontend/package.json`, `useStatus.ts`, `dropdown-menu.tsx`, `general-membership.tsx`, `useAuth.ts`, `sponsor-mail.tsx`, `rich-text-editor.tsx`, `AdminTechnicalTeam`, `homeData.ts`, `useAnnouncements.ts`, `useUser.ts`, `login/page.tsx`, `useSubmissions.ts`, `useContact.ts`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Why does `next` connect `applyDetail.tsx` to `cn`, `frontend/package.json`, `purge-submissions.js`, `aboutData.ts`, `sponsor-mail.tsx`, `app/layout.tsx`, `homeData.ts`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Why does `@fortawesome/free-solid-svg-icons` connect `applyDetail.tsx` to `cn`, `frontend/package.json`, `dropdown-menu.tsx`, `aboutData.ts`, `rich-text-editor.tsx`, `homeData.ts`, `react`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `__dirname`, `assetsDir`, `customFields` to the rest of the system?**
  _356 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `applyDetail.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06337719298245614 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.07344632768361582 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._