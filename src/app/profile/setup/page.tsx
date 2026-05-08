import { ProfileSetupForm } from "@/components/profile/ProfileSetupForm";
import { PageHeader } from "@/components/ui/PageHeader";
import { getSkills } from "@/lib/repository";

export default async function ProfileSetupPage() {
  const skills = await getSkills();

  return (
    <>
      <PageHeader eyebrow="Profile setup" title="Show what you teach and what you want to learn">
        A complete profile makes matching stronger and helps other members understand how to
        exchange value with you.
      </PageHeader>
      <ProfileSetupForm skills={skills} />
    </>
  );
}
