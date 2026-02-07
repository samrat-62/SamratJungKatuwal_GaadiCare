import mongoose from "mongoose";
import validator from "validator";

const {model,models,Schema}=mongoose;

const newUserSchema=new Schema(
    {
        userName:{
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
        userType:{
            type:String,
            required:true,
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
        }
    },{timestamps:true}
);


const NewUser = models.NewUser || model("NewUser",newUserSchema);

export default NewUser;