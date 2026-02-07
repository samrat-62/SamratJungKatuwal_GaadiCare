import BookService from "../../models/bookService.js";

export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;

    if (!bookingId) {
      return res.status(400).json({
        success: false,
        message: "Booking ID is required",
      });
    }

    const booking = await BookService.findById(bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    await BookService.findByIdAndDelete(bookingId);

    return res.status(200).json({
      success: true,
      message: "Booking deleted successfully",
    });
  } catch (error) {
    console.error("Delete Booking Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
