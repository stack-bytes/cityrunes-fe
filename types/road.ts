import { Place } from "./place";
import { Quest } from "./quest";

export interface Road {
  id: string;
  name: string;
  description: string;
  leaderboardId: string;
  places: Place[];
  quests: Quest[];
}
