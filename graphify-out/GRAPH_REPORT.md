# Graph Report - kou-seng-website  (2026-09-28)

## Corpus Check
- 162 files · ~91,084 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 944 nodes · 1998 edges · 48 communities (43 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 93 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d3c867e8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- cn
- frontend/package.json
- purge-submissions.js
- Projeye özel kurallar
- AdminGeneralMembership
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
- dropdown-menu.tsx
- announcementsController.js
- KOU SENG Website
- sidebar.tsx
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
- windows-smoke.js
- clientIp.js
- useStatus.ts
- useAuth
- api.ts
- submissionsController.js
- (admin-layout)/layout.tsx
- useAuth.ts
- tooltip.tsx
- postcss.config.mjs
- dashboard/layout.tsx
- useAnnouncements.ts
- apply/page.tsx
- AdminContact
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
- `Veri katmanı` --references--> `updateWindow()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/controllers/applicationWindowsController.js
- `Başvuru formuna alan ekleme` --references--> `createGeneralSubmission()`  [INFERRED]
  CLAUDE.md → backend/controllers/submissionsController.js
- `Endpoint'ler` --references--> `adminOnly()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/middlewares/authMiddleware.js
- `Güvenlik` --references--> `adminOnly()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/middlewares/authMiddleware.js
- `Task 2: Model, GET/PATCH endpoint'leri ve smoke betiğinin yetki/doğrulama kısmı` --references--> `protect()`  [INFERRED]
  docs/superpowers/plans/2026-09-28-basvuru-donemleri.md → backend/middlewares/authMiddleware.js

## Import Cycles
- None detected.

## Communities (48 total, 5 thin omitted)

### Community 0 - "react"
Cohesion: 0.05
Nodes (92): AnnouncementsSection(), AnnouncementsSectionProps, ContactForm(), formSchema, FormValues, RichTextEditor, RichTextEditorProps, RichTextEditorRef (+84 more)

### Community 1 - "cn"
Cohesion: 0.12
Nodes (17): DialogOverlay(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetTitle() (+9 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.04
Nodes (42): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node (+34 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.05
Nodes (41): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+33 more)

### Community 4 - "Projeye özel kurallar"
Cohesion: 0.06
Nodes (27): Backend ESM — `node --check` yalan söylüyor, Başvuru dönemleri, Başvuruları silme (saklama süresi), Branch'ler, `check:content`, Duyuru HTML'i ve CSP, Frontend (`frontend/`), graphify (+19 more)

### Community 5 - "AdminGeneralMembership"
Cohesion: 0.20
Nodes (8): AdminGeneralMembership(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue()

### Community 6 - "mailQueueProcessor.js"
Cohesion: 0.17
Nodes (19): assetsDir, __dirname, sendSponsorMail(), blockToHtml(), buildMailHtml(), escapeHtml(), parseInline(), getTransporter() (+11 more)

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
Nodes (21): AdminSponsorMail(), createBlock(), formatDate(), parseEmails(), QueueJobCard(), authHeaders(), EnqueueInput, MailQueueContext (+13 more)

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

### Community 16 - "authController.js"
Cohesion: 0.17
Nodes (11): changePassword(), getMe(), loginUser(), getSystemStatus(), generateToken(), submissionSchema, MIN_PASSWORD_LENGTH, UserSchema (+3 more)

### Community 17 - "homeData.ts"
Cohesion: 0.10
Nodes (20): RootPage(), Footer(), Header(), Home(), MainLayout(), MainLayoutProps, FooterData, getFooterData() (+12 more)

### Community 18 - "dropdown-menu.tsx"
Cohesion: 0.10
Nodes (17): NavItem, navItems, NavLinkItem, ThemeToggle(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem() (+9 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.23
Nodes (11): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), toSearchPattern(), announcementSchema (+3 more)

### Community 20 - "KOU SENG Website"
Cohesion: 0.14
Nodes (13): Admin Paneli, Backend, Backend Kurulumu, Frontend, Frontend Kurulumu, Genel Sayfalar, 📋 Gereksinimler, 📞 İletişim (+5 more)

### Community 21 - "sidebar.tsx"
Cohesion: 0.17
Nodes (18): NavItem, navItems, DialogTrigger(), SidebarContent(), SidebarContext, SidebarContextProps, SidebarFooter(), SidebarGroup() (+10 more)

### Community 22 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, json2csv, jsonwebtoken (+5 more)

### Community 23 - "authMiddleware.js"
Cohesion: 0.12
Nodes (22): createUser(), deleteUser(), getAllUsers(), updateUser(), adminOnly(), firstUserCreation(), matchesSystemKey(), protect() (+14 more)

### Community 24 - "Başvuru Dönemleri — Tasarım"
Cohesion: 0.12
Nodes (15): Admin paneli, Amaç, Backend, Başvuru Dönemleri — Tasarım, Başvuru sayfaları, Deploy, Dokümantasyon, Endpoint'ler (+7 more)

### Community 25 - "useSubmissions.ts"
Cohesion: 0.15
Nodes (12): BaseSubmissionData, GeneralSubmissionData, ListSubmissionsParams, PurgeScope, SubmissionData, SubmissionListItem, SubmissionListResponse, SubmissionPagination (+4 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.29
Nodes (9): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), router (+1 more)

### Community 27 - "mailQueueRoutes.js"
Cohesion: 0.20
Nodes (11): cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob(), attachmentSchema, MailJob, mailJobSchema (+3 more)

### Community 28 - "useUser.ts"
Cohesion: 0.20
Nodes (7): AdminManagement(), formatRole(), CreateUserRequest, UpdateUserRequest, UserResponse, useUser(), UseUserReturn

### Community 29 - "useContact.ts"
Cohesion: 0.33
Nodes (5): ContactFormValues, ContactListResponse, ContactMessage, ContactResponse, UseContactReturn

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

### Community 34 - "clientIp.js"
Cohesion: 0.29
Nodes (7): clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, keyGenerator(), ref_node_net

### Community 35 - "useStatus.ts"
Cohesion: 0.25
Nodes (5): AdminDashboard(), StatusData, StatusResponse, useStatus(), UseStatusReturn

### Community 36 - "useAuth"
Cohesion: 0.29
Nodes (7): AdminDashboardLayout(), ChangePasswordDialog(), setStoredToken(), useAuth(), SendMailPayload, useSponsorMail(), UseSponsorMailReturn

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 38 - "submissionsController.js"
Cohesion: 0.11
Nodes (34): getWindow(), getWindows(), toDate(), updateWindow(), createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV() (+26 more)

### Community 40 - "useAuth.ts"
Cohesion: 0.25
Nodes (7): AuthError, AuthUser, getStoredToken(), LoginRequestBody, LoginResponse, MIN_PASSWORD_LENGTH, UseAuthReturn

### Community 41 - "tooltip.tsx"
Cohesion: 0.33
Nodes (5): Tooltip(), TooltipContent(), TooltipProvider(), TooltipTrigger(), @radix-ui/react-tooltip

### Community 43 - "dashboard/layout.tsx"
Cohesion: 0.20
Nodes (9): DashboardLayoutProps, AdminSidebar(), Sidebar(), SidebarInset(), SidebarProvider(), SidebarRail(), SidebarTrigger(), useSidebar() (+1 more)

### Community 44 - "useAnnouncements.ts"
Cohesion: 0.40
Nodes (4): Announcement, ApiResponse, CreateAnnouncementRequest, UpdateAnnouncementRequest

## Knowledge Gaps
- **358 isolated node(s):** `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES`, `T` (+353 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 415 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `cn`, `frontend/package.json`, `useStatus.ts`, `useAuth`, `useAuth.ts`, `tooltip.tsx`, `dashboard/layout.tsx`, `MailQueueContext.tsx`, `useAnnouncements.ts`, `login/page.tsx`, `homeData.ts`, `dropdown-menu.tsx`, `sidebar.tsx`, `useSubmissions.ts`, `useUser.ts`, `useContact.ts`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Why does `next` connect `react` to `frontend/package.json`, `purge-submissions.js`, `Projeye özel kurallar`, `aboutData.ts`, `dashboard/layout.tsx`, `MailQueueContext.tsx`, `homeData.ts`, `dropdown-menu.tsx`, `sidebar.tsx`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `@fortawesome/free-solid-svg-icons` connect `react` to `cn`, `frontend/package.json`, `aboutData.ts`, `homeData.ts`, `dropdown-menu.tsx`, `sidebar.tsx`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **What connects `__dirname`, `assetsDir`, `customFields` to the rest of the system?**
  _358 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.0516261299040164 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.12121212121212122 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.044444444444444446 - nodes in this community are weakly interconnected._