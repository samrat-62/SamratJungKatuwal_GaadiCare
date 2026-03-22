import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/userSlice";
import userSlice from "./slice/getAllUsers";
import workshopsSlice from "./slice/getAllWorkshops";
import pendingWorkshopsSlice from "./slice/getAllWorkshopRequest";
import bookingSlice from "./slice/getAllBookings";
import reviewSlice from "./slice/getAllReviews";
import alertSlice from "./slice/getNotifications";

const store = configureStore({
  reducer: {
    userData: authSlice,
    allUsers: userSlice,
    allWorkshops: workshopsSlice,
    pendingWorkshops: pendingWorkshopsSlice,
    allBookings:bookingSlice,
    allReviews:reviewSlice,
    allNotifications:alertSlice,
  },
});

export default store;