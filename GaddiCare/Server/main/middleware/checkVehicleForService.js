import User from "../models/user.js";
import BookService from "../models/bookService.js";
import { pushAlert } from "../service/socket-service/index.js";

const checkVehicleServiceStatus = async (req, res, next) => {
  try {
    console.log("Running vehicle service status check...");

    const vehicleOwners = await User.find({ 
      userType: "vehicleOwner",
      isActive: true 
    }).select("_id userName");

    console.log(`Found ${vehicleOwners.length} vehicle owners to check`);

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    for (const owner of vehicleOwners) {
      const bookings = await BookService.find({ 
        userId: owner._id,
        status: "completed",
        createdAt: { $lt: threeMonthsAgo },
        serviceMessage: false
      });

      for (const booking of bookings) {
        await pushAlert({
          userId: owner._id,
          title: "Time for Vehicle Service",
          content: `Your ${booking.vehicleType} (${booking.vehicleNumber}) is time for service. Book an appointment now!`,
        });

        booking.serviceMessage = true;
        await booking.save();

        console.log(`Service reminder sent to ${owner.userName} for vehicle ${booking.vehicleNumber}`);
      }
    }

    console.log("Vehicle service check completed");
    

    if (next) next();
    
  } catch (error) {
    console.error("Error in vehicle service check:", error);

    if (next) next(error);
  }
};

export default checkVehicleServiceStatus;