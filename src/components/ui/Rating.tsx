import { Star } from "lucide-react";

export function Rating({ value, count }: { value: number; count?: number }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink">
      <Star className="h-4 w-4 fill-saffron-500 text-saffron-500" aria-hidden="true" />
      {value.toFixed(1)}
      {typeof count === "number" ? (
        <span className="font-medium text-slate-500">({count})</span>
      ) : null}
    </span>
  );
}
