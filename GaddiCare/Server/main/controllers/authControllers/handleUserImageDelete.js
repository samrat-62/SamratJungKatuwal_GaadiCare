import fs from "fs";
import path from "path";
import User from "../../models/user.js";
import Workshop from "../../models/workshop.js";

export const deleteUserImage = async (req, res) => {
  try {
    const user = req.authUser;

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
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
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
      });
    }

    if (!entity) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    if (!entity[imageField]) {
      return res.status(400).json({
        success: false,
        message: "No image to delete",
      });
    }

    const imagePath = path.resolve(`./Upload${entity[imageField]}`);

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    entity[imageField] = "";
    await entity.save();

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    console.error("Delete image error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
