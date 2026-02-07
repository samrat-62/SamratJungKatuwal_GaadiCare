import Workshop from "../../models/workshop.js";

const getUnverifiedWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find({ accountVerified: false })
      .select("-password -verifyCode -codeExpire");

    return res.status(200).json({
      success: true,
      count: workshops.length,
      data: workshops,
    });

  } catch (error) {
    console.error("Get unverified workshops error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
export default getUnverifiedWorkshops;