import { Road } from "@/types/road";
import { MOCK_PLACES } from "./mock-places";
import { MOCK_QUESTS } from "./mock-quests";

const placeById = (id: string) =>
  MOCK_PLACES.find((place) => place.id === id)!;
const questByPlaceId = (placeId: string) =>
  MOCK_QUESTS.find((quest) => quest.placeId === placeId)!;

const ROAD_PLACE_IDS: { [roadId: string]: string[] } = {
  "road-1": ["1", "2", "3"],
  "road-2": ["7", "8", "9"],
};

export const MOCK_ROADS: Road[] = [
  {
    id: "road-1",
    name: "Revolution Track",
    description:
      "A historical track about the Romanian Revolution in Timisoara.",
    leaderboardId: "leaderboard-1",
    places: ROAD_PLACE_IDS["road-1"].map(placeById),
    quests: ROAD_PLACE_IDS["road-1"].map(questByPlaceId),
  },
  {
    id: "road-2",
    name: "Art Track",
    description: "A cultural route connecting the main museums in Timisoara.",
    leaderboardId: "leaderboard-2",
    places: ROAD_PLACE_IDS["road-2"].map(placeById),
    quests: ROAD_PLACE_IDS["road-2"].map(questByPlaceId),
  },
];
