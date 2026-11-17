import { Badge } from "./badge";
import { Place } from "./place";
import { Quest } from "./quest";
import { Road } from "./road";

export interface PlaceRow {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  description: string;
  icon: string;
  reward: number;
  image_id: string | null;
  image_url: string | null;
}

export interface RoadPlaceRow {
  place_id: string;
  position: number;
}

export interface RoadRow {
  id: string;
  name: string;
  description: string;
  leaderboard_id: string;
  road_places: RoadPlaceRow[];
}

export interface QuizQuestionRow {
  id: string;
  quest_id: string;
  question: string;
  answers: string[];
  correct_answer: number;
}

export interface QuestRow {
  id: string;
  place_id: string;
  type: "PHOTO" | "QUIZ";
  name: string;
  description: string;
  reward: number;
  quiz_questions: QuizQuestionRow[];
}

export interface Catalog {
  roads: Road[];
  places: Place[];
  quests: Quest[];
  badges: Badge[];
}
