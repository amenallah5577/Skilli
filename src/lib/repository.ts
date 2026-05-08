import { getMatches } from "@/lib/matchScore";
import { getSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";
import type {
  Message,
  Review,
  Session,
  SessionMode,
  SessionStatus,
  Skill,
  SkillLevel,
  UserProfile
} from "@/types/domain";

type ProfileRow = {
  id: string;
  full_name: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  location: string | null;
  points: number | null;
  xp: number | null;
  rating: number | null;
  created_at: string;
  user_teach_skills?: UserSkillRow[];
  user_learn_skills?: UserSkillRow[];
};

type UserSkillRow = {
  id: number;
  level: SkillLevel;
  skill?: SkillRow | SkillRow[] | null;
  skills?: SkillRow | SkillRow[] | null;
};

type SkillRow = {
  id: number;
  name: string;
  category: string | null;
};

type SessionRow = {
  id: number;
  teacher?: ProfileRow | ProfileRow[] | null;
  learner?: ProfileRow | ProfileRow[] | null;
  skill?: SkillRow | SkillRow[] | null;
  status: SessionStatus;
  mode: SessionMode;
  goal: string | null;
  scheduled_at: string | null;
  duration_minutes: number | null;
  meeting_link: string | null;
  note: string | null;
  lesson_plan: string[] | null;
  lesson_notes: string | null;
  task_title: string | null;
  task_description: string | null;
  task_status: "not_started" | "practicing" | "understood" | "mastered" | null;
  task_submission: string | null;
  task_feedback: string | null;
};

type ReviewRow = {
  id: number;
  session_id: number;
  reviewer_id: string;
  reviewed_user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

const profileSelect = `
  *,
  user_teach_skills(id, level, skill:skills(id, name, category)),
  user_learn_skills(id, level, skill:skills(id, name, category))
`;

const sessionSelect = `
  *,
  skill:skills(id, name, category),
  teacher:profiles!sessions_teacher_id_fkey(${profileSelect}),
  learner:profiles!sessions_learner_id_fkey(${profileSelect})
`;

function first<T>(value: T | T[] | null | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : value ?? undefined;
}

function mapSkill(row?: SkillRow | null): Skill {
  return {
    id: row?.id ?? 0,
    name: row?.name ?? "Unknown skill",
    category: row?.category ?? "General"
  };
}

function mapProfile(row: ProfileRow): UserProfile {
  return {
    id: row.id,
    fullName: row.full_name,
    username: row.username,
    bio: row.bio ?? "",
    avatarUrl:
      row.avatar_url ??
      `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(row.full_name)}`,
    location: row.location ?? "Tunisia",
    points: row.points ?? 0,
    xp: row.xp ?? 0,
    rating: Number(row.rating ?? 0),
    completedSessions: 0,
    responseRate: 0,
    createdAt: row.created_at,
    teachSkills: (row.user_teach_skills ?? []).map((item) => ({
      id: item.id,
      level: item.level,
      skill: mapSkill(first(item.skill ?? item.skills))
    })),
    learnSkills: (row.user_learn_skills ?? []).map((item) => ({
      id: item.id,
      level: item.level,
      skill: mapSkill(first(item.skill ?? item.skills))
    }))
  };
}

function mapSession(row: SessionRow): Session | undefined {
  const teacherRow = first(row.teacher);
  const learnerRow = first(row.learner);

  if (!teacherRow || !learnerRow) {
    return undefined;
  }

  const teacher = mapProfile(teacherRow);
  const learner = mapProfile(learnerRow);

  return {
    id: row.id,
    teacher,
    learner,
    skill: mapSkill(first(row.skill)),
    status: row.status,
    mode: row.mode ?? "chat",
    goal: row.goal ?? "Practice this skill with a clear learning goal",
    scheduledAt: row.scheduled_at ?? new Date().toISOString(),
    durationMinutes: row.duration_minutes ?? 30,
    meetingLink: row.meeting_link ?? undefined,
    note: row.note ?? undefined,
    lessonPlan: row.lesson_plan ?? [],
    lessonNotes: row.lesson_notes ?? "",
    task: {
      title: row.task_title ?? "Practice task",
      description: row.task_description ?? "",
      progress: row.task_status ?? "not_started",
      submission: row.task_submission ?? undefined,
      feedback: row.task_feedback ?? undefined
    }
  };
}

async function getAuthenticatedUserId() {
  if (!getSupabaseEnv().configured) {
    return undefined;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error) {
    return undefined;
  }

  return (data?.claims as { sub?: string } | undefined)?.sub;
}

export function isSupabaseConfigured() {
  return getSupabaseEnv().configured;
}

export async function getCurrentProfile() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(profileSelect)
    .eq("id", userId)
    .single();

  if (error || !data) {
    return null;
  }

  return mapProfile(data as ProfileRow);
}

export async function getProfiles() {
  if (!getSupabaseEnv().configured) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(profileSelect)
    .order("xp", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as ProfileRow[]).map(mapProfile);
}

export async function getPublicProfile(username: string) {
  if (!getSupabaseEnv().configured) {
    return undefined;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(profileSelect)
    .eq("username", username)
    .single();

  if (error || !data) {
    return undefined;
  }

  return mapProfile(data as ProfileRow);
}

export async function getSkills() {
  if (!getSupabaseEnv().configured) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("skills")
    .select("id, name, category")
    .order("name");

  if (error || !data) {
    return [];
  }

  return (data as SkillRow[]).map(mapSkill);
}

export async function getSkillCategories() {
  const skills = await getSkills();
  return [...new Set(skills.map((skill) => skill.category))].sort();
}

export async function getSuggestedMatches() {
  const currentUser = await getCurrentProfile();

  if (!currentUser) {
    return [];
  }

  const profiles = await getProfiles();
  return getMatches(currentUser, profiles);
}

export async function getSessions() {
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select(sessionSelect)
    .or(`teacher_id.eq.${userId},learner_id.eq.${userId}`)
    .order("scheduled_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return (data as SessionRow[]).map(mapSession).filter(Boolean) as Session[];
}

export async function getSessionDetails(id: number) {
  if (!getSupabaseEnv().configured) {
    return undefined;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select(sessionSelect)
    .eq("id", id)
    .single();

  if (error || !data) {
    return undefined;
  }

  return mapSession(data as SessionRow);
}

export async function getChatMessages(sessionId: number) {
  if (!getSupabaseEnv().configured) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true });

  if (error || !data) {
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    sessionId: row.session_id,
    senderId: row.sender_id,
    content: row.content,
    createdAt: row.created_at
  })) satisfies Message[];
}

export async function getReviewsForUser(userId: string) {
  if (!getSupabaseEnv().configured) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("reviews")
    .select("*")
    .eq("reviewed_user_id", userId)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return [];
  }

  return (data as ReviewRow[]).map((row) => ({
    id: row.id,
    sessionId: row.session_id,
    reviewerId: row.reviewer_id,
    reviewedUserId: row.reviewed_user_id,
    rating: row.rating,
    comment: row.comment ?? "",
    createdAt: row.created_at
  })) satisfies Review[];
}
