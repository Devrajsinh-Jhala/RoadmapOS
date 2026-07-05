# RoadmapOS Env and Deployment Guide

RoadmapOS uses simple database-backed sign-in. Users enter name and email, and
their workspace is stored in Neon.

## 1. Create `.env.local`

```bash
copy .env.example .env.local
```

Keep `.env.local` private. Add the same values to Vercel later in Project
Settings > Environment Variables.

## 2. Required Env

Only one value is required for the app to run with real data:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST/roadmapos?sslmode=require"
```

How to get it:

1. Create a Neon project.
2. Open the Neon dashboard.
3. Copy the pooled or direct Postgres connection string.
4. Make sure it includes `sslmode=require`.
5. Paste it into `.env.local`.

## 3. Optional Gemini Env

Gemini is optional. Without it, RoadmapOS still works with deterministic
fallback planning.

```bash
GEMINI_API_KEY="your-gemini-key"
GEMINI_MODEL="gemini-2.5-flash"
GEMINI_RESEARCH_MODEL="gemini-3.5-flash"
```

## 4. Check Env

After filling `.env.local`:

```bash
npm run env:check
```

It should pass once `DATABASE_URL` is set. A missing `GEMINI_API_KEY` is only a
warning.

## 5. Apply Neon Migrations

Run this once before first real use:

```bash
npm run db:migrate
```

This creates the user, profile, goals, roadmap, task, review, research, and AI
log tables.

## 6. Verify Before Deploy

```bash
npm run predeploy
```

This runs env validation, typecheck, lint, unit tests, and production build.

## 7. Add Env Vars To Vercel

In Vercel Project Settings > Environment Variables, add:

```bash
DATABASE_URL
GEMINI_API_KEY
GEMINI_MODEL
GEMINI_RESEARCH_MODEL
```

Only `DATABASE_URL` is required. Add Gemini values when you are ready for real
AI planning and grounded research.

## 8. Verify After Deploy

Open:

- `/api/health`
- `/login`
- `/dashboard`

`/api/health` should return `status: "ok"` when Neon is configured and
reachable.
