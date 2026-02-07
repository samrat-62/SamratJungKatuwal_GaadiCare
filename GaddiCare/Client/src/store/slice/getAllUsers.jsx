import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '@/services/axiosMain';
import { GET_ALL_USERS } from '@/routes/serverEndpoints';


export const fetchAllUsers = createAsyncThunk(
  'users/fetchAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(GET_ALL_USERS, { withCredentials: true });
    //   console.log(response,"all users data");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || null);
    }
  }
);


const usersSlice = createSlice({
  name: 'users',
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload?.users || action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default usersSlice.reducer;
