// context/AuthContext.jsx
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { axiosInstance } from "../lib/http";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Fetch current user profile
    const fetchProfile = useCallback(async () => {
        try {
            const { data } = await axiosInstance.get("/user/profile");
            const userData = data?.data?.user;
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem("backendReady", "true");
            return userData;
        } catch (err) {
            console.error("❌ Fetch profile error:", err);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("backendReady");
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    // Check auth on mount
    useEffect(() => {
        fetchProfile();
    }, [fetchProfile]);

    // Listen for auth logout events
    useEffect(() => {
        const handleAuthLogout = () => {
            setUser(null);
            setIsAuthenticated(false);
            setLoading(false);
        };

        window.addEventListener("auth:logout", handleAuthLogout);
        return () => window.removeEventListener("auth:logout", handleAuthLogout);
    }, []);

    // Register user
    const register = async (formData) => {
        try {
            if (!formData.name || !formData.email || !formData.password) {
                throw new Error("All fields are required");
            }

            const response = await axiosInstance.post("/auth/register", {
                name: formData.name,
                email: formData.email,
                password: formData.password
            });

            toast.success(response.data?.message || "Verification email sent! Please check your inbox.", {
                duration: 5000,
                position: "top-center",
                icon: '✉️'
            });

            return response.data;
        } catch (err) {
            console.error("❌ Register error:", err);

            let errorMessage = "Registration failed. Please try again.";

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            } else if (err.response?.data?.error) {
                errorMessage = err.response.data.error;
            } else if (err.message) {
                errorMessage = err.message;
            }

            toast.error(errorMessage, {
                duration: 4000,
                position: "top-center"
            });

            throw err;
        }
    };

    // Login user
    const login = async (email, password, device = "unknown") => {
        try {
            const { data } = await axiosInstance.post("/auth/login", {
                email,
                password,
                device
            });

            const userData = data?.data?.user;
            setUser(userData);
            setIsAuthenticated(true);

            toast.success(data?.message || "Login successful!", {
                duration: 3000,
                position: "top-center"
            });

            return userData;
        } catch (err) {
            console.error("❌ Login error:", err);
            const msg = err?.response?.data?.message || "Login failed. Please check your credentials.";
            toast.error(msg, {
                duration: 4000,
                position: "top-center"
            });
            throw err;
        }
    };

    // Verify email token
    const verifyEmail = async (token, device = "web") => {
        try {
            const formData = new URLSearchParams();
            formData.append("device", device);

            const { data } = await axiosInstance.post(`/auth/verify/${token}`, formData, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                }
            });

            // After verification, fetch user profile
            await fetchProfile();

            toast.success(data?.message || "Email verified successfully! Welcome aboard!", {
                duration: 3000,
                position: "top-center"
            });

            return data;
        } catch (err) {
            console.error("❌ Verification error:", err);

            let errorMessage = "Verification failed. Please try again.";

            if (err.response?.data?.message) {
                errorMessage = err.response.data.message;
            }

            toast.error(errorMessage, {
                duration: 4000,
                position: "top-center"
            });

            throw err;
        }
    };

    // Logout user (current session)
    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("backendReady");
            toast.success("Logged out successfully!", {
                duration: 3000,
                position: "top-center"
            });
        } catch (err) {
            console.error("❌ Logout error:", err);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("backendReady");
            toast.error("Logged out locally.", {
                duration: 3000,
                position: "top-center"
            });
        }
    };

    // Logout from all devices
    const logoutAll = async () => {
        try {
            await axiosInstance.post("/auth/logout-all");
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("backendReady");
            toast.success("Logged out from all devices!", {
                duration: 3000,
                position: "top-center"
            });
        } catch (err) {
            console.error("❌ Logout all error:", err);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem("backendReady");
            toast.error("Error logging out from all devices.", {
                duration: 3000,
                position: "top-center"
            });
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        register,
        login,
        verifyEmail,
        logout,
        logoutAll,
        fetchProfile,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};