import mongoose from "mongoose";

const connectDB=async (url)=>{
try{
    await mongoose.connect(url);
    console.log("Connected to DB!");
}catch(err){
    console.log(err);
    console.log("Failed to connect to DB!");
    
}
}
export default connectDB;