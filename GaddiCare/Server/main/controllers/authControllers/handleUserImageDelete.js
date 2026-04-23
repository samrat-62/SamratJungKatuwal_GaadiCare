import { v2 as cloudinary } from "cloudinary";
import User from "../../models/user.js";
import Workshop from "../../models/workshop.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteUserImage = async (req, res) => {
  try {
    const user = req.authUser;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    let entity;
    let imageField;

    if (user.userType === "vehicleOwner" || user.userType === "admin") {
      entity = await User.findOne({ userId: user.userId });
      imageField = "userImage";
    } else if (user.userType === "workshop") {
      entity = await Workshop.findOne({ workshopId: user.workshopId });
      imageField = "workshopImage";
    } else {
      return res.status(400).json({ success: false, message: "Invalid user type" });
    }

    if (!entity) {
      return res.status(404).json({ success: false, message: "Account not found" });
    }

    if (!entity[imageField]) {
      return res.status(400).json({ success: false, message: "No image to delete" });
    }

    // Delete from Cloudinary
    const imageUrl = entity[imageField];
    const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);

    entity[imageField] = "";
    await entity.save();

    return res.status(200).json({ success: true, message: "Image deleted successfully" });
  } catch (error) {
    console.error("Delete image error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};