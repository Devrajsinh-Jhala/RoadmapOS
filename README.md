# RoadmapOS

RoadmapOS is a constraint-aware life roadmap MVP for ambitious Indian tech
professionals balancing career, money, health, side income, discipline, and
family responsibilities.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Neon Postgres through Drizzle ORM
- Simple database-backed email sign-in
- Gemini planning and manual Google-grounded research
- Vitest unit tests and Playwright happy-path E2E

## Local Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

The public page routes users to `/login`. New users continue through the guided
`/setup` flow; returning users land on the daily dashboard. For real
persistence, set `DATABASE_URL` from Neon.

## Database

```bash
npm run db:generate
npm run db:migrate
```

## Checks

```bash
npm run env:check
npm run lint
npm run typecheck
npm run test
npm run build
npm run test:e2e
```

Use `npm run predeploy` after env vars are configured. See `DEPLOYMENT.md` for the full
Neon, Gemini, and Vercel checklist.

## MVP Routes

- `/` signed-out product entry
- `/login` simple name/email sign-in
- `/setup` guided profile and capacity setup
- `/dashboard` daily essentials and conflicts
- `/goals` goal templates, feasibility warnings, and progress check-ins
- `/roadmap` generated roadmap
- `/review` weekly review and recovery
- `/research` manual grounded research
- `/settings` environment and account status
- `/api/health` deployment health check

Gemini research uses the Interactions API with the `google_search` tool when
`GEMINI_API_KEY` is available. Otherwise, it stores deterministic demo notes.
