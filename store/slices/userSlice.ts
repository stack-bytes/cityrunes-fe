import { fetchUserBadges } from "@/actions/badges";
import { signInWithEmail } from "@/actions/auth";
import { MOCK_USER } from "@/mocks/user-mock";
import { Badge } from "@/types/badge";
import { User } from "@/types/user";
import {
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

export type BadgesStatus = "idle" | "loading" | "succeeded" | "failed";

interface UserState extends User {
  completedPlaces: string[];
  purchasedBadges: Badge[];
  badgesStatus: BadgesStatus;
}

const initialState: UserState = {
  ...MOCK_USER,
  completedPlaces: [],
  purchasedBadges: [],
  badgesStatus: "idle",
};

interface LoginCredentials {
  email: string;
  password: string;
}

export const loadUserBadges = createAsyncThunk<Badge[], string>(
  "user/loadBadges",
  fetchUserBadges
);

export const loginUser = createAsyncThunk<
  User,
  LoginCredentials,
  { rejectValue: string }
>("user/login", async ({ email, password }, { dispatch, rejectWithValue }) => {
  try {
    const user = await signInWithEmail(email, password);
    dispatch(loadUserBadges(user.id));
    return user;
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
    builder
      .addCase(loginUser.fulfilled, (_state, action) => ({
        ...action.payload,
        completedPlaces: [],
        purchasedBadges: [],
        badgesStatus: "loading",
      }))
      .addCase(loadUserBadges.pending, (state) => {
        state.badgesStatus = "loading";
      })
      .addCase(loadUserBadges.fulfilled, (state, action) => {
        state.purchasedBadges = action.payload;
        state.badgesStatus = "succeeded";
      })
      .addCase(loadUserBadges.rejected, (state) => {
        state.badgesStatus = "failed";
      });
  },
});

export const { getUser, setUser, addCoins, completePlace, purchaseBadge } =
  userSlice.actions;
export default userSlice.reducer;
