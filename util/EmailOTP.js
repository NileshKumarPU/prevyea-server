import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const otpStore={}

export const SendOTP = async (email) =>{

    try {
        
        const otp = Math.floor(100000+Math.random()*900000)
        otpStore[email]= otp;
        const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,

    },
})
     await transporter.sendMail({
        from:'noreply.prevyea@gmail.com',
        to:email,
        subject:"Your OTP code for PREVYEA!",
        text:`Dear User,
Your One-Time Password (OTP) is: ${otp}
This code is valid for the next 5 minutes.
Please do not share this OTP with anyone for security reasons.
Do not reply to this email.
`
    })

    return {success:true,message:"OTP Sent",otp}
    
} catch (error) {
    return {success:false,message:"Please try again"}
}
    }


export const VerifyOTP = async(email,otp)=>{
   
    
    try {
          
        const valid = otpStore[email] && otpStore[email]==otp;   
        
       
        
        if(valid) {delete otpStore[email]; return true;}

        return false;
    } catch (error) {
        return false
    }
}