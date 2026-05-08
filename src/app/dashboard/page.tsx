import { CalendarClock, Coins, MessageSquare, Star, Trophy } from "lucide-react";
import { MatchCard } from "@/components/cards/MatchCard";
import { SessionCard } from "@/components/cards/SessionCard";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { StatCard } from "@/components/ui/StatCard";
import {
  getChatMessages,
  getCurrentProfile,
  getSessions,
  getSuggestedMatches,
  isSupabaseConfigured
} from "@/lib/repository";

export default async function DashboardPage() {
  const configured = isSupabaseConfigured();
  const profile = await getCurrentProfile();
  const matches = await getSuggestedMatches();
  const sessions = await getSessions();
  const messages = sessions[0] ? await getChatMessages(sessions[0].id) : [];

  if (!configured) {
    return (
      <>
        <PageHeader eyebrow="Dashboard" title="Connect Supabase to go live">
          The dashboard now uses live data only. Add Supabase environment variables and
          run the database migration to load real student profiles, skills, sessions, and
          messages.
        </PageHeader>
        <EmptyState title="Backend not configured">
          Copy `.env.example` to `.env.local`, add your Supabase URL and publishable key,
          then run the SQL migration in your Supabase project.
        </EmptyState>
      </>
    );
  }

  if (!profile) {
    return (
      <>
        <PageHeader eyebrow="Dashboard" title="Sign in to manage your learning exchange">
          Your private dashboard is connected to Supabase and requires an authenticated
          student account.
        </PageHeader>
        <EmptyState title="No active session" actionHref="/auth/login" actionLabel="Log in">
          Log in or create an account to add skills, find matches, book sessions, and
          exchange points.
        </EmptyState>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Dashboard"
        title={`Salem, ${profile.fullName.split(" ")[0]}`}
        actions={
          <>
            <Button href="/profile/setup" variant="outline">
              Edit profile
            </Button>
            <Button href="/matches">Find matches</Button>
          </>
        }
      >
        Your points, upcoming sessions, suggestions, and recent messages in one place.
      </PageHeader>

      <section className="container-shell grid gap-4 pb-8 md:grid-cols-4">
        <StatCard label="Points" value={profile.points} icon={<Coins className="h-5 w-5" />} hint="Use points to book sessions." />
        <StatCard label="XP" value={profile.xp} icon={<Trophy className="h-5 w-5" />} hint="Earn XP by helping others." />
        <StatCard label="Rating" value={profile.rating.toFixed(1)} icon={<Star className="h-5 w-5" />} hint={`${profile.completedSessions} completed sessions`} />
        <StatCard label="Upcoming" value="2" icon={<CalendarClock className="h-5 w-5" />} hint="Accepted or pending sessions." />
      </section>

      <section className="container-shell grid gap-6 pb-12 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-2xl font-bold text-ink">Best match today</h2>
            <Button href="/matches" variant="outline">
              All matches
            </Button>
          </div>
          {matches.length ? (
            matches.slice(0, 1).map((match) => <MatchCard key={match.profile.id} match={match} />)
          ) : (
            <div className="surface-card rounded-lg p-5 text-sm leading-6 text-slate-600">
              Add teach and learn skills to generate real matches.
            </div>
          )}
        </div>
        <div className="grid gap-6">
          <section>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-ink">Sessions</h2>
              <Button href="/sessions" variant="outline">
                Manage
              </Button>
            </div>
            <div className="grid gap-4">
              {sessions.length ? (
                sessions
                  .slice(0, 2)
                  .map((session) => (
                    <SessionCard key={session.id} session={session} currentUserId={profile.id} />
                  ))
              ) : (
                <div className="surface-card rounded-lg p-5 text-sm leading-6 text-slate-600">
                  No sessions yet. Request a session from a matched student teacher.
                </div>
              )}
            </div>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-ink">Recent messages</h2>
              <MessageSquare className="h-5 w-5 text-emerald-700" aria-hidden="true" />
            </div>
            <div className="grid gap-3">
              {messages.slice(-2).map((message) => (
                <p key={message.id} className="rounded-md bg-slate-50 px-3 py-2 text-sm leading-6 text-slate-600">
                  {message.content}
                </p>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
