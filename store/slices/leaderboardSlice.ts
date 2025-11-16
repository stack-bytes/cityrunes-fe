import {
  LeaderboardUser,
  MOCK_LEADERBOARD_USERS,
} from "@/mocks/mock-leaderboard";
import { createSlice } from "@reduxjs/toolkit";

interface LeaderboardState {
  users: LeaderboardUser[];
}

const leaderboardSlice = createSlice({
  name: "leaderboard",
  initialState: {
    users: MOCK_LEADERBOARD_USERS,
  } as LeaderboardState,
  reducers: {
    getLeaderboard: (state) => {
      return state;
    },
  },
});

export const { getLeaderboard } = leaderboardSlice.actions;
export default leaderboardSlice.reducer;
