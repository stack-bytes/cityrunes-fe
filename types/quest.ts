import { Quiz } from "./quiz";

export interface Quest {
  status: "FINISHED" | "UNFINISHED";
  feedback: "NEGATIVE" | "POSITIVE";
  quiz?: Quiz[];
  photos?: string[];
  type: "PHOTO" | "QUIZ";
  name: string;
  description: string;
  reward: number;
}
