import { Road } from "@/types/road";
import { MOCK_PLACES } from "./mock-places";

export const MOCK_ROADS: Road[] = [
  {
    id: "road-1",
    name: "Revolution Track",
    description: "A historical track through the city center.",
    places: MOCK_PLACES,
    quests: [],
    leaderboardId: "leaderboard-1",
  },
];
