// routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import PageLoader from "../utils/PageLoader";

// Helper to wrap each route with loader
const withLoader = (Component) => (
    <Suspense fallback={<PageLoader />}>
        <Component />
    </Suspense>
);


// Public pages
const Home = lazy(() => import("../pages/public/Home"));
const NotFound = lazy(() => import("../pages/errors/NotFound"));
const About = lazy(() => import("../pages/public/About"));
const Contact = lazy(() => import("../pages/public/Contact"));
const HowItWorks = lazy(() => import("../pages/public/HowItWorks"));

// Auth
const Register = lazy(() => import("../components/forms/Register"));
const Verify = lazy(() => import("../components/forms/Verify"));
const Login = lazy(() => import("../components/forms/Login"));
const ChangePassword = lazy(() => import("../components/forms/ChangePassword"));
const ForgotPassword = lazy(() => import("../components/forms/ForgotPassword"));
const ResetPassword = lazy(() => import("../components/forms/ResetPassword"));

// User
const Dashboard = lazy(() => import("../pages/user/Dashboard"));
const Profile = lazy(() => import("../pages/user/Profile"));
const Sessions = lazy(() => import("../pages/user/Sessions"));

// test routes
const TakeTest = lazy(() => import("../components/test/TakeTest"));
const AllTests = lazy(() => import("../pages/user/AllTests"));
const TestResult = lazy(() => import("../pages/user/TestResult"));
const Preferences = lazy(() => import("../pages/user/Preferences"));
const Suggestion = lazy(() => import("../pages/user/Suggestion"));

// College
const FindCollege = lazy(() => import("../pages/college/FindCollege"));
const CollegeDetails = lazy(() => import("../pages/college/CollegeDetails"));

const AppRoutes = () => {
    return (
        <Routes>

            {/* Auth Routes (blocked if logged in) */}
            <Route element={<PublicRoute />}>
                <Route path="/login" element={withLoader(Login)} />
                <Route path="/register" element={withLoader(Register)} />
                <Route path="/verify/:token" element={withLoader(Verify)} />
                <Route path="/forgot-password" element={withLoader(ForgotPassword)} />
                <Route path="/reset-password" element={withLoader(ResetPassword)} />
            </Route>

            {/* Public routes */}
            <Route path="/" element={withLoader(Home)} />
            <Route path="/about" element={withLoader(About)} />
            <Route path="/contact" element={withLoader(Contact)} />
            <Route path="/how-it-works" element={withLoader(HowItWorks)} />
            <Route path="/colleges" element={withLoader(FindCollege)} />
            <Route path="/colleges/:id" element={withLoader(CollegeDetails)} />

            {/* Protected */}
            <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={withLoader(Dashboard)} />
                <Route path="/profile" element={withLoader(Profile)} />
                <Route path="/sessions" element={withLoader(Sessions)} />
                <Route path="/change-password" element={withLoader(ChangePassword)} />
                {/* test routes */}
                <Route path="/all-tests" element={withLoader(AllTests)} />
                <Route path="/take-test" element={withLoader(TakeTest)} />
                <Route path="/test-result/:testId" element={withLoader(TestResult)} />
                <Route path="/preferences" element={withLoader(Preferences)} />
                <Route path="/suggestion/:testId" element={<Suggestion />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={withLoader(NotFound)} />

        </Routes>
    );
};

export default AppRoutes;