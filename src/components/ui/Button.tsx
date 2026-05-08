import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "outline" | "danger";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--brand)] text-white shadow-lg shadow-black/10 hover:bg-[var(--brand-strong)] hover:shadow-xl hover:shadow-black/15",
  secondary:
    "bg-ink text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 dark:bg-white dark:text-ink dark:hover:bg-slate-100",
  ghost: "bg-transparent text-ink hover:bg-slate-100 dark:text-slate-100 dark:hover:bg-white/[0.08]",
  outline:
    "border border-slate-200 bg-[color:var(--surface)] text-ink shadow-sm hover:border-[var(--brand)] hover:bg-[color:var(--surface-muted)] hover:text-[var(--brand)] dark:border-white/10 dark:text-slate-100 dark:hover:border-[var(--brand)] dark:hover:text-white",
  danger: "bg-coral text-white hover:bg-red-600"
};

type SharedProps = {
  variant?: ButtonVariant;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
};

type ButtonProps = SharedProps &
  Omit<ComponentPropsWithoutRef<"button">, "className" | "children"> & {
    href?: string;
  };

export function Button({
  variant = "primary",
  icon,
  children,
  className,
  href,
  type,
  ...buttonProps
}: ButtonProps) {
  const classes = cn(
    "focus-ring inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-bold transition duration-200",
    variants[variant],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {icon}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button {...buttonProps} type={type} className={classes}>
      {icon}
      <span>{children}</span>
    </button>
  );
}
