import { MOCK_USER } from "@/mocks/user-mock";
import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: { ...MOCK_USER, completedPlaces: [] as string[] },
  reducers: {
    getUser: (state) => {
      return state;
    },
    setUser: (state, action: PayloadAction<User>) => {
      return action.payload;
    },
    addCoins: (state, action: PayloadAction<number>) => {
      state.coins += action.payload;
    },
    completePlace: (state, action: PayloadAction<string>) => {
      if (!state.completedPlaces) {
        state.completedPlaces = [];
      }
      if (!state.completedPlaces.includes(action.payload)) {
        state.completedPlaces.push(action.payload);
      }
    },
  },
});

export const { getUser, setUser, addCoins, completePlace } = userSlice.actions;
export default userSlice.reducer;
