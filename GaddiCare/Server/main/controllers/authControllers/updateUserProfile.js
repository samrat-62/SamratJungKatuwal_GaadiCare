import User from "../../models/user.js";

export const updateUserProfile = async (req, res) => {
  try {
    const user = req.authUser;
    const { userName, phoneNumber } = req.body;

    if (!userName || !phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "userName and phoneNumber are required",
      });
    }

    if (user.userType !== "vehicleOwner" && user.userType !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only users can update this profile",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { userId: user.userId },
      { userName, phoneNumber },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
