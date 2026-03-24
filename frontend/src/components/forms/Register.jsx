// pages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [passwordStrength, setPasswordStrength] = useState({
        score: 0,
        message: ""
    });
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
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;

        if (score <= 2) message = "Weak password";
        else if (score <= 4) message = "Medium password";
        else message = "Strong password";

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

        // Check confirm password match in real-time
        if (name === "confirmPassword" || (name === "password" && formData.confirmPassword)) {
            const confirmValue = name === "confirmPassword" ? value : formData.confirmPassword;
            const passwordValue = name === "password" ? value : formData.password;
            
            if (confirmValue && passwordValue !== confirmValue) {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: "Passwords do not match"
                }));
            } else {
                setErrors(prev => ({
                    ...prev,
                    confirmPassword: ""
                }));
            }
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

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one uppercase letter";
        } else if (!/[0-9]/.test(formData.password)) {
            newErrors.password = "Password must contain at least one number";
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
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
        
        setLoading(true);
        try {
            // Only send name, email, password to backend
            const registerData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                password: formData.password
            };
            
            await register(registerData);
            // After successful registration, redirect to login
            navigate("/login");
        } catch (error) {
            // Error already handled in register function
            console.error("Registration failed");
        } finally {
            setLoading(false);
        }
    };

    // Get password strength color
    const getPasswordStrengthColor = () => {
        if (passwordStrength.score <= 2) return "bg-red-500";
        if (passwordStrength.score <= 4) return "bg-yellow-500";
        return "bg-green-500";
    };

    // Get password strength width
    const getPasswordStrengthWidth = () => {
        if (!formData.password) return "0%";
        const percentage = (passwordStrength.score / 5) * 100;
        return `${percentage}%`;
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <Card className="w-full max-w-md shadow-xl">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl text-center">Create an Account</CardTitle>
                    <CardDescription className="text-center">
                        Enter your details to create your account
                    </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {/* Name Field */}
                        <div className="space-y-2">
                            <Label htmlFor="name">
                                Full Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                                className={errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}
                                disabled={loading}
                                autoComplete="name"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email">
                                Email Address <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                                disabled={loading}
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password">
                                Password <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={errors.password ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
                                    disabled={loading}
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            
                            {/* Password Requirements */}
                            {formData.password && (
                                <div className="space-y-2 mt-2">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-muted-foreground">Password strength:</span>
                                        <span className={`font-medium ${
                                            passwordStrength.score <= 2 ? "text-red-500" :
                                            passwordStrength.score <= 4 ? "text-yellow-500" :
                                            "text-green-500"
                                        }`}>
                                            {passwordStrength.message}
                                        </span>
                                    </div>
                                    <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                            style={{ width: getPasswordStrengthWidth() }}
                                        />
                                    </div>
                                    <ul className="text-xs space-y-1 mt-2">
                                        <li className={`flex items-center gap-1 ${formData.password.length >= 6 ? "text-green-500" : "text-gray-400"}`}>
                                            {formData.password.length >= 6 ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                            <span>At least 6 characters</span>
                                        </li>
                                        <li className={`flex items-center gap-1 ${/[A-Z]/.test(formData.password) ? "text-green-500" : "text-gray-400"}`}>
                                            {/[A-Z]/.test(formData.password) ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                            <span>At least one uppercase letter</span>
                                        </li>
                                        <li className={`flex items-center gap-1 ${/[0-9]/.test(formData.password) ? "text-green-500" : "text-gray-400"}`}>
                                            {/[0-9]/.test(formData.password) ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                            <span>At least one number</span>
                                        </li>
                                    </ul>
                                </div>
                            )}
                            {errors.password && (
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="confirmPassword">
                                Confirm Password <span className="text-red-500">*</span>
                            </Label>
                            <div className="relative">
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={errors.confirmPassword ? "border-red-500 focus-visible:ring-red-500 pr-10" : "pr-10"}
                                    disabled={loading}
                                    autoComplete="new-password"
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
                                <p className="text-sm text-red-500 flex items-center gap-1">
                                    <XCircle className="h-3 w-3" />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Password Match Success Indicator */}
                        {formData.confirmPassword && !errors.confirmPassword && formData.password === formData.confirmPassword && (
                            <Alert className="bg-green-50 border-green-200">
                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                <AlertDescription className="text-green-700 text-sm">
                                    Passwords match!
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Info Alert */}
                        <Alert className="bg-blue-50 border-blue-200">
                            <AlertDescription className="text-blue-700 text-xs">
                                By creating an account, you agree to our Terms of Service and Privacy Policy.
                                A verification link will be sent to your email address.
                            </AlertDescription>
                        </Alert>
                    </CardContent>

                    <CardFooter className="flex flex-col space-y-4">
                        <Button 
                            type="submit" 
                            className="w-full" 
                            disabled={loading}
                            size="lg"
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? "Creating account..." : "Create Account"}
                        </Button>
                        
                        <div className="text-center text-sm">
                            <span className="text-muted-foreground">Already have an account? </span>
                            <Link to="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}