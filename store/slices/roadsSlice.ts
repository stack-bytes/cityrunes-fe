import { MOCK_ROADS } from "@/mocks/mock-roads";
import { createSlice } from "@reduxjs/toolkit";

const roadsSclice = createSlice({
  name: "roads",
  initialState: MOCK_ROADS,
  reducers: {
    getRoads: (state) => {
      return state;
    },
    setRoads: (state, action) => {
      return action.payload;
    },
  },
});

export const { getRoads, setRoads } = roadsSclice.actions;
export default roadsSclice.reducer;
