import { configureStore } from "@reduxjs/toolkit";
import badgesReducer from "./slices/badgesSlice";
import catalogReducer from "./slices/catalogSlice";
import placesReducer from "./slices/placesSlice";
import questsReducer from "./slices/questsSlice";
import roadsReducer from "./slices/roadsSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    catalog: catalogReducer,
    badges: badgesReducer,
    roads: roadsReducer,
    places: placesReducer,
    quests: questsReducer,
    user: userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
