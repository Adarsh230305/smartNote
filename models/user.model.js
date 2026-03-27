import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    userName:{
        type:String,
        required:true,
    },
    email: {
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
        
    }
},{timeStamps:true})
export default User=mongoose.model("User",userSchema)