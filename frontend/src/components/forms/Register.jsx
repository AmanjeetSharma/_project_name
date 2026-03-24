import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Loader2,
    Eye,
    EyeOff,
    CheckCircle2,
    XCircle,
    Mail,
    Clock,
    Shield,
    ArrowRight,
    Sparkles
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: ""
    });
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [registeredEmail, setRegisteredEmail] = useState("");
    const { register } = useAuth();
    const navigate = useNavigate();

    // Password strength checker
    const checkPasswordStrength = (password) => {
        let score = 0;
        let message = "";

        if (!password) {
            return { score: 0, message: "" };
        }

        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) message = "Very Weak";
        else if (score <= 3) message = "Weak";
        else if (score <= 4) message = "Medium";
        else if (score <= 5) message = "Strong";
        else message = "Very Strong";

        return { score, message };
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ""
            }));
        }

        // Check password strength
        if (name === "password") {
            setPasswordStrength(checkPasswordStrength(value));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        } else if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        } else if (formData.name.length > 50) {
            newErrors.name = "Name must be less than 50 characters";
        }

        // Email validation
        const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation - Updated requirements
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/[a-z]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one lowercase letter";
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one number";
        } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one special character (e.g., !@#$%^&*)";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        try {
            // Only send name, email, password to backend
            const registerData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            };

            await register(registerData);
            // Store the email for the dialog
            setRegisteredEmail(formData.email.trim().toLowerCase());
            // Show success dialog instead of redirecting
            setShowSuccessDialog(true);
        } catch (error) {
            // Error already handled in register function
            console.error("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    const handleDialogClose = () => {
        setShowSuccessDialog(false);
        navigate("/login");
    };

    // Get password strength color
    const getPasswordStrengthColor = () => {
        if (passwordStrength.score <= 2) return "bg-red-500";
        if (passwordStrength.score <= 3) return "bg-orange-500";
        if (passwordStrength.score <= 4) return "bg-yellow-500";
        if (passwordStrength.score <= 5) return "bg-blue-500";
        return "bg-green-500";
    };

    // Get password strength width
    const getPasswordStrengthWidth = () => {
        if (!formData.password) return "0%";
        const percentage = (passwordStrength.score / 6) * 100;
        return `${percentage}%`;
    };

    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-between p-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
                <div className="w-full max-w-md flex-1 flex items-center">
                    <Card className="border shadow-2xl shadow-black/5 w-full relative overflow-hidden">
                        {/* Premium accent line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-stone-600 to-amber-500" />

                        <CardHeader className="text-center space-y-2 pt-8 pb-4">
                            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-stone-800 to-stone-600 bg-clip-text text-transparent">
                                Create an Account
                            </CardTitle>
                            <CardDescription className="text-muted-foreground">
                                Join Schaden and experience premium service
                            </CardDescription>
                        </CardHeader>

                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-5 px-6 pb-2">
                                {/* Name Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-stone-700">
                                        Full Name <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`${errors.name ? "border-destructive focus-visible:ring-destructive" : "border-stone-200 focus:border-stone-400"} transition-all`}
                                        disabled={loading}
                                        autoComplete="name"
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <XCircle className="h-3 w-3" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-stone-700">
                                        Email Address <span className="text-destructive">*</span>
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`${errors.email ? "border-destructive focus-visible:ring-destructive" : "border-stone-200 focus:border-stone-400"} transition-all`}
                                        disabled={loading}
                                        autoComplete="email"
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <XCircle className="h-3 w-3" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-stone-700">
                                        Password <span className="text-destructive">*</span>
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter your password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            className={`${errors.password ? "border-destructive focus-visible:ring-destructive pr-10" : "border-stone-200 focus:border-stone-400 pr-10"} transition-all`}
                                            disabled={loading}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>

                                    {/* Password Requirements */}
                                    {formData.password && (
                                        <div className="space-y-2 mt-2">
                                            <div className="flex justify-between items-center text-xs">
                                                <span className="text-muted-foreground">Password strength:</span>
                                                <span className={`font-medium ${passwordStrength.score <= 2 ? "text-red-500" :
                                                    passwordStrength.score <= 3 ? "text-orange-500" :
                                                        passwordStrength.score <= 4 ? "text-yellow-500" :
                                                            passwordStrength.score <= 5 ? "text-blue-500" :
                                                                "text-green-500"
                                                    }`}>
                                                    {passwordStrength.message}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                    style={{ width: getPasswordStrengthWidth() }}
                                                />
                                            </div>
                                            <ul className="text-xs space-y-1 mt-2">
                                                <li className={`flex items-center gap-1 ${formData.password.length >= 8 ? "text-green-500" : "text-muted-foreground"}`}>
                                                    {formData.password.length >= 8 ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    <span>At least 8 characters</span>
                                                </li>
                                                <li className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}`}>
                                                    {/[A-Z]/.test(formData.password) ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    <span>At least one uppercase letter</span>
                                                </li>
                                                <li className={`flex items-center gap-1 ${/[a-z]/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}`}>
                                                    {/[a-z]/.test(formData.password) ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    <span>At least one lowercase letter</span>
                                                </li>
                                                <li className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}`}>
                                                    {/[0-9]/.test(formData.password) ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    <span>At least one number</span>
                                                </li>
                                                <li className={`flex items-center gap-1 ${/[^A-Za-z0-9]/.test(formData.password) ? "text-green-500" : "text-muted-foreground"}`}>
                                                    {/[^A-Za-z0-9]/.test(formData.password) ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    <span>At least one special character (e.g., !@#$%^&*)</span>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                    {errors.password && (
                                        <p className="text-sm text-destructive flex items-center gap-1">
                                            <XCircle className="h-3 w-3" />
                                            {errors.password}
                                        </p>
                                    )}
                                </div>
                            </CardContent>

                            <div className="px-6 pb-8 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-stone-800 hover:bg-stone-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                                    disabled={loading}
                                    size="lg"
                                >
                                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    {loading ? "Creating account..." : "Create Account"}
                                    {!loading && <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                                </Button>

                                <div className="text-center text-sm mt-6">
                                    <span className="text-muted-foreground">Already have an account? </span>
                                    <Link to="/login" className="text-stone-800 font-semibold hover:text-stone-600 hover:underline transition-colors">
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </form>

                    </Card>
                </div>

                {/* Footer */}
                <footer className="w-full py-6 text-center border-t mt-8">
                    <div className="container mx-auto px-4">
                        <p className="text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} Schaden. All rights reserved.
                        </p>
                        <div className="flex justify-center gap-4 mt-2">
                            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                Terms of Service
                            </Link>
                            <span className="text-muted-foreground text-xs">•</span>
                            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                Privacy Policy
                            </Link>
                            <span className="text-muted-foreground text-xs">•</span>
                            <Link to="/contact" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                Contact Us
                            </Link>
                        </div>
                    </div>
                </footer>
            </div>

            {/* Success Dialog */}
            <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
                <AlertDialogContent className="max-w-md p-0 overflow-hidden">
                    {/* Premium header gradient */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-amber-500 to-gray-900" />

                    <div className="p-6">
                        <AlertDialogHeader className="text-center space-y-4">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center shadow-lg shadow-emerald-100">
                                    <Mail className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
                                </div>
                            </div>
                            <AlertDialogTitle className="text-2xl font-light tracking-tight">
                                Welcome to CollegeFinder!
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-base">
                                We've sent a verification email to{" "}
                                <span className="font-semibold text-stone-800">{registeredEmail}</span>
                            </AlertDialogDescription>
                        </AlertDialogHeader>

                        <div className="mt-6 space-y-4">
                            {/* Important info cards */}
                            <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-xl p-4 border border-amber-100">
                                <div className="flex items-start gap-3">
                                    <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
                                    <div className="flex-1">
                                        {/* <p className="text-sm font-medium text-stone-800 mb-1">Verification Link Expires in 10 Minutes</p> */}
                                        <p className="text-xs text-stone-600">Please verify your email within 10 mins to activate your account.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                                <div className="flex items-start gap-3">
                                    <Shield className="h-5 w-5 text-emerald-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-stone-800 mb-1">What's Next?</p>
                                        <ul className="text-xs text-stone-600 space-y-1">
                                            <li className="flex items-center gap-2">
                                                Check your inbox (and spam folder) for the verification email
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                                <div className="flex items-start gap-3">
                                    <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-stone-800 mb-1">Pro Tip</p>
                                        <p className="text-xs text-stone-600">- Never share your verification link with anyone</p>
                                        <p className="text-xs text-stone-600">- Use a password manager to store your credentials safely</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AlertDialogFooter className="mt-6">
                            <AlertDialogAction
                                onClick={handleDialogClose}
                                className="w-full bg-stone-800 hover:bg-stone-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                Continue to Login
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </div>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}