# Graph Report - kou-seng-website  (2026-10-01)

## Corpus Check
- 170 files · ~97,780 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 1001 nodes · 2160 edges · 56 communities (52 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 124 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `5dde3876`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- card.tsx
- mailQueueRoutes.js
- frontend/package.json
- purge-submissions.js
- react
- contactRoutes.js
- mailQueueProcessor.js
- Frontend - KOU SENG Website
- dependencies
- teamData.ts
- Backend - KOU SENG Website API
- MailQueueContext.tsx
- backend/package.json
- index.js
- components.json
- compilerOptions
- authController.js
- Header.tsx
- app/layout.tsx
- announcementsController.js
- KOU SENG Website
- AdminTechnicalTeam
- dependencies
- authMiddleware.js
- general-membership.tsx
- useSubmissions.ts
- publicationsController.js
- cn
- useAuth
- applicationWindow.ts
- loadtest.js
- Projeye özel kurallar
- Backend API Endpoints
- windows-smoke.js
- rich-text-editor.tsx
- clientIp.js
- sponsor-mail.tsx
- api.ts
- submissionsController.js
- (admin-layout)/layout.tsx
- useUser.ts
- Uygulama Tasarım Dili — Tasarım
- postcss.config.mjs
- applicationWindowsController.js
- Başvuru Dönemleri — Tasarım
- aboutData.ts
- contactData.ts
- homeData.ts
- kvkk/page.tsx
- PixelLoader
- applyDetail.tsx
- useAuth.ts
- useContact.ts
- useContact
- data/page.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 85 edges
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
- `Başvuru formuna alan ekleme` --references--> `createGeneralSubmission()`  [INFERRED]
  CLAUDE.md → backend/controllers/submissionsController.js
- `Güvenlik` --references--> `adminOnly()`  [INFERRED]
  docs/superpowers/specs/2026-09-28-basvuru-donemleri-design.md → backend/middlewares/authMiddleware.js
- `Global Constraints` --references--> `PixelMark()`  [INFERRED]
  docs/superpowers/plans/2026-10-01-piksel-havasi-ve-video.md → frontend/src/components/layout/Pixel.tsx
- `Doğrulama` --references--> `PixelMark()`  [INFERRED]
  docs/superpowers/specs/2026-10-01-uygulama-tasarim-dili-design.md → frontend/src/components/layout/Pixel.tsx

## Import Cycles
- None detected.

## Communities (56 total, 4 thin omitted)

### Community 0 - "card.tsx"
Cohesion: 0.23
Nodes (22): AnnouncementsSection(), AnnouncementsSectionProps, PixelMark(), RssSection(), RssSectionProps, HomeProps, Publications(), AspectRatio() (+14 more)

### Community 1 - "mailQueueRoutes.js"
Cohesion: 0.20
Nodes (11): cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob(), attachmentSchema, MailJob, mailJobSchema (+3 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.05
Nodes (39): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node (+31 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.05
Nodes (42): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+34 more)

### Community 4 - "react"
Cohesion: 0.19
Nodes (21): AnnouncementFormData, announcementSchema, Notice, ScopeOption, SCOPES, isEmail(), isPhone(), isProbablyUrl() (+13 more)

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
Cohesion: 0.19
Nodes (11): TeamDetailRoute(), TeamDetail(), TeamDetailProps, Achievement, Competition, getTeamDetail(), getTeamSlugs(), LeaderMessage (+3 more)

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

### Community 17 - "Header.tsx"
Cohesion: 0.12
Nodes (15): RootPage(), Footer(), Header(), NavItem, navItems, NavLinkItem, Home(), ThemeToggle() (+7 more)

### Community 18 - "app/layout.tsx"
Cohesion: 0.12
Nodes (13): Frontend (`frontend/`), İçerik (`frontend/public/data/`), Klasör yapısı, Komutlar, Ortam değişkenleri, Proje, frontend_src_app_globals, jakarta (+5 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.23
Nodes (11): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), getAllSubmissions(), toSearchPattern() (+3 more)

### Community 20 - "KOU SENG Website"
Cohesion: 0.14
Nodes (13): Admin Paneli, Backend, Backend Kurulumu, Frontend, Frontend Kurulumu, Genel Sayfalar, 📋 Gereksinimler, 📞 İletişim (+5 more)

### Community 21 - "AdminTechnicalTeam"
Cohesion: 0.33
Nodes (4): AdminTechnicalTeam(), formatCustomFields(), formatGrade(), formatStatus()

### Community 22 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, json2csv, jsonwebtoken (+5 more)

### Community 23 - "authMiddleware.js"
Cohesion: 0.12
Nodes (22): createUser(), deleteUser(), getAllUsers(), updateUser(), adminOnly(), firstUserCreation(), matchesSystemKey(), protect() (+14 more)

### Community 24 - "general-membership.tsx"
Cohesion: 0.26
Nodes (10): AdminGeneralMembership(), formatCustomFields(), formatGrade(), formatStatus(), isEmail(), isPhone(), isProbablyUrl(), renderValue() (+2 more)

### Community 25 - "useSubmissions.ts"
Cohesion: 0.15
Nodes (12): BaseSubmissionData, GeneralSubmissionData, ListSubmissionsParams, PurgeScope, SubmissionData, SubmissionListItem, SubmissionListResponse, SubmissionPagination (+4 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.26
Nodes (10): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), router (+2 more)

### Community 27 - "cn"
Cohesion: 0.05
Nodes (64): DashboardLayoutProps, AdminSidebar(), NavItem, navItems, DialogOverlay(), DialogTrigger(), DropdownMenu(), DropdownMenuCheckboxItem() (+56 more)

### Community 28 - "useAuth"
Cohesion: 0.16
Nodes (11): AdminDashboardLayout(), ChangePasswordDialog(), AdminDashboard(), useAuth(), SendMailPayload, useSponsorMail(), UseSponsorMailReturn, StatusData (+3 more)

### Community 29 - "applicationWindow.ts"
Cohesion: 0.10
Nodes (20): Review Focus, Task 1: Pencere kuralı (saf fonksiyonlar) ve birim testleri, Task 4: Frontend veri katmanı, Task 5: Başvuru sayfaları durumu backend'den okur, JSON temizliği, Task 6: Admin paneli "Başvuru Dönemleri" sayfası, AdminApplicationWindows(), WindowCard(), Application (+12 more)

### Community 30 - "loadtest.js"
Cohesion: 0.12
Nodes (13): BASE, body(), C, N, one(), RUN, SUBMIT, Global Constraints (+5 more)

### Community 31 - "Projeye özel kurallar"
Cohesion: 0.11
Nodes (20): Backend ESM — `node --check` yalan söylüyor, Başvuru dönemleri, Başvuru formuna alan ekleme, Başvuruları silme (saklama süresi), Branch'ler, `check:content`, Commit, PR ve dokümanlarda yapay zekâ izi yok, Duyuru HTML'i ve CSP (+12 more)

### Community 32 - "Backend API Endpoints"
Cohesion: 0.25
Nodes (7): Backend API Endpoints, Duyurular (Announcements) - YAPILDI, Gelen Başvurular (Submissions), İletişim Mesajları (Contact Messages) - YAPILDI, Kimlik Doğrulama (Authentication) - YAPILDI, Kullanıcı Yönetimi (Admin) - YAPILDI, Yayınlar (Publications) - YAPILDI

### Community 33 - "windows-smoke.js"
Cohesion: 0.22
Nodes (9): api(), applicant(), BASE, expectClosed(), expectStatus(), RUN, setWindow(), submit() (+1 more)

### Community 34 - "rich-text-editor.tsx"
Cohesion: 0.11
Nodes (14): RichTextEditor, RichTextEditorProps, RichTextEditorRef, AdminAnnouncements(), formatDate(), Announcements(), Announcement, ApiResponse (+6 more)

### Community 35 - "clientIp.js"
Cohesion: 0.29
Nodes (7): clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, keyGenerator(), ref_node_net

### Community 36 - "sponsor-mail.tsx"
Cohesion: 0.14
Nodes (9): Message, STATE_BADGE, BLOCK_LABELS, BlockType, Button(), buttonVariants, UseApplicationWindowsReturn, ApplyLayout() (+1 more)

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 38 - "submissionsController.js"
Cohesion: 0.22
Nodes (16): getWindow(), createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV(), getSubmissionById(), isGrade(), isText() (+8 more)

### Community 40 - "useUser.ts"
Cohesion: 0.20
Nodes (7): AdminManagement(), formatRole(), CreateUserRequest, UpdateUserRequest, UserResponse, useUser(), UseUserReturn

### Community 41 - "Uygulama Tasarım Dili — Tasarım"
Cohesion: 0.17
Nodes (11): Amaç, Ana sayfa hero'su: koyu bant, Deploy, Diğer düzeltmeler, Doğrulama, Erişilebilirlik, Header, Kapsam dışı (+3 more)

### Community 43 - "applicationWindowsController.js"
Cohesion: 0.26
Nodes (13): getWindows(), toDate(), updateWindow(), APPLICATION_SLUGS, DEFAULT_WINDOWS, isWindowOpen(), T, toPublicWindow() (+5 more)

### Community 44 - "Başvuru Dönemleri — Tasarım"
Cohesion: 0.12
Nodes (15): Admin paneli, Amaç, Backend, Başvuru Dönemleri — Tasarım, Başvuru sayfaları, Deploy, Endpoint'ler, Frontend (+7 more)

### Community 45 - "aboutData.ts"
Cohesion: 0.20
Nodes (10): AboutRoute(), About(), AboutProps, AboutData, BoardMember, FocusArea, getAboutData(), iconMap (+2 more)

### Community 46 - "contactData.ts"
Cohesion: 0.18
Nodes (8): Contact(), ContactData, ContactInfo, getContactData(), MapData, PageContent, SocialMediaLink, ref_path

### Community 47 - "homeData.ts"
Cohesion: 0.18
Nodes (10): AnnouncementsData, ClubFeature, ClubIntroductionData, HeroButton, HeroData, HeroStat, HomeData, iconMap (+2 more)

### Community 48 - "kvkk/page.tsx"
Cohesion: 0.31
Nodes (7): KvkkRoute(), metadata, Kvkk(), getKvkkData(), KvkkData, KvkkSection, ref_fs

### Community 49 - "PixelLoader"
Cohesion: 0.28
Nodes (8): Global Constraints, Piksel Havası ve Tanıtım Videosu — Uygulama Planı, Review Focus, Task 1: Site geneli piksel parçaları ve kenarlık, Task 2: Koyu hero ve header markası, Task 4: Regresyon, CLAUDE.md, görüntüler ve PR, Piksel öğelerinin kuralları, PixelLoader()

### Community 50 - "applyDetail.tsx"
Cohesion: 0.12
Nodes (26): formSchema, FormValues, AdminLogin(), loginFormSchema, LoginFormValues, frontend_src_components_ui_form_form, FormControl(), FormDescription() (+18 more)

### Community 51 - "useAuth.ts"
Cohesion: 0.22
Nodes (8): AuthError, AuthUser, getStoredToken(), LoginRequestBody, LoginResponse, MIN_PASSWORD_LENGTH, setStoredToken(), UseAuthReturn

### Community 52 - "useContact.ts"
Cohesion: 0.33
Nodes (5): ContactFormValues, ContactListResponse, ContactMessage, ContactResponse, UseContactReturn

### Community 53 - "useContact"
Cohesion: 0.40
Nodes (3): ContactForm(), AdminContact(), useContact()

## Knowledge Gaps
- **373 isolated node(s):** `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES`, `T` (+368 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 435 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `card.tsx`, `frontend/package.json`, `rich-text-editor.tsx`, `sponsor-mail.tsx`, `useUser.ts`, `MailQueueContext.tsx`, `Header.tsx`, `applyDetail.tsx`, `useAuth.ts`, `useContact.ts`, `admin/page.tsx`, `general-membership.tsx`, `useSubmissions.ts`, `cn`, `useAuth`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Why does `ApplicationWindow` connect `Projeye özel kurallar` to `sponsor-mail.tsx`, `submissionsController.js`, `applicationWindowsController.js`, `authMiddleware.js`, `applicationWindow.ts`?**
  _High betweenness centrality (0.083) - this node is a cross-community bridge._
- **Why does `next` connect `card.tsx` to `frontend/package.json`, `purge-submissions.js`, `sponsor-mail.tsx`, `teamData.ts`, `MailQueueContext.tsx`, `kvkk/page.tsx`, `Header.tsx`, `app/layout.tsx`, `applyDetail.tsx`, `admin/page.tsx`, `cn`?**
  _High betweenness centrality (0.073) - this node is a cross-community bridge._
- **What connects `__dirname`, `assetsDir`, `customFields` to the rest of the system?**
  _373 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.047619047619047616 - nodes in this community are weakly interconnected._
- **Should `purge-submissions.js` be split into smaller, more focused modules?**
  _Cohesion score 0.052244897959183675 - nodes in this community are weakly interconnected._
- **Should `Frontend - KOU SENG Website` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._