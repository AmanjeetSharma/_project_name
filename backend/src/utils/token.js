import jwt from "jsonwebtoken";
import crypto from "crypto";



export const generateSessionId = () => {
    return crypto.randomBytes(32).toString("hex");
};



export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            _id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRE || "15m",
        }
    );
};



export const generateRefreshToken = (userId, sessionId) => {
    console.log("refresh token expires in:", process.env.REFRESH_TOKEN_EXPIRE);
    return jwt.sign(
        { id: userId, sessionId },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRE || "7d",
        }
    );
};


