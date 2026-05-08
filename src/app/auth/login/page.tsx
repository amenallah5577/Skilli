import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <section className="container-shell grid min-h-[calc(100vh-8rem)] place-items-center py-12">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">Welcome back</p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Log in to Skilli</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Continue to your sessions, matches, and messages.
        </p>
        <div className="mt-6">
          <AuthForm mode="login" />
        </div>
        <p className="mt-5 text-center text-sm text-slate-600">
          New here?{" "}
          <Link href="/auth/register" className="font-bold text-emerald-700">
            Create an account
          </Link>
        </p>
      </div>
    </section>
  );
}
