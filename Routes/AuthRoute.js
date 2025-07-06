import {Signup,Login,requestOTP,verifyOTP,logOut,forgotpass_reqOTP, resetPass} from "../Controllers/AuthController.js"
import { userVerification } from "../Middlewares/AuthMiddleware.js";
import express from "express"
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout",logOut);
router.post("/otp",requestOTP);
router.post("/verify",verifyOTP);
router.post("/forgotpassreqotp",forgotpass_reqOTP)
router.post("/resetpass",resetPass);
router.post("/", userVerification);

export default router;