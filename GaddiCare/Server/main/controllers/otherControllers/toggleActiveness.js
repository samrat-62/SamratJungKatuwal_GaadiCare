import User from "../../models/user.js";
import Workshop from "../../models/workshop.js";

export const toggleAccountStatus = async (req, res) => {
  try {
    const { id, type } = req.body;

    let model;

    if (type === "vehicleOwner") {
      model = User;
    } else if (type === "workshop") {
      model = Workshop;
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid type. Must be vehicleOwner or workshop.",
      });
    }

    const account =
      type === "vehicleOwner"
        ? await model.findOne({ userId: id })
        : await model.findOne({ workshopId: id });

    if (!account) {
      return res.status(404).json({
        success: false,
        message: `${type} not found`,
      });
    }

    account.isActive = !account.isActive;
    await account.save();

    return res.status(200).json({
      success: true,
      message: `${type} is now ${account.isActive ? "active" : "banned"}`,
      status: account.isActive,
    });
  } catch (error) {
    console.error("Toggle status error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
