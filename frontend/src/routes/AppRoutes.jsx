// routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "../utils/PageLoader";

// Lazy load components

//info pages/general pages
const Home = lazy(() => import("../pages/public/Home"));
const NotFound = lazy(() => import("../pages/errors/NotFound"));
const About = lazy(() => import("../pages/public/About"));
const Contact = lazy(() => import("../pages/public/Contact"));
const HowItWorks = lazy(() => import("../pages/public/HowItWorks"));


//auth related pages
const Register = lazy(() => import("../components/forms/Register"));
const Verify = lazy(() => import("../components/forms/Verify"));
const Login = lazy(() => import("../components/forms/Login"));
const ChangePassword = lazy(() => import("../components/forms/ChangePassword"));
const ForgotPassword = lazy(() => import("../components/forms/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/forms/ResetPassword"));

//user related pages
const Dashboard = lazy(() => import("../pages/user/Dashboard"));
const Profile = lazy(() => import("../pages/user/Profile"));
const Sessions = lazy(() => import("../pages/user/Sessions"));
const FindCollege = lazy(() => import("../pages/college/FindCollege"));

const AppRoutes = () => {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>

                {/* Public (blocked if logged in) */}
                <Route element={<PublicRoute />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify/:token" element={<Verify />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                </Route>

                {/* Open routes */}
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/how-it-works" element={<HowItWorks />} />
                <Route path="/colleges" element={<FindCollege />} />

                {/* Protected */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/sessions" element={<Sessions />} />
                    <Route path="/change-password" element={<ChangePassword />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />

            </Routes>
        </Suspense>
    );
};

export default AppRoutes;