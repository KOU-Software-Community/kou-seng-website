# Graph Report - kou-seng-website  (2026-10-01)

## Corpus Check
- 171 files · ~100,665 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 1008 nodes · 2187 edges · 50 communities (46 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 128 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7c9c1db7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- mailQueueRoutes.js
- devDependencies
- purge-submissions.js
- useContact
- contactRoutes.js
- mailQueueProcessor.js
- Frontend - KOU SENG Website
- dependencies
- teamData.ts
- Backend - KOU SENG Website API
- sponsor-mail.tsx
- backend/package.json
- index.js
- components.json
- compilerOptions
- authController.js
- application-windows.tsx
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
- dropdown-menu.tsx
- loadtest.js
- submissionsController.js
- Backend API Endpoints
- windows-smoke.js
- useUser.ts
- clientIp.js
- scripts
- api.ts
- admin-management.tsx
- (admin-layout)/layout.tsx
- sheet.tsx
- Uygulama Tasarım Dili — Tasarım
- postcss.config.mjs
- useAuth.ts
- useContact.ts
- useStatus.ts
- eslint.config.mjs
- homeData.ts
- tailwindcss
- frontend/package.json

## God Nodes (most connected - your core abstractions)
1. `cn()` - 87 edges
2. `react` - 50 edges
3. `useAuth()` - 36 edges
4. `Button()` - 28 edges
5. `next` - 24 edges
6. `Card()` - 24 edges
7. `PixelMark()` - 23 edges
8. `@fortawesome/free-solid-svg-icons` - 22 edges
9. `@fortawesome/react-fontawesome` - 22 edges
10. `CardHeader()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Güvenlik` --references--> `adminOnly()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/middlewares/authMiddleware.js
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

## Communities (50 total, 4 thin omitted)

### Community 0 - "react"
Cohesion: 0.06
Nodes (74): AnnouncementsSection(), AnnouncementsSectionProps, AppSection(), formSchema, FormValues, NavItem, navItems, NavLinkItem (+66 more)

### Community 1 - "mailQueueRoutes.js"
Cohesion: 0.20
Nodes (11): cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob(), attachmentSchema, MailJob, mailJobSchema (+3 more)

### Community 2 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node, @types/react (+2 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.05
Nodes (44): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+36 more)

### Community 4 - "useContact"
Cohesion: 0.40
Nodes (3): ContactForm(), AdminContact(), useContact()

### Community 5 - "contactRoutes.js"
Cohesion: 0.33
Nodes (6): createContactMessage(), deleteContactMessage(), getContactMessages(), updateContactIsRead(), contactSchema, router

### Community 6 - "mailQueueProcessor.js"
Cohesion: 0.17
Nodes (19): assetsDir, __dirname, sendSponsorMail(), blockToHtml(), buildMailHtml(), escapeHtml(), parseInline(), getTransporter() (+11 more)

### Community 7 - "Frontend - KOU SENG Website"
Cohesion: 0.07
Nodes (27): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Development Server'ı Başlatma, 4. Production Build, Admin Paneli, 📊 Analytics ve Monitoring, Code Style, 🚀 Deployment (+19 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, class-variance-authority, clsx, date-fns, @fortawesome/fontawesome-svg-core, @fortawesome/free-brands-svg-icons, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons (+17 more)

### Community 9 - "teamData.ts"
Cohesion: 0.05
Nodes (37): Takım slug'ı üç kimliği birden taşıyor, AboutRoute(), KvkkRoute(), metadata, TeamDetailRoute(), About(), AboutProps, Contact() (+29 more)

### Community 10 - "Backend - KOU SENG Website API"
Cohesion: 0.08
Nodes (23): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Server'ı Başlatma, Ana Package Dosyaları, Announcements, 📚 API Endpoints, Authentication, Backend - KOU SENG Website API (+15 more)

### Community 11 - "sponsor-mail.tsx"
Cohesion: 0.09
Nodes (26): AdminSponsorMail(), BLOCK_LABELS, BlockType, createBlock(), formatDate(), parseEmails(), QueueJobCard(), authHeaders() (+18 more)

### Community 12 - "backend/package.json"
Cohesion: 0.10
Nodes (20): author, description, devDependencies, nodemon, keywords, license, main, name (+12 more)

### Community 13 - "index.js"
Cohesion: 0.15
Nodes (14): ConnectDB(), getHealthStatus(), logger, TODO: Telegram ile loglama yapılacak, rateSkip(), rateSkipAuth(), rateSkipIP(), app (+6 more)

### Community 14 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 15 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "authController.js"
Cohesion: 0.21
Nodes (9): changePassword(), getMe(), loginUser(), getSystemStatus(), generateToken(), submissionSchema, router, bcryptjs (+1 more)

### Community 17 - "application-windows.tsx"
Cohesion: 0.12
Nodes (23): Review Focus, Task 1: Pencere kuralı (saf fonksiyonlar) ve birim testleri, Task 4: Frontend veri katmanı, Task 5: Başvuru sayfaları durumu backend'den okur, JSON temizliği, Task 6: Admin paneli "Başvuru Dönemleri" sayfası, AdminApplicationWindows(), Message, STATE_BADGE (+15 more)

### Community 18 - "Projeye özel kurallar"
Cohesion: 0.06
Nodes (30): Backend ESM — `node --check` yalan söylüyor, Başvuru dönemleri, Başvuruları silme (saklama süresi), Branch'ler, `check:content`, Commit, PR ve dokümanlarda yapay zekâ izi yok, Duyuru HTML'i ve CSP, Frontend (`frontend/`) (+22 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.23
Nodes (11): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), getAllSubmissions(), toSearchPattern() (+3 more)

### Community 20 - "KOU SENG Website"
Cohesion: 0.14
Nodes (13): Admin Paneli, Backend, Backend Kurulumu, Frontend, Frontend Kurulumu, Genel Sayfalar, 📋 Gereksinimler, 📞 İletişim (+5 more)

### Community 21 - "technical-team.tsx"
Cohesion: 0.19
Nodes (11): AdminTechnicalTeam(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue() (+3 more)

### Community 22 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, json2csv, jsonwebtoken (+5 more)

### Community 23 - "authMiddleware.js"
Cohesion: 0.12
Nodes (22): createUser(), deleteUser(), getAllUsers(), updateUser(), adminOnly(), firstUserCreation(), matchesSystemKey(), protect() (+14 more)

### Community 24 - "general-membership.tsx"
Cohesion: 0.24
Nodes (11): AdminGeneralMembership(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue() (+3 more)

### Community 25 - "useSubmissions.ts"
Cohesion: 0.15
Nodes (12): BaseSubmissionData, GeneralSubmissionData, ListSubmissionsParams, PurgeScope, SubmissionData, SubmissionListItem, SubmissionListResponse, SubmissionPagination (+4 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.26
Nodes (10): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), router (+2 more)

### Community 27 - "cn"
Cohesion: 0.11
Nodes (36): NavItem, navItems, Sidebar(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+28 more)

### Community 28 - "useAuth"
Cohesion: 0.24
Nodes (8): AdminDashboardLayout(), DashboardLayoutProps, AdminSidebar(), ChangePasswordDialog(), AdminDashboard(), AuthUser, useAuth(), useStatus()

### Community 29 - "dropdown-menu.tsx"
Cohesion: 0.12
Nodes (14): ThemeToggle(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem(), DropdownMenuSeparator() (+6 more)

### Community 30 - "loadtest.js"
Cohesion: 0.12
Nodes (13): BASE, body(), C, N, one(), RUN, SUBMIT, Global Constraints (+5 more)

### Community 31 - "submissionsController.js"
Cohesion: 0.07
Nodes (46): getWindow(), getWindows(), toDate(), updateWindow(), createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV() (+38 more)

### Community 32 - "Backend API Endpoints"
Cohesion: 0.25
Nodes (7): Backend API Endpoints, Duyurular (Announcements) - YAPILDI, Gelen Başvurular (Submissions), İletişim Mesajları (Contact Messages) - YAPILDI, Kimlik Doğrulama (Authentication) - YAPILDI, Kullanıcı Yönetimi (Admin) - YAPILDI, Yayınlar (Publications) - YAPILDI

### Community 33 - "windows-smoke.js"
Cohesion: 0.22
Nodes (9): api(), applicant(), BASE, expectClosed(), expectStatus(), RUN, setWindow(), submit() (+1 more)

### Community 34 - "useUser.ts"
Cohesion: 0.20
Nodes (7): AdminManagement(), formatRole(), CreateUserRequest, UpdateUserRequest, UserResponse, useUser(), UseUserReturn

### Community 35 - "clientIp.js"
Cohesion: 0.29
Nodes (7): clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, keyGenerator(), ref_node_net

### Community 36 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, check:content, dev, lint, pm2:restart, pm2:start, pm2:stop (+1 more)

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 38 - "admin-management.tsx"
Cohesion: 0.15
Nodes (16): AdminDataManagement(), Notice, ScopeOption, SCOPES, Dialog(), DialogContent(), DialogDescription(), DialogFooter() (+8 more)

### Community 40 - "sheet.tsx"
Cohesion: 0.18
Nodes (7): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle()

### Community 41 - "Uygulama Tasarım Dili — Tasarım"
Cohesion: 0.10
Nodes (19): Global Constraints, Piksel Havası ve Tanıtım Videosu — Uygulama Planı, Review Focus, Task 1: Site geneli piksel parçaları ve kenarlık, Task 2: Koyu hero ve header markası, Task 4: Regresyon, CLAUDE.md, görüntüler ve PR, Amaç, Ana sayfa hero'su: koyu bant (+11 more)

### Community 43 - "useAuth.ts"
Cohesion: 0.29
Nodes (6): AuthError, getStoredToken(), LoginRequestBody, LoginResponse, setStoredToken(), UseAuthReturn

### Community 44 - "useContact.ts"
Cohesion: 0.33
Nodes (5): ContactFormValues, ContactListResponse, ContactMessage, ContactResponse, UseContactReturn

### Community 45 - "useStatus.ts"
Cohesion: 0.50
Nodes (3): StatusData, StatusResponse, UseStatusReturn

### Community 47 - "homeData.ts"
Cohesion: 0.10
Nodes (21): RootPage(), Footer(), Header(), Home(), MainLayout(), MainLayoutProps, FooterData, getFooterData() (+13 more)

### Community 50 - "frontend/package.json"
Cohesion: 0.09
Nodes (21): name, overrides, postcss, private, version, class-variance-authority, clsx, eslint (+13 more)

## Knowledge Gaps
- **375 isolated node(s):** `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES`, `T` (+370 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 437 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `useUser.ts`, `admin-management.tsx`, `sheet.tsx`, `sponsor-mail.tsx`, `useAuth.ts`, `useContact.ts`, `useStatus.ts`, `homeData.ts`, `application-windows.tsx`, `frontend/package.json`, `technical-team.tsx`, `general-membership.tsx`, `useSubmissions.ts`, `cn`, `useAuth`, `dropdown-menu.tsx`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Why does `next` connect `react` to `purge-submissions.js`, `teamData.ts`, `sponsor-mail.tsx`, `homeData.ts`, `Projeye özel kurallar`, `frontend/package.json`, `cn`, `useAuth`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Why does `ApplicationWindow` connect `application-windows.tsx` to `teamData.ts`, `Projeye özel kurallar`, `submissionsController.js`, `authMiddleware.js`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **What connects `__dirname`, `assetsDir`, `customFields` to the rest of the system?**
  _375 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05961807172799255 - nodes in this community are weakly interconnected._
- **Should `purge-submissions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05128205128205128 - nodes in this community are weakly interconnected._
- **Should `Frontend - KOU SENG Website` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._