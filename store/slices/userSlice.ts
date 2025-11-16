import { MOCK_USER } from "@/mocks/user-mock";
import { User } from "@/types/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PurchasedBadge {
  name: string;
  image: any;
  backgroundColor: string;
}

const userSlice = createSlice({
  name: "user",
  initialState: {
    ...MOCK_USER,
    completedPlaces: [] as string[],
    purchasedBadges: [] as PurchasedBadge[],
  },
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
    purchaseBadge: (
      state,
      action: PayloadAction<{ badge: PurchasedBadge; price: number }>
    ) => {
      if (!state.purchasedBadges) {
        state.purchasedBadges = [];
      }
      const alreadyPurchased = state.purchasedBadges.some(
        (b) => b.name === action.payload.badge.name
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
export type { PurchasedBadge };
