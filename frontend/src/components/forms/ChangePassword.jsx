// pages/ChangePasswordPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { usePassword } from "../../context/PasswordContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Loader2,
    Eye,
    EyeOff,
    Lock,
    CheckCircle2,
    LogOut,
    ArrowLeft,
    Shield,
    KeyRound
} from "lucide-react";

const ChangePasswordPage = () => {
    const { clearSession } = useAuth();
    const { changePassword, loading: passwordLoading } = usePassword();
    const navigate = useNavigate();

    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: ""
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordErrors, setPasswordErrors] = useState({});
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [logoutCountdown, setLogoutCountdown] = useState(5);

    // Password validation with strict requirements
    const validatePasswordForm = () => {
        const errors = {};

        if (!passwordForm.currentPassword) {
            errors.currentPassword = "Current password is required";
        }

        if (!passwordForm.newPassword) {
            errors.newPassword = "New password is required";
        } else {
            const hasMinLength = passwordForm.newPassword.length >= 8;
            const hasUpperCase = /[A-Z]/.test(passwordForm.newPassword);
            const hasLowerCase = /[a-z]/.test(passwordForm.newPassword);
            const hasNumber = /[0-9]/.test(passwordForm.newPassword);
            const hasSpecialChar = /[^A-Za-z0-9]/.test(passwordForm.newPassword);

            if (!hasMinLength) {
                errors.newPassword = "Password must be at least 8 characters";
            } else if (!hasUpperCase) {
                errors.newPassword = "Password must contain at least one uppercase letter";
            } else if (!hasLowerCase) {
                errors.newPassword = "Password must contain at least one lowercase letter";
            } else if (!hasNumber) {
                errors.newPassword = "Password must contain at least one number";
            } else if (!hasSpecialChar) {
                errors.newPassword = "Password must contain at least one special character";
            }
        }

        if (!passwordForm.confirmNewPassword) {
            errors.confirmNewPassword = "Please confirm your new password";
        } else if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            errors.confirmNewPassword = "Passwords do not match";
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) {
            return;
        }

        setIsChangingPassword(true);

        try {
            await changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
                confirmNewPassword: passwordForm.confirmNewPassword
            });

            // Reset form
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: ""
            });
            setPasswordErrors({});

            // Show success dialog
            setShowSuccessDialog(true);
            setLogoutCountdown(5);

        } catch (error) {
            // Error handled in context
            setIsChangingPassword(false);
        }
    };

    // Handle countdown and redirect after successful password change
    useEffect(() => {
        let timer;
        let redirectTimeout;

        if (showSuccessDialog) {
            timer = setInterval(() => {
                setLogoutCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            redirectTimeout = setTimeout(() => {
                clearSession();
                navigate("/login");
            }, 5500);
        }

        return () => {
            if (timer) clearInterval(timer);
            if (redirectTimeout) clearTimeout(redirectTimeout);
        };
    }, [showSuccessDialog, clearSession, navigate]);

    const handleBack = () => {
        navigate(-1);
    };

    // Calculate password strength with updated criteria
    const getPasswordStrength = () => {
        const { newPassword } = passwordForm;
        if (!newPassword) return 0;

        let strength = 0;

        // Check all requirements
        const hasMinLength = newPassword.length >= 8;
        const hasUpperCase = /[A-Z]/.test(newPassword);
        const hasLowerCase = /[a-z]/.test(newPassword);
        const hasNumber = /[0-9]/.test(newPassword);
        const hasSpecialChar = /[^A-Za-z0-9]/.test(newPassword);

        // All mandatory requirements must be met
        const allRequirementsMet = hasMinLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

        if (allRequirementsMet) {
            strength = 3; // Base strength for meeting all requirements

            // Extra points for longer passwords
            if (newPassword.length >= 12) {
                strength = 4; // Strong password
            }
        } else {
            // Partial strength based on how many requirements are met
            if (hasMinLength) strength++;
            if (hasUpperCase) strength++;
            if (hasLowerCase) strength++;
            if (hasNumber) strength++;
            if (hasSpecialChar) strength++;
        }

        return strength;
    };

    const getStrengthColor = (strength) => {
        if (strength === 1) return "bg-red-500";
        if (strength === 2) return "bg-orange-500";
        if (strength === 3) return "bg-yellow-500";
        if (strength === 4) return "bg-green-500";
        return "bg-gray-200";
    };

    const getStrengthText = (strength) => {
        if (strength === 1) return "Weak";
        if (strength === 2) return "Fair";
        if (strength === 3) return "Good";
        if (strength === 4) return "Strong";
        return "Very Weak";
    };

    // Check if all mandatory requirements are met
    const areAllRequirementsMet = () => {
        const { newPassword } = passwordForm;
        if (!newPassword) return false;

        return newPassword.length >= 8 &&
            /[A-Z]/.test(newPassword) &&
            /[a-z]/.test(newPassword) &&
            /[0-9]/.test(newPassword) &&
            /[^A-Za-z0-9]/.test(newPassword);
    };

    // Get requirement status
    const getRequirementStatus = () => {
        const { newPassword } = passwordForm;
        return {
            minLength: newPassword && newPassword.length >= 8,
            upperCase: newPassword && /[A-Z]/.test(newPassword),
            lowerCase: newPassword && /[a-z]/.test(newPassword),
            number: newPassword && /[0-9]/.test(newPassword),
            specialChar: newPassword && /[^A-Za-z0-9]/.test(newPassword),
            minLength12: newPassword && newPassword.length >= 12
        };
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-4 pt-16 bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-stone-100/40 rounded-full blur-3xl" />
            </div>

            <div className="w-full max-w-md flex-1 flex items-center">
                <Card className="border shadow-2xl shadow-black/5 w-full relative overflow-hidden backdrop-blur-sm bg-white/95">
                    {/* Premium accent line */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-stone-600 to-amber-500" />

                    <CardHeader className="text-center space-y-2 pt-8 pb-4">
                        <CardTitle className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                            Change Password
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Secure your account with a strong password
                        </CardDescription>
                    </CardHeader>

                    <form onSubmit={handleChangePassword}>
                        <CardContent className="space-y-5 px-6 pb-2">
                            {/* Current Password */}
                            <div className="space-y-2">
                                <Label htmlFor="currentPassword" className="text-stone-700">
                                    Current Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <Input
                                        id="currentPassword"
                                        type={showCurrentPassword ? "text" : "password"}
                                        placeholder="Enter current password"
                                        value={passwordForm.currentPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                        className={`pl-9 pr-9 border-stone-200 focus:border-stone-400 transition-all ${passwordErrors.currentPassword ? "border-red-500" : ""}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordErrors.currentPassword && (
                                    <p className="text-xs text-red-500">{passwordErrors.currentPassword}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <Label htmlFor="newPassword" className="text-stone-700">
                                    New Password
                                </Label>
                                <div className="relative">
                                    <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <Input
                                        id="newPassword"
                                        type={showNewPassword ? "text" : "password"}
                                        placeholder="Enter new password"
                                        value={passwordForm.newPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                        className={`pl-9 pr-9 border-stone-200 focus:border-stone-400 transition-all ${passwordErrors.newPassword ? "border-red-500" : ""}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordErrors.newPassword && (
                                    <p className="text-xs text-red-500">{passwordErrors.newPassword}</p>
                                )}

                                {/* Password Requirements */}
                                {passwordForm.newPassword && (
                                    <div className="mt-2 space-y-1">
                                        <p className="text-xs font-medium text-stone-600 mb-1">Password must contain:</p>
                                        {(() => {
                                            const reqs = getRequirementStatus();
                                            return (
                                                <div className="space-y-1 text-xs">
                                                    <div className={`flex items-center gap-2 ${reqs.minLength ? "text-green-600" : "text-stone-500"}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${reqs.minLength ? "bg-green-500" : "bg-stone-300"}`} />
                                                        <span>At least 8 characters</span>
                                                    </div>
                                                    <div className={`flex items-center gap-2 ${reqs.upperCase ? "text-green-600" : "text-stone-500"}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${reqs.upperCase ? "bg-green-500" : "bg-stone-300"}`} />
                                                        <span>One uppercase letter</span>
                                                    </div>
                                                    <div className={`flex items-center gap-2 ${reqs.lowerCase ? "text-green-600" : "text-stone-500"}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${reqs.lowerCase ? "bg-green-500" : "bg-stone-300"}`} />
                                                        <span>One lowercase letter</span>
                                                    </div>
                                                    <div className={`flex items-center gap-2 ${reqs.number ? "text-green-600" : "text-stone-500"}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${reqs.number ? "bg-green-500" : "bg-stone-300"}`} />
                                                        <span>One number</span>
                                                    </div>
                                                    <div className={`flex items-center gap-2 ${reqs.specialChar ? "text-green-600" : "text-stone-500"}`}>
                                                        <div className={`w-1.5 h-1.5 rounded-full ${reqs.specialChar ? "bg-green-500" : "bg-stone-300"}`} />
                                                        <span>One special character (!@#$%^&* etc.)</span>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                )}

                                {/* Password Strength Indicator */}
                                {passwordForm.newPassword && (
                                    <div className="mt-3">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="text-xs text-stone-500">Password strength:</div>
                                            <div className={`text-xs font-medium ${getPasswordStrength() === 4 ? "text-green-600" :
                                                getPasswordStrength() === 3 ? "text-yellow-600" :
                                                    "text-red-600"
                                                }`}>
                                                {getStrengthText(getPasswordStrength())}
                                            </div>
                                        </div>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4].map((level) => (
                                                <div
                                                    key={level}
                                                    className={`h-1 flex-1 rounded-full transition-all ${level <= getPasswordStrength()
                                                        ? getStrengthColor(getPasswordStrength())
                                                        : "bg-gray-200"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        {areAllRequirementsMet() && passwordForm.newPassword.length >= 12 && (
                                            <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3" />
                                                Strong password! Good security
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Confirm New Password */}
                            <div className="space-y-2">
                                <Label htmlFor="confirmNewPassword" className="text-stone-700">
                                    Confirm New Password
                                </Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                    <Input
                                        id="confirmNewPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm new password"
                                        value={passwordForm.confirmNewPassword}
                                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })}
                                        className={`pl-9 pr-9 border-stone-200 focus:border-stone-400 transition-all ${passwordErrors.confirmNewPassword ? "border-red-500" : ""}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordErrors.confirmNewPassword && (
                                    <p className="text-xs text-red-500">{passwordErrors.confirmNewPassword}</p>
                                )}
                                {passwordForm.confirmNewPassword && passwordForm.newPassword === passwordForm.confirmNewPassword && passwordForm.newPassword && (
                                    <p className="text-xs text-green-600 flex items-center gap-1">
                                        <CheckCircle2 className="h-3 w-3" />
                                        Passwords match
                                    </p>
                                )}
                            </div>

                            {/* Security note */}
                            <div className="bg-gradient-to-br from-stone-50 to-white rounded-lg p-3 border border-stone-200/60">
                                <div className="flex items-center gap-2 text-xs text-stone-500">
                                    <Shield className="h-3 w-3" />
                                    <span>Use a strong, unique password to keep your account secure</span>
                                </div>
                            </div>
                        </CardContent>

                        <div className="px-6 pb-8 pt-4">
                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="flex-1 border-stone-200 hover:bg-stone-50"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={passwordLoading || isChangingPassword}
                                    className="flex-1 bg-stone-800 hover:bg-stone-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                                >
                                    {(passwordLoading || isChangingPassword) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Change Password
                                </Button>
                            </div>

                            <div className="text-center text-sm mt-6">
                                <Link to="/profile" className="text-stone-600 hover:text-stone-800 transition-colors">
                                    ← Back to Profile
                                </Link>
                            </div>
                        </div>
                    </form>
                </Card>
            </div>

            {/* Premium Footer */}
            <footer className="w-full py-6 text-center border-t mt-8 bg-white/50 backdrop-blur-sm">
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

            {/* Success Alert Dialog */}
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent className="sm:max-w-md text-center flex flex-col items-center">
                    <AlertDialogHeader className="items-center text-center">
                        <div className="flex items-center justify-center mb-2">
                            <CheckCircle2 className="h-12 w-12 text-green-500" />
                        </div>
                        <AlertDialogTitle className="text-xl font-semibold">
                            Password Changed Successfully!
                        </AlertDialogTitle>
                        <AlertDialogDescription className="space-y-2 w-full">
                            <div>Your password has been updated successfully.</div>
                            <div className="flex items-center justify-center gap-2 text-sm font-medium text-stone-700">
                                <LogOut className="h-4 w-4" />
                                Logging out in {logoutCountdown} seconds...
                            </div>
                            <div className="text-xs text-stone-500">
                                You'll need to log in again with your new password.
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default ChangePasswordPage;