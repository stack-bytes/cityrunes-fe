import { buyBadge, fetchUserBadges } from "@/actions/badges";
import { signInWithEmail } from "@/actions/auth";
import { toErrorMessage } from "@/lib/rpc";
import { MOCK_USER } from "@/mocks/user-mock";
import { Badge } from "@/types/badge";
import { User } from "@/types/user";
import {
  createAsyncThunk,
  createSlice,
  isFulfilled,
  PayloadAction,
} from "@reduxjs/toolkit";
import {
  leaveRoad,
  loadProgress,
  startReplay,
  startRoad,
  submitPlaceCompletion,
} from "./progressSlice";

export type BadgesStatus = "idle" | "loading" | "succeeded" | "failed";

interface UserState extends User {
  purchasedBadges: Badge[];
  badgesStatus: BadgesStatus;
}

const initialState: UserState = {
  ...MOCK_USER,
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
    dispatch(loadProgress());
    return user;
  } catch (error) {
    return rejectWithValue(
      error instanceof Error ? error.message : "Could not log in."
    );
  }
});

export const purchaseBadge = createAsyncThunk<
  number,
  Badge,
  { rejectValue: string }
>("user/purchaseBadge", async (badge, { rejectWithValue }) => {
  try {
    return await buyBadge(badge.id);
  } catch (error) {
    return rejectWithValue(toErrorMessage(error));
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (_state, action) => ({
        ...action.payload,
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
      })
      .addCase(purchaseBadge.fulfilled, (state, action) => {
        state.coins = action.payload;
        if (!state.purchasedBadges.some((b) => b.id === action.meta.arg.id)) {
          state.purchasedBadges.push(action.meta.arg);
        }
      })
      .addCase(startReplay.fulfilled, (state, action) => {
        if (action.payload) {
          state.coins = action.payload.coins;
        }
      })
      .addCase(submitPlaceCompletion.fulfilled, (state, action) => {
        if (action.payload.progress) {
          state.coins = action.payload.progress.coins;
        }
      })
      .addMatcher(
        isFulfilled(loadProgress, startRoad, leaveRoad),
        (state, action) => {
          state.coins = action.payload.coins;
        }
      );
  },
});

export const { getUser, setUser } = userSlice.actions;
export default userSlice.reducer;
