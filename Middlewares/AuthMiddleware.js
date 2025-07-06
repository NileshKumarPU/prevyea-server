import User from "../Models/User.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();
export const userVerification = (req,res) =>{
    const token = req.cookies.token;
    if(!token ){
        return res.json({message:"Not Authenticated",status:false})
    }
    
    jwt.verify(token,process.env.TOKEN_KEY, async(err,decoded) =>{
        if(err) return res.json({status:false})
        else{
            const user= await prisma.user.findUnique({where:{id:decoded.id}})
            if(user) {return res.json({status:true, user:user.username,admin:user.admin,email:user.email,fullname:user.fullname});}
                else {return res.json({status:false});}
        }
    })
}