"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/skills", label: "Skills" },
  { href: "/matches", label: "Matches" },
  { href: "/sessions", label: "Sessions" },
  { href: "/leaderboard", label: "Leaderboard" }
];

export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="focus-ring inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-ink dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-100"
        aria-label={open ? "Close navigation" : "Open navigation"}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>
      {open ? (
        <div className="absolute left-4 right-4 top-16 z-50 rounded-lg border border-slate-200 bg-white p-3 shadow-soft dark:border-white/10 dark:bg-[rgba(15,17,21,0.96)] dark:shadow-night">
          <nav className="grid gap-1">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/[0.08]"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-3 grid grid-cols-[auto_1fr_1fr] gap-2">
            <ThemeToggle />
            <Button href="/auth/login" variant="outline" className="w-full">
              Log in
            </Button>
            <Button href="/auth/register" className="w-full">
              Join
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
