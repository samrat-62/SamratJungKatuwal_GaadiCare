import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const SECRET = process.env.JWT_SECRET;

export const generateAccessToken = (userId) => {
  return jwt.sign(
    { userId },
    SECRET, 
    { expiresIn: "1d" } 
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token,SECRET);
};
