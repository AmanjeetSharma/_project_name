import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { axiosInstance } from "../lib/http";
import { toast } from "sonner";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = Boolean(user?._id);

    // ================================
    // 🔹 FETCH PROFILE
    // ================================
    const fetchProfile = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get("/user/profile");

            const userData = data?.data;

            if (userData) {
                setUser(userData);
                localStorage.setItem("backendReady", "true");
                return userData;
            }

            throw new Error("No user data");
        } catch (err) {
            setUser(null);
            localStorage.removeItem("backendReady");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // ================================
    // 🔹 INITIAL LOAD (NO FLICKER FIX)
    // ================================
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // ================================
    // 🔹 REGISTER
    // ================================
    const register = async ({ name, email, password }) => {
        try {
            const { data } = await axiosInstance.post("/auth/register", {
                name,
                email,
                password,
            });

            toast.success(data?.message || "Verification email sent!", {
                duration: 4000,
                position: "top-center",
                description: "Please check your inbox to verify your account",
                icon: "✉️",
            });

            return data?.data;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Registration failed. Try again.";
            toast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please check your information and try again",
            });
            throw err;
        }
    };

    // ================================
    // 🔹 VERIFY EMAIL
    // ================================
    const verifyEmail = async (token) => {
        try {
            const { data } = await axiosInstance.post(
                `/auth/verify/${token}`
            );

            toast.success(data?.message || "Email verified successfully!", {
                duration: 5000,
                position: "top-center",
                description: "You can now login to your account",
                icon: "✅",
            });

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Verification failed";
            toast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please request a new verification link",
            });
            throw err;
        }
    };

    // ================================
    // 🔹 LOGIN
    // ================================
    const login = async (email, password, device = "web") => {
        try {
            const { data } = await axiosInstance.post("/auth/login", {
                email,
                password,
                device,
            });

            const userData = data?.data?.user;

            if (!userData) {
                throw new Error("Invalid login response");
            }

            setUser(userData);
            localStorage.setItem("backendReady", "true");

            toast.success(data?.message || "Welcome back!", {
                duration: 3000,
                position: "top-center",
                description: `Logged in as ${userData.name || email}`,
                icon: "👋",
            });

            return userData;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Invalid email or password";
            toast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please check your credentials and try again",
            });
            throw err;
        }
    };

    // ================================
    // 🔹 LOGOUT (CURRENT DEVICE)
    // ================================
    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            toast.success("Logged out successfully", {
                duration: 2000,
                position: "top-center",
                icon: "👋",
            });
        } catch (err) {
            console.warn("Logout API failed, clearing locally");
            toast.warning("Logged out locally", {
                duration: 2000,
                position: "top-center",
                description: "Your session has been cleared from this device",
            }); 
        } finally {
            setUser(null);
            localStorage.removeItem("backendReady");
        }
    };

    // ================================
    // 🔹 LOGOUT ALL DEVICES
    // ================================
    const logoutAll = async () => {
        try {
            const { data } = await axiosInstance.post("/auth/logout-all");

            toast.success(data?.message || "Logged out from all other devices", {
                duration: 4000,
                position: "top-center",
                description: "All active sessions have been terminated",
                icon: "🔒",
            });

        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to logout from other devices";

            toast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please try again or contact support",
            });
            throw err;
        }
    };

    // ================================
    // 🔹 REFRESH TOKEN (OPTIONAL MANUAL)
    // ================================
    const refreshAuth = async () => {
        toast.promise(
            async () => {
                try {
                    await axiosInstance.post("/auth/refresh");
                    await fetchProfile();
                } catch (err) {
                    throw err;
                }
            },
            {
                loading: "Refreshing session...",
                success: "Session refreshed successfully",
                error: "Failed to refresh session",
                position: "top-center",
                duration: 3000,
            }
        );
    };

    // ================================
    // 🔹 RESET PASSWORD (Example of promise toast)
    // ================================
    const resetPassword = async (email) => {
        toast.promise(
            async () => {
                const { data } = await axiosInstance.post("/auth/forgot-password", { email });
                if (!data.success) throw new Error(data.message);
                return data;
            },
            {
                loading: "Sending reset link...",
                success: (data) => ({
                    message: data?.message || "Reset link sent!",
                    description: `Check your email at ${email} for the reset link`,
                    icon: "📧",
                }),
                error: (err) => ({
                    message: err?.response?.data?.message || "Failed to send reset link",
                    description: "Please check your email address and try again",
                }),
                position: "top-center",
                duration: 5000,
            }
        );
    };

    // ================================
    // 🔹 CHANGE PASSWORD (Example of info toast)
    // ================================
    const changePassword = async (oldPassword, newPassword) => {
        try {
            await axiosInstance.post("/auth/change-password", {
                oldPassword,
                newPassword,
            });

            toast.info("Password changed successfully", {
                duration: 3000,
                position: "top-center",
                description: "Your password has been updated. Please use your new password next login.",
                icon: "🔐",
            });

            return true;
        } catch (err) {
            toast.error(err?.response?.data?.message || "Failed to change password", {
                duration: 4000,
                position: "top-center",
                description: "Please verify your current password and try again",
            });
            throw err;
        }
    };

    // ================================
    // 🔹 VALUE
    // ================================
    const value = {
        user,
        loading,
        isAuthenticated,
        register,
        verifyEmail,
        login,
        logout,
        logoutAll,
        fetchProfile,
        refreshAuth,
        resetPassword,
        changePassword,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

// ================================
// 🔹 HOOK
// ================================
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};