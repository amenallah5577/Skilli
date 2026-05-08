import { SkillExplorer } from "@/components/skills/SkillExplorer";
import { PageHeader } from "@/components/ui/PageHeader";
import { getProfiles, getSkillCategories, getSkills } from "@/lib/repository";

export default async function SkillsPage() {
  const [skills, categories, profiles] = await Promise.all([
    getSkills(),
    getSkillCategories(),
    getProfiles()
  ]);

  return (
    <>
      <PageHeader eyebrow="Skills" title="Browse what the community can teach">
        Search by skill name, filter by category, and open member profiles to request a
        session.
      </PageHeader>
      <SkillExplorer skills={skills} categories={categories} profiles={profiles} />
    </>
  );
}
