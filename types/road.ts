import { Place } from "./place";
import { Quest } from "./quest";

export interface Road {
  id: string;
  name: string;
  description: string;
  places: Place[];
  quests: Quest[];
  leaderboardId: string;
}
