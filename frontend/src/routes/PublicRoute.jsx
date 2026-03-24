// routes/PublicRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import PageLoader from "@/utils/PageLoader";

export default function PublicRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <PageLoader />
        </div>
    );

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}