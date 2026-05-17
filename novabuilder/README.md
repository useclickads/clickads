# NovaBuilder Monorepo

This repository contains the NovaBuilder monorepo with apps and packages for the platform.

Quickstart

- Run `pnpm install` at repo root.
- Start Postgres and Redis with `docker compose up -d postgres redis`.
- Apply migrations and seed the API:

```bash
export DATABASE_URL="postgresql://novabuilder:novabuilder@localhost:5432/novabuilder"
pnpm --filter @novabuilder/api run migrate:dev
pnpm --filter @novabuilder/api run seed
```

Development notes:
- API: see `apps/api` for NestJS server, modules, and seeds.
- Billing: `apps/api/src/modules/billing` contains a Stripe provider stub and billing endpoints.
- Observability: Sentry and OpenTelemetry integrations live in `apps/api/src/observability` and are initialised in `apps/api/src/main.ts`.
- Tests: run `pnpm -w test` (vitest) once installed and configured.
