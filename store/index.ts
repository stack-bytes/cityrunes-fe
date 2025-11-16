import { configureStore } from "@reduxjs/toolkit";
import leaderboardReducer from "./slices/leaderboardSlice";
import placesReducer from "./slices/placesSlice";
import roadsReducer from "./slices/roadsSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    roads: roadsReducer,
    places: placesReducer,
    user: userReducer,
    leaderboard: leaderboardReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
