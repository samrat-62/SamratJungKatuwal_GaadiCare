import Workshop from "../../models/workshop.js";

export const getWorkshopById = async (req, res) => {
  try {
    const { workshopId } = req.params;

    if (!workshopId) {
      return res.status(400).json({
        success: false,
        message: "Workshop ID is required",
      });
    }

    const workshop = await Workshop.findOne({ workshopId });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "Workshop not found.",
      });
    }

    return res.status(200).json({
      success: true,
      workshop,
    });
  } catch (error) {
    console.error("Get workshop error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
