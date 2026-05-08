import type { ReactNode } from "react";

export function PageHeader({
  eyebrow,
  title,
  children,
  actions
}: {
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <header className="container-shell flex flex-col gap-5 py-12 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? (
          <p className="eyebrow mb-2">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="max-w-4xl text-4xl font-black leading-tight text-ink sm:text-5xl">{title}</h1>
        {children ? <div className="mt-3 text-base leading-7 text-slate-600">{children}</div> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
    </header>
  );
}
