import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { axiosInstance } from "../lib/http";
import toast from "react-hot-toast";

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

            toast.success(
                data?.message || "Verification email sent!",
                {
                    duration: 4000,
                    position: "top-center",
                }
            );

            return data?.data;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Registration failed. Try again.";
            toast.error(msg, { duration: 4000 });
            throw err;
        }
    };

    // ================================
    // 🔹 VERIFY EMAIL
    // ================================
    const verifyEmail = async (token) => {
        try {
            const { data } = await axiosInstance.get(
                `/auth/verify/${token}`
            );

            toast.success(
                data?.message ||
                "Email verified successfully! Please login.",
                { duration: 4000 }
            );

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Verification failed";
            toast.error(msg);
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

            toast.success(data?.message || "Login successful");

            return userData;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Invalid email or password";
            toast.error(msg);
            throw err;
        }
    };

    // ================================
    // 🔹 LOGOUT (CURRENT DEVICE)
    // ================================
    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
        } catch (err) {
            console.warn("Logout API failed, clearing locally");
        } finally {
            setUser(null);
            localStorage.removeItem("backendReady");

            toast.success("Logged out successfully");
        }
    };

    // ================================
    // 🔹 LOGOUT ALL DEVICES
    // ================================
    const logoutAll = async () => {
        try {
            await axiosInstance.post("/auth/logout-all");

            toast.success("Logged out from all devices");
        } catch (err) {
            toast.error("Failed to logout from all devices");
        } finally {
            setUser(null);
            localStorage.removeItem("backendReady");
        }
    };

    // ================================
    // 🔹 REFRESH TOKEN (OPTIONAL MANUAL)
    // ================================
    const refreshAuth = async () => {
        try {
            await axiosInstance.post("/auth/refresh");
            await fetchProfile();
        } catch (err) {
            logout();
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