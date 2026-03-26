import {
    createContext,
    useContext,
    useEffect,
    useState,
    useCallback,
} from "react";
import { IoIosMail } from "react-icons/io";
import { axiosInstance } from "../lib/http";
import { schadenToast } from "@/components/schadenToast/ToastConfig.jsx";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = Boolean(user?._id);










    // FETCH PROFILE
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

    // INITIAL LOAD (NO FLICKER FIX)
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);










    // REGISTER
    const register = async ({ name, email, password }) => {
        try {
            const { data } = await axiosInstance.post("/auth/register", {
                name,
                email,
                password,
            });

            schadenToast.info(data?.message || "Verification email sent!", { // info because they need to check their email
                duration: 6000,
                position: "top-center",
                description: "Please check your inbox or spam folder",
                icon: <IoIosMail size={20} />,
            });

            return data?.data;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Registration failed. Try again.";
            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please try again",
            });
            throw err;
        }
    };









    // VERIFY EMAIL
    const verifyEmail = async (token) => {
        try {
            const { data } = await axiosInstance.post(
                `/auth/verify/${token}`
            );

            schadenToast.success(data?.message || "Email verified successfully!", {
                duration: 5000,
                position: "top-center",
                description: "You can now login to your account",
            });

            return true;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Verification failed";
            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please request a new verification link",
            });
            throw err;
        }
    };








    // LOGIN
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

            schadenToast.success(data?.message || "Welcome back!", {
                duration: 3000,
                position: "top-center",
                description: `Logged in as ${userData.name || email}`,
            });

            return userData;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Invalid email or password";
            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please check your credentials and try again",
            });
            throw err;
        }
    };








    // LOGOUT (CURRENT DEVICE)
    const logout = async () => {
        try {
            const res = await axiosInstance.post("/auth/logout");
            if (res.data?.success) {
                clearSession(); // Clear session only on successful logout
            }
            schadenToast.success(res.data?.message || "Logged out successfully", {
                duration: 2000,
                position: "top-center",
            });
        } catch (err) {
            schadenToast.error(res?.data?.message || "Logout failed", {
                duration: 4000,
                position: "top-center",
            });
        }
    };










    // LOGOUT ALL DEVICES
    const logoutAll = async () => {
        try {
            const { data } = await axiosInstance.post("/auth/logout-all");

            schadenToast.success(data?.message || "Logged out from all other devices", {
                duration: 4000,
                position: "top-center",
                description: "current session remains active",
            });

        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to logout from other devices";

            if (msg === "No other active sessions found") {
                schadenToast.warning(msg, {
                    duration: 6000,
                    position: "top-center",
                });
                return; //exit early since this is not really an error
            }   
            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please try again or contact support",
            });
            throw err;
        }
    };










    const clearSession = () => {
        setUser(null);
        localStorage.removeItem("backendReady");
    };

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
        clearSession,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};