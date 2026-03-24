// context/UserContext.jsx
import { createContext, useContext, useState, useCallback } from "react";
import { useAuth } from "./AuthContext";
import { axiosInstance } from "../lib/http";
import toast from "react-hot-toast";

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
    const { user: authUser, setUser, fetchProfile } = useAuth();
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [loadingSessions, setLoadingSessions] = useState(false);
    const [sessions, setSessions] = useState([]);

    // Update user profile
    const updateProfile = async (profileData) => {
        setUpdatingProfile(true);
        try {
            const { data } = await axiosInstance.patch("/user/update-profile", profileData);
            const updatedUser = data?.data?.user;

            // Update user in auth context
            if (setUser) {
                setUser(updatedUser);
            }

            toast.success("Profile updated successfully!", {
                duration: 3000,
                position: "top-center"
            });

            return updatedUser;
        } catch (err) {
            console.error("❌ Update profile error:", err);
            const msg = err?.response?.data?.message || "Failed to update profile.";
            toast.error(msg, {
                duration: 4000,
                position: "top-center"
            });
            throw err;
        } finally {
            setUpdatingProfile(false);
        }
    };

    // Get user sessions
    const getUserSessions = useCallback(async () => {
        setLoadingSessions(true);
        try {
            const { data } = await axiosInstance.get("/user/sessions");
            const sessionsData = data?.data?.sessions || [];
            setSessions(sessionsData);
            return sessionsData;
        } catch (err) {
            console.error("❌ Get sessions error:", err);
            const msg = err?.response?.data?.message || "Failed to fetch sessions.";
            toast.error(msg, {
                duration: 3000,
                position: "top-center"
            });
            throw err;
        } finally {
            setLoadingSessions(false);
        }
    }, []);

    // Logout from specific session
    const logoutSession = async (sessionToken) => {
        try {
            await axiosInstance.post(`/user/sessions/logout/${sessionToken}`);
            toast.success("Session terminated successfully!", {
                duration: 3000,
                position: "top-center"
            });

            // Refresh sessions list
            await getUserSessions();
        } catch (err) {
            console.error("❌ Logout session error:", err);
            const msg = err?.response?.data?.message || "Failed to terminate session.";
            toast.error(msg, {
                duration: 4000,
                position: "top-center"
            });
            throw err;
        }
    };

    const value = {
        // Profile related
        user: authUser,
        updatingProfile,
        updateProfile,

        // Session related
        sessions,
        loadingSessions,
        getUserSessions,
        logoutSession,
    };

    return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within UserProvider");
    }
    return context;
};