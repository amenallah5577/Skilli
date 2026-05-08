"use client";

import { Plus, Save, X } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/Button";
import { SkillBadge } from "@/components/ui/SkillBadge";
import type { Skill } from "@/types/domain";

export function ProfileSetupForm({ skills }: { skills: Skill[] }) {
  const [teachSkills, setTeachSkills] = useState<Skill[]>(skills.slice(0, 2));
  const [learnSkills, setLearnSkills] = useState<Skill[]>(skills.slice(2, 4));
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function addSkill(type: "teach" | "learn", skillId: string) {
    const selected = skills.find((skill) => skill.id === Number(skillId));
    if (!selected) {
      return;
    }

    if (type === "teach") {
      setTeachSkills((current) =>
        current.some((skill) => skill.id === selected.id) ? current : [...current, selected]
      );
    } else {
      setLearnSkills((current) =>
        current.some((skill) => skill.id === selected.id) ? current : [...current, selected]
      );
    }
  }

  function removeSkill(type: "teach" | "learn", skillId: number) {
    if (type === "teach") {
      setTeachSkills((current) => current.filter((skill) => skill.id !== skillId));
    } else {
      setLearnSkills((current) => current.filter((skill) => skill.id !== skillId));
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/profile/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: formData.get("username"),
        location: formData.get("location"),
        bio: formData.get("bio")
      })
    });

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "Could not save profile.");
      return;
    }

    setMessage("Profile saved to Supabase.");
  }

  return (
    <form onSubmit={onSubmit} className="container-shell grid gap-6 pb-12 lg:grid-cols-[1fr_360px]">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft">
        <div className="grid gap-5">
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Username
            <input
              name="username"
              required
              placeholder="username"
              className="focus-ring rounded-md border-slate-200"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Location
            <input
              name="location"
              required
              placeholder="Tunis"
              className="focus-ring rounded-md border-slate-200"
            />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-ink">
            Bio
            <textarea
              name="bio"
              rows={5}
              required
              placeholder="Tell other students what you can teach and what you want to learn."
              className="focus-ring rounded-md border-slate-200"
            />
          </label>
        </div>
      </section>
      <aside className="grid gap-6">
        <SkillPicker
          title="Skills you can teach"
          skills={skills}
          selected={teachSkills}
          onAdd={(id) => addSkill("teach", id)}
          onRemove={(id) => removeSkill("teach", id)}
        />
        <SkillPicker
          title="Skills you want to learn"
          skills={skills}
          selected={learnSkills}
          onAdd={(id) => addSkill("learn", id)}
          onRemove={(id) => removeSkill("learn", id)}
        />
        {message ? (
          <p className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
            {message}
          </p>
        ) : null}
        {error ? (
          <p className="rounded-md bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
            {error}
          </p>
        ) : null}
        <Button icon={<Save className="h-4 w-4" aria-hidden="true" />}>Save profile</Button>
      </aside>
    </form>
  );
}

function SkillPicker({
  title,
  skills,
  selected,
  onAdd,
  onRemove
}: {
  title: string;
  skills: Skill[];
  selected: Skill[];
  onAdd: (skillId: string) => void;
  onRemove: (skillId: number) => void;
}) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <h2 className="text-base font-bold text-ink">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {selected.map((skill) => (
          <span key={skill.id} className="inline-flex items-center gap-1">
            <SkillBadge name={skill.name} category={skill.category} compact />
            <button
              type="button"
              className="focus-ring rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              aria-label={`Remove ${skill.name}`}
              onClick={() => onRemove(skill.id)}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <select
          className="focus-ring min-w-0 flex-1 rounded-md border-slate-200 text-sm"
          defaultValue=""
          onChange={(event) => {
            onAdd(event.target.value);
            event.currentTarget.value = "";
          }}
        >
          <option value="" disabled>
            Add a skill
          </option>
          {skills.map((skill) => (
            <option key={skill.id} value={skill.id}>
              {skill.name}
            </option>
          ))}
        </select>
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-100 text-slate-500">
          <Plus className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
    </section>
  );
}
