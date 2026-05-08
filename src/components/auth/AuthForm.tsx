"use client";

import { useRouter } from "next/navigation";
import { KeyRound, Mail, RefreshCw, UserRound } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
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

  async function sendCode(successMessage?: string) {
    if (!configured) {
      setError(
        "Supabase is not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY to .env.local."
      );
      return false;
    }

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail.endsWith("@gmail.com") && !cleanEmail.endsWith("@googlemail.com")) {
      setError("Use a Gmail address for this version of Skilli.");
      return false;
    }

    if (mode === "register" && fullName.trim().length < 2) {
      setError("Enter your full name before requesting the activation code.");
      return false;
    }

    const supabase = createClient();
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: cleanEmail,
      options: {
        shouldCreateUser: mode === "register",
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${
          mode === "register" ? "/profile/setup" : "/dashboard"
        }`,
        data: mode === "register" ? { full_name: fullName.trim() } : undefined
      }
    });

    if (otpError) {
      throw otpError;
    }

    setEmail(cleanEmail);
    setStep("code");
    setMessage(successMessage ?? `We sent a Skilli activation code to ${cleanEmail}.`);
    return true;
  }

  async function verifyCode(formData: FormData) {
    const token = String(formData.get("code") ?? "").replace(/\s/g, "");

    if (token.length < 6) {
      setError("Enter the activation code from your Gmail inbox.");
      return;
    }

    const supabase = createClient();
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email"
    });

    if (verifyError) {
      throw verifyError;
    }

    router.push(mode === "register" ? "/profile/setup" : "/dashboard");
    router.refresh();
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    const formData = new FormData(event.currentTarget);

    setLoading(true);

    try {
      if (step === "email") {
        await sendCode();
      } else {
        await verifyCode(formData);
      }
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Authentication failed.");
    } finally {
      setLoading(false);
    }
  }

  async function onResend() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      await sendCode(`A new activation code was sent to ${email}.`);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "Could not resend code.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      {mode === "register" && step === "email" ? (
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Full name
          <span className="relative">
            <UserRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="fullName"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              required
              className="focus-ring w-full rounded-md border-slate-200 pl-10"
              placeholder="Your full name"
            />
          </span>
        </label>
      ) : null}

      <label className="grid gap-2 text-sm font-semibold text-ink">
        Gmail address
        <span className="relative">
          <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={step === "code"}
            required
            className="focus-ring w-full rounded-md border-slate-200 pl-10 disabled:bg-slate-100"
            placeholder="you@gmail.com"
          />
        </span>
      </label>

      {step === "code" ? (
        <label className="grid gap-2 text-sm font-semibold text-ink">
          Activation code
          <span className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              className="focus-ring w-full rounded-md border-slate-200 pl-10 tracking-[0.3em]"
              placeholder="000000"
            />
          </span>
        </label>
      ) : null}

      {step === "code" ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm leading-6 text-emerald-900">
          Check Gmail for the six-digit Skilli code. It may take a few seconds to arrive.
        </div>
      ) : null}

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
        {loading
          ? "Please wait"
          : step === "email"
            ? "Send activation code"
            : "Activate account"}
      </Button>

      {step === "code" ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            className="rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
            onClick={() => {
              setStep("email");
              setMessage("");
              setError("");
            }}
          >
            Change email
          </button>
          <button
            type="button"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
            onClick={onResend}
            disabled={loading}
          >
            <RefreshCw className="h-4 w-4" />
            Resend
          </button>
        </div>
      ) : null}
    </form>
  );
}
