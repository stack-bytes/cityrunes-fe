import { Road } from "@/types/road";
import { MOCK_PLACES } from "./mock-places";
import { MOCK_QUESTS } from "./mock-quests";

export const MOCK_ROADS: Road[] = [
  {
    id: "road-1",
    name: "Revolution Track",
    description:
      "A historical track about the Romanian Revolution in Timisoara.",
    places: MOCK_PLACES.slice(0, 3),
    quests: MOCK_QUESTS,
    leaderboardId: "leaderboard-1",
  },
  {
    id: "road-2",
    name: "Art Track",
    description: "A cultural route connecting the main museums in Timisoara.",
    places: MOCK_PLACES.slice(6, 9),
    quests: MOCK_QUESTS,
    leaderboardId: "leaderboard-2",
  },
];
