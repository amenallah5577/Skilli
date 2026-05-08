"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";

type Theme = "light" | "dark";

function getThemeSnapshot(): Theme {
  if (typeof document === "undefined") {
    return "light";
  }

  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("skilli-theme-change", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("skilli-theme-change", callback);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getThemeSnapshot, () => "light");

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem("skilli-theme", nextTheme);
    window.dispatchEvent(new Event("skilli-theme-change"));
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="focus-ring group inline-flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 bg-white text-ink transition hover:border-[var(--brand)] hover:text-[var(--brand)] dark:border-white/10 dark:bg-white/[0.08] dark:text-slate-100 dark:hover:border-[var(--brand)] dark:hover:text-white"
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to night mode"}
      title={theme === "dark" ? "Light mode" : "Night mode"}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  );
}
