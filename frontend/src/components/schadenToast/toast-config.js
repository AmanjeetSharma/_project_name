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
            duration: options.duration || 3000,
            position: options.position || "top-center",
            description: options.description,
            icon: options.icon,
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
            duration: options.duration || 4000,
            position: options.position || "top-center",
            description: options.description,
            icon: options.icon,
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
            duration: options.duration || 4000,
            position: options.position || "top-center",
            description: options.description,
            icon: options.icon,
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
            duration: options.duration || 4000,
            position: options.position || "top-center",
            description: options.description,
            icon: options.icon,
            ...options
        });
    },

    promise: (promise, options = {}) => {
        return toast.promise(promise, {
            loading: options.loading || "Loading...",
            success: (data) => {
                if (typeof options.success === 'string') {
                    return {
                        message: options.success,
                        description: options.description,
                        icon: options.icon,
                    };
                }
                return options.success(data);
            },
            error: (err) => {
                if (typeof options.error === 'string') {
                    return {
                        message: options.error,
                        description: options.errorDescription,
                        icon: options.errorIcon,
                    };
                }
                return options.error(err);
            },
            position: options.position || "top-center",
            duration: options.duration || 3000,
            ...options
        });
    },

    // Custom loading toast
    loading: (message, options = {}) => {
        return toast.loading(message, {
            duration: options.duration || Infinity,
            position: options.position || "top-center",
            description: options.description,
            ...options
        });
    },

    // Dismiss all toasts
    dismiss: () => {
        toast.dismiss();
    },

    // Custom toast with custom styling
    custom: (message, options = {}) => {
        toast(message, {
            style: options.style || {
                background: "white",
                border: "1px solid rgba(0, 0, 0, 0.05)",
                color: "#1f2937",
            },
            duration: options.duration || 3000,
            position: options.position || "top-center",
            description: options.description,
            icon: options.icon,
            ...options
        });
    }
};