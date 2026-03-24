// routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "../utils/PageLoader";

// Lazy load components

//info pages/general pages
const Home = lazy(() => import("../pages/Home"));
const NotFound = lazy(() => import("../pages/NotFound"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const HowItWorks = lazy(() => import("../pages/HowItWorks"));


//auth related pages
const Register = lazy(() => import("../components/forms/Register"));
const Verify = lazy(() => import("../components/forms/Verify"));
const Login = lazy(() => import("../components/forms/Login"));
const ResetPassword = lazy(() => import("../components/forms/ResetPassword"));

//user related pages
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const Sessions = lazy(() => import("../pages/Sessions"));
const FindCollege = lazy(() => import("../pages/FindCollege"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>

                {/* Public routes (blocked if logged in) */}
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/verify/:token" element={<PublicRoute><Verify /></PublicRoute>} />
                <Route path="/reset-password" element={<PublicRoute><ResetPassword /></PublicRoute>} />
                
                {/* Public route */}
                <Route path="/" element={<Home />} />

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/colleges" element={<FindCollege />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/sessions" element={<ProtectedRoute><Sessions /></ProtectedRoute>} />



                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;