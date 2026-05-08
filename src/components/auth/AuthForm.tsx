"use client";

import { useRouter } from "next/navigation";
import { Mail, Lock, UserRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const configured = useMemo(
    () =>
      Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      ),
    []
  );

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const fullName = String(formData.get("fullName") ?? "");

    if (!configured) {
      setError(
        "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local."
      );
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (signInError) {
          throw signInError;
        }

        router.push("/dashboard");
        router.refresh();
      } else {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (signUpError) {
          throw signUpError;
        }

        setMessage("Check your email to confirm your account, then continue to profile setup.");
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {mode === "register" ? (
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Full name
          <span className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="fullName"
              required
              className="focus-ring w-full rounded-md border-slate-200 pl-10"
              placeholder="Your full name"
            />
          </span>
        </label>
      ) : null}
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Email
        <span className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="email"
            type="email"
            required
            className="focus-ring w-full rounded-md border-slate-200 pl-10"
            placeholder="you@example.com"
          />
        </span>
      </label>
      <label className="grid gap-2 text-sm font-semibold text-ink">
        Password
        <span className="relative">
          <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="password"
            type="password"
            required
            minLength={6}
            className="focus-ring w-full rounded-md border-slate-200 pl-10"
            placeholder="At least 6 characters"
          />
        </span>
      </label>
      {message ? (
        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
          {message}
        </p>
      ) : null}
      {error ? (
        <p className="rounded-md bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700">
          {error}
        </p>
      ) : null}
      <Button disabled={loading} className="w-full">
        {loading ? "Please wait" : mode === "login" ? "Log in" : "Create account"}
      </Button>
    </form>
  );
}
