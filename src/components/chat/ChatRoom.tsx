"use client";

import { Send } from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { Message, Session } from "@/types/domain";

export function ChatRoom({
  session,
  initialMessages,
  currentUserId
}: {
  session: Session;
  initialMessages: Message[];
  currentUserId: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const configured = useMemo(
    () =>
      Boolean(
        process.env.NEXT_PUBLIC_SUPABASE_URL &&
          (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
      ),
    []
  );

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  useEffect(() => {
    if (!configured) {
      return;
    }

    const supabase = createClient();
    const channel = supabase
      .channel(`session-${session.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `session_id=eq.${session.id}`
        },
        (payload) => {
          const row = payload.new as {
            id: number;
            session_id: number;
            sender_id: string;
            content: string;
            created_at: string;
          };

          setMessages((current) =>
            current.some((message) => message.id === row.id)
              ? current
              : [
                  ...current,
                  {
                    id: row.id,
                    sessionId: row.session_id,
                    senderId: row.sender_id,
                    content: row.content,
                    createdAt: row.created_at
                  }
                ]
          );
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [configured, session.id]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const content = String(formData.get("message") ?? "").trim();

    if (!content) {
      return;
    }

    if (!configured) {
      setError("Supabase is not configured. Messages are saved only after the backend is connected.");
      return;
    }

    const supabase = createClient();
    const { error: insertError } = await supabase.from("messages").insert({
      session_id: session.id,
      sender_id: currentUserId,
      content
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    form.reset();
  }

  return (
    <section className="container-shell grid gap-6 pb-12 lg:grid-cols-[1fr_320px]">
      <div className="rounded-lg border border-slate-200 bg-slate-50 shadow-soft">
        <div
          ref={listRef}
          className="flex h-[560px] flex-col gap-3 overflow-y-auto p-4 sm:p-6"
        >
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              mine={message.senderId === currentUserId}
            />
          ))}
        </div>
        <form onSubmit={onSubmit} className="border-t border-slate-200 bg-white p-4">
          <div className="flex gap-2">
            <input
              name="message"
              className="focus-ring min-w-0 flex-1 rounded-md border-slate-200"
              placeholder="Write a message"
              maxLength={1000}
            />
            <Button icon={<Send className="h-4 w-4" aria-hidden="true" />}>Send</Button>
          </div>
          {error ? <p className="mt-2 text-sm font-medium text-rose-700">{error}</p> : null}
        </form>
      </div>
      <aside className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
        <p className="text-sm font-bold uppercase tracking-normal text-slate-500">Session</p>
        <h2 className="mt-2 text-xl font-bold text-ink">{session.skill.name}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">{session.note}</p>
        <div className="mt-5 grid gap-3 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-ink">Teacher:</span>{" "}
            {session.teacher.fullName}
          </p>
          <p>
            <span className="font-semibold text-ink">Learner:</span>{" "}
            {session.learner.fullName}
          </p>
          <p>
            <span className="font-semibold text-ink">Status:</span> {session.status}
          </p>
        </div>
      </aside>
    </section>
  );
}
