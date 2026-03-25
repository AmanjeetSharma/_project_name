// pages/ResetPassword.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { usePassword } from "../../context/PasswordContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Eye, EyeOff, Lock, CheckCircle2, AlertCircle, ArrowLeft, Shield, Sparkles } from "lucide-react";
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

    // If token is missing, show error with consistent layout
    if (!token) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-between p-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-stone-100/40 rounded-full blur-3xl" />
                </div>

                <div className="w-full max-w-md flex-1 flex items-center py-8">
                    <Card className="border shadow-2xl shadow-black/5 w-full relative overflow-hidden backdrop-blur-sm bg-white/95">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-stone-600 to-red-500" />
                        <CardHeader className="text-center space-y-2 pt-8 pb-4">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center shadow-lg shadow-red-100">
                                    <AlertCircle className="h-10 w-10 text-red-600" strokeWidth={1.5} />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                Missing Token!
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                No reset token was provided in the URL
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="px-6 pb-8">
                            <div className="space-y-3">
                                <Link to="/forgot-password">
                                    <Button className="w-full bg-stone-800 hover:bg-stone-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                                        Request New Link
                                    </Button>
                                </Link>
                                <Link to="/login">
                                    <Button variant="ghost" className="w-full text-stone-600 hover:text-stone-800 hover:bg-stone-50 transition-all">
                                        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign In
                                    </Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <footer className="w-full py-6 text-center border-t bg-white/50 backdrop-blur-sm">
                    <div className="container mx-auto px-4">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} CollegeFinder. All rights reserved.
                        </p>
                        <div className="flex justify-center gap-4 mt-2">
                            <Link to="/terms" className="text-xs text-muted-foreground hover:text-stone-800 transition-colors">
                                Terms of Service
                            </Link>
                            <span className="text-muted-foreground text-xs">•</span>
                            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-stone-800 transition-colors">
                                Privacy Policy
                            </Link>
                            <span className="text-muted-foreground text-xs">•</span>
                            <Link to="/contact" className="text-xs text-muted-foreground hover:text-stone-800 transition-colors">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-between p-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl" />
                    <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-stone-100/40 rounded-full blur-3xl" />
                </div>

                <div className="w-full max-w-md flex-1 flex items-center py-8">
                    <Card className="border shadow-2xl shadow-black/5 w-full relative overflow-hidden backdrop-blur-sm bg-white/95">
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-stone-600 to-amber-500" />

                        <CardHeader className="text-center space-y-2 pt-8 pb-4">
                            <div className="flex justify-center mb-6">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center shadow-lg shadow-indigo-100">
                                    <Lock className="h-10 w-10 text-stone-700" strokeWidth={1.5} />
                                </div>
                            </div>
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                Create New Password
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Enter your new password below to reset your account
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="px-6 pb-8">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* New Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-stone-700">New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter new password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className={`pl-9 pr-9 border-stone-200 focus:border-stone-400 transition-all ${errors.password ? "border-red-500" : ""}`}
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
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
                                                <span className="text-stone-500">Password strength:</span>
                                                <span className={`font-medium ${
                                                    getPasswordStrength().text === "Very Weak" ? "text-red-500" :
                                                    getPasswordStrength().text === "Weak" ? "text-orange-500" :
                                                    getPasswordStrength().text === "Medium" ? "text-yellow-500" :
                                                    getPasswordStrength().text === "Strong" ? "text-blue-500" :
                                                    "text-green-500"
                                                }`}>
                                                    {getPasswordStrength().text}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
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
                                    <Label htmlFor="confirmPassword" className="text-stone-700">Confirm New Password</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                        <Input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm new password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`pl-9 pr-9 border-stone-200 focus:border-stone-400 transition-all ${errors.confirmPassword ? "border-red-500" : ""}`}
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
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
                                    <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-lg p-3 border border-amber-200">
                                        <p className="font-medium text-stone-700 mb-2 text-sm">Password requirements:</p>
                                        <ul className="space-y-1 text-xs text-stone-600">
                                            <li className={`flex items-center gap-2 ${password.length >= 8 ? "text-green-600" : ""}`}>
                                                {password.length >= 8 ? "✓" : "○"} At least 8 characters
                                            </li>
                                            <li className={`flex items-center gap-2 ${/[A-Z]/.test(password) ? "text-green-600" : ""}`}>
                                                {/[A-Z]/.test(password) ? "✓" : "○"} At least one uppercase letter
                                            </li>
                                            <li className={`flex items-center gap-2 ${/[a-z]/.test(password) ? "text-green-600" : ""}`}>
                                                {/[a-z]/.test(password) ? "✓" : "○"} At least one lowercase letter
                                            </li>
                                            <li className={`flex items-center gap-2 ${/[0-9]/.test(password) ? "text-green-600" : ""}`}>
                                                {/[0-9]/.test(password) ? "✓" : "○"} At least one number
                                            </li>
                                            <li className={`flex items-center gap-2 ${/[^A-Za-z0-9]/.test(password) ? "text-green-600" : ""}`}>
                                                {/[^A-Za-z0-9]/.test(password) ? "✓" : "○"} At least one special character
                                            </li>
                                        </ul>
                                    </div>
                                )}

                                {/* Security note */}
                                <div className="bg-gradient-to-br from-stone-50 to-white rounded-lg p-3 border border-stone-200/60">
                                    <div className="flex items-center gap-2 text-xs text-stone-500">
                                        <Shield className="h-3 w-3" />
                                        <span>Your new password will be encrypted and secured</span>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full bg-stone-800 hover:bg-stone-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                                    disabled={isSubmitting}
                                    size="lg"
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {isSubmitting ? "Resetting Password..." : "Reset Password"}
                                </Button>

                                <div className="text-center">
                                    <Link to="/login" className="text-sm text-stone-600 hover:text-stone-800 inline-flex items-center gap-1 transition-colors">
                                        <ArrowLeft className="h-3 w-3" />
                                        Back to Sign In
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>

                <footer className="w-full py-6 text-center border-t bg-white/50 backdrop-blur-sm">
                    <div className="container mx-auto px-4">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} CollegeFinder. All rights reserved.
                        </p>
                        <div className="flex justify-center gap-4 mt-2">
                            <Link to="/terms" className="text-xs text-muted-foreground hover:text-stone-800 transition-colors">
                                Terms of Service
                            </Link>
                            <span className="text-muted-foreground text-xs">•</span>
                            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-stone-800 transition-colors">
                                Privacy Policy
                            </Link>
                            <span className="text-muted-foreground text-xs">•</span>
                            <Link to="/contact" className="text-xs text-muted-foreground hover:text-stone-800 transition-colors">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Success Dialog */}
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent className="max-w-md">
                    <AlertDialogHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-lg shadow-emerald-100">
                                <CheckCircle2 className="h-8 w-8 text-emerald-600" strokeWidth={1.5} />
                            </div>
                        </div>
                        <AlertDialogTitle className="text-2xl font-semibold text-stone-800">
                            Password Reset Successful!
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-stone-600">
                            Your password has been successfully reset.
                            <br />
                            <span className="text-sm text-stone-500">
                                Redirecting to login in {countdown} seconds...
                            </span>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex justify-center">
                        <AlertDialogAction
                            onClick={handleGoToLogin}
                            className="bg-stone-800 hover:bg-stone-700 text-white"
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