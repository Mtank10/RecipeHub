
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();



export const authenticate = (req,res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET ) 
    req.user = { id: decoded.id };
    
    return req.user;
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
