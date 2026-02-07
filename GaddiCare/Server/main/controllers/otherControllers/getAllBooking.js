import BookService from "../../models/bookService.js";

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookService.find().sort({ createdAt: -1 });
    // console.log(bookings,"bookings");

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    console.error("Get All Bookings Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
