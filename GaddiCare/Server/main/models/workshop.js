import mongoose from "mongoose";
import validator from "validator";

const { model, models, Schema } = mongoose;


const workingDaySchema = new Schema(
  {
    from: {
      type: String, 
      required: true,
    },
    to: {
      type: String, 
      required: true,
    },
    closed: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);


const workshopSchema = new Schema(
  {
    workshopId: {
      type: String,
      required: true,
      unique: true,
    },

    workshopName: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      validate: (value) => validator.isEmail(value),
    },

    phoneNumber: {
      type: String,
      required: true,
      unique: true,
    },

    workshopAddress: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      trim: true,
    },

    userType: {
      type: String,
      required: true,
    },

    latitude: {
      type: String,
      required: true,
    },

    longitude: {
      type: String,
      required: true,
    },

    workshopImage: {
      type: String,
    },

    isLicenseNumber: {
      type: String,
      required: true,
      unique: true,
    },

    servicesOffered: {
      type: [String],
      required: true,
    },
    workingHours: {
      monday: workingDaySchema,
      tuesday: workingDaySchema,
      wednesday: workingDaySchema,
      thursday: workingDaySchema,
      friday: workingDaySchema,
      saturday: workingDaySchema,
      sunday: workingDaySchema,
    },

    isOpen: {
      type: Boolean,
      default: true,
    },

    password: {
      type: String,
      required: true,
    },

    verifyCode: String,
    codeExpire: Date,

    isActive: {
      type: Boolean,
      default: true,
    },

    accountVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);


const Workshop = models.Workshop || model("Workshop", workshopSchema);

export default Workshop;