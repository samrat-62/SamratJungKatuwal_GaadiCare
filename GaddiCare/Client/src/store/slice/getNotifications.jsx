import {
    DELETE_SPECIFIC_NOTIFICATION,
    DELETE_TOTAL_NOTIFICATIONS,
    GET_NOTIFICATIONS,
    READ_NOTIFICATIONS,
} from "@/routes/serverEndpoints";
import axiosClient from "@/services/axiosMain";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "sonner";

export const fetchAlerts = createAsyncThunk(
  "alerts/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosClient.get(GET_NOTIFICATIONS, { withCredentials: true });
      return data.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to fetch alerts");
    }
  }
);

export const markAllAlertsRead = createAsyncThunk(
  "alerts/markReadAll",
  async (_, { rejectWithValue }) => {
    try {
      const { status } = await axiosClient.patch(READ_NOTIFICATIONS, {}, { withCredentials: true });
      return status === 200;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to mark alerts as read");
      return rejectWithValue(err?.response?.data?.message || "Failed to mark alerts as read");
    }
  }
);

export const deleteAlert = createAsyncThunk(
  "alerts/deleteOne",
  async (id, { rejectWithValue }) => {
    try {
      const { status, data } = await axiosClient.delete(`${DELETE_SPECIFIC_NOTIFICATION}/${id}`, {
        withCredentials: true,
      });
      if (status === 200) toast.success(data.message || "Alert removed");
      return id;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to remove alert");
      return rejectWithValue(err?.response?.data?.message || "Failed to remove alert");
    }
  }
);

export const clearAllAlerts = createAsyncThunk(
  "alerts/clearAll",
  async (_, { rejectWithValue }) => {
    try {
      const { status, data } = await axiosClient.delete(DELETE_TOTAL_NOTIFICATIONS, {
        withCredentials: true,
      });
      if (status === 200) toast.success(data.message || "All alerts cleared");
      return status === 200;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to clear alerts");
      return rejectWithValue(err?.response?.data?.message || "Failed to clear alerts");
    }
  }
);

const alertSlice = createSlice({
  name: "alerts",
  initialState: {
    notificationList: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    pushAlert: (state, action) => {
      state.notificationList.push(action.payload);
      state.unreadCount = state.notificationList?.filter((a) => !a.read).length;
    },
  },
  extraReducers: (builder) => {
    builder
    .addCase(fetchAlerts.fulfilled, (state, action) => {
        state.loading = false;
        state.notificationList = action.payload;
        state.unreadCount = action.payload?.filter((a) => !a.read).length;
      })
      .addCase(markAllAlertsRead.fulfilled, (state) => {
        state.notificationList = state.notificationList?.map((a) => ({ ...a, read: true }));
        state.unreadCount = 0;
      })
      .addCase(deleteAlert.fulfilled, (state, action) => {
        state.notificationList = state.notificationList?.filter((a) => a._id !== action.payload);
        state.unreadCount = state.notificationList.filter((a) => !a.read).length;
      })
      .addCase(clearAllAlerts.fulfilled, (state) => {
          state.notificationList = [];
          state.unreadCount = 0;
        })
        .addMatcher(
          (action) => action.type.startsWith("alerts/") && action.type.endsWith("/pending"),
          (state) => {
            state.loading = true;
            state.error = null;
          }
        )
        .addMatcher(
          (action) => action.type.startsWith("alerts/") && action.type.endsWith("/rejected"),
          (state, action) => {
            state.loading = false;
            state.error = action.payload;
          }
        )
    },
});

export const { pushAlert } = alertSlice.actions;
export default alertSlice.reducer;
