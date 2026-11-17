import { BadgeRow } from "@/types/badge";
import {
  Catalog,
  PlaceRow,
  QuestRow,
  RoadRow,
} from "@/types/catalog";
import { mapBadgeRow } from "./badgeMapper";
import { Place } from "@/types/place";
import { Quest } from "@/types/quest";
import { Road } from "@/types/road";

export const mapPlaceRow = (row: PlaceRow): Place => ({
  id: row.id,
  name: row.name,
  coordinates: { latitude: row.latitude, longitude: row.longitude },
  description: row.description,
  icon: row.icon,
  reward: row.reward,
  imageId: row.image_id,
  imageUrl: row.image_url,
});

export const mapQuestRow = (row: QuestRow): Quest => {
  const firstQuestion =
    row.type === "QUIZ"
      ? [...(row.quiz_questions ?? [])].sort((a, b) =>
          a.id.localeCompare(b.id)
        )[0]
      : undefined;

  return {
    id: row.id,
    placeId: row.place_id,
    type: row.type,
    name: row.name,
    description: row.description,
    reward: row.reward,
    quiz: firstQuestion
      ? {
          question: firstQuestion.question,
          answers: firstQuestion.answers,
          correctAnswer: firstQuestion.correct_answer,
        }
      : null,
  };
};

export const mapRoadRow = (
  row: RoadRow,
  placesById: Map<string, Place>,
  questsByPlaceId: Map<string, Quest>
): Road => {
  const orderedPlaces = [...row.road_places]
    .sort((a, b) => a.position - b.position)
    .map((roadPlace) => placesById.get(roadPlace.place_id))
    .filter((place): place is Place => place !== undefined);

  const quests = orderedPlaces
    .map((place) => questsByPlaceId.get(place.id))
    .filter((quest): quest is Quest => quest !== undefined);

  return {
    id: row.id,
    name: row.name,
    description: row.description,
    leaderboardId: row.leaderboard_id,
    places: orderedPlaces,
    quests,
  };
};

export const buildCatalog = (
  roadRows: RoadRow[],
  placeRows: PlaceRow[],
  questRows: QuestRow[],
  badgeRows: BadgeRow[]
): Catalog => {
  const places = placeRows.map(mapPlaceRow);
  const quests = questRows.map(mapQuestRow);
  const placesById = new Map(places.map((place) => [place.id, place]));
  const questsByPlaceId = new Map(
    quests.map((quest) => [quest.placeId, quest])
  );
  const roads = roadRows.map((row) =>
    mapRoadRow(row, placesById, questsByPlaceId)
  );

  const badges = badgeRows.map(mapBadgeRow);

  return { roads, places, quests, badges };
};
