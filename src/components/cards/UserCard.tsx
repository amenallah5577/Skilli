import Image from "next/image";
import { ArrowRight, Coins, MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { SkillBadge } from "@/components/ui/SkillBadge";
import type { UserProfile } from "@/types/domain";

export function UserCard({ profile }: { profile: UserProfile }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <div className="flex items-start gap-4">
        <Image
          src={profile.avatarUrl}
          alt=""
          width={72}
          height={72}
          className="h-16 w-16 rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-bold text-ink">{profile.fullName}</h2>
            <Rating value={profile.rating} />
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {profile.location}
          </p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600">{profile.bio}</p>
      <div className="mt-4">
        <p className="mb-2 text-xs font-bold uppercase tracking-normal text-slate-500">
          Teaches
        </p>
        <div className="flex flex-wrap gap-2">
          {profile.teachSkills.slice(0, 3).map((item) => (
            <SkillBadge
              key={item.id}
              name={item.skill.name}
              category={item.skill.category}
              level={item.level}
              compact
            />
          ))}
        </div>
      </div>
      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700">
          <Coins className="h-4 w-4" aria-hidden="true" />
          {profile.points} points
        </span>
        <Button
          href={`/profile/${profile.username}`}
          variant="outline"
          icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
        >
          View
        </Button>
      </div>
    </article>
  );
}
