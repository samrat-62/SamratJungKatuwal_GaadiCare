import Workshop from "../../models/workshop.js";

export const updateWorkshopProfile = async (req, res) => {
  try {
    const authWorkshop = req.authUser;

    if (!authWorkshop) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      workshopName,
      phoneNumber,
      workshopAddress,
      description,
      isOpen,
      servicesOffered,
      workingHours,
    } = req.body;

    const updateData = {};

    if (workshopName !== undefined) updateData.workshopName = workshopName;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (workshopAddress !== undefined) updateData.workshopAddress = workshopAddress;
    if (description !== undefined) updateData.description = description;
    if (typeof isOpen === "boolean") updateData.isOpen = isOpen;

    if (Array.isArray(servicesOffered)) {
      updateData.servicesOffered = servicesOffered;
    }

    if (workingHours) {
      updateData.workingHours = workingHours;
    }

    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      authWorkshop._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Workshop profile updated successfully",
      data: updatedWorkshop,
    });
  } catch (error) {
    console.error("Update Workshop Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
