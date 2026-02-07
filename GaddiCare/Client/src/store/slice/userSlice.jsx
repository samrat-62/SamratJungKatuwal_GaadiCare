import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosClient from '@/services/axiosMain';
import { toast } from 'sonner';
import { GET_AUTH_USER, LOGOUT_USER } from '@/routes/serverEndpoints';


// fetch the user data
export const fetchAuthUser = createAsyncThunk(
  'auth/fetchAuthUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosClient.get(GET_AUTH_USER, { withCredentials: true });
    //   console.log(response,"auth user data");
      return response?.data; 
    } catch (error) {
      return rejectWithValue(error.response?.data || null);
    }
  }
);

// Logout user
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      const response=await axiosClient.delete(LOGOUT_USER,{ withCredentials: true });
      if(response.status===200){
        toast.success(response?.data?.message||"Logged out successfully.");
      }
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);



const authSlice = createSlice({
  name: 'auth',
  initialState: {
    data: null,      
    status: 'pending',  
    error: null,
    loading: false,
  },
  extraReducers: (builder) => {
    builder
    
      .addCase(fetchAuthUser.pending, (state) => {
        state.status = 'pending';
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload; 
        state.loading = false;
      })
      .addCase(fetchAuthUser.rejected, (state, action) => {
        state.status = 'failed';
        state.data = null;
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(logoutUser.pending, (state) => {
        state.status = 'pending';
        state.error = null;
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'succeeded';
        state.loading = false;
        state.data = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default authSlice.reducer;
