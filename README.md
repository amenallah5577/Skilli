# Skilli

Skilli is a full-stack skill exchange app for peer-to-peer learning. Users can list skills they teach and want to learn, discover matches, request sessions, chat, review completed sessions, and earn points instead of paying directly.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Supabase Auth, Postgres, Realtime, and RLS

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

The app uses live Supabase data only. Copy `.env.example` to `.env.local`, add your Supabase URL and publishable key, then run the SQL in `supabase/migrations/20260508000000_init_skilli.sql` in your Supabase project.

## Verification

```bash
npm run typecheck
npm run build
```
