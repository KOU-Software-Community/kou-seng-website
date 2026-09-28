# Graph Report - kou-seng-website  (2026-09-28)

## Corpus Check
- 166 files · ~92,687 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 967 nodes · 2083 edges · 51 communities (46 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 107 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `53ae1dfc`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cn
- mailQueueRoutes.js
- frontend/package.json
- purge-submissions.js
- applicationWindow.ts
- AdminGeneralMembership
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
- devDependencies
- dependencies
- authMiddleware.js
- teamData.ts
- useSubmissions.ts
- publicationsController.js
- sidebar.tsx
- useAuth
- scripts
- loadtest.js
- contactRoutes.js
- Backend API Endpoints
- windows-smoke.js
- eslint.config.mjs
- dropdown-menu.tsx
- contactData.ts
- api.ts
- submissionsController.js
- (admin-layout)/layout.tsx
- useUser.ts
- ApplyLayout.tsx
- postcss.config.mjs
- AdminTechnicalTeam
- useAnnouncements.ts
- useApplicationWindows.ts
- useSubmissions
- kvkk/page.tsx
- AdminContact
- clientIp.js
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
- `Güvenlik` --references--> `adminOnly()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/middlewares/authMiddleware.js
- `Veri katmanı` --references--> `updateWindow()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/controllers/applicationWindowsController.js
- `Başvuru formuna alan ekleme` --references--> `createGeneralSubmission()`  [INFERRED]
  CLAUDE.md → backend/controllers/submissionsController.js
- `Takım slug'ı üç kimliği birden taşıyor` --references--> `roleOnlyForCategory()`  [INFERRED]
  CLAUDE.md → backend/middlewares/authMiddleware.js
- `Task 2: Model, GET/PATCH endpoint'leri ve smoke betiğinin yetki/doğrulama kısmı` --references--> `protect()`  [INFERRED]
  docs/superpowers/plans/2026-09-28-basvuru-donemleri.md → backend/middlewares/authMiddleware.js

## Import Cycles
- None detected.

## Communities (51 total, 5 thin omitted)

### Community 0 - "cn"
Cohesion: 0.06
Nodes (95): NavItem, navItems, AnnouncementsSection(), AnnouncementsSectionProps, ContactForm(), formSchema, FormValues, RichTextEditor (+87 more)

### Community 1 - "mailQueueRoutes.js"
Cohesion: 0.19
Nodes (12): cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob(), attachmentSchema, MailJob, mailJobSchema (+4 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.09
Nodes (21): name, overrides, postcss, private, version, class-variance-authority, clsx, eslint (+13 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.05
Nodes (41): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+33 more)

### Community 4 - "applicationWindow.ts"
Cohesion: 0.29
Nodes (10): Task 6: Admin paneli "Başvuru Dönemleri" sayfası, WindowCard(), APPLICATION_LABELS, dateFormat, formatWindowDate(), fromLocalInput(), pad(), toLocalInput() (+2 more)

### Community 5 - "AdminGeneralMembership"
Cohesion: 0.20
Nodes (8): AdminGeneralMembership(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue()

### Community 6 - "mailQueueProcessor.js"
Cohesion: 0.17
Nodes (18): assetsDir, __dirname, sendSponsorMail(), blockToHtml(), buildMailHtml(), escapeHtml(), parseInline(), getTransporter() (+10 more)

### Community 7 - "Frontend - KOU SENG Website"
Cohesion: 0.07
Nodes (27): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Development Server'ı Başlatma, 4. Production Build, Admin Paneli, 📊 Analytics ve Monitoring, Code Style, 🚀 Deployment (+19 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, class-variance-authority, clsx, date-fns, @fortawesome/fontawesome-svg-core, @fortawesome/free-brands-svg-icons, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons (+17 more)

### Community 9 - "aboutData.ts"
Cohesion: 0.18
Nodes (11): AboutRoute(), About(), AboutProps, AboutData, BoardMember, FocusArea, getAboutData(), iconMap (+3 more)

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
Cohesion: 0.13
Nodes (17): ConnectDB(), getHealthStatus(), logger, TODO: Telegram ile loglama yapılacak, rateSkip(), rateSkipAuth(), rateSkipIP(), app (+9 more)

### Community 14 - "components.json"
Cohesion: 0.11
Nodes (18): aliases, components, hooks, lib, ui, utils, iconLibrary, registries (+10 more)

### Community 15 - "compilerOptions"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 16 - "authController.js"
Cohesion: 0.23
Nodes (8): changePassword(), getMe(), loginUser(), getSystemStatus(), generateToken(), submissionSchema, router, bcryptjs

### Community 17 - "homeData.ts"
Cohesion: 0.15
Nodes (13): RootPage(), Home(), AnnouncementsData, ClubFeature, ClubIntroductionData, getHomeData(), HeroButton, HeroData (+5 more)

### Community 18 - "Projeye özel kurallar"
Cohesion: 0.06
Nodes (28): Backend ESM — `node --check` yalan söylüyor, Başvuruları silme (saklama süresi), Branch'ler, `check:content`, Duyuru HTML'i ve CSP, Frontend (`frontend/`), graphify, Görsel hazırlama (+20 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.25
Nodes (10): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), toSearchPattern(), announcementSchema (+2 more)

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

### Community 24 - "teamData.ts"
Cohesion: 0.19
Nodes (11): TeamDetailRoute(), TeamDetail(), TeamDetailProps, Achievement, Competition, getTeamDetail(), getTeamSlugs(), LeaderMessage (+3 more)

### Community 25 - "useSubmissions.ts"
Cohesion: 0.15
Nodes (12): BaseSubmissionData, GeneralSubmissionData, ListSubmissionsParams, PurgeScope, SubmissionData, SubmissionListItem, SubmissionListResponse, SubmissionPagination (+4 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.29
Nodes (9): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), router (+1 more)

### Community 27 - "sidebar.tsx"
Cohesion: 0.07
Nodes (34): AdminDashboardLayout(), DashboardLayoutProps, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay() (+26 more)

### Community 28 - "useAuth"
Cohesion: 0.15
Nodes (13): ChangePasswordDialog(), AdminDashboard(), AuthError, getStoredToken(), LoginRequestBody, LoginResponse, setStoredToken(), useAuth() (+5 more)

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

### Community 35 - "dropdown-menu.tsx"
Cohesion: 0.07
Nodes (26): Footer(), Header(), NavItem, navItems, NavLinkItem, Publications(), ThemeToggle(), DropdownMenu() (+18 more)

### Community 36 - "contactData.ts"
Cohesion: 0.18
Nodes (8): Contact(), ContactData, ContactInfo, getContactData(), MapData, PageContent, SocialMediaLink, ref_fs

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 38 - "submissionsController.js"
Cohesion: 0.06
Nodes (52): getWindow(), getWindows(), toDate(), updateWindow(), createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV() (+44 more)

### Community 40 - "useUser.ts"
Cohesion: 0.20
Nodes (7): AdminManagement(), formatRole(), CreateUserRequest, UpdateUserRequest, UserResponse, useUser(), UseUserReturn

### Community 43 - "AdminTechnicalTeam"
Cohesion: 0.20
Nodes (8): AdminTechnicalTeam(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue()

### Community 44 - "useAnnouncements.ts"
Cohesion: 0.40
Nodes (4): Announcement, ApiResponse, CreateAnnouncementRequest, UpdateAnnouncementRequest

### Community 45 - "useApplicationWindows.ts"
Cohesion: 0.20
Nodes (5): AdminApplicationWindows(), Apply(), getIconByName(), useApplicationWindows(), UseApplicationWindowsReturn

### Community 46 - "useSubmissions"
Cohesion: 0.29
Nodes (3): AdminDataManagement(), ApplyDetail(), useSubmissions()

### Community 47 - "kvkk/page.tsx"
Cohesion: 0.36
Nodes (6): KvkkRoute(), metadata, Kvkk(), getKvkkData(), KvkkData, KvkkSection

### Community 49 - "clientIp.js"
Cohesion: 0.29
Nodes (7): clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, keyGenerator(), ref_node_net

### Community 50 - "useContact.ts"
Cohesion: 0.33
Nodes (5): ContactFormValues, ContactListResponse, ContactMessage, ContactResponse, UseContactReturn

## Knowledge Gaps
- **360 isolated node(s):** `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES`, `T` (+355 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 419 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `cn` to `frontend/package.json`, `dropdown-menu.tsx`, `useUser.ts`, `sponsor-mail.tsx`, `useAnnouncements.ts`, `useApplicationWindows.ts`, `useContact.ts`, `useSubmissions.ts`, `sidebar.tsx`, `useAuth`?**
  _High betweenness centrality (0.108) - this node is a cross-community bridge._
- **Why does `ApplicationWindow` connect `submissionsController.js` to `cn`, `Projeye özel kurallar`, `applicationWindow.ts`, `useApplicationWindows.ts`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Why does `next` connect `cn` to `frontend/package.json`, `purge-submissions.js`, `dropdown-menu.tsx`, `ApplyLayout.tsx`, `sponsor-mail.tsx`, `kvkk/page.tsx`, `Projeye özel kurallar`, `teamData.ts`, `sidebar.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **What connects `__dirname`, `assetsDir`, `customFields` to the rest of the system?**
  _360 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05927051671732523 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `purge-submissions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05357142857142857 - nodes in this community are weakly interconnected._