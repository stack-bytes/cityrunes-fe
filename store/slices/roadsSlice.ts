import { MOCK_ROADS } from "@/mocks/mock-roads";
import { Road } from "@/types/road";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const roadsSlice = createSlice({
  name: "roads",
  initialState: MOCK_ROADS as Road[],
  reducers: {
    getRoads: (state) => {
      return state;
    },
    setRoads: (state, action: PayloadAction<Road[]>) => {
      return action.payload;
    },
  },
});

export const { getRoads, setRoads } = roadsSlice.actions;
export default roadsSlice.reducer;
