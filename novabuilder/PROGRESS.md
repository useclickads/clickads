# Project Progress

## Completed

- Wired backend auth into `apps/api/src/app.module.ts`.
- Implemented the NestJS auth module and services:
  - `AuthService`, `MagicLinkService`, `RefreshStrategy`, `JwtStrategy`, `SessionService`, `MfaService`, `PrismaService`
  - optional OAuth strategy support and RBAC guard registration
- Added backend auth endpoints in `apps/api/src/modules/auth/auth.controller.ts`:
  - `/api/auth/signup` (password-based account creation)
  - `/api/auth/login`
  - `/api/auth/magic-link`
  - `/api/auth/magic-link/verify`
  - `/api/auth/refresh`
  - `/api/auth/logout`
  - `/api/auth/forgot-password`
  - `/api/auth/reset-password`
  - `/api/auth/me`
- Implemented magic link flow with database-backed token persistence (`MagicLink` model).
- Implemented password-based signup with bcrypt hashing and `passwordHash` field on User model.
- Implemented password reset flow with database-backed token persistence (`PasswordReset` model).
- Implemented role-based access control support via `RbacGuard` and permissions metadata.
- Built frontend web auth experience in `apps/web`:
  - app root layout uses `AuthProvider` with automatic token refresh
  - login page with password auth and redirect to dashboard
  - signup page with password + name registration
  - magic link page that requests and verifies tokens
  - forgot-password page for requesting reset tokens
  - reset-password page for setting a new password
  - auth success page with auto-redirect to dashboard
  - protected dashboard page behind `ProtectedRoute` guard
- Added `ProtectedRoute` component in `apps/web/components/protected-route.tsx`.
- Frontend `AuthProvider` handles:
  - localStorage session persistence
  - automatic JWT refresh before expiry (with deduplication)
  - `getAccessToken()` helper for authenticated API calls
  - proper logout with API call to revoke refresh token
- Added shared frontend auth API helpers in `apps/web/lib/auth.ts` (signup, login, refresh, logout, forgotPassword, resetPassword, fetchAuthenticated).
- Enabled CORS on the API for frontend origin.
- Fixed frontend compile issues and validated `pnpm --filter @novabuilder/web exec tsc --noEmit` and `pnpm --filter @novabuilder/api exec tsc --noEmit` successfully.

## Remaining work

- Run database migration (`prisma migrate dev`) to apply new schema (MagicLink, PasswordReset models, User.passwordHash field).
- Confirm `apps/api` runtime startup and API route health with a live database.
- Implement email delivery for magic links and password reset tokens (currently tokens returned in API response for dev).
- Expand RBAC enforcement to real backend resources (projects, pages, editor controllers).
- Add a projects CRUD module and wire it to the dashboard.
- Add tests for auth flows, route protection, and session management.
- Add proper error boundaries and loading states to the frontend.

## Notes

- Frontend auth pages use the shared `apps/web/lib/auth.ts` client helpers.
- Auth state is managed through `AuthProvider` with full session refresh and localStorage persistence.
- The API URL falls back to `http://localhost:3001` when `NEXT_PUBLIC_API_URL` is not set.
- CORS origin defaults to `http://localhost:3000`.
- Magic link and password reset tokens are stored in the database (not in-memory), surviving server restarts.
