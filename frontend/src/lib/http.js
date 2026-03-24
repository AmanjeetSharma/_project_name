// lib/http.js
import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

// List of endpoints that should NOT trigger refresh token
const skipRefreshEndpoints = [
    "/auth/refresh",
    "/auth/login",
    "/auth/register",
    "/auth/verify"
];

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if this endpoint should skip refresh
        const shouldSkipRefresh = skipRefreshEndpoints.some(endpoint =>
            originalRequest.url?.includes(endpoint)
        );

        // Don't retry if already retried or if it's an auth endpoint
        if (originalRequest._retry || shouldSkipRefresh) {
            return Promise.reject(error);
        }

        // If unauthorized (401) → Try refresh token
        if (error.response?.status === 401) {
            originalRequest._retry = true;

            try {
                // Attempt to refresh the token
                await axiosInstance.post("/auth/refresh", {}, { withCredentials: true });

                // Retry the original request
                return axiosInstance(originalRequest);
            } catch (refreshErr) {
                // Refresh failed - redirect to login
                console.error("Refresh token failed:", refreshErr);

                // Clear any stale auth data
                localStorage.removeItem("backendReady");

                // You can dispatch a custom event for auth failure
                window.dispatchEvent(new CustomEvent("auth:logout"));

                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);

export const http = axiosInstance;