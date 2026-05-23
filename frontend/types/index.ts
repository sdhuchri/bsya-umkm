export type Branch = "A" | "B" | "C";

export type QuestionType = "single" | "multi" | "text" | "text-chips";

export type Question = {
  id: string;
  q: string;
  sub?: string;
  ai: string;
  type: QuestionType;
  textHint?: string;
  chipsLabel?: string;
  options?: string[];
};

// Raw answer captured per question id during onboarding.
export type Answer = {
  text?: string;
  chip?: string | null;
  multi?: string[];
  single?: string | null;
};

export type BusinessProfile = {
  branch: Branch;
  businessName: string;
  category: string;
  needs: string[];
  answers: Record<string, Answer>;
  completedAt: string;
};
