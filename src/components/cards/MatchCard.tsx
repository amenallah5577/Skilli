import Image from "next/image";
import { ArrowRight, Handshake, MapPin, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { SkillBadge } from "@/components/ui/SkillBadge";
import type { MatchResult } from "@/types/domain";

export function MatchCard({ match }: { match: MatchResult }) {
  return (
    <article className="surface-card rounded-lg p-5 transition duration-200 hover:-translate-y-0.5">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <Image
            src={match.profile.avatarUrl}
            alt=""
            width={88}
            height={88}
            className="h-20 w-20 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate text-xl font-bold text-ink">
                {match.profile.fullName}
              </h2>
              <Rating value={match.profile.rating} />
            </div>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="h-4 w-4" aria-hidden="true" />
              {match.profile.location}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {match.matchingSkills.map((skill) => (
                <SkillBadge
                  key={skill.id}
                  name={skill.name}
                  category={skill.category}
                  compact
                />
              ))}
            </div>
          </div>
        </div>
        <div className="w-full rounded-lg bg-emerald-50 p-4 text-center ring-1 ring-emerald-100 sm:w-36">
          <p className="text-3xl font-black text-emerald-700">{match.score}%</p>
          <p className="text-xs font-bold uppercase tracking-normal text-emerald-900">
            Match
          </p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div className="quiet-panel rounded-lg p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
            <Sparkles className="h-4 w-4 text-saffron-600" aria-hidden="true" />
            Why this works
          </p>
          <ul className="grid gap-1 text-sm text-slate-600">
            {match.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </div>
        <div className="quiet-panel rounded-lg p-4">
          <p className="mb-2 flex items-center gap-2 text-sm font-bold text-ink">
            <Handshake className="h-4 w-4 text-emerald-700" aria-hidden="true" />
            Mutual exchange
          </p>
          <div className="flex flex-wrap gap-2">
            {match.reciprocalSkills.length ? (
              match.reciprocalSkills.map((skill) => (
                <SkillBadge
                  key={skill.id}
                  name={skill.name}
                  category={skill.category}
                  compact
                />
              ))
            ) : (
              <p className="text-sm text-slate-500">No reciprocal skill yet.</p>
            )}
          </div>
        </div>
      </div>
      <div className="mt-5 flex justify-end">
        <Button
          href={`/profile/${match.profile.username}`}
          icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
        >
          Request session
        </Button>
      </div>
    </article>
  );
}
