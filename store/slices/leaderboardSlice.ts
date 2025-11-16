import { MOCK_LEADERBOARD_USERS } from "@/mocks/mock-leaderboard";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TrackPoints {
  [userId: string]: number;
}

interface LeaderboardState {
  trackLeaderboards: {
    [trackId: string]: TrackPoints;
  };
}

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    trackLeaderboards: {},
  } as LeaderboardState,
  reducers: {
    addPoints: (
      state,
      action: PayloadAction<{ userId: string; trackId: string; points: number }>
    ) => {
      const { userId, trackId, points } = action.payload;

      if (!state.trackLeaderboards[trackId]) {
        state.trackLeaderboards[trackId] = {};
      }

      if (!state.trackLeaderboards[trackId][userId]) {
        state.trackLeaderboards[trackId][userId] = 0;
      }

      state.trackLeaderboards[trackId][userId] += points;
    },
    initializeTrackLeaderboard: (
      state,
      action: PayloadAction<{ trackId: string }>
    ) => {
      const { trackId } = action.payload;

      if (!state.trackLeaderboards[trackId]) {
        state.trackLeaderboards[trackId] = {};

        // Initialize mock users with their coins
        MOCK_LEADERBOARD_USERS.forEach((user) => {
          state.trackLeaderboards[trackId][user.id] = user.coins;
        });

        console.log(
          "Initialized track:",
          trackId,
          "with users:",
          state.trackLeaderboards[trackId]
        );
      } else {
        console.log(
          "Track already initialized:",
          trackId,
          "data:",
          state.trackLeaderboards[trackId]
        );
      }
    },
  },
});

export const { addPoints, initializeTrackLeaderboard } =
  leaderboardSlice.actions;
export default leaderboardSlice.reducer;
