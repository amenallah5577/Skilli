import Image from "next/image";
import { notFound } from "next/navigation";
import { CalendarPlus, Coins, MapPin, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Rating } from "@/components/ui/Rating";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { getProfiles, getPublicProfile, getReviewsForUser } from "@/lib/repository";

export async function generateStaticParams() {
  const profiles = await getProfiles();
  return profiles.map((profile) => ({
    username: profile.username
  }));
}

export default async function PublicProfilePage({
  params
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const profile = await getPublicProfile(username);

  if (!profile) {
    notFound();
  }

  const reviews = await getReviewsForUser(profile.id);

  return (
    <>
      <section className="bg-white">
        <div className="container-shell grid gap-8 py-10 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-6 sm:flex-row">
            <Image
              src={profile.avatarUrl}
              alt=""
              width={144}
              height={144}
              className="h-32 w-32 rounded-lg object-cover"
            />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black text-ink">{profile.fullName}</h1>
                <Rating value={profile.rating} count={reviews.length || profile.completedSessions} />
              </div>
              <p className="mt-2 flex items-center gap-2 text-slate-500">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                {profile.location}
              </p>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">{profile.bio}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                  <Coins className="h-4 w-4" aria-hidden="true" />
                  {profile.points} points
                </span>
                <span className="inline-flex items-center gap-2 rounded-md bg-skyline-100 px-3 py-2 text-sm font-bold text-skyline-700">
                  <Trophy className="h-4 w-4" aria-hidden="true" />
                  {profile.xp} XP
                </span>
              </div>
            </div>
          </div>
          <aside className="rounded-lg border border-slate-200 bg-mist p-5">
            <h2 className="text-lg font-bold text-ink">Request a session</h2>
            <div className="mt-4 grid gap-3">
              <select className="focus-ring rounded-md border-slate-200 bg-white">
                {profile.teachSkills.map((item) => (
                  <option key={item.id}>{item.skill.name}</option>
                ))}
              </select>
              <input type="datetime-local" className="focus-ring rounded-md border-slate-200 bg-white" />
              <select className="focus-ring rounded-md border-slate-200 bg-white">
                <option>30 minutes</option>
                <option>45 minutes</option>
                <option>60 minutes</option>
              </select>
              <input
                placeholder="Learning goal"
                className="focus-ring rounded-md border-slate-200 bg-white"
                defaultValue={`Learn ${profile.teachSkills[0]?.skill.name ?? "this skill"}`}
              />
              <select className="focus-ring rounded-md border-slate-200 bg-white">
                <option>Text chat</option>
                <option>Voice link</option>
                <option>Video link</option>
              </select>
              <input
                placeholder="Optional Meet, Zoom, or Discord link"
                className="focus-ring rounded-md border-slate-200 bg-white"
              />
              <textarea
                rows={4}
                placeholder="Add a short goal for the session"
                className="focus-ring rounded-md border-slate-200 bg-white"
              />
              <Button icon={<CalendarPlus className="h-4 w-4" aria-hidden="true" />}>
                Send request
              </Button>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-shell grid gap-6 py-10 lg:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-ink">Can teach</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.teachSkills.map((item) => (
              <SkillBadge
                key={item.id}
                name={item.skill.name}
                category={item.skill.category}
                level={item.level}
              />
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
          <h2 className="text-2xl font-bold text-ink">Wants to learn</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile.learnSkills.map((item) => (
              <SkillBadge
                key={item.id}
                name={item.skill.name}
                category={item.skill.category}
                level={item.level}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell pb-12">
        <h2 className="mb-4 text-2xl font-bold text-ink">Reviews</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {(reviews.length ? reviews : []).map((review) => (
            <article key={review.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
              <Rating value={review.rating} />
              <p className="mt-3 text-sm leading-6 text-slate-600">{review.comment}</p>
            </article>
          ))}
          {!reviews.length ? (
            <article className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-500">
              No written reviews yet.
            </article>
          ) : null}
        </div>
      </section>
    </>
  );
}
