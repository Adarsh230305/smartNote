import ApiError from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { text } from "express";

const registerUser=asyncHandler(async(req,res)=>{
/*
1.take username ,fullname,email,new password,avatar
2. check whether you got or not
3. take localAvatarPath
4.uploadOncloudnary
5.create a data base form this user ,finally user registered
*/ 
    const {userName,email,password}=req.body;
    if([userName,email,password].some((field)=>field?.trim()===""))
    {
        throw new ApiError(401,"All fields are required !")
    }
    const existingUser=await User.findOne({
        $or:[{userName},{email}]
    })
    if(existingUser){
        throw new ApiError(409,"User already exist!! ")
    }
    const avatarLocalPath=req.files?.avatar[0].path;
    if(!avatarLocalPath) {
        throw new ApiError(401,"Error in avatar local path !")
    }
    // console.log("avatarLocalPath:",avatarLocalPath);
    const avatar=await uploadOnCloudinary(avatarLocalPath);
    if(!avatar)
    {
        throw new ApiError(500,"avatar not uploaded to cloudinary")
    }
    const user=await User.create({
        userName,
        email,
        password,
        avatar:avatar.url
    })
    const createdUser=await User.findById(user._id).select("-refreshToken -password")
    if(!createdUser)
    {
       throw new ApiError(500,"Something went wrong")
    }
     res.status(200).json(new ApiResponse(200,createdUser,"User created succefully"))
})
const generateAccessAndRefreshToken=async function(userId)
{
    try {
        const user=await User.findById(userId);
        // console.log(user);
        if(!user) throw new ApiError(401,"user not found while generating AT&RT")
        const accessToken=user.generateAccessToken();
        const refreshToken=user.generateRefreshToken();
        // console.log("accessToken in gen func ",accessToken);
        // console.log("refreshToken in gen func ",refreshToken);
        user.refreshToken=refreshToken;
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        console.log("error: ",error)
        throw new ApiError(500,"Error in generating access and refresh token")
    }
}
const loginUser=asyncHandler(async(req,res)=>{
    const {userName,email,password}=req.body;
    
    if([email,password,userName].some((field)=>field?.trim()===""))
    {
        throw new ApiError(401,"All fields are required !")
    }
    const user=await User.findOne({
        $or:[{userName},{email}]
    })
   
    if(!user){throw new ApiError(404,"email not registerd")}
    const passwordCorrect=await user.isPasswordCorrect(password);
    
    if(!passwordCorrect)
    {
     throw  new ApiError(404,"Password is incorrect ! ")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id);
    // console.log("accessToken ",accessToken);
    // console.log("refreshToken ",refreshToken);
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    
    // make the cookies editable only by server
    const options={
          httpOnly:true,
          secure:true
    }
    
    // let's make cookies
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    /*“We store access and refresh tokens in cookies to improve security. Cookies with httpOnly flag prevent JavaScript access, protecting against XSS attacks.
     Access tokens are short-lived for security, while refresh tokens allow generating new access tokens without forcing the user to log in again.”
     XSS (Cross-Site Scripting) is a security attack where an attacker injects malicious JavaScript into a website, and it runs in other users’ browsers. */
    .json(
       new ApiResponse(200,{
            user:loggedInUser,accessToken,refreshToken
        },
        "User loggedIn Succesefully !!")
    )
})
const logOutUser=asyncHandler(async(req,res)=>{
    const userId=req.user._id;
    const user=await User.findByIdAndUpdate(userId,{
        $set:{refreshToken:""}},
       { new:true}
    )
      if(!user) throw new ApiError(501,"User not found ! while logout !");
      const options={
             httpOnly:true,
             secure:true
      }
      res.status(200)
      .clearCookie("refreshToken",options)
      .clearCookie("accessToken",options)
      .json({
           message:"Log out successfully"
      })
})

