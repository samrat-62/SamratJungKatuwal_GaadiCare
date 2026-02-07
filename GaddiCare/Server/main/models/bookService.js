import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const bookServiceSchema = new Schema(
    {
        bookingId: {
            type: String,
            required: true,
            unique: true,
        },

        userId: {
            type: Schema.Types.ObjectId,
            ref:"User",
            required: true,
        },

        workshopId: {
            type: Schema.Types.ObjectId,
            ref:"Workshop",
            required: true,
        },

        userName: {
            type: String,
            required: true,
        },

        userEmail: {
            type: String,
            required: true,
        },

        userPhone: {
            type: String,
            required: true,
        },

        workshopName: {
            type: String,
            required: true,
        },

        workshopAddress: {
            type: String,
            required: true,
        },

        vehicleType: {
            type: String,
            required: true,
        },
        vehicleNumber: {
            type: String,
            required: true,
        },

        services: {
            type: [String],
            required: true,
        },

        problemDescription: {
            type: String,
        },

        bookingDate: {
            type: Date,
            required: true,
        },

        timeSlot: {
            type: String,
            required: true,
        },

        pickupRequired: {
            type: Boolean,
            default: false,
        },
        pickupAddress: {
            type: String,
            required: function () {
                return this.pickupRequired === true;
            },
        },

        status: {
            type: String,
            enum: ["pending", "accepted", "in-progress", "completed", "cancelled"],
            default: "pending",
        },
        isCancelled: {
            type: Boolean,
            default: false,
        },
        userImage:{
            type:String,
            required:false
        },
        workshopImage:{
            type:String,
            required:false
        }
    },
    { timestamps: true }
);

const BookService = models.BookService || model("BookService", bookServiceSchema);

export default BookService;
