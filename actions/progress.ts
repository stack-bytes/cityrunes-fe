import { callRpc } from "@/lib/rpc";
import {
  CompletionResult,
  CompletionRow,
  ProgressRow,
  UserProgress,
} from "@/types/progress";
import { mapCompletionRow, mapProgressRow } from "@/utils/progressMapper";

export const fetchProgress = async (): Promise<UserProgress> =>
  mapProgressRow(await callRpc<ProgressRow>("get_my_progress"));

export const startRoadRequest = async (
  roadId: string
): Promise<UserProgress> =>
  mapProgressRow(
    await callRpc<ProgressRow>("start_road", { p_road_id: roadId })
  );

export const leaveRoadRequest = async (): Promise<UserProgress> =>
  mapProgressRow(await callRpc<ProgressRow>("leave_road"));

export const completePlaceRequest = async (
  roadId: string,
  placeId: string
): Promise<CompletionResult> =>
  mapCompletionRow(
    await callRpc<CompletionRow>("complete_place", {
      p_road_id: roadId,
      p_place_id: placeId,
    })
  );
