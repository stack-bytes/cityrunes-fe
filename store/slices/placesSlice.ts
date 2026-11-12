import { MOCK_PLACES } from "@/mocks/mock-places";
import { Place } from "@/types/place";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadCatalog } from "./catalogSlice";

const placesSlice = createSlice({
  name: "places",
  initialState: MOCK_PLACES as Place[],
  reducers: {
    getPlaces: (state) => {
      return state;
    },
    setPlaces: (state, action: PayloadAction<Place[]>) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCatalog.fulfilled, (_state, action) => {
      return action.payload.places;
    });
  },
});

export const { getPlaces, setPlaces } = placesSlice.actions;
export default placesSlice.reducer;
