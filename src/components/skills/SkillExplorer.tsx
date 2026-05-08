"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { SkillBadge } from "@/components/ui/SkillBadge";
import type { Skill, UserProfile } from "@/types/domain";

export function SkillExplorer({
  skills,
  categories,
  profiles
}: {
  skills: Skill[];
  categories: string[];
  profiles: UserProfile[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");

  const filteredSkills = useMemo(
    () =>
      skills.filter((skill) => {
        const matchesQuery = skill.name.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = category === "All" || skill.category === category;
        return matchesQuery && matchesCategory;
      }),
    [category, query, skills]
  );

  return (
    <section className="container-shell pb-12">
      <div className="mb-6 grid gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft md:grid-cols-[1fr_240px]">
        <label className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search skills"
            className="focus-ring w-full rounded-md border-slate-200 pl-10"
          />
        </label>
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
          className="focus-ring rounded-md border-slate-200"
        >
          <option>All</option>
          {categories.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredSkills.map((skill) => {
          const teachers = profiles.filter((profile) =>
            profile.teachSkills.some((item) => item.skill.id === skill.id)
          );

          return (
            <article
              key={skill.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft"
            >
              <SkillBadge name={skill.name} category={skill.category} />
              <p className="mt-4 text-sm leading-6 text-slate-600">
                {teachers.length
                  ? `${teachers.length} community member${teachers.length > 1 ? "s" : ""} can teach this skill.`
                  : "No teacher yet. Add it to your profile to become the first."}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {teachers.slice(0, 3).map((teacher) => (
                  <a
                    key={teacher.id}
                    href={`/profile/${teacher.username}`}
                    className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200"
                  >
                    {teacher.fullName}
                  </a>
                ))}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
