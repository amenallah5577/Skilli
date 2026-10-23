# Reproducible setup and engineering decisions

Verified on 23 October 2026 with Node.js 22, npm, Docker Desktop (Linux containers), and Supabase CLI 2.121.0. Begin with a clean checkout and `npm ci`. Docker must be running before the local database starts.

## Local services

From the repository root:

```sh
npx --yes supabase@2.121.0 start -x storage-api,imgproxy,studio,edge-runtime,logflare,vector,supavisor,postgres-meta
```

The committed configuration starts PostgreSQL, Auth, REST, Realtime, a gateway, and local email capture. The migration creates the schema, policies and initial skills. No separate seed file is needed. First startup downloads Docker images. Ports 54321 (API), 54322 (database), and 54324 (email viewer) must be free.

Run `npx --yes supabase@2.121.0 status` locally to obtain the API URL and **publishable** key. Do not publish its secret keys. Create the Git-ignored `.env.local`:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_LOCAL_PUBLISHABLE_KEY
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Never put a service-role or secret key in a `NEXT_PUBLIC_` variable. For a hosted Supabase project, apply the migration, enable email authentication, include `{{ .Token }}` in the email template, and allow the site's `/auth/callback` redirect. The UI accepts Gmail addresses; local Supabase captures verification messages at http://127.0.0.1:54324 rather than sending them externally.

```sh
npm run dev
# Or check and run the production build:
npm run typecheck
npm run lint
npm run build
npm start -- --hostname 127.0.0.1 --port 3000
```

Set `NEXT_PUBLIC_SITE_URL` before building. The start script also works on Windows; it does not depend on shell expansion of `$PORT`. For port 3014, set that site URL and use `--port 3014`; its callback is allowed by the local configuration.

## Access checks

`tests/local-access.sql` creates synthetic teacher, learner and outsider accounts inside a transaction, then rolls back everything. It checks a learner cannot accept their own request, the teacher can accept and send a message, the learner can read it, and an unrelated account cannot read or modify the private room/chat. Run only against this disposable local stack:

```sh
docker exec -i supabase_db_Skilli psql -U postgres -d postgres -v ON_ERROR_STOP=1 < tests/local-access.sql
```

PowerShell equivalent:

```powershell
Get-Content -Raw tests/local-access.sql | docker exec -i supabase_db_Skilli psql -U postgres -d postgres -v ON_ERROR_STOP=1
```

Successful output ends in `ROLLBACK`, with no errors. These database checks exercise real RLS and triggers; they do not substitute for browser testing. GitHub Actions runs type checking, lint and a production build without production credentials.

To stop just this local project while preserving its database:

```sh
npx --yes supabase@2.121.0 stop
```

## Design trade-off: managed identity and database policies

Skilli uses Supabase Auth and PostgreSQL row-level security instead of maintaining a separate custom authentication and data-access backend. This reduces infrastructure and makes ownership rules apply to direct API access as well as Next.js routes. The cost is policy, privilege and token-management complexity: an authenticated user is not automatically authorized for another learner's session. The route checks and RLS must agree; the local access test protects this boundary. Matching is currently a deterministic skill-based heuristic, not a trained recommendation model.

## Verification boundaries

A clean dependency install, type check, lint, production build, local migrations and transactional access checks passed. The migrated database contained 14 initial skills and nine public tables with RLS enabled. The public homepage responded and unauthenticated session requests were denied. Local checks do not establish hosted email delivery or the deployed database's configuration.
