import { fetchCatalog } from "@/actions/catalog";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export type CatalogStatus = "idle" | "loading" | "succeeded" | "failed";

interface CatalogState {
  status: CatalogStatus;
  initialLoadSettled: boolean;
}

const initialState: CatalogState = {
  status: "idle",
  initialLoadSettled: false,
};

export const loadCatalog = createAsyncThunk("catalog/load", fetchCatalog);

const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCatalog.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadCatalog.fulfilled, (state) => {
        state.status = "succeeded";
        state.initialLoadSettled = true;
      })
      .addCase(loadCatalog.rejected, (state) => {
        state.status = "failed";
        state.initialLoadSettled = true;
      });
  },
});

export default catalogSlice.reducer;
