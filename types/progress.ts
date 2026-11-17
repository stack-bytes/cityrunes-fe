export interface RoadProgressRow {
  road_id: string;
  completed: boolean;
  place_ids: string[];
}

export interface ProgressRow {
  coins: number;
  active_road_id: string | null;
  roads: RoadProgressRow[];
}

export interface CompletionRow extends ProgressRow {
  reward: number;
  road_completed: boolean;
}

export interface RoadProgress {
  roadId: string;
  completed: boolean;
  placeIds: string[];
}

export interface UserProgress {
  coins: number;
  activeRoadId: string | null;
  roads: Record<string, RoadProgress>;
}

export interface CompletionResult extends UserProgress {
  reward: number;
  roadCompleted: boolean;
}

export interface ReplayState {
  roadId: string;
  placeIds: string[];
}

export interface CompletionOutcome {
  reward: number;
  roadCompleted: boolean;
  progress: UserProgress | null;
}
