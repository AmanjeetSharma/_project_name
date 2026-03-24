// routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "../utils/PageLoader";

// Lazy load components
const Home = lazy(() => import("../pages/Home"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Login = lazy(() => import("../components/forms/Login"));
const Register = lazy(() => import("../components/forms/Register"));
const Verify = lazy(() => import("../components/forms/Verify"));
const NotFound = lazy(() => import("../pages/NotFound"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>

                {/* Public routes (blocked if logged in) */}
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/verify/:token" element={<PublicRoute><Verify /></PublicRoute>} />

                {/* Public route */}
                <Route path="/" element={<Home />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;