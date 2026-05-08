import Link from "next/link";
import { AuthForm } from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <section className="container-shell grid min-h-[calc(100vh-8rem)] place-items-center py-12">
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">
          Join the exchange
        </p>
        <h1 className="mt-2 text-3xl font-bold text-ink">Create your account</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Use your Gmail address and activate it with a Skilli code. Start with 20 points,
          then earn more by teaching.
        </p>
        <div className="mt-6">
          <AuthForm mode="register" />
        </div>
        <p className="mt-5 text-center text-sm text-slate-600">
          Already registered?{" "}
          <Link href="/auth/login" className="font-bold text-emerald-700">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}
