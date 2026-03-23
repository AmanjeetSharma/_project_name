import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

// 🔒 Prevent multiple refresh calls
let isRefreshing = false;
let refreshSubscribers = [];

function onRefreshed() {
    refreshSubscribers.forEach(cb => cb());
    refreshSubscribers = [];
}

function addSubscriber(callback) {
    refreshSubscribers.push(callback);
}

axiosInstance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;

        // 🛑 Safety check
        if (!originalRequest) return Promise.reject(error);

        const skipRefresh = [
            "/auth/refresh-token",
            "/auth/login",
            "/auth/register",
            "/oauth2/google-login",
        ];

        const isAuthRoute = skipRefresh.some(route =>
            originalRequest.url?.includes(route)
        );

        // ❌ Skip if:
        // - already retried
        // - auth route
        // - no response
        if (
            originalRequest._retry ||
            isAuthRoute ||
            !error.response
        ) {
            return Promise.reject(error);
        }

        // 🔐 Handle 401
        if (error.response.status === 401) {

            // 🔁 If already refreshing → queue requests
            if (isRefreshing) {
                return new Promise((resolve) => {
                    addSubscriber(() => {
                        resolve(axiosInstance(originalRequest));
                    });
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                await axiosInstance.post("/auth/refresh-token", {}, {
                    withCredentials: true
                });

                isRefreshing = false;
                onRefreshed();

                return axiosInstance(originalRequest);

            } catch (refreshErr) {
                isRefreshing = false;
                refreshSubscribers = [];

                // 🚨 Important: stop loop completely
                return Promise.reject(refreshErr);
            }
        }

        return Promise.reject(error);
    }
);

export const http = axiosInstance;