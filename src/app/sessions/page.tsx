import { SessionsBoard } from "@/components/sessions/SessionsBoard";
import { EmptyState } from "@/components/ui/EmptyState";
import { PageHeader } from "@/components/ui/PageHeader";
import { getCurrentProfile, getSessions, isSupabaseConfigured } from "@/lib/repository";

export default async function SessionsPage() {
  const [profile, sessions] = await Promise.all([getCurrentProfile(), getSessions()]);
  const configured = isSupabaseConfigured();

  return (
    <>
      <PageHeader eyebrow="Sessions" title="Manage requests and scheduled exchanges">
        Each accepted session opens a mini learning room with chat, lesson notes, tasks,
        progress, completion, and review.
      </PageHeader>
      {!configured ? (
        <EmptyState title="Connect Supabase to use sessions">
          Sessions are live records now. Configure Supabase and run the migration before
          booking real learning rooms.
        </EmptyState>
      ) : !profile ? (
        <EmptyState title="Log in to view sessions" actionHref="/auth/login" actionLabel="Log in">
          Your session list is private and only shows sessions where you are the teacher
          or learner.
        </EmptyState>
      ) : sessions.length ? (
        <SessionsBoard sessions={sessions} currentUserId={profile.id} />
      ) : (
        <EmptyState title="No sessions yet" actionHref="/matches" actionLabel="Find matches">
          Book a session with another student to open a live learning room.
        </EmptyState>
      )}
    </>
  );
}
