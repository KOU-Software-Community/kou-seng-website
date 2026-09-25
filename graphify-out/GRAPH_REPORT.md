# Graph Report - kou-seng-website  (2026-09-25)

## Corpus Check
- 155 files · ~83,530 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 8 file(s) not represented in the graph (top: (none) 4, .example 2, .ico 1)

## Summary
- 885 nodes · 1881 edges · 43 communities (40 shown, 3 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 68 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `4e6bed73`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- react
- cn
- frontend/package.json
- purge-submissions.js
- Projeye özel kurallar
- mailQueueProcessor.js
- utils.ts
- Frontend - KOU SENG Website
- dependencies
- authMiddleware.js
- Backend - KOU SENG Website API
- MailQueueContext.tsx
- backend/package.json
- index.js
- components.json
- compilerOptions
- authController.js
- homeData.ts
- rich-text-editor.tsx
- announcementsController.js
- KOU SENG Website
- submissionsController.js
- dependencies
- aboutData.ts
- teamData.ts
- useSubmissions.ts
- publicationsController.js
- useAuth
- useUser.ts
- contactData.ts
- loadtest.js
- contactRoutes.js
- Backend API Endpoints
- kvkk/page.tsx
- clientIp.js
- useStatus.ts
- useAuth.ts
- api.ts
- useContact.ts
- (admin-layout)/layout.tsx
- useAnnouncements.ts
- AdminContact
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
- `İlk admin oluşturma (deploy edilmiş sunucuda)` --references--> `createUser()`  [INFERRED]
  CLAUDE.md → backend/controllers/userController.js

## Import Cycles
- None detected.

## Communities (43 total, 3 thin omitted)

### Community 0 - "react"
Cohesion: 0.06
Nodes (89): AnnouncementsSection(), AnnouncementsSectionProps, ContactForm(), formSchema, FormValues, RssSection(), RssSectionProps, AnnouncementFormData (+81 more)

### Community 1 - "cn"
Cohesion: 0.05
Nodes (62): DashboardLayoutProps, AdminSidebar(), NavItem, navItems, DialogOverlay(), DialogTrigger(), DropdownMenu(), DropdownMenuCheckboxItem() (+54 more)

### Community 2 - "frontend/package.json"
Cohesion: 0.05
Nodes (40): eslintConfig, devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, tw-animate-css, @types/node (+32 more)

### Community 3 - "purge-submissions.js"
Cohesion: 0.06
Nodes (35): args, __dirname, dryRun, rollback, all, args, BACKEND_ROOT, category (+27 more)

### Community 4 - "Projeye özel kurallar"
Cohesion: 0.05
Nodes (30): Backend ESM — `node --check` yalan söylüyor, Başvuruları silme (saklama süresi), `check:content`, Duyuru HTML'i ve CSP, Frontend (`frontend/`), graphify, Görsel hazırlama, İçerik (`frontend/public/data/`) (+22 more)

### Community 5 - "mailQueueProcessor.js"
Cohesion: 0.10
Nodes (29): assetsDir, __dirname, sendSponsorMail(), cancelMailJob(), createMailJob(), deleteMailJob(), getMailJobs(), sanitizeJob() (+21 more)

### Community 6 - "utils.ts"
Cohesion: 0.10
Nodes (20): ApplicationEntry, getApplicationSlugs(), getBaseUrl(), getTeamSlugs(), sitemap(), TeamFileEntry, Footer(), Header() (+12 more)

### Community 7 - "Frontend - KOU SENG Website"
Cohesion: 0.07
Nodes (27): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Development Server'ı Başlatma, 4. Production Build, Admin Paneli, 📊 Analytics ve Monitoring, Code Style, 🚀 Deployment (+19 more)

### Community 8 - "dependencies"
Cohesion: 0.08
Nodes (25): dependencies, class-variance-authority, clsx, date-fns, @fortawesome/fontawesome-svg-core, @fortawesome/free-brands-svg-icons, @fortawesome/free-regular-svg-icons, @fortawesome/free-solid-svg-icons (+17 more)

### Community 9 - "authMiddleware.js"
Cohesion: 0.14
Nodes (19): createUser(), deleteUser(), getAllUsers(), updateUser(), adminOnly(), firstUserCreation(), matchesSystemKey(), protect() (+11 more)

### Community 10 - "Backend - KOU SENG Website API"
Cohesion: 0.08
Nodes (23): 1. Bağımlılıkları Yükleme, 2. Environment Variables, 3. Server'ı Başlatma, Ana Package Dosyaları, Announcements, 📚 API Endpoints, Authentication, Backend - KOU SENG Website API (+15 more)

### Community 11 - "MailQueueContext.tsx"
Cohesion: 0.09
Nodes (20): AdminSponsorMail(), createBlock(), formatDate(), parseEmails(), QueueJobCard(), authHeaders(), EnqueueInput, MailQueueContext (+12 more)

### Community 12 - "backend/package.json"
Cohesion: 0.09
Nodes (22): author, description, devDependencies, nodemon, keywords, license, main, name (+14 more)

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
Cohesion: 0.20
Nodes (9): changePassword(), getMe(), loginUser(), getSystemStatus(), generateToken(), submissionSchema, MIN_PASSWORD_LENGTH, UserSchema (+1 more)

### Community 17 - "homeData.ts"
Cohesion: 0.15
Nodes (13): RootPage(), Home(), AnnouncementsData, ClubFeature, ClubIntroductionData, getHomeData(), HeroButton, HeroData (+5 more)

### Community 18 - "rich-text-editor.tsx"
Cohesion: 0.16
Nodes (9): RichTextEditor, RichTextEditorProps, RichTextEditorRef, AdminAnnouncements(), formatDate(), Announcements(), ALLOWED_TAGS, cleanNode() (+1 more)

### Community 19 - "announcementsController.js"
Cohesion: 0.25
Nodes (10): cleanContent(), createAnnouncement(), deleteAnnouncement(), getAnnouncement(), getAnnouncements(), updateAnnouncement(), toSearchPattern(), announcementSchema (+2 more)

### Community 20 - "KOU SENG Website"
Cohesion: 0.14
Nodes (13): Admin Paneli, Backend, Backend Kurulumu, Frontend, Frontend Kurulumu, Genel Sayfalar, 📋 Gereksinimler, 📞 İletişim (+5 more)

### Community 21 - "submissionsController.js"
Cohesion: 0.29
Nodes (11): createGeneralSubmission(), createTechnicalSubmission(), csvString(), exportSubmissionsToCSV(), getAllSubmissions(), getSubmissionById(), isText(), PURGE_SCOPES (+3 more)

### Community 22 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, bcryptjs, cors, dotenv, express, express-rate-limit, json2csv, jsonwebtoken (+5 more)

### Community 23 - "aboutData.ts"
Cohesion: 0.18
Nodes (11): AboutRoute(), About(), AboutProps, AboutData, BoardMember, FocusArea, getAboutData(), iconMap (+3 more)

### Community 24 - "teamData.ts"
Cohesion: 0.19
Nodes (11): TeamDetailRoute(), TeamDetail(), TeamDetailProps, Achievement, Competition, getTeamDetail(), getTeamSlugs(), LeaderMessage (+3 more)

### Community 25 - "useSubmissions.ts"
Cohesion: 0.15
Nodes (12): BaseSubmissionData, GeneralSubmissionData, ListSubmissionsParams, PurgeScope, SubmissionData, SubmissionListItem, SubmissionListResponse, SubmissionPagination (+4 more)

### Community 26 - "publicationsController.js"
Cohesion: 0.26
Nodes (10): customFields, extractCoverImage(), extractExcerpt(), extractSourceName(), fetchAllRssFeeds(), formatDate(), getRssFeed(), router (+2 more)

### Community 27 - "useAuth"
Cohesion: 0.18
Nodes (9): AdminDashboardLayout(), ChangePasswordDialog(), AdminLogin(), setStoredToken(), useAuth(), MailBlock, SendMailPayload, useSponsorMail() (+1 more)

### Community 28 - "useUser.ts"
Cohesion: 0.18
Nodes (8): AdminManagement(), formatRole(), CreateUserRequest, UpdateUserRequest, User, UserResponse, useUser(), UseUserReturn

### Community 29 - "contactData.ts"
Cohesion: 0.18
Nodes (8): Contact(), ContactData, ContactInfo, getContactData(), MapData, PageContent, SocialMediaLink, ref_fs

### Community 30 - "loadtest.js"
Cohesion: 0.22
Nodes (7): BASE, body(), C, N, one(), RUN, SUBMIT

### Community 31 - "contactRoutes.js"
Cohesion: 0.33
Nodes (6): createContactMessage(), deleteContactMessage(), getContactMessages(), updateContactIsRead(), contactSchema, router

### Community 32 - "Backend API Endpoints"
Cohesion: 0.22
Nodes (8): Backend API Endpoints, Başvuru Formları Yönetimi (Recruitments), Duyurular (Announcements) - YAPILDI, Gelen Başvurular (Submissions), İletişim Mesajları (Contact Messages) - YAPILDI, Kimlik Doğrulama (Authentication) - YAPILDI, Kullanıcı Yönetimi (Admin) - YAPILDI, Yayınlar (Publications) - YAPILDI

### Community 33 - "kvkk/page.tsx"
Cohesion: 0.36
Nodes (6): KvkkRoute(), metadata, Kvkk(), getKvkkData(), KvkkData, KvkkSection

### Community 34 - "clientIp.js"
Cohesion: 0.29
Nodes (7): clientIp(), CLOUDFLARE_RANGES, fromTrustedHop(), LOCAL_RANGES, trustedHops, keyGenerator(), ref_node_net

### Community 35 - "useStatus.ts"
Cohesion: 0.25
Nodes (5): AdminDashboard(), StatusData, StatusResponse, useStatus(), UseStatusReturn

### Community 36 - "useAuth.ts"
Cohesion: 0.25
Nodes (7): AuthError, AuthUser, getStoredToken(), LoginRequestBody, LoginResponse, MIN_PASSWORD_LENGTH, UseAuthReturn

### Community 37 - "api.ts"
Cohesion: 0.29
Nodes (4): Announcement, AnnouncementsResponse, RssFeedResponse, RssItem

### Community 38 - "useContact.ts"
Cohesion: 0.33
Nodes (5): ContactFormValues, ContactListResponse, ContactMessage, ContactResponse, UseContactReturn

### Community 40 - "useAnnouncements.ts"
Cohesion: 0.40
Nodes (4): Announcement, ApiResponse, CreateAnnouncementRequest, UpdateAnnouncementRequest

## Knowledge Gaps
- **343 isolated node(s):** `__dirname`, `assetsDir`, `customFields`, `PURGE_SCOPES`, `CLOUDFLARE_RANGES` (+338 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 394 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `react` to `cn`, `frontend/package.json`, `purge-submissions.js`, `Projeye özel kurallar`, `kvkk/page.tsx`, `utils.ts`, `MailQueueContext.tsx`, `teamData.ts`?**
  _High betweenness centrality (0.100) - this node is a cross-community bridge._
- **Why does `react` connect `react` to `cn`, `frontend/package.json`, `useStatus.ts`, `Projeye özel kurallar`, `useAuth.ts`, `utils.ts`, `useContact.ts`, `useAnnouncements.ts`, `MailQueueContext.tsx`, `rich-text-editor.tsx`, `useSubmissions.ts`, `useAuth`, `useUser.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Why does `@fortawesome/free-solid-svg-icons` connect `react` to `cn`, `frontend/package.json`, `utils.ts`, `homeData.ts`, `rich-text-editor.tsx`, `aboutData.ts`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **What connects `__dirname`, `assetsDir`, `customFields` to the rest of the system?**
  _343 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `react` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05328005328005328 - nodes in this community are weakly interconnected._
- **Should `frontend/package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._