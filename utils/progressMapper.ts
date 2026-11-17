import {
  CompletionResult,
  CompletionRow,
  ProgressRow,
  RoadProgress,
  UserProgress,
} from "@/types/progress";

export const mapProgressRow = (row: ProgressRow): UserProgress => ({
  coins: row.coins,
  activeRoadId: row.active_road_id,
  roads: Object.fromEntries(
    (row.roads ?? []).map((road): [string, RoadProgress] => [
      road.road_id,
      {
        roadId: road.road_id,
        completed: road.completed,
        placeIds: road.place_ids ?? [],
      },
    ])
  ),
});

export const mapCompletionRow = (row: CompletionRow): CompletionResult => ({
  ...mapProgressRow(row),
  reward: row.reward,
  roadCompleted: row.road_completed,
});
