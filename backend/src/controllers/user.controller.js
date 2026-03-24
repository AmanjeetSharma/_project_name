import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";









const getProfile = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).select("-password -sessions");
    // console.log("Fetching user profile for:", user);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    console.log(`Profile fetched for: ${user.email} | ID: ${user._id}`);

    return res
        .status(200)
        .json(new ApiResponse(200, user, "✅ User profile fetched successfully"));
});








const updateProfile = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const { name, address } = req.body;

    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    if (name) {
        if (name.length < 3 || name.length > 50) {
            throw new ApiError(400, "Name must be between 3 and 50 characters");
        }
        user.name = name;
    }

    // Update address (partial update safe)
    if (address) {
        user.address = {
            ...user.address?.toObject(),
            ...address
        };
    }

    await user.save();

    const updatedUser = await User.findById(userId)
        .select("-password -sessions -resetPasswordToken -resetPasswordExpiry");

    console.log(`Profile updated for: ${updatedUser.email} | ID: ${updatedUser._id}`);

    return res.status(200).json(
        new ApiResponse(
            200,
            updatedUser,
            "Profile updated successfully"
        )
    );
});











const getUserSessions = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const user = await User.findById(userId).select("sessions");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const currentToken = req.cookies?.refreshToken;

    const safeSessions = user.sessions.map((s) => ({
        sessionId: s.sessionId,
        device: s.device,
        firstLogin: s.firstLogin,
        latestLogin: s.latestLogin,
        isActive: s.isActive,

        // Optional UX improvement
        isCurrent: s.refreshToken === currentToken
    }));

    console.log(`Sessions fetched for: ${req.user.email} | Total sessions: ${safeSessions.length}`);

    return res.status(200).json(
        new ApiResponse(200, safeSessions, "User sessions fetched | Total: " + safeSessions.length)
    );
});









const logoutSingleDevice = asyncHandler(async (req, res) => {
    const userId = req.user?._id;
    const { sessionId } = req.params;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    if (!sessionId) {
        throw new ApiError(400, "Session ID is required");
    }

    const user = await User.findById(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const session = user.sessions.find(s => s.sessionId === sessionId);

    if (!session) {
        throw new ApiError(404, "Session not found");
    }

    // Deactivate session
    session.isActive = false;
    session.refreshToken = null;

    await user.save();

    console.log(`Single session logged out for: ${req.user.email} | Device: ${session.device}`);

    return res.status(200).json(
        new ApiResponse(200, null, `Session for ${session.device} logged out successfully`)
    );
});









export {
    getProfile,
    updateProfile,
    getUserSessions,
    logoutSingleDevice
}