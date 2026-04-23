import { v2 as cloudinary } from "cloudinary";
import User from "../../models/user.js";
import Workshop from "../../models/workshop.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadUserImage = async (req, res) => {
  try {
    const user = req.authUser;

    if (!user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image provided" });
    }

    // Upload to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "gaddicare/userImages" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      stream.end(req.file.buffer);
    });

    const imageUrl = uploadResult.secure_url;

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

    entity[imageField] = imageUrl;
    await entity.save();

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    console.error("Upload image error:", error);
    return res.status(500).json({ success: false, message: "Something went wrong" });
  }
};