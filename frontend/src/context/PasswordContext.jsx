import { createContext, useContext, useState } from "react";
import { axiosInstance } from "../lib/http";
import { schadenToast } from "../components/schadenToast/toast-config";

const PasswordContext = createContext(null);

export const PasswordProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    // ================================
    // 🔹 CHANGE PASSWORD (AUTH REQUIRED)
    // ================================
    const changePassword = async ({
        currentPassword,
        newPassword,
        confirmNewPassword,
    }) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post(
                "/password/change-password",
                {
                    currentPassword,
                    newPassword,
                    confirmNewPassword,
                }
            );

            schadenToast.success(
                data?.message ||
                "Password changed successfully. Please login again.",
                {
                    duration: 4000,
                    position: "top-center",
                    description: "You will be redirected to login",
                    icon: "🔐",
                }
            );

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to change password";
            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please check your current password and try again",
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // 🔹 FORGOT PASSWORD
    // ================================
        const forgotPassword = async (email) => {
            setLoading(true);

            try {
                const { data } = await axiosInstance.post(
                    "/password/forgot-password",
                    { email }
                );

                // ⚠️ Always generic message (security)
                schadenToast.success(
                    data?.message ||
                    "If this email exists, a reset link has been sent",
                    {
                        duration: 5000,
                        position: "top-center",
                        description: "Please check your inbox and spam folder",
                        icon: "📧",
                    }
                );

                return true;
            } catch (err) {
                const msg =
                    err?.response?.data?.message ||
                    "Something went wrong";
                schadenToast.error(msg, {
                    duration: 4000,
                    position: "top-center",
                    description: "Please try again or contact support",
                });
                throw err;
            } finally {
                setLoading(false);
            }
        };

    // ================================
    // 🔹 RESET PASSWORD
    // ================================
    const resetPassword = async ({
        token,
        newPassword,
        confirmNewPassword,
    }) => {
        setLoading(true);

        try {
            const { data } = await axiosInstance.post(
                "/password/reset-password",
                {
                    token,
                    newPassword,
                    confirmNewPassword,
                }
            );

            schadenToast.success(
                data?.message ||
                "Password reset successful. Please login.",
                {
                    duration: 4000,
                    position: "top-center",
                    description: "You can now login with your new password",
                    icon: "✅",
                }
            );

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Password reset failed";
            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "The reset link may have expired or is invalid",
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // ================================
    // 🔹 VALUE
    // ================================
    const value = {
        loading,
        changePassword,
        forgotPassword,
        resetPassword,
    };

    return (
        <PasswordContext.Provider value={value}>
            {children}
        </PasswordContext.Provider>
    );
};

// ================================
// 🔹 HOOK
// ================================
export const usePassword = () => {
    const context = useContext(PasswordContext);
    if (!context) {
        throw new Error(
            "usePassword must be used within PasswordProvider"
        );
    }
    return context;
};