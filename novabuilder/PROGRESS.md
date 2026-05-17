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

### Editor Module (Backend)
- Pages CRUD nested under projects (`/api/projects/:projectId/pages`)
- Content save endpoint (`PUT /api/projects/:projectId/pages/:id/content`)
- Blocks service + controller (list blocks by project)

### Billing Module (Scaffold)
- Subscribe endpoint, usage recording
- Stripe provider placeholder

### Realtime (Scaffold)
- WebSocket gateway with Socket.io

### Observability
- OpenTelemetry initialization
- Sentry integration

---

## Remaining Work

### High Priority
- Run `prisma migrate dev` to apply latest schema changes (MagicLink, PasswordReset, User.passwordHash, Page.content)
- Implement email delivery for magic links and password reset tokens (currently tokens returned in response for dev)
- Implement nested blocks (children inside Columns block)
- Add inline text editing (contentEditable) in the canvas
- Add block reordering via up/down buttons (not just drag)

### Medium Priority
- Expand RBAC: project-scoped roles, team member access, collaborator invites
- Wire billing module to Stripe API (checkout, webhooks, subscription management)
- Implement CMS collections CRUD (create/manage dynamic content types)
- Asset management: file upload (S3/R2), folder management, image optimization
- Deployment/publishing pipeline: build pages → static output → deploy to edge
- Domain management: custom domain verification, DNS instructions, SSL

### Lower Priority
- Admin panel (apps/admin) for platform management
- Real-time collaboration: presence cursors, conflict resolution via OT/CRDT
- AI generation features: page generation from prompt, block suggestions
- Analytics: page views, heatmaps, funnel tracking
- Marketplace: plugin publishing, purchasing, installation
- Webhooks and integrations (third-party service connectors)
- Add comprehensive test suites (unit, integration, e2e)
- Landing page (apps/landing) with marketing content

---

## Notes

- Frontend auth pages use shared `apps/web/lib/auth.ts` client helpers.
- `ApiClient` in `apps/web/lib/api.ts` handles authenticated requests with auto token refresh.
- The API URL defaults to `http://localhost:3001`, CORS origin to `http://localhost:3000`.
- Magic link and password reset tokens are stored in DB (survive restarts).
- Projects are soft-deleted (retain data for recovery).
- All TypeScript compilation passes for both `@novabuilder/web` and `@novabuilder/api`.
