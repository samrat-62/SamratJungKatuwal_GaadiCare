import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/services/axiosMain";
import {GET_UNVERIFIED_WORKSHOPS } from "@/routes/serverEndpoints";


export const fetchPendingWorkshops = createAsyncThunk(
  "pendingWorkshops/fetchPendingWorkshops",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(GET_UNVERIFIED_WORKSHOPS, {
        withCredentials: true,
      });
      // console.log(response,"pending workshops data");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const pendingWorkshopsSlice = createSlice({
  name: "pendingWorkshops",
  initialState: {
    pendingWorkshops: [],
    loading: false,
    error: null,
    status: "idle",
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPendingWorkshops.pending, (state) => {
        state.loading = true;
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchPendingWorkshops.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.pendingWorkshops = action.payload.workshops || action.payload;
      })
      .addCase(fetchPendingWorkshops.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default pendingWorkshopsSlice.reducer;
