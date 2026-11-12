import { signInWithEmail } from "@/actions/auth";
import { MOCK_USER } from "@/mocks/user-mock";
import { Badge } from "@/types/badge";
import { User } from "@/types/user";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

interface UserState extends User {
  completedPlaces: string[];
  purchasedBadges: Badge[];
}

const initialState: UserState = {
  ...MOCK_USER,
  completedPlaces: [],
  purchasedBadges: [],
};

interface LoginCredentials {
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>("user/login", async ({ email, password }, { rejectWithValue }) => {
  try {
    return await signInWithEmail(email, password);
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Could not log in."
    );
  }
});

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
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, (_state, action) => ({
      ...action.payload,
      completedPlaces: [],
      purchasedBadges: [],
    }));
  },
});

export const { getUser, setUser, addCoins, completePlace, purchaseBadge } =
  userSlice.actions;
export default userSlice.reducer;
