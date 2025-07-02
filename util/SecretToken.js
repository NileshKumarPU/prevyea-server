import dotenv from "dotenv"
dotenv.config()
import jsonwebtoken from "jsonwebtoken"

export const createSecretToken = (id) =>{
    return jsonwebtoken.sign({id}, process.env.TOKEN_KEY,{
        expiresIn: 1000*60*60,
    });
};

