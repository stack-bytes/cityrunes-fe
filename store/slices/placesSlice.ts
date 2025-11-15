import { MOCK_PLACES } from "@/mocks/mock-places";
import { createSlice } from "@reduxjs/toolkit";

const placesSlice = createSlice({
  name: "places",
  initialState: MOCK_PLACES,
  reducers: {
    getPlaces: (state) => {
      return state;
    },
    setPlaces: (state, action) => {
      return action.payload;
    },
  },
});

export const { getPlaces, setPlaces } = placesSlice.actions;
export default placesSlice.reducer;
