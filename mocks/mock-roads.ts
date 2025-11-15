import { Road } from "@/types/road";
import { MOCK_PLACES } from "./mock-places";

export const MOCK_ROADS: Road[] = [
  {
    id: "road-1",
    name: "Revolution Track",
    description: "A historical track through the city center.",
    places: MOCK_PLACES.slice(0, 5),
    quests: [],
    leaderboardId: "leaderboard-1",
  },
  {
    id: "road-2",
    name: "Drumul muzeelor",
    description:
      "O rută culturală care leagă principalele muzee din Timișoara.",
    places: MOCK_PLACES.slice(6, 9),
    quests: [],
    leaderboardId: "leaderboard-2",
  },
];
