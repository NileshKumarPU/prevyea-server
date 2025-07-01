import {Signup,Login,requestOTP,verifyOTP} from "../Controllers/AuthController.js"
import { userVerification } from "../Middlewares/AuthMiddleware.js";
import express from "express"
const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/otp",requestOTP);
router.post("/verify",verifyOTP);
router.post("/", userVerification);

export default router;