import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const body = await request.json();
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

  const update = {
    lesson_notes:
      typeof body.lessonNotes === "string" ? body.lessonNotes.slice(0, 4000) : undefined,
    task_description:
      typeof body.taskDescription === "string" ? body.taskDescription.slice(0, 2000) : undefined,
    task_status: typeof body.taskStatus === "string" ? body.taskStatus : undefined,
    task_submission:
      typeof body.taskSubmission === "string" ? body.taskSubmission.slice(0, 4000) : undefined,
    task_feedback:
      typeof body.taskFeedback === "string" ? body.taskFeedback.slice(0, 2000) : undefined
  };

  const { data, error } = await supabase
    .from("sessions")
    .update(update)
    .eq("id", Number(id))
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ session: data });
}
