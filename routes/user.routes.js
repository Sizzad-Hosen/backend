import express from "express";
import {  deleteUserById, forgotPasswordController, loginController, logoutController, refreshToken, registerUserController, resetpassword, updateUserDetails, uploadAvatar, userDetails, verifyEmailController, verifyForgotPasswordOtp } from "../controllers/user.controller.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/multer.js";


const router = express.Router();


router.post("/register", registerUserController);
router.post("/verify-email", verifyEmailController);
router.post("/login", loginController);
router.post("/refresh-token", refreshToken);
router.get("/logout", auth,logoutController);
router.get("/user-details",auth, userDetails);
router.put("/upload-avatar", auth,upload.single('avatar'),uploadAvatar);
router.put('/update-user',auth,updateUserDetails)
router.put('/forgot-password',forgotPasswordController)
router.put('/verify-forgot-password-otp',verifyForgotPasswordOtp)
router.put('/reset-password',resetpassword)
router.delete("/delete-user/:id",auth,deleteUserById)


export default router;
