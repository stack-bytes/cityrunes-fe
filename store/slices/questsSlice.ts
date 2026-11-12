import { MOCK_QUESTS } from "@/mocks/mock-quests";
import { Quest } from "@/types/quest";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loadCatalog } from "./catalogSlice";

const questsSlice = createSlice({
  name: "quests",
  initialState: MOCK_QUESTS as Quest[],
  reducers: {
    setQuests: (_state, action: PayloadAction<Quest[]>) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadCatalog.fulfilled, (_state, action) => {
      return action.payload.quests;
    });
  },
});

export const selectQuestByPlaceId = (
  quests: Quest[],
  placeId: string
): Quest | undefined => quests.find((quest) => quest.placeId === placeId);

export const { setQuests } = questsSlice.actions;
export default questsSlice.reducer;
