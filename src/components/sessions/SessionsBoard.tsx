"use client";

import { useMemo, useState } from "react";
import { SessionCard } from "@/components/cards/SessionCard";
import type { Session, SessionStatus } from "@/types/domain";

const tabs: Array<SessionStatus | "all"> = [
  "all",
  "pending",
  "accepted",
  "completed",
  "rejected",
  "cancelled"
];

export function SessionsBoard({
  sessions,
  currentUserId
}: {
  sessions: Session[];
  currentUserId: string;
}) {
  const [tab, setTab] = useState<SessionStatus | "all">("all");
  const visibleSessions = useMemo(
    () => (tab === "all" ? sessions : sessions.filter((session) => session.status === tab)),
    [sessions, tab]
  );

  return (
    <section className="container-shell pb-12">
      <div className="mb-6 flex gap-2 overflow-x-auto rounded-lg border border-slate-200 bg-white p-2 shadow-soft">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`focus-ring min-h-10 rounded-md px-4 text-sm font-bold capitalize transition ${
              tab === item
                ? "bg-emerald-600 text-white"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {visibleSessions.map((session) => (
          <SessionCard key={session.id} session={session} currentUserId={currentUserId} />
        ))}
      </div>
    </section>
  );
}
