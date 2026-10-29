import { Quiz } from "./quiz";

export interface Quest {
  id: string;
  placeId: string;
  type: "PHOTO" | "QUIZ";
  name: string;
  description: string;
  reward: number;
  quiz: Quiz | null;
}
