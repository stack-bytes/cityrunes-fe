import {
  completePlaceRequest,
  fetchProgress,
  leaveRoadRequest,
  startRoadRequest,
} from "@/actions/progress";
import { toErrorMessage } from "@/lib/rpc";
import {
  CompletionOutcome,
  ReplayState,
  RoadProgress,
  UserProgress,
} from "@/types/progress";
import { Road } from "@/types/road";
import { getNextPlace, isRoadFinished } from "@/utils/progress";
import {
  createAsyncThunk,
  createSlice,
  isPending,
  isRejected,
} from "@reduxjs/toolkit";

export type ProgressStatus = "idle" | "loading" | "succeeded" | "failed";

interface ProgressState {
  status: ProgressStatus;
  activeRoadId: string | null;
  roads: Record<string, RoadProgress>;
  replay: ReplayState | null;
  saving: boolean;
}

interface ThunkConfig {
  state: { progress: ProgressState; roads: Road[] };
  rejectValue: string;
}

interface PlaceCompletion {
  roadId: string;
  placeId: string;
}

const NOT_UNLOCKED_MESSAGE = "This place is not unlocked yet";

const initialState: ProgressState = {
  status: "idle",
  activeRoadId: null,
  roads: {},
  replay: null,
  saving: false,
};

const applyProgress = (state: ProgressState, progress: UserProgress) => {
  state.activeRoadId = progress.activeRoadId;
  state.roads = progress.roads;
};

export const loadProgress = createAsyncThunk("progress/load", fetchProgress);

export const startRoad = createAsyncThunk<UserProgress, string, ThunkConfig>(
  "progress/startRoad",
  async (roadId, { rejectWithValue }) => {
    try {
      return await startRoadRequest(roadId);
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const leaveRoad = createAsyncThunk<UserProgress, void, ThunkConfig>(
  "progress/leaveRoad",
  async (_arg, { rejectWithValue }) => {
    try {
      return await leaveRoadRequest();
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

export const startReplay = createAsyncThunk<
  UserProgress | null,
  string,
  ThunkConfig
>("progress/startReplay", async (_roadId, { getState, rejectWithValue }) => {
  if (!getState().progress.activeRoadId) {
    return null;
  }
  try {
    return await leaveRoadRequest();
  } catch (error) {
    return rejectWithValue(toErrorMessage(error));
  }
});

export const submitPlaceCompletion = createAsyncThunk<
  CompletionOutcome,
  PlaceCompletion,
  ThunkConfig
>(
  "progress/completePlace",
  async ({ roadId, placeId }, { getState, rejectWithValue }) => {
    const { progress, roads } = getState();

    if (progress.replay?.roadId === roadId) {
      const road = roads.find((candidate) => candidate.id === roadId);
      const replayed = progress.replay.placeIds;
      if (!road || getNextPlace(road, replayed)?.id !== placeId) {
        return rejectWithValue(NOT_UNLOCKED_MESSAGE);
      }
      return {
        reward: 0,
        roadCompleted: isRoadFinished(road, [...replayed, placeId]),
        progress: null,
      };
    }

    try {
      const { reward, roadCompleted, ...updated } = await completePlaceRequest(
        roadId,
        placeId
      );
      return { reward, roadCompleted, progress: updated };
    } catch (error) {
      return rejectWithValue(toErrorMessage(error));
    }
  }
);

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    stopReplay: (state) => {
      state.replay = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadProgress.pending, () => ({
        ...initialState,
        status: "loading",
      }))
      .addCase(loadProgress.fulfilled, (state, action) => {
        applyProgress(state, action.payload);
        state.status = "succeeded";
      })
      .addCase(loadProgress.rejected, (state) => {
        state.status = "failed";
      })
      .addCase(startRoad.fulfilled, (state, action) => {
        applyProgress(state, action.payload);
        state.replay = null;
        state.saving = false;
      })
      .addCase(leaveRoad.fulfilled, (state, action) => {
        applyProgress(state, action.payload);
        state.replay = null;
        state.saving = false;
      })
      .addCase(startReplay.fulfilled, (state, action) => {
        if (action.payload) {
          applyProgress(state, action.payload);
        }
        state.replay = { roadId: action.meta.arg, placeIds: [] };
        state.saving = false;
      })
      .addCase(submitPlaceCompletion.fulfilled, (state, action) => {
        const { progress, roadCompleted } = action.payload;
        if (progress) {
          applyProgress(state, progress);
        } else if (state.replay) {
          state.replay.placeIds.push(action.meta.arg.placeId);
          if (roadCompleted) {
            state.replay = null;
          }
        }
        state.saving = false;
      })
      .addMatcher(
        isPending(startRoad, leaveRoad, startReplay, submitPlaceCompletion),
        (state) => {
          state.saving = true;
        }
      )
      .addMatcher(
        isRejected(startRoad, leaveRoad, startReplay, submitPlaceCompletion),
        (state) => {
          state.saving = false;
        }
      );
  },
});

export const { stopReplay } = progressSlice.actions;
export default progressSlice.reducer;
