export type SkillLevel = "beginner" | "intermediate" | "advanced";

export type SessionStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled"
  | "completed";

export type SessionMode = "chat" | "voice" | "video";

export type LearningProgress =
  | "not_started"
  | "practicing"
  | "understood"
  | "mastered";

export type Skill = {
  id: number;
  name: string;
  category: string;
};

export type UserSkill = {
  id: number;
  skill: Skill;
  level: SkillLevel;
};

export type UserProfile = {
  id: string;
  fullName: string;
  username: string;
  bio: string;
  avatarUrl: string;
  location: string;
  points: number;
  xp: number;
  rating: number;
  completedSessions: number;
  responseRate: number;
  createdAt: string;
  teachSkills: UserSkill[];
  learnSkills: UserSkill[];
};

export type Session = {
  id: number;
  teacher: Pick<
    UserProfile,
    "id" | "fullName" | "username" | "avatarUrl" | "location" | "rating"
  >;
  learner: Pick<
    UserProfile,
    "id" | "fullName" | "username" | "avatarUrl" | "location" | "rating"
  >;
  skill: Skill;
  status: SessionStatus;
  mode: SessionMode;
  goal: string;
  scheduledAt: string;
  durationMinutes: number;
  meetingLink?: string;
  note?: string;
  lessonPlan: string[];
  lessonNotes: string;
  task: {
    title: string;
    description: string;
    progress: LearningProgress;
    submission?: string;
    feedback?: string;
  };
};

export type Message = {
  id: number;
  sessionId: number;
  senderId: string;
  content: string;
  createdAt: string;
};

export type Review = {
  id: number;
  sessionId: number;
  reviewerId: string;
  reviewedUserId: string;
  rating: number;
  comment: string;
  createdAt: string;
};

export type MatchResult = {
  profile: UserProfile;
  score: number;
  reasons: string[];
  matchingSkills: Skill[];
  reciprocalSkills: Skill[];
};
