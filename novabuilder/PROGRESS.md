# Project Progress

## Completed

### Infrastructure
- Turborepo monorepo with pnpm workspaces (apps: api, web, admin, landing, workers; packages: shared, ui, design-system, editor-core, ai-engine)
- NestJS API on port 3001 with global `/api` prefix and CORS
- Next.js web app with TypeScript
- Prisma schema with 40+ models (users, projects, pages, blocks, CMS, billing, analytics, collaboration, plugins, etc.)
- GitHub CI workflow, Docker Compose for Postgres + Redis
- Vitest config at root level

### Authentication (Full)
- Password-based signup with bcrypt hashing (`/api/auth/signup`)
- Password login (`/api/auth/login`)
- Magic link auth with database-backed token storage (`/api/auth/magic-link`, `/api/auth/magic-link/verify`)
- JWT access tokens (15min) + refresh token rotation (`/api/auth/refresh`)
- Logout with refresh token revocation (`/api/auth/logout`)
- Password reset flow: forgot + reset endpoints (`/api/auth/forgot-password`, `/api/auth/reset-password`)
- `/api/auth/me` - get current user (JWT protected)
- Role-based access control via `RbacGuard` + `@Permissions()` decorator
- Passport.js JWT strategy, optional Google OAuth strategy
- MFA service (speakeasy), Session service (Redis)

### Frontend Auth
- `AuthProvider` with localStorage persistence and automatic JWT refresh (deduplicates concurrent refreshes)
- `getAccessToken()` method for authenticated API calls
- Login, signup, magic link, forgot-password, reset-password pages
- Auth success page with auto-redirect to dashboard
- `ProtectedRoute` component for guarding authenticated pages

### Projects CRUD (Backend)
- `ProjectsModule` with full CRUD: list, create, get, update, soft-delete
- All endpoints JWT-protected, scoped to the owning user
- Slug uniqueness validation, alphanumeric slug enforcement
- Includes page/deployment counts in list responses

### Pages CRUD (Backend)
- `PagesController` nested under `/api/projects/:projectId/pages`
- List, create, get, update, soft-delete
- All endpoints JWT-protected

### Frontend Dashboard
- Protected `/dashboard` page showing project list with counts
- Create project form with auto-slug generation
- Project detail page (`/dashboard/projects/[id]`) with pages list
- Add page form within project detail
- `ApiClient` utility class with authenticated `get/post/patch/delete`
- `useApi()` hook providing auth-aware API client

### Visual Page Editor
- Drag-and-drop block editor at `/editor/[projectId]/[pageId]`
- 11 block types: Hero, Text, Image, Button, Columns, Spacer, Card, Navigation, Footer, Form, Video
- Block panel sidebar with category tabs (Layout, Content, Media, Interactive)
- Live canvas with drag-to-reorder and drop-to-add
- Properties panel with type-aware inputs (text, textarea, color picker, select, checkbox, number)
- Block actions: select, duplicate, delete (via panel or keyboard)
- Keyboard shortcuts: Cmd+S save, Cmd+Z undo, Cmd+Shift+Z redo, Cmd+D duplicate, Delete remove, Escape deselect
- Undo/redo with 50-step history stack
- Responsive preview toggle (Desktop / Tablet 768px / Mobile 375px)
- Page publish/unpublish toggle from project detail
- Project preview page (`/preview/[projectId]`) renders all blocks without editor chrome
- Editor state management via React useReducer (add, remove, move, update, duplicate, set)
- Page content saved as JSON to the `Page.content` field via `PUT /api/projects/:id/pages/:id/content`
- Each block has a visual renderer matching its type (full preview in canvas)

### Canvas Enhancements
- Block action toolbar: move up/down, duplicate, delete buttons on each block
- Inline text editing via `contentEditable` (InlineEdit component)
- EditableBlockRenderer wraps hero, text, button, card blocks for direct editing
- Nested block support (children inside Columns block)

### Teams & Collaboration (Backend)
- `TeamsModule` with collaborator CRUD (`/api/projects/:projectId/team/collaborators`)
- Invite by email, role assignment (viewer/editor/admin), accept invite
- Team creation and team member management
- Frontend team management page (`/dashboard/projects/[id]/team`) with invite form and role editing

### Deployment/Publishing
- `DeployModule` with deploy trigger + history endpoints (`/api/projects/:projectId/deploy`)
- Static HTML generation from block JSON (hero, text, image, button, spacer, columns, card)
- Deployment record tracking (status, URL, timestamp)
- Publish history per deployment with user attribution
- Frontend deploy page (`/dashboard/projects/[id]/deploy`) with deploy button and history list

