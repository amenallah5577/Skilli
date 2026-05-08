import {
  BookOpen,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  Coins,
  MessageSquare,
  PlayCircle,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  UsersRound,
  Video
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SkillBadge } from "@/components/ui/SkillBadge";
import { StatCard } from "@/components/ui/StatCard";
import { getSkillCategories, isSupabaseConfigured } from "@/lib/repository";

export default async function HomePage() {
  const categories = await getSkillCategories();
  const configured = isSupabaseConfigured();
  const visibleCategories = categories.length
    ? categories
    : ["Programming", "Languages", "Design", "Academic Support"];

  return (
    <>
      <section className="relative isolate min-h-[calc(100vh-72px)] overflow-hidden bg-[#111318] text-white">
        <div className="absolute inset-0 -z-20 bg-[linear-gradient(160deg,#25272d_0%,#17191d_58%,#0f1115_100%)]" />
        <div className="decor-texture absolute inset-0 -z-10" />
        <div className="decor-line absolute right-[6vw] top-1/2 hidden h-[36vh] -translate-y-1/2 opacity-75 lg:block" />

        <div className="container-shell flex min-h-[calc(100vh-72px)] flex-col justify-end pb-[9vh] pt-16">
          <div className="max-w-4xl">
            <p className="eyebrow mb-6">Student skill exchange · Mini learning rooms</p>
            <h1 className="display-title max-w-5xl text-[clamp(4rem,10vw,9.5rem)] leading-[0.9] text-white">
              Skilli<br />
              <em className="text-[var(--brand)]">students teach students</em>
            </h1>
            <p className="mt-8 max-w-lg text-base leading-8 text-white/60">
              A learner chooses a skill and a goal. Skilli finds another student who can
              teach it like a tutor, then both enter a focused room with notes, chat,
              tasks, feedback, and review.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-6">
              <Button
                href="/sessions/101"
                icon={<PlayCircle className="h-4 w-4" aria-hidden="true" />}
              >
                Enter a learning room
              </Button>
              <a href="/matches" className="thin-link text-white/90">
                Find student teachers
              </a>
            </div>
          </div>

        </div>
      </section>

      <section className="border-b border-slate-200 bg-[rgba(32,33,38,0.82)] backdrop-blur">
        <div className="container-shell grid gap-px overflow-hidden py-4 sm:grid-cols-4">
          {["Choose a goal", "Match teacher", "Book session", "Practice task"].map((step, index) => (
            <div
              key={step}
              className="flex min-h-20 items-center gap-4 border border-slate-200 bg-white px-4 py-3"
            >
              <span className="font-serif text-4xl font-light leading-none text-slate-500">
                0{index + 1}
              </span>
              <span className="text-[0.72rem] font-bold uppercase tracking-[0.18em] text-slate-600">
                {step}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="container-shell py-12">
        <div className="app-frame rounded-lg p-3 sm:p-4">
          <div className="rounded-md border border-slate-200 bg-white">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600 text-white">
                  <BookOpen className="h-5 w-5" aria-hidden="true" />
                </span>
                <div>
                  <p className="text-xs font-black uppercase tracking-normal text-slate-500">
                    Live learning room
                  </p>
                  <h2 className="text-lg font-black text-ink">
                    German speaking with a student teacher
                  </h2>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-2 text-xs font-black text-emerald-700">
                  <MessageSquare className="h-4 w-4" aria-hidden="true" />
                  Text chat
                </span>
                <span className="inline-flex items-center gap-2 rounded-md bg-skyline-100 px-3 py-2 text-xs font-black text-skyline-700">
                  <Video className="h-4 w-4" aria-hidden="true" />
                  Link-ready
                </span>
              </div>
            </div>

            <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="border-b border-slate-200 p-4 lg:border-b-0 lg:border-r">
                <div className="quiet-panel rounded-lg p-4">
                  <p className="flex items-start gap-2 text-sm font-semibold leading-6 text-slate-600">
                    <Target className="mt-1 h-4 w-4 shrink-0 text-emerald-700" />
                    Goal: introduce yourself in German with clear beginner sentences.
                  </p>
                </div>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <div className="surface-card rounded-lg p-4 shadow-none">
                    <div className="mb-3 flex items-center gap-2">
                      <ClipboardCheck className="h-5 w-5 text-emerald-700" />
                      <h3 className="font-black text-ink">Lesson notes</h3>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      Today we learn beginner introductions: greeting, name, age,
                      city, and one sentence about what you like.
                    </p>
                  </div>
                  <div className="surface-card rounded-lg p-4 shadow-none">
                    <div className="mb-3 flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-skyline-700" />
                      <h3 className="font-black text-ink">Task</h3>
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      Write five German sentences introducing yourself, then send
                      them for correction.
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-xs font-black uppercase tracking-normal text-slate-500">
                    <span>Progress</span>
                    <span>Practicing</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-emerald-600 to-skyline-500" />
                  </div>
                </div>
              </div>

              <div className="flex min-h-[390px] flex-col bg-slate-50">
                <div className="flex-1 space-y-3 p-4">
                  <ChatLine
                    name="Teacher"
                    text="Today I will teach you German introductions."
                  />
                  <ChatLine
                    mine
                    name="Learner"
                    text="I want to introduce myself clearly in German."
                  />
                  <ChatLine
                    name="Teacher"
                    text="Good. Start with: Hallo, ich heisse [your name]."
                  />
                  <ChatLine
                    mine
                    name="Learner"
                    text="Hallo! Ich heisse [name]. Ich komme aus Tunis."
                  />
                </div>
                <div className="border-t border-slate-200 bg-white p-4">
                  <div className="flex gap-2">
                    <div className="min-h-10 flex-1 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                      Ask, answer, or submit your task
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-emerald-600 text-white">
                      <Send className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-shell grid gap-4 pb-12 md:grid-cols-4">
        <StatCard label="Starting points" value="20" icon={<Coins className="h-5 w-5" />} />
        <StatCard label="Live backend" value={configured ? "On" : "Setup"} icon={<UsersRound className="h-5 w-5" />} />
        <StatCard
          label="Skill categories"
          value={visibleCategories.length}
          icon={<Sparkles className="h-5 w-5" />}
        />
        <StatCard label="Best rating" value="5.0" icon={<Star className="h-5 w-5" />} />
      </section>

      <section className="section-band relative overflow-hidden py-16">
        <div className="decor-number absolute left-[4vw] top-8">01</div>
        <div className="container-shell relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="pt-8">
            <p className="eyebrow">How Skilli actually teaches</p>
            <h2 className="display-title mt-3 text-5xl leading-none text-ink sm:text-6xl">
              The session is the <em className="text-slate-500">classroom</em>.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
              Profiles help people find each other, but the learning happens in a
              structured room with notes, tasks, feedback, and review.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: Search,
                title: "Goal-first matching",
                text: "A learner chooses the skill, level, and outcome before matching."
              },
              {
                icon: CalendarCheck,
                title: "Booked learning slots",
                text: "Sessions have date, duration, mode, and optional Meet or Discord link."
              },
              {
                icon: MessageSquare,
                title: "Guided practice",
                text: "Teacher notes and chat keep the lesson focused and easy to follow."
              },
              {
                icon: Trophy,
                title: "Task and review",
                text: "The learner submits work, receives feedback, and reviews the session."
              }
            ].map((item) => (
              <article key={item.title} className="surface-card rounded-lg p-5">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-50 text-emerald-700">
                  <item.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-black text-ink">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="container-shell relative grid gap-8 py-16 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="decor-number absolute right-0 top-8">02</div>
        <div className="surface-card rounded-lg p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Match preview</p>
              <h2 className="mt-2 text-3xl font-black text-ink">
            Real matches appear after students add teach and learn skills.
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">
                Skilli calculates compatibility from the learner goal, teacher skills,
                reciprocal exchange, location, and rating.
          </p>
            </div>
            <div className="rounded-lg bg-emerald-50 px-5 py-4 text-center">
              <p className="text-4xl font-black text-emerald-700">Live</p>
              <p className="text-xs font-black uppercase tracking-normal text-emerald-900">
                Matching
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {visibleCategories.slice(0, 4).map((category) => (
              <SkillBadge key={category} name={category} category={category} compact />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/matches">View all matches</Button>
            <Button href="/dashboard" variant="outline">
              Open dashboard
            </Button>
          </div>
        </div>

        <div>
          <p className="eyebrow">Popular categories</p>
          <h2 className="mt-2 text-3xl font-black text-ink">A practical catalog for real sessions</h2>
          <div className="mt-6 flex flex-wrap gap-2">
            {visibleCategories.map((category) => (
              <SkillBadge key={category} name={category} category={category} />
            ))}
          </div>
          <div className="mt-6 grid gap-3">
            {[
              {
                icon: ShieldCheck,
                title: "Protected by RLS",
                text: "Only session participants can access private chat and learning content."
              },
              {
                icon: Coins,
                title: "Points instead of payment",
                text: "Teachers earn points and XP; learners spend points to book help."
              }
            ].map((item) => (
              <article key={item.title} className="quiet-panel rounded-lg p-4">
                <div className="flex gap-3">
                  <item.icon className="mt-1 h-5 w-5 shrink-0 text-emerald-700" />
                  <div>
                    <h3 className="font-black text-ink">{item.title}</h3>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{item.text}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ChatLine({
  name,
  text,
  mine = false
}: {
  name: string;
  text: string;
  mine?: boolean;
}) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-lg px-3 py-2 text-sm shadow-sm ${
          mine
            ? "bg-emerald-600 text-white"
            : "border border-slate-200 bg-white text-slate-600"
        }`}
      >
        <p className={`mb-1 text-[11px] font-black ${mine ? "text-emerald-50" : "text-slate-500"}`}>
          {name}
        </p>
        <p className="leading-6">{text}</p>
      </div>
    </div>
  );
}
