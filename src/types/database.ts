export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          username: string;
          bio: string | null;
          avatar_url: string | null;
          location: string | null;
          points: number;
          xp: number;
          rating: number;
          created_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          username: string;
          bio?: string | null;
          avatar_url?: string | null;
          location?: string | null;
          points?: number;
          xp?: number;
          rating?: number;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      skills: {
        Row: {
          id: number;
          name: string;
          category: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          category?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["skills"]["Insert"]>;
      };
      user_teach_skills: {
        Row: {
          id: number;
          user_id: string;
          skill_id: number;
          level: "beginner" | "intermediate" | "advanced";
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          skill_id: number;
          level: "beginner" | "intermediate" | "advanced";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_teach_skills"]["Insert"]>;
      };
      user_learn_skills: {
        Row: {
          id: number;
          user_id: string;
          skill_id: number;
          level: "beginner" | "intermediate" | "advanced";
          created_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          skill_id: number;
          level: "beginner" | "intermediate" | "advanced";
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_learn_skills"]["Insert"]>;
      };
      sessions: {
        Row: {
          id: number;
          teacher_id: string;
          learner_id: string;
          skill_id: number;
          status: "pending" | "accepted" | "rejected" | "cancelled" | "completed";
          mode: "chat" | "voice" | "video";
          goal: string;
          scheduled_at: string | null;
          duration_minutes: number;
          meeting_link: string | null;
          note: string | null;
          lesson_plan: string[];
          lesson_notes: string;
          task_title: string;
          task_description: string;
          task_status: "not_started" | "practicing" | "understood" | "mastered";
          task_submission: string | null;
          task_feedback: string | null;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: number;
          teacher_id: string;
          learner_id: string;
          skill_id: number;
          status?: "pending" | "accepted" | "rejected" | "cancelled" | "completed";
          mode?: "chat" | "voice" | "video";
          goal?: string;
          scheduled_at?: string | null;
          duration_minutes?: number;
          meeting_link?: string | null;
          note?: string | null;
          lesson_plan?: string[];
          lesson_notes?: string;
          task_title?: string;
          task_description?: string;
          task_status?: "not_started" | "practicing" | "understood" | "mastered";
          task_submission?: string | null;
          task_feedback?: string | null;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["sessions"]["Insert"]>;
      };
      messages: {
        Row: {
          id: number;
          session_id: number;
          sender_id: string;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: number;
          session_id: number;
          sender_id: string;
          content: string;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: number;
          session_id: number;
          reviewer_id: string;
          reviewed_user_id: string;
          rating: number;
          comment: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          session_id: number;
          reviewer_id: string;
          reviewed_user_id: string;
          rating: number;
          comment?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      badges: {
        Row: {
          id: number;
          name: string;
          description: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          description?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["badges"]["Insert"]>;
      };
      user_badges: {
        Row: {
          id: number;
          user_id: string;
          badge_id: number;
          earned_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          badge_id: number;
          earned_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["user_badges"]["Insert"]>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