### SEO Settings
- Per-page SEO: meta title, meta description, OG image, noIndex flag
- Backend endpoints: `PUT/GET /api/projects/:projectId/pages/:id/seo`
- SEO panel in editor with Google SERP preview
- Character counters for title (70) and description (160)

### Theme / Design Tokens
- `ThemeModule` with CRUD for design tokens (`/api/projects/:projectId/theme/tokens`)
- Token types: color, font, spacing, border-radius, shadow
- Theme versioning (snapshot all tokens at a point in time)
- Frontend theme settings page (`/dashboard/projects/[id]/theme`) with color picker

### Domain Management
- `DomainsModule` with domain CRUD (`/api/projects/:projectId/domains`)
- DNS instruction generation (CNAME + TXT verification record)
- Domain verification flow
- Frontend domains page (`/dashboard/projects/[id]/domains`) with DNS table

### Page Templates
- 5 starter templates: Blank, Landing Page, About, Contact, Blog Post
- Template selection in the "Add Page" form
- Templates pre-populate blocks on page creation

### Form Submissions
- `FormsModule` with public submit endpoint (`POST /api/projects/:projectId/forms/submit`)
- Submissions viewer page (`/dashboard/projects/[id]/forms`) with per-form filtering
- List distinct form names, view/delete individual submissions
- No auth required on submit (public-facing forms), auth required for management

### Project Settings
- `SettingsModule` with GET/PUT for project-level settings (`/api/projects/:projectId/settings`)
- Global header/footer (JSON blocks applied to all deployed pages)
- Code injection: head scripts and body scripts
- Favicon and default social image
- Frontend settings page (`/dashboard/projects/[id]/settings`) with General and Code Injection tabs
- Deploy pipeline now includes: SEO meta, global header/footer, head/body scripts, favicon in generated HTML

### Version History & Rollback
- Auto-snapshots on every content save (previous state stored as Snapshot)
- Version history endpoint (`GET /api/projects/:projectId/pages/:id/versions`)
- Restore endpoint (`POST /api/projects/:projectId/pages/:id/versions/:snapshotId/restore`)
- Version history panel in the editor (History tab) with one-click restore

### Global Search
- `SearchModule` with cross-entity search (`GET /api/search?q=...`)
- Searches projects (name, slug, description), pages (title, slug, path), CMS collections (name, slug)
- Scoped to the authenticated user's projects
- Frontend search page (`/dashboard/search`) with categorized results and direct links

### User Profile & Account
- `UsersModule` with profile CRUD (`GET/PATCH /api/users/profile`)
- Password change endpoint with current password verification
- Account deletion (soft delete)
- Frontend profile page (`/dashboard/profile`) with Profile and Password tabs
- Search and Profile links in dashboard header

### Analytics (Full)
- `AnalyticsModule` with event tracking (`POST /api/projects/:projectId/analytics/track`)
- Page view tracking with visitor/session IDs (`POST /api/projects/:projectId/analytics/pageview`)
- Event listing and summary endpoints with date range filtering
- Summary includes: total events, page views, unique visitors, top pages, referrers, daily time series
- Public track/pageview endpoints (no auth), protected management endpoints
- Frontend analytics dashboard (`/dashboard/projects/[id]/analytics`) with 4-stat grid, traffic time series chart
- Tabbed views: By Type, Top Pages, Referrers, Events Log
- Configurable time range (7/30/90 days)

### Audit Logging
- `AuditModule` with log creation and querying (`GET /api/audit`)
- Query by actor or by resource/resourceId
- Frontend activity log page (`/dashboard/activity`) with color-coded action timeline

### Notifications
- `NotificationsModule` with full CRUD (`GET /api/notifications`, `PATCH .../read`, `PATCH .../read-all`)
- Unread count endpoint for badge display
- Frontend notifications center (`/dashboard/notifications`) with mark-read interactions

### Webhooks
- `WebhooksModule` with CRUD + test fire (`/api/projects/:projectId/webhooks`)
- HMAC SHA-256 signature verification on outgoing payloads
- 6 supported events: page.published, page.updated, deployment.created, form.submitted, collaborator.invited, entry.created
- Frontend webhooks page (`/dashboard/projects/[id]/webhooks`) with event selector and test button

### Project Export
- `ExportModule` with full project export as JSON (`GET /api/projects/:projectId/export`)
- Exports: pages, CMS collections + entries, settings, theme tokens, domains
- Download endpoint with Content-Disposition header for file save

### Editor Module (Backend)
- Pages CRUD nested under projects (`/api/projects/:projectId/pages`)
- Content save endpoint (`PUT /api/projects/:projectId/pages/:id/content`)
- Blocks service + controller (list blocks by project)

