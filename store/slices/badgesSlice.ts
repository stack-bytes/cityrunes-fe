import { MOCK_STORE_BADGES } from "@/mocks/mock-store";
import { Badge } from "@/types/badge";
import { createSlice } from "@reduxjs/toolkit";
import { loadCatalog } from "./catalogSlice";

const badgesSlice = createSlice({
  name: "badges",
  initialState: MOCK_STORE_BADGES as Badge[],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadCatalog.fulfilled, (_state, action) => {
      return action.payload.badges;
    });
  },
});

export default badgesSlice.reducer;
