import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()

const otpStore={}

export const SendAck = async (email,username) =>{

    try {
        
        
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
        subject:"Thank You for Registering on PREVYEA! 🎉",
        text:`Hi ${username},

Thank you for registering on PREVYEA! 🎉  
We're excited to have you on board.

You can now log in and start exploring all the features and benefits we offer.

If you didn’t create this account, please ignore this email or contact our support team.

Best regards,  
The PrevYea Team  
prevyea.vercel.app


`
    })

    return {success:true,message:"Ack Sent"}
    
} catch (error) {
    return {success:false,message:"Please try again"}
}
    }



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