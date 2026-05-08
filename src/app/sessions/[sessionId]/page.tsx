import { notFound } from "next/navigation";
import { EmptyState } from "@/components/ui/EmptyState";
import { LearningRoom } from "@/components/sessions/LearningRoom";
import { getChatMessages, getCurrentProfile, getSessionDetails } from "@/lib/repository";

export const dynamic = "force-dynamic";

export default async function LearningRoomPage({
  params
}: {
  params: Promise<{ sessionId: string }>;
}) {
  const { sessionId } = await params;
  const session = await getSessionDetails(Number(sessionId));

  if (!session) {
    notFound();
  }

  const [profile, messages] = await Promise.all([
    getCurrentProfile(),
    getChatMessages(session.id)
  ]);

  if (!profile) {
    return (
      <div className="py-8">
        <EmptyState title="Log in to enter this learning room" actionHref="/auth/login" actionLabel="Log in">
          Session rooms are private. Only the teacher and learner can read notes,
          messages, tasks, and feedback.
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="py-8">
      <LearningRoom session={session} initialMessages={messages} currentUserId={profile.id} />
    </div>
  );
}
