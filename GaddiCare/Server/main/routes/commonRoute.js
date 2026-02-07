import { Router } from "express";
import uploadWorkshopImg from "../service/Multer/uploadWorkshopImage.js";
import { createWorkshop } from "../controllers/otherControllers/createWorkshop.js";
import getUnverifiedWorkshops from "../controllers/otherControllers/getWorkshopRequest.js";
import isAdmin from "../middleware/isAdmin.js";
import setAuthUser from "../middleware/setAuthUser.js";
import { updateWorkshopStatus } from "../controllers/otherControllers/updateWorkshopStatus.js";
import getAllUsers from "../controllers/otherControllers/getAllUsers.js";
import getAllVerifiedWorkshops from "../controllers/otherControllers/getAllVerifiedWorkshops.js";
import { toggleAccountStatus } from "../controllers/otherControllers/toggleActiveness.js";
import { getWorkshopById } from "../controllers/otherControllers/getWorkshopDetails.js";
import { handleBookService } from "../controllers/otherControllers/handleBookService.js";
import { getAllBookings } from "../controllers/otherControllers/getAllBooking.js";
import { createOrUpdateReview } from "../controllers/otherControllers/handleSubmitReview.js";
import { getAllReviews } from "../controllers/otherControllers/getAllReview.js";
import { uploadUserImage } from "../controllers/authControllers/handleUserImageUpload.js";
import { updateWorkshopProfile } from "../controllers/otherControllers/updateWorkshopProfile.js";
import { updateBookingStatus } from "../controllers/otherControllers/updateBookingStatus.js";
import { deleteBooking } from "../controllers/otherControllers/handleDeleteBooking.js";

const commonRouter= Router();


commonRouter.post("/createWorkshop",uploadWorkshopImg.single("workshopImage"),createWorkshop);
commonRouter.get("/getUnverifiedWorkshops",getUnverifiedWorkshops);
commonRouter.patch(
  "/admin/workshop/status/:workshopId", 
  updateWorkshopStatus
);
commonRouter.get("/all-users", getAllUsers);
commonRouter.get("/verified-workshops", getAllVerifiedWorkshops);
commonRouter.patch(
  "/toggle-status",
  toggleAccountStatus
);
commonRouter.post("/booking/:userId/:workshopId",handleBookService);
commonRouter.get("/all-bookings",getAllBookings);
commonRouter.post("/review/:userId/:workshopId",createOrUpdateReview);
commonRouter.get("/get-all-reviews",getAllReviews);
commonRouter.post("/workshopImage",uploadWorkshopImg.single("workshopImage"),uploadUserImage);
commonRouter.patch("/update-workshop-profile",updateWorkshopProfile);
commonRouter.patch("/update-booking-status/:bookingId",updateBookingStatus);
commonRouter.delete("/booking/:bookingId",deleteBooking);
commonRouter.get("/:workshopId",getWorkshopById);


export default commonRouter;