### Billing Module (Full)
- Plans definition: Free ($0), Pro ($29), Business ($99) with project/page/storage limits
- Subscription CRUD: subscribe, cancel, get current subscription
- Invoices endpoint (mock invoice history)
- Usage tracking endpoint (projects, pages, storage used)
- Frontend billing page (`/dashboard/billing`) with plan cards, upgrade/downgrade, cancel
- Stripe provider placeholder for future integration

### API Keys
- `ApiKeysModule` with CRUD (`GET/POST/DELETE /api/api-keys`)
- Key generation with `nova_` prefix + crypto random bytes
- Scope-based permissions (read, write)
- Frontend API keys page (`/dashboard/api-keys`) with generate, copy-to-clipboard, revoke

### Project Import
- `ImportModule` with import endpoint (`POST /api/import`)
- Imports full project from JSON export (pages, CMS collections + entries, settings, theme tokens)
- Unique slug suffix to prevent conflicts

### Landing Page
- Full marketing landing page at app root (`/`)
- Hero section with CTA
- 6 feature cards (Visual Editor, Instant Publish, Team Collaboration, AI-Powered, Analytics, API & Webhooks)
- Pricing section with Free/Pro/Business plan comparison
- Bottom CTA section
- Footer with navigation links

### Real-time Collaboration
- WebSocket gateway with Socket.io (namespace: `/realtime`)
- Presence tracking: join/leave rooms per project+page
- Remote cursor positions with smooth CSS transitions
- Block selection broadcast (see who is editing what)
- Live block updates broadcast to other collaborators
- Real-time comments on pages/blocks
- Auto-assigned unique colors per collaborator
- Frontend presence component with cursor rendering and online user avatars
- `socket.io-client` integration in web app

### Observability
- OpenTelemetry initialization
- Sentry integration

---

## Remaining Work

### High Priority
- Run `prisma migrate dev` to apply latest schema changes (MagicLink, PasswordReset, User.passwordHash, Page.content)
- Implement email delivery for magic links and password reset tokens (currently tokens returned in response for dev)

### Asset Management (Full)
- File upload via multipart (multer), stored locally in `/uploads/`
- Static file serving from uploads directory
- Drag-and-drop file upload on frontend with progress indicator
- Folder management: create, list, delete folders
- Folder filtering on asset listing
- Asset grid with image thumbnails, file type labels, copy URL, delete
- Size formatting and creation date display

### Admin Panel
- `AdminModule` with platform-wide stats, user management, project management, activity log
- API endpoints: `GET /api/admin/stats`, `GET /api/admin/users`, `GET /api/admin/projects`, `GET /api/admin/activity`
- User deletion, project soft-delete from admin
- Admin frontend (`apps/admin`) with sidebar layout
- Dashboard page with stats cards (users, projects, pages, deployments)
- Users page with table, pagination, delete action
- Projects page with table, pagination, delete action
- Activity page with color-coded audit log

### Email System
- `EmailModule` (global) with SMTP transport via nodemailer
- Dev mode: logs emails to console when SMTP not configured
- 5 responsive HTML email templates: magic link, password reset, team invite, welcome, deploy notification
- Table-based layout for cross-client email rendering
- Consistent branding with NovaBuilder header and footer

### Usage Metrics
- `UsageModule` with per-user and per-project usage tracking
- Metrics: projects, pages, storage (from asset sizes), API calls, deployments, bandwidth
- Plan-aware limits tied to subscription tier
- Frontend usage dashboard (`/dashboard/usage`) with progress bars and percentage indicators
- Color-coded bars (green/amber/red) based on consumption level

### Stripe Integration
- Full `StripeProvider` with Stripe API communication
- Checkout session creation for plan upgrades
- Customer portal session for self-service billing management
- Subscription cancellation via Stripe API
- Webhook signature verification (HMAC SHA-256)
- Mock mode when `STRIPE_SECRET_KEY` not configured (graceful dev fallback)
- `stripeCustomerId` and `stripeSubId` fields on Subscription model

