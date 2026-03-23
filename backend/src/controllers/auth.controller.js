import crypto from "crypto";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import registerEmail from "../utils/emailTemplates/registerEmail.js";
import { User } from "../models/user.model.js";
import { PendingUser } from "../models/PendingUser.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { cookieOptions } from "../config/cookieOptions.js";
import { generateAccessToken, generateRefreshToken, generateSessionId } from "../utils/token.js";










// 🔹 REGISTER CONTROLLER
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;
    console.log(`Register request for ${email}`);

    if (!name || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }

    // 1. Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(400, "User already exists");
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Generate token
    const token = crypto.randomBytes(32).toString("hex");

    // 4. Check pending user
    const existingPending = await PendingUser.findOne({ email });

    if (existingPending) {
        existingPending.name = name;
        existingPending.password = hashedPassword;
        existingPending.verificationToken = token;
        existingPending.verificationTokenExpiry = Date.now() + 1000 * 60 * 10; // 10 minutes

        await existingPending.save();
    } else {
        await PendingUser.create({
            name,
            email,
            password: hashedPassword,
            verificationToken: token,
            verificationTokenExpiry: Date.now() + 1000 * 60 * 10 // 10 minutes
        });
    }

    console.log(`Pending user {${existingPending ? 'existing' : 'new'}} for ${email} with token ${token}`);

    // 5. Send email
    const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`;

    const emailHTML = registerEmail(verifyLink);

    await sendEmail(
        email,
        "🎉 Welcome to QueueINDIA! Verify Your Email Address",
        emailHTML,
        true
    );
    console.log(`Verification email sent to ${email}`);

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                "name": name,
                "email": email
            },
            "Verification email sent"
        )
    );
});










// 🔹 VERIFY CONTROLLER
export const verify = asyncHandler(async (req, res) => {
    const { token } = req.params;

    const pending = await PendingUser.findOne({
        verificationToken: token,
        verificationTokenExpiry: { $gt: Date.now() }
    });

    if (!pending) {
        throw new ApiError(400, "Invalid or expired token");
    }

    // Prevent duplicate user (race condition safety)
    let user = await User.findOne({ email: pending.email });

    if (!user) {
        user = await User.create({
            name: pending.name,
            email: pending.email,
            password: pending.password
        });
    }

    // Delete pending user
    await PendingUser.deleteOne({ _id: pending._id });

    // Redirect to frontend
    if (req.headers["user-agent"]?.includes("Postman")) {
        return res.status(200).json({
            success: true,
            message: "Email verified successfully"
        });
    }

    return res.redirect(
        `${process.env.CLIENT_URL}/login?verified=true`
    );
});







export const login = asyncHandler(async (req, res) => {
    const { email, password, device = "Unknown Device" } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials");
    }

    // 🔥 Create session
    const sessionId = generateSessionId();
    const refreshToken = generateRefreshToken(user._id, sessionId);
    const accessToken = generateAccessToken(user);

    user.sessions.push({
        sessionId,
        device,
        refreshToken,
        isActive: true
    });

    await user.save();

    const cookieOptions = getCookieOptions();

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { accessToken },
                "Login successful"
            )
        );
});








export const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new ApiError(400, "No refresh token");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // deactivate session
    user.sessions = user.sessions.map((session) => {
        if (session.refreshToken === refreshToken) {
            session.isActive = false;
        }
        return session;
    });

    await user.save();

    return res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, null, "Logged out successfully"));
});










export const logoutAll = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    user.sessions.forEach((s) => (s.isActive = false));
    await user.save();

    return res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, null, "Logged out from all devices"));
});








export const refresh = asyncHandler(async (req, res) => {
    const token = req.cookies?.refreshToken;

    if (!token) {
        throw new ApiError(401, "No refresh token provided");
    }

    let decoded;
    try {
        decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch {
        throw new ApiError(403, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const session = user.sessions.find(
        (s) =>
            s.sessionId === decoded.sessionId &&
            s.refreshToken === token &&
            s.isActive
    );

    if (!session) {
        throw new ApiError(403, "Invalid session");
    }

    // 🔥 Update activity
    session.latestLogin = new Date();
    await user.save();

    const newAccessToken = generateAccessToken(user);
    const cookieOptions = getCookieOptions();

    return res
        .cookie("accessToken", newAccessToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { accessToken: newAccessToken },
                "Token refreshed"
            )
        );
});