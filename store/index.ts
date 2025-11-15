import { configureStore } from "@reduxjs/toolkit";
import placesReducer from "./slices/placesSlice";
import roadsReducer from "./slices/roadsSlice";

export const store = configureStore({
  reducer: {
    roads: roadsReducer,
    places: placesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
