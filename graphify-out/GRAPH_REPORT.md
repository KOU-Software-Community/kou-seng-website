# Graph Report - kou-seng-website  (2026-10-01)

## Corpus Check
- 168 files · ~94,118 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 984 nodes · 2099 edges · 45 communities (43 shown, 2 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 108 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `31e719e4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- applyDetail.tsx
- mailQueueRoutes.js
- frontend/package.json
- purge-submissions.js
- react
- mongoose
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
- Projeye özel kurallar
- announcementsController.js
- KOU SENG Website
- technical-team.tsx
- dependencies
- authMiddleware.js
- general-membership.tsx
- useSubmissions.ts
- publicationsController.js
- cn
- useAuth
- submissionsController.js
- loadtest.js
- Başvuru Dönemleri — Tasarım
- Backend API Endpoints
- windows-smoke.js
- sanitizeHTML
- clientIp.js
- Review Focus
- api.ts
- applicationWindowsController.js
- (admin-layout)/layout.tsx
- admin-management.tsx
- Uygulama Tasarım Dili — Tasarım
- postcss.config.mjs
- createGeneralSubmission
- useContact.ts

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
- `Başvuru dönemleri` --references--> `ApplicationWindow`  [INFERRED]
  CLAUDE.md → frontend/src/lib/applicationWindow.ts
- `Dokümantasyon` --references--> `ApplicationWindow`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → frontend/src/lib/applicationWindow.ts
- `Başvuru formuna alan ekleme` --references--> `createGeneralSubmission()`  [INFERRED]
  CLAUDE.md → backend/controllers/submissionsController.js
- `Task 3: Başvurulara 403 uygulaması, smoke'un kalanı ve CI` --references--> `isWindowOpen()`  [INFERRED]
  docs/superpowers/plans/2026-09-28-basvuru-donemleri.md → backend/helpers/applicationWindow.js

## Import Cycles
- None detected.

## Communities (45 total, 2 thin omitted)

### Community 0 - "applyDetail.tsx"
Cohesion: 0.05
Nodes (78): Task 5: Başvuru sayfaları durumu backend'den okur, JSON temizliği, Task 6: Admin paneli "Başvuru Dönemleri" sayfası, AnnouncementsSection(), AnnouncementsSectionProps, formSchema, FormValues, NavItem, navItems (+70 more)

### Community 1 - "mailQueueRoutes.js"
Cohesion: 0.19
Nodes (12): cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob(), attachmentSchema, MailJob, mailJobSchema (+4 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.04
Nodes (45): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node (+37 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.05
Nodes (41): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+33 more)

### Community 4 - "react"
Cohesion: 0.19
Nodes (16): RichTextEditorRef, AnnouncementFormData, announcementSchema, Notice, ScopeOption, SCOPES, Dialog(), DialogContent() (+8 more)

### Community 5 - "mongoose"
Cohesion: 0.19
Nodes (9): createContactMessage(), deleteContactMessage(), getContactMessages(), updateContactIsRead(), announcementSchema, contactSchema, submissionSchema, router (+1 more)

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
Cohesion: 0.06
Nodes (34): AboutRoute(), KvkkRoute(), metadata, TeamDetailRoute(), About(), AboutProps, Kvkk(), TeamDetail() (+26 more)

### Community 10 - "Backend - KOU SENG Website API"
Cohesion: 0.08
Nodes (23): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Server'ı Başlatma, Ana Package Dosyaları, Announcements, 📚 API Endpoints, Authentication, Backend - KOU SENG Website API (+15 more)

### Community 11 - "sponsor-mail.tsx"
Cohesion: 0.10
Nodes (25): AdminSponsorMail(), BLOCK_LABELS, BlockType, createBlock(), formatDate(), parseEmails(), QueueJobCard(), authHeaders() (+17 more)

### Community 12 - "backend/package.json"
Cohesion: 0.10
Nodes (20): author, description, devDependencies, nodemon, keywords, license, main, name (+12 more)

### Community 13 - "index.js"
Cohesion: 0.14
Nodes (16): ConnectDB(), getHealthStatus(), logger, TODO: Telegram ile loglama yapılacak, rateSkip(), rateSkipAuth(), rateSkipIP(), app (+8 more)

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
Cohesion: 0.05
Nodes (32): Backend ESM — `node --check` yalan söylüyor, Başvuru dönemleri, Başvuruları silme (saklama süresi), Branch'ler, `check:content`, Duyuru HTML'i ve CSP, Frontend (`frontend/`), graphify (+24 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.36
Nodes (8): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), router, sanitize-html

### Community 20 - "KOU SENG Website"
Cohesion: 0.14
Nodes (13): Admin Paneli, Backend, Backend Kurulumu, Frontend, Frontend Kurulumu, Genel Sayfalar, 📋 Gereksinimler, 📞 İletişim (+5 more)

### Community 21 - "technical-team.tsx"
Cohesion: 0.22
Nodes (11): AdminTechnicalTeam(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue() (+3 more)

### Community 22 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, json2csv, jsonwebtoken (+5 more)

### Community 23 - "authMiddleware.js"
Cohesion: 0.16
Nodes (19): createUser(), deleteUser(), getAllUsers(), updateUser(), adminOnly(), firstUserCreation(), matchesSystemKey(), protect() (+11 more)

### Community 24 - "general-membership.tsx"
Cohesion: 0.22
Nodes (10): AdminDataManagement(), AdminGeneralMembership(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl() (+2 more)

### Community 25 - "useSubmissions.ts"
Cohesion: 0.15
Nodes (12): BaseSubmissionData, GeneralSubmissionData, ListSubmissionsParams, PurgeScope, SubmissionData, SubmissionListItem, SubmissionListResponse, SubmissionPagination (+4 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.33
Nodes (8): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), router

### Community 27 - "cn"
Cohesion: 0.06
Nodes (54): NavItem, navItems, CardAction(), DialogOverlay(), DialogTrigger(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem() (+46 more)

### Community 28 - "useAuth"
Cohesion: 0.08
Nodes (24): AdminDashboardLayout(), DashboardLayoutProps, AdminSidebar(), ChangePasswordDialog(), AdminDashboard(), AdminLogin(), SidebarInset(), Announcement (+16 more)

### Community 29 - "submissionsController.js"
Cohesion: 0.24
Nodes (11): csvString(), exportSubmissionsToCSV(), getAllSubmissions(), getSubmissionById(), PURGE_SCOPES, purgeSubmissions(), quoteCsvString, updateSubmission() (+3 more)

### Community 30 - "loadtest.js"
Cohesion: 0.12
Nodes (13): BASE, body(), C, N, one(), RUN, SUBMIT, Global Constraints (+5 more)

### Community 31 - "Başvuru Dönemleri — Tasarım"
Cohesion: 0.17
Nodes (11): Admin paneli, Amaç, Başvuru Dönemleri — Tasarım, Başvuru sayfaları, Deploy, Dokümantasyon, Frontend, Kapsam dışı (+3 more)

### Community 32 - "Backend API Endpoints"
Cohesion: 0.25
Nodes (7): Backend API Endpoints, Duyurular (Announcements) - YAPILDI, Gelen Başvurular (Submissions), İletişim Mesajları (Contact Messages) - YAPILDI, Kimlik Doğrulama (Authentication) - YAPILDI, Kullanıcı Yönetimi (Admin) - YAPILDI, Yayınlar (Publications) - YAPILDI

### Community 33 - "windows-smoke.js"
Cohesion: 0.22
Nodes (9): api(), applicant(), BASE, expectClosed(), expectStatus(), RUN, setWindow(), submit() (+1 more)

### Community 34 - "sanitizeHTML"
Cohesion: 0.25
Nodes (6): RichTextEditor, AdminAnnouncements(), formatDate(), ALLOWED_TAGS, cleanNode(), sanitizeHTML()

### Community 35 - "clientIp.js"
Cohesion: 0.29
Nodes (7): clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, keyGenerator(), ref_node_net

### Community 36 - "Review Focus"
Cohesion: 0.33
Nodes (5): Başvuru Dönemleri — Uygulama Planı, Global Constraints, Review Focus, Task 1: Pencere kuralı (saf fonksiyonlar) ve birim testleri, Task 4: Frontend veri katmanı

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 38 - "applicationWindowsController.js"
Cohesion: 0.26
Nodes (13): getWindows(), toDate(), updateWindow(), APPLICATION_SLUGS, DEFAULT_WINDOWS, isWindowOpen(), T, toPublicWindow() (+5 more)

### Community 40 - "admin-management.tsx"
Cohesion: 0.26
Nodes (8): AdminManagement(), formatRole(), MIN_PASSWORD_LENGTH, CreateUserRequest, UpdateUserRequest, UserResponse, useUser(), UseUserReturn

### Community 41 - "Uygulama Tasarım Dili — Tasarım"
Cohesion: 0.22
Nodes (8): Amaç, Deploy, Doğrulama, Erişilebilirlik, Kapsam dışı, Tasarım kuralları, Uygulama Tasarım Dili — Tasarım, Uygulamaya özgü dokunuşlar

### Community 46 - "createGeneralSubmission"
Cohesion: 0.27
Nodes (11): getWindow(), createGeneralSubmission(), createTechnicalSubmission(), isGrade(), isText(), Başvuru formuna alan ekleme, Task 3: Başvurulara 403 uygulaması, smoke'un kalanı ve CI, Backend (+3 more)

### Community 50 - "useContact.ts"
Cohesion: 0.18
Nodes (8): ContactForm(), AdminContact(), ContactFormValues, ContactListResponse, ContactMessage, ContactResponse, useContact(), UseContactReturn

## Knowledge Gaps
- **371 isolated node(s):** `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES`, `T` (+366 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 432 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `applyDetail.tsx`, `frontend/package.json`, `admin-management.tsx`, `sponsor-mail.tsx`, `homeData.ts`, `Projeye özel kurallar`, `useContact.ts`, `technical-team.tsx`, `general-membership.tsx`, `useSubmissions.ts`, `cn`, `useAuth`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Why does `ApplicationWindow` connect `applyDetail.tsx` to `Review Focus`, `applicationWindowsController.js`, `createGeneralSubmission`, `Projeye özel kurallar`, `Başvuru Dönemleri — Tasarım`?**
  _High betweenness centrality (0.088) - this node is a cross-community bridge._
- **Why does `next` connect `applyDetail.tsx` to `frontend/package.json`, `purge-submissions.js`, `aboutData.ts`, `sponsor-mail.tsx`, `homeData.ts`, `Projeye özel kurallar`, `cn`, `useAuth`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **What connects `__dirname`, `assetsDir`, `customFields` to the rest of the system?**
  _371 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `applyDetail.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.051400560224089634 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.041666666666666664 - nodes in this community are weakly interconnected._
- **Should `purge-submissions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05357142857142857 - nodes in this community are weakly interconnected._