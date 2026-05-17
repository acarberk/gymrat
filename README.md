# Gymrat

[![CI](https://github.com/acarberk/gymrat/actions/workflows/ci.yml/badge.svg)](https://github.com/acarberk/gymrat/actions/workflows/ci.yml)
[![CodeQL](https://github.com/acarberk/gymrat/actions/workflows/codeql.yml/badge.svg)](https://github.com/acarberk/gymrat/actions/workflows/codeql.yml)

Nutrition and workout tracking PWA — paywall-free, ad-free, with a curated
Turkish food database that no major competitor has.

## Why

Major nutrition apps (MyFitnessPal, Lose It!) moved core features behind
paywalls in 2024-2025. Workout-focused apps (Strong, Hevy) do not handle
nutrition. Turkish home cooking (lahmacun, mercimek çorbası, mantı) is
unsupported or wildly inaccurate in user-contributed databases. Gymrat fills
this gap in one app.

## Phase 1 — MVP

- Email + Google + Apple auth (JWT + refresh token)
- Onboarding with BMR/TDEE/macro calculation (Mifflin-St Jeor)
- Nutrition log: manual entry, Open Food Facts barcode scan, curated Turkish food DB
- Workout log: free-exercise-db library, sets/reps/weight tracking, RPE
- Two starter programs: Push/Pull/Legs (6 day), Full Body (3 day)
- Gamification: XP, levels, streaks (Duolingo-style)
- PWA: offline-capable, installable, mobile-first
- i18n: Turkish (default) and English

## Tech Stack

**Frontend**

- Next.js 16 (App Router, Server Components)
- React 19
- TanStack Query for data fetching
- Zustand for client state
- React Hook Form + Zod for forms and validation
- Tailwind CSS 4 + shadcn/ui

**Backend**

- NestJS 11 with Fastify adapter
- TypeScript strict mode
- JWT + Passport.js
- Bull Queue for async jobs
- Pino structured logging
- Zod runtime validation
- Cloudflare Turnstile bot protection

**Data**

- PostgreSQL (primary)
- Redis (cache, session, queue backend, rate limit)
- Prisma ORM

**Infrastructure**

- pnpm + Turborepo monorepo
- Vercel (web hosting)
- Railway (api + db + redis)
- GitHub Actions CI/CD, CodeQL, Dependabot

**Data sources**

- [Open Food Facts](https://world.openfoodfacts.org) — barcoded products (ODbL)
- [USDA FoodData Central](https://fdc.nal.usda.gov) — raw foods (public domain)
- [free-exercise-db](https://github.com/yuhonas/free-exercise-db) — exercises (Unlicense)
- Curated Turkish food database — original work

## Repository Layout

```
apps/
  api/      NestJS backend
  web/      Next.js frontend
packages/
  config/   Shared tsconfig + eslint + prettier presets
  shared/   Shared types, Zod schemas, constants, pure utils
  ui/       Shared React UI components (shadcn-based)
```

## Getting Started

See [CONTRIBUTING.md](./CONTRIBUTING.md).

## Status

Early development. Phase 1 (MVP) in progress. Not yet deployed.
