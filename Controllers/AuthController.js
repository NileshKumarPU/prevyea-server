import { createSecretToken } from "../util/SecretToken.js";
import User from "../Models/User.model.js";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { SendOTP, VerifyOTP } from "../util/EmailOTP.js";


let expiresAt = 0;

export const requestOTP = async (req, res) => {
  const { email } = req.body;
   const existinguser = await User.findOne({ email: email });
    if (existinguser) return res.json({success:false, message: "E-mail Already Registered" });
  try {
    await SendOTP(email);
    res.json({ success: true, message: "OTP sent" });
    expiresAt= Date.now() + 5 * 60 * 1000;
  } catch (error) {
    res.status(510).json({ success: false, message: "Failed to send OTP" });
  }
};

export const verifyOTP = async (req, res) => {
    
  try {
  const {  email,otp } = req.body;
 
  
  if (Date.now() > expiresAt) return res.json({success:false, message: 'OTP expired' });

    const authResult = await VerifyOTP(email, otp);
    
    
    if (authResult) {
      res.json({ success: true, message: "OTP Verified" });
    } else {
      res.json({ success: false, message: "Invalid OTP" });
    }
  } catch (error) {
    res.json({success:false,message:"Verification Error, Try Again"})
  }
};
export const Signup = async (req, res, next) => {
  try {
    const { username, email, fullname, password,admin } = req.body;
   
    // const user= User.bulkSave()
    const user = User.create({ username, email, fullname, password,admin });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User Signed Up Successfully", success: true, user });
    next();
  } catch (error) {
    res.json({ message: "Oops! Try Again", success: false })
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json({ message: "All fields required!", success: false });
    }

    const existinguser = await User.findOne({ email: email });
 
    

    if (!existinguser) {
      return res.json({ message: "User Not Registered!", success: false });
    }

    const auth = await bcrypt.compare(password, existinguser.password);
    
    

    if (!auth) {
      return res.json({
        message: "Incorrect Password or E-mail",
        success: false,
      });
    }

    const token = createSecretToken(existinguser._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      path: "/",
    });
    res
      .status(201)
      .json({ message: "User Logged in Successfully!", success: true });
    next();
  } catch (error) {}
};
