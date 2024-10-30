export interface Feature {
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
}

// For Rag
export type AiResponse = {
  answer: string;
  referencedFiles: string[];
};

export type AiBubbleData = {
  isLoading: boolean;
  response: AiResponse[] | null;
};

type BubbleBase<T extends "user" | "ai"> = {
  sender: T;
  data: T extends "user" ? string : AiBubbleData;
};
export type Bubble = BubbleBase<"user"> | BubbleBase<"ai">;

export type Thread = Bubble[];