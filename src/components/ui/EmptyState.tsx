import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";

export function EmptyState({
  title,
  children,
  actionHref,
  actionLabel
}: {
  title: string;
  children: ReactNode;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <section className="container-shell pb-12">
      <div className="surface-card rounded-lg p-8 text-center">
        <h2 className="display-title text-4xl text-ink">{title}</h2>
        <div className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-slate-600">
          {children}
        </div>
        {actionHref && actionLabel ? (
          <div className="mt-6">
            <Button href={actionHref}>{actionLabel}</Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
