import { NextResponse } from "next/server";
import { getSuggestedMatches } from "@/lib/repository";

export async function GET() {
  return NextResponse.json({ matches: await getSuggestedMatches() });
}
