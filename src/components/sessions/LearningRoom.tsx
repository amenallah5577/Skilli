"use client";

import {
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  ExternalLink,
  MessageSquare,
  Mic,
  Save,
  Send,
  Star,
  Target,
  Trophy,
  Video
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { MessageBubble } from "@/components/chat/MessageBubble";
import { Button } from "@/components/ui/Button";
import { formatDateTime, formatDuration } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { LearningProgress, Message, Session } from "@/types/domain";

const progressOptions: Array<{ value: LearningProgress; label: string }> = [
  { value: "not_started", label: "Not started" },
  { value: "practicing", label: "Practicing" },
  { value: "understood", label: "Understood" },
  { value: "mastered", label: "Mastered" }
];

const modeCopy = {
  chat: {
    label: "Text chat",
    icon: MessageSquare
  },
  voice: {
    label: "Voice link",
    icon: Mic
  },
  video: {
    label: "Video link",
    icon: Video
  }
};

export function LearningRoom({
  session,
  initialMessages,
  currentUserId
}: {
  session: Session;
  initialMessages: Message[];
  currentUserId: string;
}) {
  const [messages, setMessages] = useState(initialMessages);
  const [lessonNotes, setLessonNotes] = useState(session.lessonNotes);
  const [taskDescription, setTaskDescription] = useState(session.task.description);
  const [taskSubmission, setTaskSubmission] = useState(session.task.submission ?? "");
  const [taskFeedback, setTaskFeedback] = useState(session.task.feedback ?? "");
  const [progress, setProgress] = useState<LearningProgress>(session.task.progress);
  const [status, setStatus] = useState(session.status);
  const [reviewSaved, setReviewSaved] = useState(false);
  const [error, setError] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const isTeacher = session.teacher.id === currentUserId;
  const partner = isTeacher ? session.learner : session.teacher;
  const mode = modeCopy[session.mode];
  const ModeIcon = mode.icon;
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

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
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

  async function saveLessonPlan() {
    setError("");
    if (!configured) {
      setError("Supabase is not configured. Lesson notes can be saved after the backend is connected.");
      return;
    }

    const response = await fetch(`/api/sessions/${session.id}/learning`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ lessonNotes })
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Could not save lesson notes.");
    }
  }

  async function submitTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setProgress((current) => (current === "not_started" ? "practicing" : current));
    setError("");

    if (!configured) {
      setError("Supabase is not configured. Tasks can be saved after the backend is connected.");
      return;
    }

    const response = await fetch(`/api/sessions/${session.id}/learning`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        taskDescription,
        taskStatus: progress,
        taskSubmission: isTeacher ? undefined : taskSubmission,
        taskFeedback: isTeacher ? taskFeedback : undefined
      })
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Could not save task update.");
    }
  }

  return (
    <section className="container-shell grid gap-6 pb-12 xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="grid gap-6">
        <div className="app-frame rounded-lg p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-bold uppercase tracking-normal text-emerald-700">
                Learning room
              </p>
              <h1 className="mt-2 text-3xl font-black text-ink">
                {session.skill.name} with {session.teacher.fullName}
              </h1>
              <p className="mt-3 flex items-start gap-2 text-base leading-7 text-slate-600">
                <Target className="mt-1 h-4 w-4 shrink-0 text-emerald-700" aria-hidden="true" />
                {session.goal}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-700">
                <ModeIcon className="h-4 w-4" aria-hidden="true" />
                {mode.label}
              </span>
              <span className="rounded-md bg-slate-100 px-3 py-2 text-sm font-bold capitalize text-slate-700">
                {status}
              </span>
            </div>
          </div>
          <div className="mt-5 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            <p>
              <span className="font-semibold text-ink">When:</span>{" "}
              {formatDateTime(session.scheduledAt)}
            </p>
            <p>
              <span className="font-semibold text-ink">Duration:</span>{" "}
              {formatDuration(session.durationMinutes)}
            </p>
            <p>
              <span className="font-semibold text-ink">Partner:</span> {partner.fullName}
            </p>
          </div>
          {session.meetingLink ? (
            <a
              href={session.meetingLink}
              target="_blank"
              rel="noreferrer"
              className="focus-ring mt-5 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-ink hover:border-emerald-600 hover:text-emerald-700"
            >
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              Open external {session.mode === "video" ? "video" : "voice"} room
            </a>
          ) : null}
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="surface-card rounded-lg p-5">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-md bg-skyline-100 text-skyline-700">
                <BookOpen className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                  Lesson plan
                </p>
                <h2 className="text-xl font-bold text-ink">What this session covers</h2>
              </div>
            </div>
            <ol className="mt-5 grid gap-3">
              {session.lessonPlan.map((item, index) => (
                <li key={item} className="flex gap-3 text-sm leading-6 text-slate-600">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-black text-ink">
                    {index + 1}
                  </span>
                  {item}
                </li>
              ))}
            </ol>
          </section>

          <section className="surface-card rounded-lg p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                    Lesson notes
                  </p>
                  <h2 className="text-xl font-bold text-ink">Teacher explanation</h2>
                </div>
              </div>
              {isTeacher ? (
                <Button
                  type="button"
                  variant="outline"
                  icon={<Save className="h-4 w-4" aria-hidden="true" />}
                  onClick={saveLessonPlan}
                >
                  Save
                </Button>
              ) : null}
            </div>
            {isTeacher ? (
              <textarea
                value={lessonNotes}
                onChange={(event) => setLessonNotes(event.target.value)}
                rows={8}
                className="focus-ring mt-5 w-full rounded-md border-slate-200 text-sm leading-6"
              />
            ) : (
              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
                {lessonNotes}
              </p>
            )}
          </section>
        </div>

        <section className="surface-card rounded-lg p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                Session task
              </p>
              <h2 className="mt-1 text-2xl font-bold text-ink">{session.task.title}</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {progressOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setProgress(option.value)}
                  className={`focus-ring rounded-md px-3 py-2 text-xs font-bold transition ${
                    progress === option.value
                      ? "bg-emerald-600 text-white"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={submitTask} className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-semibold text-ink">
                Task brief
                <textarea
                  value={taskDescription}
                  onChange={(event) => setTaskDescription(event.target.value)}
                  readOnly={!isTeacher}
                  rows={6}
                  className="focus-ring rounded-md border-slate-200 text-sm leading-6 read-only:bg-slate-50"
                />
              </label>
              {isTeacher ? (
                <label className="grid gap-2 text-sm font-semibold text-ink">
                  Feedback for learner
                  <textarea
                    value={taskFeedback}
                    onChange={(event) => setTaskFeedback(event.target.value)}
                    rows={4}
                    className="focus-ring rounded-md border-slate-200 text-sm leading-6"
                    placeholder="Correct the answer or give the next step"
                  />
                </label>
              ) : null}
            </div>
            <div className="grid gap-3">
              <label className="grid gap-2 text-sm font-semibold text-ink">
                Learner answer
                <textarea
                  value={taskSubmission}
                  onChange={(event) => setTaskSubmission(event.target.value)}
                  readOnly={isTeacher}
                  rows={8}
                  className="focus-ring rounded-md border-slate-200 text-sm leading-6 read-only:bg-slate-50"
                  placeholder="Write your answer, code, sentences, or practice result"
                />
              </label>
              {!isTeacher && taskFeedback ? (
                <p className="rounded-md bg-skyline-100 px-3 py-2 text-sm leading-6 text-skyline-700">
                  {taskFeedback}
                </p>
              ) : null}
              <Button>
                {isTeacher ? "Send feedback to chat" : "Submit task to chat"}
              </Button>
            </div>
          </form>
        </section>

        <section className="surface-card overflow-hidden rounded-lg">
          <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-white p-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                Chat
              </p>
              <h2 className="text-xl font-bold text-ink">Teacher and learner messages</h2>
            </div>
            <MessageSquare className="h-5 w-5 text-emerald-700" aria-hidden="true" />
          </div>
          <div ref={listRef} className="flex h-[420px] flex-col gap-3 overflow-y-auto p-4 sm:p-5">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                mine={message.senderId === currentUserId}
              />
            ))}
          </div>
          <form onSubmit={sendMessage} className="border-t border-slate-200 bg-white p-4">
            <div className="flex gap-2">
              <input
                name="message"
                className="focus-ring min-w-0 flex-1 rounded-md border-slate-200"
                placeholder="Ask, answer, or correct something"
                maxLength={1000}
              />
              <Button icon={<Send className="h-4 w-4" aria-hidden="true" />}>Send</Button>
            </div>
            {error ? <p className="mt-2 text-sm font-medium text-rose-700">{error}</p> : null}
          </form>
        </section>
      </div>

      <aside className="grid content-start gap-6">
        <section className="surface-card rounded-lg p-5">
          <h2 className="text-lg font-bold text-ink">Session flow</h2>
          <div className="mt-4 grid gap-3">
            {[
              "Match with teacher",
              "Book session",
              "Enter learning room",
              "Use chat and notes",
              "Complete task",
              "Review and update points"
            ].map((item, index) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-600">
                <span className="flex h-7 w-7 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className={index <= 3 ? "font-semibold text-ink" : ""}>{item}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card rounded-lg p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-saffron-100 text-saffron-600">
              <Trophy className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                Completion
              </p>
              <h2 className="text-lg font-bold text-ink">Points after learning</h2>
            </div>
          </div>
          <div className="mt-4 grid gap-2 text-sm text-slate-600">
            <p>Teacher earns +10 points and +20 XP.</p>
            <p>Learner spends 10 points and gains +5 XP.</p>
            <p>A 5-star review gives bonus reputation.</p>
          </div>
          {status !== "completed" ? (
            <Button type="button" className="mt-5 w-full" onClick={() => setStatus("completed")}>
              Mark session completed
            </Button>
          ) : (
            <p className="mt-5 rounded-md bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-700">
              Session completed. Review is now available.
            </p>
          )}
        </section>

        <section className="surface-card rounded-lg p-5">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-skyline-100 text-skyline-700">
              <Star className="h-5 w-5" aria-hidden="true" />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-slate-500">
                Review
              </p>
              <h2 className="text-lg font-bold text-ink">Rate the session</h2>
            </div>
          </div>
          <form
            className="mt-4 grid gap-3"
            onSubmit={(event) => {
              event.preventDefault();
              setReviewSaved(true);
            }}
          >
            <select
              disabled={status !== "completed"}
              className="focus-ring rounded-md border-slate-200 disabled:bg-slate-100"
              defaultValue="5"
            >
              <option value="5">5 stars</option>
              <option value="4">4 stars</option>
              <option value="3">3 stars</option>
              <option value="2">2 stars</option>
              <option value="1">1 star</option>
            </select>
            <textarea
              disabled={status !== "completed"}
              rows={4}
              className="focus-ring rounded-md border-slate-200 text-sm leading-6 disabled:bg-slate-100"
              placeholder="What helped you learn?"
            />
            <Button disabled={status !== "completed"}>
              {reviewSaved ? "Review saved" : "Save review"}
            </Button>
          </form>
        </section>
      </aside>
    </section>
  );
}
