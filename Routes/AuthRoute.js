import {Signup,Login,requestOTP,verifyOTP,logOut} from "../Controllers/AuthController.js"
import { userVerification } from "../Middlewares/AuthMiddleware.js";
import express from "express"
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/logout",logOut);
router.post("/otp",requestOTP);
router.post("/verify",verifyOTP);
router.post("/", userVerification);

export default router;