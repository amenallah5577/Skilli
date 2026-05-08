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

## Supabase Auth

Skilli uses passwordless Gmail sign-in. Supabase sends a one-time activation code, then the app verifies it with `verifyOtp`.

1. In Supabase, enable the Email provider.
2. Run `supabase/migrations/20260508000000_init_skilli.sql` in the SQL editor.
3. In Authentication > Email Templates, include `{{ .Token }}` in the magic link template so users receive a code.
4. Add redirect URLs for local and production:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR_RENDER_URL/auth/callback`

## Render Deployment

This repo includes `render.yaml` for a Render web service.

1. Create a Render Blueprint or Web Service from the GitHub repo.
2. Set environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` with your Render URL
3. Deploy, then add the Render callback URL to Supabase Auth redirects.

## Verification

```bash
npm run typecheck
npm run build
```
