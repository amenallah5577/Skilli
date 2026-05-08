import { MatchCard } from "@/components/cards/MatchCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCurrentProfile, getSuggestedMatches, isSupabaseConfigured } from "@/lib/repository";

export default async function MatchesPage() {
  const matches = await getSuggestedMatches();
  const profile = await getCurrentProfile();
  const configured = isSupabaseConfigured();

  return (
    <>
      <PageHeader eyebrow="Matches" title="People who fit your learning goals">
        Scores combine skill fit, reciprocal exchange, location, and rating.
      </PageHeader>
      {!configured ? (
        <EmptyState title="Connect Supabase to calculate live matches">
          Matches are no longer generated from sample profiles. Configure Supabase and
          add real student skill data.
        </EmptyState>
      ) : !profile ? (
        <EmptyState title="Log in to see your matches" actionHref="/auth/login" actionLabel="Log in">
          Matching depends on your teach skills and learn goals.
        </EmptyState>
      ) : !matches.length ? (
        <EmptyState title="No matches yet" actionHref="/profile/setup" actionLabel="Add skills">
          Add skills you teach and skills you want to learn, then Skilli will find
          compatible student teachers.
        </EmptyState>
      ) : null}
      <section className="container-shell grid gap-5 pb-12">
        {matches.map((match) => (
          <MatchCard key={match.profile.id} match={match} />
        ))}
      </section>
    </>
  );
}
