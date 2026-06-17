import mongoose from "mongoose";
import bcrypt from   "bcrypt";
import jwt from "jsonwebtoken";
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
        
    },
    googleId:{
        type:String,
        
    },
    avatar:{
        type:String,
        
    },

    refreshToken:{
        type:String,
        default:""
    },
    otp:{
        type:String
    },
    otpExpiry:{
        type:Number,
        default:0
    }
},{timestamps:true})
userSchema.pre("save", async function () {
    if (!this.isModified("password")) return ;
    this.password = await bcrypt.hash(this.password, 10);
});
userSchema.pre("save",async function(){
    if(!this.isModified("otp")) return ;
    this.otp=await bcrypt.hash(this.otp.toString(),10);
})
userSchema.methods.isOtpCorrect=async function(otp){
    return await bcrypt.compare(otp.toString(),this.otp);
}
userSchema.methods.isPasswordCorrect=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken=function(){
        //     console.log("SECRET:", process.env.ACCESS_TOKEN_SECRET);
        //   console.log("EXPIRY:", process.env.ACCESS_TOKEN_EXPIRY);
    return jwt.sign({id:this._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:process.env.ACCESS_TOKEN_EXPIRY})
}
userSchema.methods.generateRefreshToken=function(){
//     console.log("SECRET:", process.env.REFRESH_TOKEN_SECRET);
//   console.log("EXPIRY:", process.env.REFRESH_TOKEN_EXPIRY);
    return jwt.sign({id:this._id},process.env.REFRESH_TOKEN_SECRET,{expiresIn:process.env.REFRESH_TOKEN_EXPIRY})
}
const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User; 