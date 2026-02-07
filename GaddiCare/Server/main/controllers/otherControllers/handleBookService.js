import { v4 as uuidv4 } from "uuid";
import BookService from "../../models/bookService.js";
import User from "../../models/user.js";
import Workshop from "../../models/workshop.js";

export const handleBookService = async (req, res) => {
  try {
    const { userId, workshopId } = req.params;

    const {
      vehicleType,
      vehicleNumber,
      services,
      problemDescription,
      bookingDate,
      timeSlot,
      pickupRequired,
      pickupAddress,
    } = req.body;

    const user = await User.findOne({userId});
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const workshop = await Workshop.findOne({workshopId});
    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "Workshop not found",
      });
    }

    if (pickupRequired && !pickupAddress) {
      return res.status(400).json({
        success: false,
        message: "Pickup address is required when pickup is selected",
      });
    }

    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    const existingBooking = await BookService.findOne({
      userId: user._id,
      workshopId: workshop._id,
      timeSlot,
      bookingDate: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message:
          "You already have a booking with this workshop on the same date and time slot",
      });
    }

    const bookingId = uuidv4();

    const newBooking = new BookService({
      bookingId,
      userId: user._id,
      workshopId: workshop._id,

      userName: user.userName,
      userEmail: user.email,
      userPhone: user.phoneNumber,
      workshopImage:workshop?.workshopImage ||null,

      workshopName: workshop.workshopName,
      workshopAddress: workshop.workshopAddress,

      vehicleType,
      vehicleNumber,
      services,
      problemDescription,
      userImage:user?.userImage||null,
      bookingDate,
      timeSlot,
      pickupRequired,
      pickupAddress: pickupRequired ? pickupAddress : null,
    });

    await newBooking.save();

    return res.status(201).json({
      success: true,
      message: "Service booked successfully",
      data: newBooking,
    });
  } catch (error) {
    console.error("Booking Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
