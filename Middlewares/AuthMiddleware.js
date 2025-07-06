import User from "../Models/User.model.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { PrismaClient } from "../generated/prisma/index.js";

const prisma = new PrismaClient();
export const userVerification = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    console.log("heretoken");
    return res.json({ message: "Not Authenticated", success: false });
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    console.log(decoded.id);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.json({ status: false });
    } else {
      return res.json({
        success: true,
        user: user.username,
        admin: user.admin,
        email: user.email,
        fullname: user.fullname,
    });
}
} catch (error) {
    res.json({ message: "error", success: false });
}
next();
};
