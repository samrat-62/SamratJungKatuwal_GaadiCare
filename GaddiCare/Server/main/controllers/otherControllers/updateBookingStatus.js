import BookService from "../../models/bookService.js";

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
    ];

    if (!type || !allowedStatuses.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking status",
      });
    }

    const booking = await BookService.findOne({ bookingId });

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
