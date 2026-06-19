import express from "express";
import {
  registerUser,
  loginUser,
  logOutUser,
  googleCallback,
  sendmail,
  forgetPassword,
  verifyOtp,
  resetPass
} from "../controllers/user.controller.js";
import passport from "passport";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = express.Router();
router.post(
  "/register",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.post("/login", loginUser);

router.post("/logout", verifyJWT, logOutUser);

// Google Login
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

// Google Callback
router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    
  }),
  googleCallback
);
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
router.get("/test",()=>{
  res.send("auth is working")
})
router.post("/sendMail",sendmail)
router.post("/forget_pass",forgetPassword)
router.post("/verify_Otp",verifyOtp)
router.post("/resetPass",resetPass)
export default router;