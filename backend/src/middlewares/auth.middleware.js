import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const VerifyToken = async (req, res, next) => {
    console.log("a new request to the server");
    // console.log(req.cookies?.accessToken);
    
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if(!token){
        return res.status(401).json({message: "Unauthorized, you need to login"});
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        req.user = await User.findById(decoded.id).select("-password -refreshToken");
    } catch (error) {
        return res.status(401).json({message: "Unauthorized, invalid token"});
    } 
    next();  
}