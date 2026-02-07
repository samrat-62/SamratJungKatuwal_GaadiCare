import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/services/axiosMain";
import { GET_ALL_WORKSHOPS } from "@/routes/serverEndpoints";


export const fetchAllWorkshops = createAsyncThunk(
  "workshops/fetchAllWorkshops",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(GET_ALL_WORKSHOPS, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Something went wrong");
    }
  }
);

const workshopsSlice = createSlice({
  name: "workshops",
  initialState: {
    allWorkshops: [],
    loading: false,
    error: null,
    status: "idle",
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllWorkshops.pending, (state) => {
        state.loading = true;
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchAllWorkshops.fulfilled, (state, action) => {
        state.loading = false;
        state.status = "succeeded";
        state.allWorkshops = action.payload.workshops || action.payload;
      })
      .addCase(fetchAllWorkshops.rejected, (state, action) => {
        state.loading = false;
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default workshopsSlice.reducer;
