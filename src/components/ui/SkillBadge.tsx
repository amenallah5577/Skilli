import type { SkillLevel } from "@/types/domain";
import { cn } from "@/lib/utils";

const levelLabel: Record<SkillLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced"
};

const colorByCategory: Record<string, string> = {
  Programming: "bg-emerald-50 text-emerald-700 border-emerald-100",
  Languages: "bg-skyline-100 text-skyline-700 border-skyline-100",
  Design: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-100",
  Fitness: "bg-orange-50 text-orange-700 border-orange-100",
  Business: "bg-amber-50 text-amber-700 border-amber-100",
  Music: "bg-rose-50 text-rose-700 border-rose-100",
  "Academic Support": "bg-indigo-50 text-indigo-700 border-indigo-100",
  Communication: "bg-teal-50 text-teal-700 border-teal-100",
  "Career Development": "bg-slate-100 text-slate-700 border-slate-200"
};

export function SkillBadge({
  name,
  category,
  level,
  compact = false
}: {
  name: string;
  category: string;
  level?: SkillLevel;
  compact?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border px-3 py-1 text-xs font-semibold",
        colorByCategory[category] ?? "border-slate-200 bg-slate-100 text-slate-700",
        compact && "px-2 py-0.5"
      )}
    >
      {name}
      {level ? (
        <span className="rounded bg-white/70 px-1.5 py-0.5 text-[10px] uppercase tracking-normal text-slate-600">
          {levelLabel[level]}
        </span>
      ) : null}
    </span>
  );
}
