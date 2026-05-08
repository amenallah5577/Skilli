import Image from "next/image";
import { BookOpen, CalendarClock, MessageSquare, Mic, Timer, Video } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { formatDateTime, formatDuration } from "@/lib/utils";
import type { Session, SessionStatus } from "@/types/domain";

const statusStyles: Record<SessionStatus, string> = {
  pending: "bg-saffron-100 text-saffron-600",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
  cancelled: "bg-slate-100 text-slate-600",
  completed: "bg-skyline-100 text-skyline-700"
};

const modeIcon = {
  chat: MessageSquare,
  voice: Mic,
  video: Video
};

export function SessionCard({ session, currentUserId }: { session: Session; currentUserId: string }) {
  const otherUser = session.teacher.id === currentUserId ? session.learner : session.teacher;
  const role = session.teacher.id === currentUserId ? "Teaching" : "Learning";
  const ModeIcon = modeIcon[session.mode];

  return (
    <article className="surface-card rounded-lg p-5 transition duration-200 hover:-translate-y-0.5">
      <div className="flex items-start gap-4">
        <Image
          src={otherUser.avatarUrl}
          alt=""
          width={64}
          height={64}
          className="h-14 w-14 rounded-lg object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-bold text-ink">{otherUser.fullName}</h2>
            <span
              className={`rounded-md px-2 py-1 text-xs font-bold capitalize ${statusStyles[session.status]}`}
            >
              {session.status}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-slate-500">{role}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <SkillBadge name={session.skill.name} category={session.skill.category} compact />
        <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-xs font-bold capitalize text-slate-600">
          <ModeIcon className="h-3.5 w-3.5" aria-hidden="true" />
          {session.mode}
        </span>
      </div>
      <p className="quiet-panel mt-4 rounded-lg p-3 text-sm leading-6 text-slate-600">
        <span className="font-semibold text-ink">Goal:</span> {session.goal}
      </p>
      <div className="mt-4 grid gap-2 text-sm text-slate-600">
        <p className="flex items-center gap-2">
          <CalendarClock className="h-4 w-4 text-slate-400" aria-hidden="true" />
          {formatDateTime(session.scheduledAt)}
        </p>
        <p className="flex items-center gap-2">
          <Timer className="h-4 w-4 text-slate-400" aria-hidden="true" />
          {formatDuration(session.durationMinutes)}
        </p>
      </div>
      {session.note ? <p className="mt-4 text-sm leading-6 text-slate-600">{session.note}</p> : null}
      <div className="mt-5 flex flex-wrap justify-end gap-2">
        {session.status === "pending" ? (
          <>
            <Button variant="outline">Reject</Button>
            <Button>Accept</Button>
          </>
        ) : null}
        {session.status === "accepted" ? (
          <>
            <Button href={`/sessions/${session.id}`} variant="outline" icon={<BookOpen className="h-4 w-4" aria-hidden="true" />}>
              Learning room
            </Button>
            <Button>Complete</Button>
          </>
        ) : null}
        {session.status === "completed" ? (
          <Button href={`/sessions/${session.id}`} variant="outline" icon={<BookOpen className="h-4 w-4" aria-hidden="true" />}>
            Review room
          </Button>
        ) : null}
        {session.status === "pending" ? (
          <Button href={`/sessions/${session.id}`} variant="ghost">
            Preview room
          </Button>
        ) : null}
      </div>
    </article>
  );
}
