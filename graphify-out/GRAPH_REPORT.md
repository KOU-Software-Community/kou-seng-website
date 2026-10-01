# Graph Report - kou-seng-website  (2026-10-01)

## Corpus Check
- 170 files · ~97,956 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 1002 nodes · 2163 edges · 47 communities (45 shown, 2 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 124 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c98dcb07`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- card.tsx
- mailQueueRoutes.js
- frontend/package.json
- purge-submissions.js
- data-management.tsx
- mongoose
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
- MainLayout.tsx
- app/layout.tsx
- announcementsController.js
- KOU SENG Website
- technical-team.tsx
- dependencies
- authMiddleware.js
- general-membership.tsx
- useSubmissions.ts
- publicationsController.js
- cn
- react
- userRoutes.js
- loadtest.js
- submissionsController.js
- Backend API Endpoints
- windows-smoke.js
- admin/announcements.tsx
- clientIp.js
- MailQueueContext.tsx
- api.ts
- (admin-layout)/layout.tsx
- Uygulama Tasarım Dili — Tasarım
- postcss.config.mjs
- Başvuru Dönemleri — Tasarım
- aboutData.ts
- contactData.ts
- homeData.ts
- kvkk/page.tsx
- applyDetail.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 87 edges
2. `react` - 49 edges
3. `useAuth()` - 36 edges
4. `Button()` - 27 edges
5. `next` - 24 edges
6. `Card()` - 24 edges
7. `@fortawesome/free-solid-svg-icons` - 22 edges
8. `@fortawesome/react-fontawesome` - 21 edges
9. `PixelMark()` - 21 edges
10. `CardHeader()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Veri katmanı` --references--> `updateWindow()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/controllers/applicationWindowsController.js
- `Doğrulama` --references--> `PixelMark()`  [INFERRED]
  docs/superpowers/specs/2026-10-01-uygulama-tasarim-dili-design.md → frontend/src/components/layout/Pixel.tsx
- `Erişilebilirlik` --references--> `PixelMark()`  [INFERRED]
  docs/superpowers/specs/2026-10-01-uygulama-tasarim-dili-design.md → frontend/src/components/layout/Pixel.tsx
- `Mobil uygulama bölümü ve tanıtım videosu` --references--> `PixelMark()`  [INFERRED]
  docs/superpowers/specs/2026-10-01-uygulama-tasarim-dili-design.md → frontend/src/components/layout/Pixel.tsx
- `Dokümantasyon` --references--> `ApplicationWindow`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → frontend/src/lib/applicationWindow.ts

## Import Cycles
- None detected.

## Communities (47 total, 2 thin omitted)

### Community 0 - "card.tsx"
Cohesion: 0.06
Nodes (63): Task 6: Admin paneli "Başvuru Dönemleri" sayfası, Global Constraints, Piksel Havası ve Tanıtım Videosu — Uygulama Planı, Review Focus, Task 1: Site geneli piksel parçaları ve kenarlık, Task 2: Koyu hero ve header markası, Task 3: Mobil uygulama bölümü ve tanıtım videosu, Task 4: Regresyon, CLAUDE.md, görüntüler ve PR (+55 more)

### Community 1 - "mailQueueRoutes.js"
Cohesion: 0.20
Nodes (11): cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob(), attachmentSchema, MailJob, mailJobSchema (+3 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.04
Nodes (44): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node (+36 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.05
Nodes (41): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+33 more)

### Community 4 - "data-management.tsx"
Cohesion: 0.20
Nodes (10): AdminContact(), Notice, ScopeOption, SCOPES, Dialog(), DialogContent(), DialogFooter(), DialogHeader() (+2 more)

### Community 5 - "mongoose"
Cohesion: 0.19
Nodes (9): createContactMessage(), deleteContactMessage(), getContactMessages(), updateContactIsRead(), announcementSchema, contactSchema, submissionSchema, router (+1 more)

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
Cohesion: 0.24
Nodes (9): TeamDetailRoute(), TeamDetail(), Achievement, Competition, getTeamDetail(), getTeamSlugs(), LeaderMessage, Project (+1 more)

### Community 10 - "Backend - KOU SENG Website API"
Cohesion: 0.08
Nodes (23): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Server'ı Başlatma, Ana Package Dosyaları, Announcements, 📚 API Endpoints, Authentication, Backend - KOU SENG Website API (+15 more)

### Community 11 - "sponsor-mail.tsx"
Cohesion: 0.11
Nodes (20): AdminSponsorMail(), BLOCK_LABELS, BlockType, createBlock(), formatDate(), parseEmails(), QueueJobCard(), Separator() (+12 more)

### Community 12 - "backend/package.json"
Cohesion: 0.10
Nodes (20): author, description, devDependencies, nodemon, keywords, license, main, name (+12 more)

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
Cohesion: 0.26
Nodes (8): changePassword(), getMe(), loginUser(), getSystemStatus(), generateToken(), router, bcryptjs, jsonwebtoken

### Community 17 - "MainLayout.tsx"
Cohesion: 0.27
Nodes (6): RootPage(), Header(), Home(), MainLayout(), MainLayoutProps, getHomeData()

### Community 18 - "app/layout.tsx"
Cohesion: 0.12
Nodes (13): Frontend (`frontend/`), İçerik (`frontend/public/data/`), Klasör yapısı, Komutlar, Ortam değişkenleri, Proje, frontend_src_app_globals, jakarta (+5 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.30
Nodes (9): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), getAllSubmissions(), toSearchPattern() (+1 more)

### Community 20 - "KOU SENG Website"
Cohesion: 0.14
Nodes (13): Admin Paneli, Backend, Backend Kurulumu, Frontend, Frontend Kurulumu, Genel Sayfalar, 📋 Gereksinimler, 📞 İletişim (+5 more)

### Community 21 - "technical-team.tsx"
Cohesion: 0.22
Nodes (10): AdminDataManagement(), AdminTechnicalTeam(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl() (+2 more)

### Community 22 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, json2csv, jsonwebtoken (+5 more)

### Community 23 - "authMiddleware.js"
Cohesion: 0.12
Nodes (20): adminOnly(), firstUserCreation(), matchesSystemKey(), protect(), roleOnlyForCategory(), roleOnlyForSubmission(), sponsorOrAdmin(), router (+12 more)

### Community 24 - "general-membership.tsx"
Cohesion: 0.24
Nodes (10): AdminGeneralMembership(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue() (+2 more)

### Community 25 - "useSubmissions.ts"
Cohesion: 0.15
Nodes (12): BaseSubmissionData, GeneralSubmissionData, ListSubmissionsParams, PurgeScope, SubmissionData, SubmissionListItem, SubmissionListResponse, SubmissionPagination (+4 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.29
Nodes (9): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), router (+1 more)

### Community 27 - "cn"
Cohesion: 0.05
Nodes (64): DashboardLayoutProps, AdminSidebar(), NavItem, navItems, ThemeToggle(), CardAction(), DialogOverlay(), DialogTrigger() (+56 more)

### Community 28 - "react"
Cohesion: 0.10
Nodes (26): AdminDashboardLayout(), ChangePasswordDialog(), AdminManagement(), formatRole(), AdminDashboard(), useApplicationWindows(), UseApplicationWindowsReturn, AuthError (+18 more)

### Community 29 - "userRoutes.js"
Cohesion: 0.31
Nodes (7): createUser(), deleteUser(), getAllUsers(), updateUser(), MIN_PASSWORD_LENGTH, UserSchema, router

### Community 30 - "loadtest.js"
Cohesion: 0.12
Nodes (13): BASE, body(), C, N, one(), RUN, SUBMIT, Global Constraints (+5 more)

### Community 31 - "submissionsController.js"
Cohesion: 0.06
Nodes (53): getWindow(), getWindows(), toDate(), updateWindow(), createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV() (+45 more)

### Community 32 - "Backend API Endpoints"
Cohesion: 0.25
Nodes (7): Backend API Endpoints, Duyurular (Announcements) - YAPILDI, Gelen Başvurular (Submissions), İletişim Mesajları (Contact Messages) - YAPILDI, Kimlik Doğrulama (Authentication) - YAPILDI, Kullanıcı Yönetimi (Admin) - YAPILDI, Yayınlar (Publications) - YAPILDI

### Community 33 - "windows-smoke.js"
Cohesion: 0.22
Nodes (9): api(), applicant(), BASE, expectClosed(), expectStatus(), RUN, setWindow(), submit() (+1 more)

### Community 34 - "admin/announcements.tsx"
Cohesion: 0.13
Nodes (19): RichTextEditor, RichTextEditorProps, RichTextEditorRef, AdminAnnouncements(), AnnouncementFormData, announcementSchema, formatDate(), Announcements() (+11 more)

### Community 35 - "clientIp.js"
Cohesion: 0.29
Nodes (7): clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, keyGenerator(), ref_node_net

### Community 36 - "MailQueueContext.tsx"
Cohesion: 0.25
Nodes (8): authHeaders(), EnqueueInput, MailQueueContext, MailQueueContextValue, MailQueueProvider(), QueueJob, QueueJobResult, QueueJobStatus

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 41 - "Uygulama Tasarım Dili — Tasarım"
Cohesion: 0.17
Nodes (11): Amaç, Ana sayfa hero'su: koyu bant, Deploy, Diğer düzeltmeler, Doğrulama, Erişilebilirlik, Header, Kapsam dışı (+3 more)

### Community 44 - "Başvuru Dönemleri — Tasarım"
Cohesion: 0.17
Nodes (11): Admin paneli, Amaç, Başvuru Dönemleri — Tasarım, Başvuru sayfaları, Deploy, Dokümantasyon, Frontend, Kapsam dışı (+3 more)

### Community 45 - "aboutData.ts"
Cohesion: 0.24
Nodes (8): AboutRoute(), About(), BoardMember, FocusArea, getAboutData(), iconMap, PageContent, TimelineEvent

### Community 46 - "contactData.ts"
Cohesion: 0.29
Nodes (6): ContactData, ContactInfo, MapData, PageContent, SocialMediaLink, ref_fs

### Community 47 - "homeData.ts"
Cohesion: 0.18
Nodes (10): AnnouncementsData, ClubFeature, ClubIntroductionData, HeroButton, HeroData, HeroStat, HomeData, iconMap (+2 more)

### Community 48 - "kvkk/page.tsx"
Cohesion: 0.31
Nodes (7): KvkkRoute(), metadata, Kvkk(), getKvkkData(), KvkkData, KvkkSection, ref_path

### Community 50 - "applyDetail.tsx"
Cohesion: 0.09
Nodes (31): ContactForm(), formSchema, FormValues, AdminLogin(), loginFormSchema, LoginFormValues, ApplyDetail(), frontend_src_components_ui_form_form (+23 more)

## Knowledge Gaps
- **374 isolated node(s):** `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES`, `T` (+369 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 436 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `card.tsx`, `frontend/package.json`, `admin/announcements.tsx`, `data-management.tsx`, `MailQueueContext.tsx`, `sponsor-mail.tsx`, `applyDetail.tsx`, `technical-team.tsx`, `general-membership.tsx`, `useSubmissions.ts`, `cn`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `ApplicationWindow` connect `submissionsController.js` to `card.tsx`, `Başvuru Dönemleri — Tasarım`, `react`, `authMiddleware.js`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Why does `next` connect `card.tsx` to `frontend/package.json`, `purge-submissions.js`, `MailQueueContext.tsx`, `teamData.ts`, `kvkk/page.tsx`, `app/layout.tsx`, `applyDetail.tsx`, `cn`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **What connects `__dirname`, `assetsDir`, `customFields` to the rest of the system?**
  _374 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `card.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.056578947368421055 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.0425531914893617 - nodes in this community are weakly interconnected._
- **Should `purge-submissions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.05357142857142857 - nodes in this community are weakly interconnected._