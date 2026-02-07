import { GET_ALL_REVIEWS } from "@/routes/serverEndpoints";
import axiosClient from "@/services/axiosMain";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchAllReviews = createAsyncThunk(
  "reviews/fetchAllReviews",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(GET_ALL_REVIEWS,{withCredentials:true}); 
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const reviewSlice = createSlice({
  name: "reviews",
  initialState: {
    reviews: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload;
      })
      .addCase(fetchAllReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default reviewSlice.reducer;
