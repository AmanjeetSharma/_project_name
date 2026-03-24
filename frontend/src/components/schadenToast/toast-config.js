// lib/toast-config.js
import { toast } from "sonner";

export const schadenToast = {
    success: (message, options = {}) => {
        toast.success(message, {
            style: {
                background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                border: "none",
                color: "white",
            },
            ...options
        });
    },
    error: (message, options = {}) => {
        toast.error(message, {
            style: {
                background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                border: "none",
                color: "white",
            },
            ...options
        });
    },
    warning: (message, options = {}) => {
        toast.warning(message, {
            style: {
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                border: "none",
                color: "white",
            },
            ...options
        });
    },
    info: (message, options = {}) => {
        toast.info(message, {
            style: {
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                border: "none",
                color: "white",
            },
            ...options
        });
    },
    promise: (promise, options = {}) => {
        return toast.promise(promise, {
            loading: options.loading || "Loading...",
            success: options.success,
            error: options.error,
            style: {
                background: "white",
                border: "1px solid rgba(0, 0, 0, 0.05)",
            },
            ...options
        });
    }
};