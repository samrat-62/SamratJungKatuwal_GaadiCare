import Workshop from "../../models/workshop.js";

const getAllVerifiedWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find({ accountVerified: true })
      .select("-password"); 

    return res.status(200).json({
      success: true,
      count: workshops.length,
      workshops,
    });
  } catch (error) {
    console.error("Get verified workshops error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export default getAllVerifiedWorkshops;
