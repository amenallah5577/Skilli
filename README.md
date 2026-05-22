# Skilli

Skilli is a full-stack student skill-exchange platform where learners and student teachers meet, book focused learning sessions, chat, share lesson notes, complete tasks, and build reputation through points and reviews.

Live demo: [https://skilli-two.vercel.app](https://skilli-two.vercel.app)

## Screenshots

| Landing page | Night mode |
| --- | --- |
| ![Skilli landing page](public/screenshots/skilli-home-light.png) | ![Skilli night mode](public/screenshots/skilli-home-dark.png) |

| Gmail activation |
| --- |
| ![Skilli Gmail activation screen](public/screenshots/skilli-auth-code.png) |

## Overview

Skilli is designed for students, young professionals, and self-learners who want to exchange knowledge without direct payment. Instead of a marketplace built around money, the app uses points, sessions, and reputation to encourage peer-to-peer learning.

The core flow is simple:

1. A learner chooses a skill and goal.
2. Skilli suggests compatible student teachers.
3. The learner books a session.
4. Both users enter a mini learning room with chat, notes, tasks, and feedback.
5. The session is completed, reviewed, and rewarded with points/XP.

## Features

- Passwordless Gmail activation using Supabase OTP codes
- User profiles with teach skills and learn skills
- Skill discovery and match suggestions
- Session booking with goals, duration, mode, and optional meeting links
- Mini learning rooms with chat, lesson notes, tasks, submissions, and feedback
- Reviews, ratings, points, and XP
- Leaderboard for active contributors
- Light and night mode UI
- Responsive Next.js interface
- Supabase PostgreSQL schema with RLS policies

## Tech Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL, Realtime, and Row Level Security
- Vercel deployment

## Project Structure

```text
src/
  app/                 App Router pages and API routes
  components/          Reusable UI, layout, auth, and session components
  lib/                 Supabase clients, repository helpers, matching logic
  types/               Shared domain types
supabase/
  migrations/          Database schema, policies, triggers, and seed data
public/
  screenshots/         README screenshots
```

## Getting Started

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Create `.env.local` from `.env.example`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Supabase Setup

1. Create a Supabase project.
2. Run `supabase/migrations/20260508000000_init_skilli.sql` in the SQL editor.
3. Enable the Email provider in Authentication.
4. In Authentication > Email Templates, include `{{ .Token }}` so users receive a login code.
5. Add redirect URLs:

```text
http://localhost:3000/auth/callback
https://skilli-two.vercel.app/auth/callback
```

## Deployment

The production app is deployed on Vercel.

Required Vercel environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_SITE_URL=https://skilli-two.vercel.app
```

Deploy manually with:

```bash
npx vercel deploy --prod
```

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```

## Status

Skilli is MVP-ready: the demo data has been removed, the app is wired for live Supabase data, and authentication is built around Gmail activation codes.
