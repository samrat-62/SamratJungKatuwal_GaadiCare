import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/services/axiosMain";
import { GET_ALL_BOOKINGS } from "@/routes/serverEndpoints";

export const fetchAllBookings = createAsyncThunk(
  "bookings/fetchAllBookings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(GET_ALL_BOOKINGS, {
        withCredentials: true,
      });
      console.log(response,"all bookings");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch bookings");
    }
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState: {
    bookings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchAllBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default bookingSlice.reducer;
