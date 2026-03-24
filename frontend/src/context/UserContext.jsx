import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { axiosInstance } from "../lib/http";
import { schadenToast } from "@/components/schadenToast/toast-config";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const { user, fetchProfile } = useAuth();

    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [sessions, setSessions] = useState([]);

    // ================================
    // 🔹 UPDATE PROFILE
    // ================================
    const updateProfile = async (profileData) => {
        setUpdatingProfile(true);

        try {
            const { data } = await axiosInstance.patch(
                "/user/update-profile",
                profileData
            );

            const updatedUser = data?.data;

            // 🔥 sync auth context
            await fetchProfile();

            schadenToast.success(data?.message || "Profile updated successfully", {
                duration: 3000,
                position: "top-center",
                description: "Your information has been saved",
                icon: "✅",
            });

            return updatedUser;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to update profile";
            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please check your information and try again",
            });
            throw err;
        } finally {
            setUpdatingProfile(false);
        }
    };

    // ================================
    // 🔹 GET SESSIONS
    // ================================
    const getUserSessions = useCallback(async () => {
        setLoadingSessions(true);

        try {
            const { data } = await axiosInstance.get("/user/sessions");

            const sessionsData = data?.data || [];

            setSessions(sessionsData);

            return sessionsData;
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to fetch sessions";
            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please refresh the page and try again",
            });
            throw err;
        } finally {
            setLoadingSessions(false);
        }
    }, []);

    // ================================
    // 🔹 LOGOUT SPECIFIC SESSION
    // ================================
    const logoutSession = async (sessionId) => {
        try {
            const { data } = await axiosInstance.post(
                `/user/sessions/logout/${sessionId}`
            );

            schadenToast.success(data?.message || "Session terminated successfully", {
                duration: 3000,
                position: "top-center",
                description: "The device has been logged out",
                icon: "🔒",
            });

            // 🔥 refresh sessions
            await getUserSessions();
        } catch (err) {
            const msg =
                err?.response?.data?.message ||
                "Failed to terminate session";
            schadenToast.error(msg, {
                duration: 4000,
                position: "top-center",
                description: "Please try again or refresh the page",
            });
            throw err;
        }
    };

    // ================================
    // 🔹 LOGOUT ALL OTHER SESSIONS (Bulk action)
    // ================================
    const logoutAllOtherSessions = async () => {
        schadenToast.promise(
            async () => {
                const { data } = await axiosInstance.post("/user/sessions/logout-all");
                if (!data.success) throw new Error(data.message);
                await getUserSessions();
                return data;
            },
            {
                loading: "Terminating other sessions...",
                success: (data) => ({
                    message: data?.message || "All other sessions terminated",
                    description: "Your account is now only active on this device",
                    icon: "🔒",
                }),
                error: (err) => ({
                    message: err?.response?.data?.message || "Failed to terminate sessions",
                    description: "Please try again or contact support",
                }),
                position: "top-center",
                duration: 4000,
            }
        );
    };
    // ================================
    // 🔹 VALUE
    // ================================
    const value = {
        user, // from AuthContext

        // Profile
        updatingProfile,
        updateProfile,

        // Sessions
        sessions,
        loadingSessions,
        getUserSessions,
        logoutSession,
        logoutAllOtherSessions, // New bulk action
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

// ================================
// 🔹 HOOK
// ================================
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
};