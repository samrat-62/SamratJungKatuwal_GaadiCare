import User from "../../models/user.js";
import Workshop from "../../models/workshop.js";

export const uploadUserImage = async (req, res) => {
  try {
    const user = req.authUser;
    // console.log("user data",user);
    

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image uploaded",
      });
    }

    

    let updatedEntity;
    let filePath;

    if (user.userType === "vehicleOwner" || user.userType === "admin") {
    filePath = `/userImage/${req.file.filename}`;
      updatedEntity = await User.findOneAndUpdate(
        { userId: user?.userId },
        { userImage: filePath },
        { new: true }
      );
    } else if (user?.userType === "workshop") {
      filePath = `/workshopImage/${req.file.filename}`;
      updatedEntity = await Workshop.findOneAndUpdate(
        { workshopId: user?.workshopId },
        { workshopImage: filePath },
        { new: true }
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
      });
    }
    if (!updatedEntity) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image: filePath,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
