// pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { usePassword } from "../../context/PasswordContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Lock, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const navigate = useNavigate();
    const { resetPassword, loading } = usePassword();

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (!token) {
            // No token case handled in render
        }
    }, [token]);

    // Auto-redirect countdown
    useEffect(() => {
        if (showSuccessDialog && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (showSuccessDialog && countdown === 0) {
            navigate("/login");
        }
    }, [showSuccessDialog, countdown, navigate]);

    const validateForm = () => {
        const newErrors = {};

        if (!password) {
            newErrors.password = "Password is required";
        } else if (password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(password)) {
            newErrors.password = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(password)) {
            newErrors.password = "Password must contain at least one number";
        } else if (!/[^A-Za-z0-9]/.test(password)) {
            newErrors.password = "Password must contain at least one special character";
        }

        if (!confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            await resetPassword({
                token,
                newPassword: password,
                confirmNewPassword: confirmPassword
            });

            // Show success dialog on successful password reset
            setShowSuccessDialog(true);
            setCountdown(5); // Reset countdown to 5 seconds

        } catch (error) {
            // Error is already handled in context with toast
            console.error("Password reset error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle manual redirect
    const handleGoToLogin = () => {
        setShowSuccessDialog(false);
        navigate("/login");
    };

    // Password strength indicator
    const getPasswordStrength = () => {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) return { text: "Very Weak", color: "bg-red-500", width: "33%" };
        if (score <= 3) return { text: "Weak", color: "bg-orange-500", width: "50%" };
        if (score <= 4) return { text: "Medium", color: "bg-yellow-500", width: "66%" };
        if (score <= 5) return { text: "Strong", color: "bg-blue-500", width: "83%" };
        return { text: "Very Strong", color: "bg-green-500", width: "100%" };
    };

    // If token is missing, show error
    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-100/30 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-100/40 rounded-full blur-3xl" />
                </div>

                <Card className="w-full max-w-md relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-gray-900 to-red-500" />
                    <CardHeader className="text-center pt-8 pb-6">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center shadow-lg shadow-red-100">
                                <AlertCircle className="h-10 w-10 text-red-600" strokeWidth={1.5} />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-light tracking-tight">
                            Missing Token!
                        </CardTitle>
                        <CardDescription>
                            No reset token was provided in the URL
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <div className="space-y-4">
                            <Link to="/forgot-password">
                                <Button className="w-full bg-gray-900 hover:bg-gray-800">
                                    Request New Link
                                </Button>
                            </Link>
                            <Link to="/login">
                                <Button variant="ghost" className="w-full">
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 p-4">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-stone-100/40 rounded-full blur-3xl" />
                </div>

                <Card className="w-full max-w-md relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-indigo-500 to-gray-900" />

                    <CardHeader className="text-center pt-8 pb-6">
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center shadow-lg">
                                <Lock className="h-10 w-10 text-stone-700" strokeWidth={1.5} />
                            </div>
                        </div>
                        <CardTitle className="text-2xl font-light tracking-tight">
                            Create New Password
                        </CardTitle>
                        <CardDescription>
                            Enter your new password below to reset your account
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-8 pb-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* New Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="password">New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={errors.password ? "border-red-500" : ""}
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-500">{errors.password}</p>
                                )}

                                {/* Password Strength Indicator */}
                                {password && !errors.password && (
                                    <div className="mt-2 space-y-1">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-500">Password strength:</span>
                                            <span className={`font-medium ${getPasswordStrength().text === "Very Weak" ? "text-red-500" :
                                                getPasswordStrength().text === "Weak" ? "text-orange-500" :
                                                    getPasswordStrength().text === "Medium" ? "text-yellow-500" :
                                                        getPasswordStrength().text === "Strong" ? "text-blue-500" :
                                                            "text-green-500"
                                                }`}>
                                                {getPasswordStrength().text}
                                            </span>
                                        </div>
                                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-300 ${getPasswordStrength().color}`}
                                                style={{ width: getPasswordStrength().width }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <div className="relative">
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={errors.confirmPassword ? "border-red-500" : ""}
                                        disabled={isSubmitting}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-500">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {/* Password Requirements */}
                            {password && (
                                <div className="bg-gray-50 rounded-lg p-3 text-xs space-y-1">
                                    <p className="font-medium text-gray-700 mb-1">Password requirements:</p>
                                    <ul className="space-y-1 text-gray-600">
                                        <li className={`flex items-center gap-1 ${password.length >= 8 ? "text-green-600" : ""}`}>
                                            {password.length >= 8 ? "✓" : "○"} At least 8 characters
                                        </li>
                                        <li className={`flex items-center gap-1 ${/[A-Z]/.test(password) ? "text-green-600" : ""}`}>
                                            {/[A-Z]/.test(password) ? "✓" : "○"} At least one uppercase letter
                                        </li>
                                        <li className={`flex items-center gap-1 ${/[a-z]/.test(password) ? "text-green-600" : ""}`}>
                                            {/[a-z]/.test(password) ? "✓" : "○"} At least one lowercase letter
                                        </li>
                                        <li className={`flex items-center gap-1 ${/[0-9]/.test(password) ? "text-green-600" : ""}`}>
                                            {/[0-9]/.test(password) ? "✓" : "○"} At least one number
                                        </li>
                                        <li className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}`}>
                                            {/[^A-Za-z0-9]/.test(password) ? "✓" : "○"} At least one special character
                                        </li>
                                    </ul>
                                </div>
                            )}

                            <Button
                                type="submit"
                                className="w-full bg-gray-900 hover:bg-gray-800"
                                disabled={isSubmitting}
                                size="lg"
                            >
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                {isSubmitting ? "Resetting Password..." : "Reset Password"}
                            </Button>

                            <div className="text-center">
                                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1">
                                    <ArrowLeft className="h-3 w-3" />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            {/* Success Dialog */}
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                        </div>
                        <AlertDialogTitle className="text-2xl font-semibold">
                            Password Changed!
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-gray-600">
                            Your password has been successfully reset.
                            <br />
                            <span className="text-sm text-gray-500">
                                Redirecting to login in {countdown} seconds...
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-center">
                        <AlertDialogAction
                            onClick={handleGoToLogin}
                            className="bg-gray-900 hover:bg-gray-800 text-white"
                        >
                            Go to Login Page
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default ResetPassword;