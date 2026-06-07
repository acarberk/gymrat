# @gymrat/api

NestJS 11 backend on Fastify.

Foundation modules wired up: Config (Zod), Logger (Pino), Prisma, Redis,
Throttler (Redis-backed, fail-closed), Health (Postgres + Redis ping).

Auth, User, Mailer, Turnstile modules land in a follow-up PR.

## Local development

```sh
cp ../../.env.example ../../.env
docker compose -f ../../docker-compose.yml up -d
pnpm --filter @gymrat/api prisma:generate
pnpm --filter @gymrat/api prisma:migrate:dev
pnpm --filter @gymrat/api dev
```

The Swagger UI is served at `http://localhost:3001/api/docs` in development.
The `/health` endpoint returns `200` when both Postgres and Redis respond.
