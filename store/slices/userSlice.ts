import { MOCK_USER } from "@/mocks/user-mock";
import { Badge } from "@/types/badge";
import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState extends User {
  completedPlaces: string[];
  purchasedBadges: Badge[];
}

const initialState: UserState = {
  ...MOCK_USER,
  completedPlaces: [],
  purchasedBadges: [],
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUser: (state) => {
      return state;
    },
    setUser: (state, action: PayloadAction<User>) => {
      Object.assign(state, action.payload);
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
    purchaseBadge: (
      state,
      action: PayloadAction<{ badge: Badge; price: number }>
    ) => {
      if (!state.purchasedBadges) {
        state.purchasedBadges = [];
      }
      const alreadyPurchased = state.purchasedBadges.some(
        (b) => b.id === action.payload.badge.id
      );
      if (!alreadyPurchased && state.coins >= action.payload.price) {
        state.coins -= action.payload.price;
        state.purchasedBadges.push(action.payload.badge);
      }
    },
  },
});

export const { getUser, setUser, addCoins, completePlace, purchaseBadge } =
  userSlice.actions;
export default userSlice.reducer;
