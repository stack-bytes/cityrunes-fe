import { Place } from "@/types/place";
import { CompletionOutcome } from "@/types/progress";
import { Road } from "@/types/road";

export type PlaceStatus = "completed" | "next" | "locked";

export const getNextPlace = (
  road: Road,
  placeIds: string[]
): Place | undefined => road.places.find((place) => !placeIds.includes(place.id));

export const getPlaceStatus = (
  road: Road,
  placeIds: string[],
  placeId: string
): PlaceStatus => {
  if (placeIds.includes(placeId)) {
    return "completed";
  }
  return getNextPlace(road, placeIds)?.id === placeId ? "next" : "locked";
};

export const isRoadFinished = (road: Road, placeIds: string[]): boolean =>
  road.places.length > 0 &&
  road.places.every((place) => placeIds.includes(place.id));

export const getRoadReward = (road: Road): number =>
  road.quests.reduce((sum, quest) => sum + quest.reward, 0);

export const formatCompletionMessage = ({
  reward,
  roadCompleted,
}: CompletionOutcome): string =>
  roadCompleted ? `+${reward}G\nTrack complete!` : `+${reward}G`;
