import BookService from "../../models/bookService.js";
import { pushAlert } from "../../service/socket-service/index.js";

export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { type } = req.body;

    const allowedStatuses = [
      "pending",
      "accepted",
      "in-progress",
      "completed",
      "cancelled",
      "rejected"
    ];

    if (!type || !allowedStatuses.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await BookService.findOne({ _id:bookingId });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    booking.status = type;

    if (type === "cancelled") {
      booking.isCancelled = true;
    } else {
      booking.isCancelled = false;
    }

    await booking.save();

     const userNotification = {
      userId: booking.userId,
      title: "Booking Status Updated",
      content: `Your booking at ${booking.workshopName} for ${booking.vehicleType} (${booking.vehicleNumber}) is now "${type}".`,
      read: false,
    };
    await pushAlert(userNotification);

    if (type === "cancelled") {
      const workshopNotification = {
        userId: booking.workshopId,
        title: "Booking Cancelled",
        content: `The booking by ${booking.userName} for ${booking.vehicleType} (${booking.vehicleNumber}) has been cancelled.`,
        read: false,
      };
      await pushAlert(workshopNotification);
    }

    return res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Update Booking Status Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
