import Link from "next/link";
import { GraduationCap } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-[rgba(32,33,38,0.92)] backdrop-blur dark:bg-[rgba(15,17,21,0.92)]">
      <div className="container-shell grid gap-8 py-10 md:grid-cols-[1.2fr_2fr]">
        <div>
          <Link href="/" className="inline-flex items-center gap-2 rounded-md">
            <span className="flex h-9 w-9 items-center justify-center rounded-md bg-ink text-white">
              <GraduationCap className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="text-lg font-black text-ink">Skilli</span>
          </Link>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
            A points-based learning exchange for students, young professionals, and local
            communities in Tunisia.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-3">
          <div>
            <p className="font-semibold text-ink">Explore</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-600">
              <Link href="/skills">Skills</Link>
              <Link href="/matches">Matches</Link>
              <Link href="/leaderboard">Leaderboard</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-ink">Account</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-600">
              <Link href="/auth/register">Register</Link>
              <Link href="/auth/login">Log in</Link>
              <Link href="/profile/setup">Profile setup</Link>
            </div>
          </div>
          <div>
            <p className="font-semibold text-ink">Project</p>
            <div className="mt-3 grid gap-2 text-sm text-slate-600">
              <a href="https://supabase.com/docs" target="_blank" rel="noreferrer">
                Supabase docs
              </a>
              <a href="https://nextjs.org/docs" target="_blank" rel="noreferrer">
                Next.js docs
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
