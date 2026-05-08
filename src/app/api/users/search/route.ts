import { NextResponse, type NextRequest } from "next/server";
import { getProfiles } from "@/lib/repository";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q")?.toLowerCase() ?? "";
  const location = searchParams.get("location")?.toLowerCase() ?? "";
  const category = searchParams.get("category")?.toLowerCase() ?? "";
  const profiles = await getProfiles();

  const results = profiles.filter((profile) => {
    const skillNames = [...profile.teachSkills, ...profile.learnSkills]
      .map((item) => `${item.skill.name} ${item.skill.category}`)
      .join(" ")
      .toLowerCase();

    const matchesQuery =
      !query ||
      profile.fullName.toLowerCase().includes(query) ||
      profile.username.toLowerCase().includes(query) ||
      skillNames.includes(query);
    const matchesLocation = !location || profile.location.toLowerCase().includes(location);
    const matchesCategory = !category || skillNames.includes(category);

    return matchesQuery && matchesLocation && matchesCategory;
  });

  return NextResponse.json({ users: results });
}
