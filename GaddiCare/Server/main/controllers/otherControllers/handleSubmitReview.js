import { v4 as uuidv4 } from "uuid";
import Review from "../../models/review.js";
import User from "../../models/user.js";
import Workshop from "../../models/workshop.js";

export const createOrUpdateReview = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    const { userId, workshopId } = req.params;
    const { rating, comment } = req.body;


    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "Workshop not found",
      });
    }

    const existingReview = await Review.findOne({ userId, workshopId });

    if (existingReview) {
      existingReview.rating = rating;
      existingReview.comment = comment;

      await existingReview.save();

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
        data: existingReview,
      });
    }

    const reviewId = uuidv4();

    const newReview = new Review({
      reviewId,
      userId:user._id,
      workshopId:workshop._id,
      rating,
      comment,
    });

    await newReview.save();

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: newReview,
    });
  } catch (error) {
    console.error("Create/Update Review Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
