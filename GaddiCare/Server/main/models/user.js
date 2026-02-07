import mongoose from "mongoose";
import validator from "validator";

const { model, models, Schema } = mongoose;

const userSchema = new Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },
        userName: {
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
        userType: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        verifyCode: {
            type: String,
            required: false
        },
        codeExpire: {
            type: Date,
            required: false
        },
        userImage: {
            type: String,
            required: false
        },
        isActive: {
            type: Boolean,
            default: true
        }
    },{ timestamps: true }
);


const User = models.User || model("User", userSchema);

export default User;