// routes/AppRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";

import Home from "../pages/Home";
import Dashboard from "../pages/Dashboard";
import Login from "../components/forms/Login";
import Register from "../components/forms/Register";
import Verify from "../components/forms/Verify";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public (but blocked if logged in) */}
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <Login />
                    </PublicRoute>
                }
            />

            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <Register />
                    </PublicRoute>
                }
            />

            <Route
                path="/verify/:token"
                element={
                    <PublicRoute>
                        <Verify />
                    </PublicRoute>
                }
            />

            {/* Normal public */}
            <Route path="/" element={<Home />} />

            {/* Protected */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;