import { createContext } from "react";
import axiosClient from "@/services/axiosMain";
import { UPDATE_BOOKING_STATUS } from "@/routes/serverEndpoints";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { fetchAllBookings } from "@/store/slice/getAllBookings";

export const AppContext = createContext();

const AppProvider = ({ children }) => {
  const dispatch = useDispatch();
   const updateBookingStatus = async (bookingId, type) => {
    try {
      const response = await axiosClient.patch(`${UPDATE_BOOKING_STATUS}/${bookingId}`,{type},{withCredentials:true});

      if (response.status === 200) {
        await dispatch(fetchAllBookings());
        toast.success(response.data.message || "Booking status updated successfully");
      }
    } catch (error) {
      console.error("Update Booking Status Error:", error);
      toast.error(error.response?.data?.message || "Failed to update booking status");
    }
  };

  const sharedState = {
    updateBookingStatus,
  };

  return (
    <AppContext.Provider value={sharedState}>
      {children}
    </AppContext.Provider>
  );
};
export default AppProvider;

