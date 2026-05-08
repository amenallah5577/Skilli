import type { MatchResult, Skill, UserProfile } from "@/types/domain";

function hasSkill(skills: Skill[], target: Skill) {
  return skills.some((skill) => skill.id === target.id);
}

export function calculateMatch(currentUser: UserProfile, candidate: UserProfile): MatchResult {
  const currentWants = currentUser.learnSkills.map((item) => item.skill);
  const currentTeaches = currentUser.teachSkills.map((item) => item.skill);
  const candidateTeaches = candidate.teachSkills.map((item) => item.skill);
  const candidateWants = candidate.learnSkills.map((item) => item.skill);

  const matchingSkills = candidateTeaches.filter((skill) => hasSkill(currentWants, skill));
  const reciprocalSkills = candidateWants.filter((skill) => hasSkill(currentTeaches, skill));

  const reasons: string[] = [];
  let score = 0;

  if (matchingSkills.length > 0) {
    score += 40;
    reasons.push(`Teaches ${matchingSkills.map((skill) => skill.name).join(", ")}`);
  }

  if (reciprocalSkills.length > 0) {
    score += 40;
    reasons.push(`Wants ${reciprocalSkills.map((skill) => skill.name).join(", ")}`);
  }

  if (candidate.location === currentUser.location) {
    score += 10;
    reasons.push(`Also in ${candidate.location}`);
  }

  if (candidate.rating >= 4.7) {
    score += 10;
    reasons.push(`${candidate.rating.toFixed(1)} average rating`);
  } else if (candidate.rating >= 4.4) {
    score += 6;
    reasons.push("Strong community rating");
  }

  return {
    profile: candidate,
    score: Math.min(score, 100),
    reasons,
    matchingSkills,
    reciprocalSkills
  };
}

export function getMatches(currentUser: UserProfile, candidates: UserProfile[]) {
  return candidates
    .filter((candidate) => candidate.id !== currentUser.id)
    .map((candidate) => calculateMatch(currentUser, candidate))
    .filter((match) => match.score > 0)
    .sort((a, b) => b.score - a.score);
}
