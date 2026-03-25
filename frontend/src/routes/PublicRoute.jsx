// routes/PublicRoute.jsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "@/utils/PageLoader";

export default function PublicRoute() {
    const { isAuthenticated, loading } = useAuth();

    // Show loading spinner while checking auth status
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <PageLoader />
            </div>
        );
    }

    // if authenticated, redirect to dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // if not authenticated, render the nested routes
    return <Outlet />;
}