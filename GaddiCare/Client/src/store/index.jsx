import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slice/userSlice";

const store = configureStore({
  reducer: {
    userData: authSlice,
  },
});

export default store;