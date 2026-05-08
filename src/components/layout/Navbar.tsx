import Link from "next/link";
import { GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/skills", label: "Skills" },
  { href: "/matches", label: "Matches" },
  { href: "/sessions", label: "Sessions" },
  { href: "/leaderboard", label: "Leaderboard" }
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-[rgba(32,33,38,0.88)] backdrop-blur-xl dark:border-white/10 dark:bg-[rgba(15,17,21,0.88)]">
      <div className="container-shell relative flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="focus-ring inline-flex items-center gap-2 rounded-md">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[var(--brand)] text-white">
            <GraduationCap className="h-5 w-5" aria-hidden="true" />
          </span>
          <span className="font-serif text-2xl font-light tracking-[0.24em] text-ink dark:text-white">
            SKILLI
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="focus-ring rounded-md px-3 py-2 text-[0.72rem] font-bold uppercase tracking-[0.16em] text-slate-600 hover:bg-slate-100 hover:text-[var(--brand)] dark:text-slate-300 dark:hover:bg-white/[0.08] dark:hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button href="/auth/login" variant="ghost">
            Log in
          </Button>
          <Button href="/auth/register">Join Skilli</Button>
        </div>
        <MobileMenu />
      </div>
    </header>
  );
}
