import crypto from "crypto";
import bcrypt from "bcrypt";
import sendEmail from "../utils/sendEmail.js";
import registerEmail from "../utils/emailTemplates/registerEmail.js";
import welcomeEmail from "../utils/emailTemplates/welcomeEmail.js";
import { User } from "../models/user.model.js";
import { PendingUser } from "../models/PendingUser.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { getCookieOptions } from "../config/cookieOptions.js";
import { generateAccessToken, generateRefreshToken, generateSessionId } from "../utils/token.js";
import { getTimeDifference } from "../utils/getTimeDifference.js";
import jwt from "jsonwebtoken";









const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

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
            verificationTokenExpiry: Date.now() + 1000 * 60 * 10, // 10 minutes
        });
    }

    console.log(`${existingPending ? 'Existing' : 'New'} pendingUser ${existingPending ? 'updated' : 'created'} for ${email} | Token ${token} (duration: 10 mins)`);

    // 5. Send email
    const verifyLink = `${process.env.CLIENT_URL}/verify/${token}`;

    const emailHTML = registerEmail(verifyLink);

    // await sendEmail(
    //     email,
    //     "Kindly Verify Your Email Address - Complete Your Registration",
    //     emailHTML,
    //     true
    // );
    console.log(`Verification email sent to ${email} with link: ${verifyLink}`); // temporary log since email sending is disabled for testing
    console.log(`Verification email sent to ${email}`); // temporary log since email sending is disabled for testing

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










const verifyEmail = asyncHandler(async (req, res) => {
    const { token } = req.params;
    console.log(`Verification attempt | Token: ${token}`);

    const pending = await PendingUser.findOne({
        verificationToken: token, //no need to check expiry here, we will check it separately to provide better error messages
    });

    if (!pending) {
        throw new ApiError(400, "Invalid Token");
    }

    if (pending.verificationTokenExpiry < Date.now()) {
        const timeInfo = getTimeDifference(pending.verificationTokenExpiry);
        console.log(`❌ Token expired ${timeInfo} ago | Email: ${pending.email}`);

        throw new ApiError(
            400,
            `Token expired ${timeInfo} ago. Please register again.`
        );
    }

    // Prevent duplicate user (race condition)
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

    console.log(`Email verified | User: ${user.email} | ID: ${user._id}`);

    const welcomeHTML = welcomeEmail(user.name || user.email.split('@')[0]);
    // await sendEmail(
    //     user.email,
    //     "Welcome to CollegeFinder! 🎓",
    //     welcomeHTML,
    //     true
    // );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Email verified successfully!\nYou can login now."
            )
        );
});














const login = asyncHandler(async (req, res) => {
    const { email, password, device = "Unknown Device" } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
        throw new ApiError(404, "User doesn't exist");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid credentials");
    }

    const existingSession = user.sessions.find(
        (session) => session.device === device
    );

    let sessionId;
    let refreshToken;

    if (existingSession) {
        // reuse session
        sessionId = existingSession.sessionId;
        refreshToken = generateRefreshToken(user._id, sessionId);

        existingSession.refreshToken = refreshToken;
        existingSession.latestLogin = new Date();
        existingSession.isActive = true;

        // console.log(`Session reused | Device: ${device}`);
    } else {
        // create new session
        sessionId = generateSessionId();
        refreshToken = generateRefreshToken(user._id, sessionId);

        user.sessions.push({
            sessionId,
            device,
            refreshToken,
            firstLogin: new Date(),
            latestLogin: new Date(),
            isActive: true,
        });

        // console.log(`New session created | Device: ${device}`);
    }

    const accessToken = generateAccessToken(user);

    await user.save();

    const cookieOptions = getCookieOptions();

    const loggedInUser = await User.findById(user._id).select("-password -sessions -resetPasswordToken -resetPasswordExpiry");

    console.log(`User logged in | Email: ${user.email} | Device: ${device}`);

    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser },
                "Login successful"
            )
        );
});









const logout = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
        throw new ApiError(400, "No refresh token");
    }

    const user = await User.findById(req.user._id);

    if (!user) {
        throw new ApiError(404, "User doesn't exist");
    }

    // deactivate session
    user.sessions = user.sessions.map((session) => {
        if (session.refreshToken === refreshToken) {
            session.isActive = false;
            session.refreshToken = null; // Invalidate refresh token
        }
        return session;
    });

    await user.save();

    console.log(`User logged out | Email: ${user.email} | Device: ${user.sessions.find(s => s.refreshToken === refreshToken)?.device || 'Unknown Device'}`);

    return res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, null, "Logged out successfully"));
});










const logoutAll = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    user.sessions.forEach((s) => (
        s.isActive = false,
        s.refreshToken = null // Invalidate all refresh tokens
    ));

    await user.save();
    console.log(`User logged out from all devices | Email: ${user.email}`);

    return res
        .clearCookie("accessToken")
        .clearCookie("refreshToken")
        .json(new ApiResponse(200, null, "Logged out from all devices"));
});











const refresh = asyncHandler(async (req, res) => {
    const token =
        req.cookies?.refreshToken
    // console.log("Refresh token received:", token); // Debug log

    if (!token) {
        throw new ApiError(401, "No refresh token provided");
    }
    let decoded;
    try {
        // console.log(process.env.REFRESH_TOKEN_SECRET); // Debug log
        decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    } catch (err) {
        throw new ApiError(403, "Invalid or expired refresh token");
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        console.log("User not found");
        throw new ApiError(404, "User not found");
    }

    const session = user.sessions.find(
        (s) =>
            s.sessionId === decoded.sessionId &&
            s.refreshToken === token &&
            s.isActive
    );

    if (!session) {
        console.log("❌ Invalid session or session is inactive");
        throw new ApiError(403, "Invalid session or session is inactive");
    }

    // Update activity
    session.latestLogin = new Date();
    await user.save();

    const newAccessToken = generateAccessToken(user);
    const cookieOptions = getCookieOptions();

    console.log(`Access token refreshed | Email: ${user.email} | Device: ${session.device}`);

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



export {
    register,
    verifyEmail,
    login,
    logout,
    logoutAll,
    refresh
};