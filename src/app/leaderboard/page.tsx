import Image from "next/image";
import { Medal, Trophy } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Rating } from "@/components/ui/Rating";
import { getProfiles } from "@/lib/repository";

export default async function LeaderboardPage() {
  const profiles = await getProfiles();
  const ranked = [...profiles].sort((a, b) => b.xp - a.xp);

  return (
    <>
      <PageHeader eyebrow="Leaderboard" title="Top contributors">
        Ranking combines XP, completed sessions, helpful activity, and average rating.
      </PageHeader>
      <section className="container-shell pb-12">
        <div className="grid gap-4">
          {ranked.map((profile, index) => (
            <article
              key={profile.id}
              className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-soft sm:grid-cols-[72px_1fr_auto] sm:items-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                {index < 3 ? (
                  <Trophy className="h-6 w-6" aria-hidden="true" />
                ) : (
                  <Medal className="h-6 w-6" aria-hidden="true" />
                )}
              </div>
              <div className="flex min-w-0 items-center gap-4">
                <Image
                  src={profile.avatarUrl}
                  alt=""
                  width={64}
                  height={64}
                  className="h-14 w-14 rounded-lg object-cover"
                />
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-ink">
                    #{index + 1} {profile.fullName}
                  </h2>
                  <p className="text-sm text-slate-500">
                    {profile.completedSessions} completed sessions
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 sm:justify-end">
                <Rating value={profile.rating} />
                <span className="rounded-md bg-skyline-100 px-3 py-2 text-sm font-black text-skyline-700">
                  {profile.xp} XP
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
