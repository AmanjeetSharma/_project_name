import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";




export const verifyToken = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    // console.log("Verifying token:", token); // Debug log
    if (!token) {
        throw new ApiError(401, "No access token");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (err) {
        console.log("Auth middleware"); // Debug log
        throw new ApiError(401, err.message || "Invalid or expired token");
    }

    const user = await User.findById(decoded._id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // 🔥 OPTIONAL: Check active session via refresh token
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
        const session = user.sessions.find(
            (s) => s.refreshToken === refreshToken && s.isActive
        );

        if (!session) {
            throw new ApiError(401, "Session expired or logged out");
        }
    }

    req.user = user;
    next();
});





export const authRole = (role) => {
    return (req, res, next) => {
        if (!req.user.roles.includes(role)) {
            throw new ApiError(403, "Access denied");
        }
        next();
    };
};