### S3/R2 Storage Provider
- Dual-mode `StorageService` supporting local disk and S3/R2
- AWS Signature V4 signing for S3 uploads (no AWS SDK dependency)
- Configurable via env vars: `STORAGE_DRIVER`, `S3_BUCKET`, `S3_REGION`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_ENDPOINT`
- Local fallback (default) stores files in `uploads/` directory
- Signed URL generation for private S3 objects

### Auth Email Integration
- Welcome email on signup
- Magic link email with clickable link
- Password reset email with reset link
- Fire-and-forget delivery (non-blocking auth responses)

### Rate Limiting
- Configurable per-route throttle guard via `@Throttle(limit, windowSeconds)` decorator
- In-memory sliding window rate limiter
- IP-based tracking with automatic window cleanup

### AI Generation
- `AiModule` with page generation, block suggestions, copy generation, content improvement
- Generate full page from prompt: analyzes keywords and creates appropriate block layout
- Smart block suggestions based on existing page content
- Copy generation: headlines, paragraphs, CTAs, taglines with topic awareness
- Content improvement endpoint with actionable suggestions
- AI panel in editor (4th tab) with Suggest, Copy, and Generate modes
- Standalone AI Page Generator (`/dashboard/ai`) with project selector and prompt templates
- Prompt preset buttons for common page types (Portfolio, Ecommerce, SaaS, Restaurant)

### Plugin Marketplace (Full)
- `MarketplaceModule` with plugin publishing, installation, purchasing
- Plugin listing with search and category filtering
- Plugin installation per project with custom config
- Plugin uninstallation
- Marketplace items with pricing (free or paid)
- Purchase tracking per user
- Review/rating system: create, update, delete reviews with 1-5 star ratings
- One review per user per plugin (upsert on duplicate)
- Average rating calculation on plugin detail
- Frontend marketplace page (`/dashboard/marketplace`) with search, category filters, plugin cards
- Plugin detail page (`/dashboard/marketplace/[pluginId]`) with reviews, rating display, review submission form
- Install button, version display, install count, review count, author attribution

### Test Suite
- Vitest configured at root and API app level
- 33 unit tests covering:
  - AI service: page generation, block suggestions, copy generation, content improvement
  - Email templates: all 5 templates render correctly with data interpolation
  - Stripe provider: mock mode behavior, checkout sessions, portal, webhook verification
- `pnpm test` runs all tests via Turborepo
- `pnpm --filter @novabuilder/api test` runs API-specific tests

### Extended Block Types
- 8 new block types: Custom Code, Divider, Testimonial, Pricing, FAQ, Gallery, Map Embed, Countdown
- Full block renderers for canvas preview and deployed HTML generation
- Custom Code block with HTML + CSS injection
- Testimonial block with star rating and author info
- Pricing block with feature list and highlighted variant
- FAQ block with expandable accordion items
- Gallery block with configurable grid columns
- Map Embed block for Google Maps / OpenStreetMap iframes
- Countdown block with live JS timer for deployed pages
- Total block types: 19

### Scheduled Publishing
- Schedule pages to auto-publish at a future date/time
- `PATCH /api/projects/:projectId/pages/:id/schedule` — set scheduled date
- `PATCH /api/projects/:projectId/pages/:id/unschedule` — cancel schedule
- `scheduledAt` field on Page model with index
- Background method to publish all due scheduled pages
- Frontend schedule picker with datetime-local input on project detail page
- Scheduled badge and cancel button on page rows

### Plugin Publish Page
- Frontend plugin publish form (`/dashboard/marketplace/publish`)
- Form fields: name, version, description, author, category, icon, price
- 7 plugin categories (Utility, Design, Analytics, SEO, E-Commerce, Integration, Other)
- Redirects to marketplace on successful publish

### Deploy HTML Generation (Expanded)
- All 19 block types now generate production-ready HTML on deploy
- Navigation, Footer, Form, Video blocks added to HTML renderer
- New blocks (Code, Divider, Testimonial, Pricing, FAQ, Gallery, Map, Countdown) fully supported
- Countdown block includes inline JavaScript timer for live pages

### Page Management
- Page duplication with content and SEO cloning
- Bulk operations: publish, unpublish, delete multiple pages at once
- Duplicate button on each page row in project detail

### Project Cloning
- Clone entire project with all pages and content
- Auto-generates unique slug suffix for cloned project
- Clone button on project detail page

### Dashboard Overview Enhancement
- Quick stats row: projects count, total pages, deployments, unread notifications
- Recent activity feed from audit log on dashboard home
- Link to full activity page

### Lower Priority
- Conflict resolution via OT/CRDT for concurrent block edits
- Integrate OpenAI/Anthropic API for more intelligent generation (currently rule-based)
- Analytics: heatmaps, funnel tracking
- Marketplace: developer API docs, plugin versioning
- Webhooks and integrations (third-party service connectors)
- Expand test coverage (integration tests, e2e with Playwright)

---

## Notes

- Frontend auth pages use shared `apps/web/lib/auth.ts` client helpers.
- `ApiClient` in `apps/web/lib/api.ts` handles authenticated requests with auto token refresh.
- The API URL defaults to `http://localhost:3001`, CORS origin to `http://localhost:3000`.
- Magic link and password reset tokens are stored in DB (survive restarts).
- Projects are soft-deleted (retain data for recovery).
- All TypeScript compilation passes for both `@novabuilder/web` and `@novabuilder/api`.