// controllers/authController.js
const googleCallback = async (req, res) => {
    try {

        const {accessToken,refreshToken}=await generateAccessAndRefreshToken(req.user._id);
    // console.log("accessToken ",accessToken);
    // console.log("refreshToken ",refreshToken);
    const loggedInUser=await User.findById(req.user._id).select("-password -refreshToken")
    
    // make the cookies editable only by server
    const options={
          httpOnly:true,
          secure:true
    }
    
    // let's make cookies
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    /*“We store access and refresh tokens in cookies to improve security. Cookies with httpOnly flag prevent JavaScript access, protecting against XSS attacks.
     Access tokens are short-lived for security, while refresh tokens allow generating new access tokens without forcing the user to log in again.”
     XSS (Cross-Site Scripting) is a security attack where an attacker injects malicious JavaScript into a website, and it runs in other users’ browsers. */
    .json(
       new ApiResponse(200,{
            user:loggedInUser,accessToken,refreshToken
        },
        "User loggedIn Succesefully !!")
    )
}    
 catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
const sendmail=asyncHandler(async(req,res)=>{
    const {email}=req.body;
     const transporter=nodemailer.createTransport({
        service:"gmail",
        secure:true,
        auth:{
            user:process.env.GOOGLE_EMAIL,
            pass:process.env.GOOGLE_PASSWORD
        }
     })
     if(!transporter) throw new ApiError(500,"Error in creating transporter for nodemailer !")
    const info=await transporter.sendMail({
        from:process.env.GOOGLE_EMAIL,
        to:email,
        subject:"Testing nodemailer",
        text:"This is a test email sent using nodemailer!"
     })
     
     if(!info) throw new ApiError(500,"Error in sending email !")
     res.status(200).json({
        success:true,
        message:"Email sent successfully"
     })
     
})

const forgetPassword=asyncHandler(async(req,res)=>{
          const {email}=req.body;
          if(!email) throw new ApiError(401,"Email required !")
          const verifiedEmail=await User.findOne({email});
        if(!verifiedEmail) throw new ApiError(401,"Invalid email !")
            const otp=Math.floor(100000+Math.random()*900000);
            const otpExpiry=Date.now() +10*60*1000;
              verifiedEmail.otp=otp.toString();
              verifiedEmail.otpExpiry=otpExpiry;
              await verifiedEmail.save();
const transporter=nodemailer.createTransport({
            service:"gmail",
            secure:true,
            auth:{
                 user:process.env.GOOGLE_EMAIL,
                 pass:process.env.GOOGLE_PASSWORD
            }
        })
        if(!transporter) throw new ApiError(500,"Error in generating Transporter !")
            const mail=await transporter.sendMail({
           from:process.env.GOOGLE_EMAIL,
           to:email,
           subject:"OTP for Reseting Password",
           text:`Your OTP is ${otp}`
        })
        res.status(200).json(
            new ApiResponse(200,null,"OTP send successfully !")
        )
})

const verifyOtp=asyncHandler(async(req,res)=>{
        const {email,otp}=req.body;
       
        if(!otp) throw new ApiError(400,"OTP is required !");
        const user=await User.findOne({email});
        console.log("User: ",user);
        if(!user) throw new ApiError(400,"Invalid email !");
        if(Date.now()>user.otpExpiry){
            throw new ApiError(400,"OTP is expired !")
        }
        const verifiedOtp=await user.isOtpCorrect(otp);
            if(!verifiedOtp) throw new ApiError(400,"OTP is wrong")
                user.otp=0;
            user.otpExpiry=0;
            await user.save({validateBeforeSave:false})
            res.status(200).json(new ApiResponse(200,null,"OTP verified successfully !"))
})
const resetPass=asyncHandler(async(req,res)=>{
   const {email,newPass}=req.body;
   if([email,newPass].some((field)=>field?.trim()=="")){
    throw new ApiError(400,"All field is required !");
   }
   const user=await User.findOne({email});
   if(!user) throw new ApiError(400,"Email not registered !");
   user.password=newPass;
   await user.save({validateBeforeSave:false});
   res.status(200).json(new ApiResponse(200,null,"Password updated successfully !"));
})

export{registerUser,loginUser,generateAccessAndRefreshToken,logOutUser,googleCallback,sendmail,forgetPassword,verifyOtp,resetPass};