import Review from "../../models/review.js";

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate("userId", "userName email userImage")
      .populate("workshopId", "workshopName workshopAddress")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    console.error("Get All Reviews Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
