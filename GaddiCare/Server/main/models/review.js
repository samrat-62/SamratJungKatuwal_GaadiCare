import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const reviewSchema = new Schema(
  {
    reviewId: {
      type: String,
      required: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    workshopId: {
      type: Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: false,
      trim: true,
    },

  },
  { timestamps: true }
);

const Review = models.Review || model("Review", reviewSchema);

export default Review;
