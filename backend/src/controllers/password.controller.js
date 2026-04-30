import bcrypt from "bcrypt";
import crypto from "crypto";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import sendEmail from "../utils/sendEmail.js";
import { resetPasswordEmail } from "../utils/emailTemplates/resetPasswordEmail.js";












const changePassword = asyncHandler(async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        throw new ApiError(401, "Unauthorized");
    }

    const { currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword) {
        throw new ApiError(400, "Current password is required");
    }
    if (!newPassword) {
        throw new ApiError(400, "New password is required");
    }
    if (newPassword.length < 8) {
        throw new ApiError(400, "New password must be at least 8 characters long");
    }
    if (newPassword !== confirmNewPassword) {
        throw new ApiError(400, "New password and confirm new password do not match");
    }

    const user = await User.findById(userId).select("+password");

    if (!user) {
        throw new ApiError(404, "User account not found");
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Current password is incorrect");
    }

    // Prevent same password reuse
    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        throw new ApiError(400, "New password must be different from your current password");
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Invalidate all sessions
    if (user.sessions && user.sessions.length > 0) {
        user.sessions = user.sessions.map((s) => ({
            ...s.toObject(),
            isActive: false,
            refreshToken: null
        }));
    }

    await user.save();

    console.log(`Password changed for user ${user.email} | All sessions logged out.`);

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            null,
            "Password changed successfully. All sessions have been logged out."
        )
        );
});











const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;

    if (!email) {
        throw new ApiError(400, "Email is required");
    }

    const user = await User.findOne({ email });

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    if (!user) {
        await delay(2300); // 2 second delay to mitigate user enumeration attacks
        console.log(`User with email ${email} does not exist.`);
        return res.status(200).json(
            new ApiResponse(200, null, "If this email exists, a reset link has been sent")
        );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    const hashedToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000; // 10 min

    await user.save({ validateBeforeSave: false });

    const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    const emailHTML = resetPasswordEmail(resetLink);

    if (process.env.EMAIL_ENABLED === 'true') { // Only send email if enabled in environment variables
        await sendEmail(user.email, "Reset Your Password - MySaaS", emailHTML, true);
    }
    console.log(`[sendEmail] for password reset: ${process.env.EMAIL_ENABLED === 'true' ? 'Email sent' : 'Email sending disabled, skipping...'}`);

    console.log(`Reset link for ${user.email}: ${resetLink}`); // log the reset link for testing since email sending is disabled

    return res.status(200).json(
        new ApiResponse(200, null, "If this email exists, a reset link has been sent")
    );
});










const resetPassword = asyncHandler(async (req, res) => {
    let { token, newPassword, confirmNewPassword } = req.body;

    token = token?.trim();
    newPassword = newPassword?.trim();
    confirmNewPassword = confirmNewPassword?.trim();

    const requiredFields = { token, newPassword, confirmNewPassword };

    const missingFields = Object.entries(requiredFields)
        .filter(([_, value]) => value === undefined || value === null || value === "")
        .map(([name]) => name);

    if (missingFields.length > 0) {
        throw new ApiError(400, `The following fields are required: ${missingFields.join(", ")}`);
    }

    if (newPassword !== confirmNewPassword) {
        throw new ApiError(400, "New password and confirm new password do not match");
    }

    if (newPassword.length < 8) {
        throw new ApiError(400, "Password must be at least 8 characters");
    }

    // Hashing incoming token to compare with the db value
    const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken: hashedToken,
        resetPasswordExpiry: { $gt: Date.now() }
    }).select("+password");

    if (!user) {
        throw new ApiError(400, "Token is invalid or your link has expired");
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);
    if (isSamePassword) {
        throw new ApiError(400, "New password must be different from old password");
    }
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    // Invalidate reset token and all sessions
    user.resetPasswordToken = null;
    user.resetPasswordExpiry = null;

    // Invalidate all sessions
    user.sessions.forEach((s) => {
        s.isActive = false;
        s.refreshToken = null;
    });

    await user.save();

    console.log(`Password reset successful for user ${user.email}`);

    return res.status(200).json(
        new ApiResponse(200, null, "Password reset successful. Please login again.")
    );
});






export {
    changePassword,
    forgotPassword,
    resetPassword,
};