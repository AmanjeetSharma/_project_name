import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";




export const verifyToken = asyncHandler(async (req, res, next) => {
    const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
        throw new ApiError(401, "No access token");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch {
        throw new ApiError(401, "Invalid or expired token");
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





export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            throw new ApiError(403, "Access denied");
        }
        next();
    };
};
