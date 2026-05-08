import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const env = getSupabaseEnv();

  if (!env.configured) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = (claimsData?.claims as { sub?: string } | undefined)?.sub;

  if (claimsError || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("sessions")
    .select("*, skill:skills(*), teacher:profiles!sessions_teacher_id_fkey(*), learner:profiles!sessions_learner_id_fkey(*)")
    .or(`teacher_id.eq.${userId},learner_id.eq.${userId}`)
    .order("scheduled_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ sessions: data });
}

export async function POST(request: NextRequest) {
  const env = getSupabaseEnv();
  const body = await request.json();

  if (!env.configured) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims();
  const userId = (claimsData?.claims as { sub?: string } | undefined)?.sub;

  if (claimsError || !userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      learner_id: userId,
      teacher_id: String(body.teacherId),
      skill_id: Number(body.skillId),
      mode: String(body.mode ?? "chat"),
      goal: String(body.goal ?? "Practice this skill with a clear learning goal").slice(0, 300),
      scheduled_at: String(body.scheduledAt),
      duration_minutes: Number(body.durationMinutes ?? 30),
      meeting_link: body.meetingLink ? String(body.meetingLink).slice(0, 500) : null,
      note: String(body.note ?? "").slice(0, 500),
      lesson_plan: Array.isArray(body.lessonPlan) ? body.lessonPlan.slice(0, 8) : [],
      lesson_notes: String(body.lessonNotes ?? "").slice(0, 4000),
      task_title: String(body.taskTitle ?? "Practice task").slice(0, 120),
      task_description: String(body.taskDescription ?? "").slice(0, 2000)
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ session: data }, { status: 201 });
}
