import mongoose from "mongoose";
import validator from "validator";

const {model,models,Schema}=mongoose;

const workshopSchema=new Schema(
    {
        workshopId:{
            type:String,
            required:true,
            unique:true
        },
        workshopName:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
            unique:true,
            validate: (value) => validator.isEmail(value),
        },
        phoneNumber:{
            type:String,
            required:true,
            unique:true,
        },
        workshopAddress:{
            type:String,
            required:true,
        },
        userType:{
            type:String,
            required:true,
        },
        latitude:{
            type:String,
            required:true,
        },
        longitude:{
            type:String,
            required:true,
        },
        workshopImage:{
            type:String,
            required:false
        },
        isLicenseNumber:{
            type:String,
            required:true,
            unique:true,
        },
        servicesOffered:{
            type:[String],
            required:true
        },
        password:{
            type:String,
            required:true,
        },
        verifyCode:{
            type:String,
            required:false
        },
        codeExpire:{
            type:Date,
            required:false
        },
        accountVerified:{
            type:Boolean,
            default:false
        }
    }
);

const Workshop = models.Workshop || model("Workshop",workshopSchema);

export default Workshop;