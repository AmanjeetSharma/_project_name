import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
    Loader2, 
    Mail, 
    Lock, 
    Eye, 
    EyeOff, 
    ArrowLeft,
    CheckCircle2,
    Shield,
    Sparkles
} from "lucide-react";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [forgot, setForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState("");
    const [sent, setSent] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);
        try {
            await login(email, password, "web");
            navigate("/dashboard");
        } catch (err) {
            setError(err.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");

        if (!resetEmail) {
            setError("Enter your email");
            return;
        }

        setLoading(true);
        try {
            await new Promise((r) => setTimeout(r, 800));
            setSent(true);
        } catch (e) {
            setError("Failed to send link");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-between p-4 bg-gradient-to-br from-slate-50 via-white to-slate-50">
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
                            {forgot ? "Reset Password" : "Welcome Back"}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            {forgot
                                ? "We'll send you a reset link to your email"
                                : "Sign in to access your premium account"}
                        </CardDescription>
                    </CardHeader>

                    {!forgot ? (
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-5 px-6 pb-2">
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 shadow-sm">
                                        <p className="text-sm text-red-600 text-center">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-stone-700">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="you@example.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-9 border-stone-200 focus:border-stone-400 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <Label htmlFor="password" className="text-stone-700">
                                            Password
                                        </Label>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setError("");
                                                setForgot(true);
                                            }}
                                            className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
                                        >
                                            Forgot password?
                                        </button>
                                    </div>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="pl-9 pr-9 border-stone-200 focus:border-stone-400 transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Security note */}
                                <div className="bg-gradient-to-br from-stone-50 to-white rounded-lg p-3 border border-stone-200/60">
                                    <div className="flex items-center gap-2 text-xs text-stone-500">
                                        <Shield className="h-3 w-3" />
                                        <span>Your data is encrypted and secure</span>
                                    </div>
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
                                    {loading ? "Signing in..." : "Sign In"}
                                </Button>

                                <div className="text-center text-sm mt-6">
                                    <span className="text-muted-foreground">Don't have an account? </span>
                                    <Link to="/register" className="text-stone-800 font-semibold hover:text-stone-600 hover:underline transition-colors">
                                        Create account
                                    </Link>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleReset}>
                            <CardContent className="space-y-5 px-6 pb-2">
                                {error && (
                                    <div className="p-3 rounded-lg bg-red-50 border border-red-200 shadow-sm">
                                        <p className="text-sm text-red-600 text-center">
                                            {error}
                                        </p>
                                    </div>
                                )}

                                {sent ? (
                                    <div className="text-center space-y-4 py-8">
                                        <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-100">
                                            <CheckCircle2 className="h-8 w-8 text-emerald-600" strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-stone-800 text-lg">Reset link sent!</p>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                We've sent a password reset link to
                                            </p>
                                            <p className="font-semibold mt-2 text-stone-800 bg-amber-50 inline-block px-3 py-1 rounded-md">
                                                {resetEmail}
                                            </p>
                                            <div className="mt-4 p-3 bg-gradient-to-br from-amber-50 to-stone-50 rounded-lg border border-amber-200">
                                                <div className="flex items-start gap-2">
                                                    <Sparkles className="h-4 w-4 text-amber-600 mt-0.5" />
                                                    <p className="text-xs text-stone-600 text-left">
                                                        Check your inbox and spam folder. The link expires in 10 minutes.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="space-y-2">
                                            <Label htmlFor="reset-email" className="text-stone-700">
                                                Email Address
                                            </Label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-stone-400" />
                                                <Input
                                                    id="reset-email"
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    value={resetEmail}
                                                    onChange={(e) => setResetEmail(e.target.value)}
                                                    className="pl-9 border-stone-200 focus:border-stone-400 transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="bg-gradient-to-br from-amber-50 to-stone-50 rounded-lg p-3 border border-amber-200">
                                            <div className="flex items-start gap-2">
                                                <Shield className="h-4 w-4 text-amber-600 mt-0.5" />
                                                <p className="text-xs text-stone-600">
                                                    Enter your registered email address and we'll send you a link to reset your password.
                                                </p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </CardContent>

                            <div className="px-6 pb-8 pt-4">
                                {!sent && (
                                    <Button
                                        type="submit"
                                        className="w-full bg-stone-800 hover:bg-stone-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 mb-3"
                                        disabled={loading}
                                        size="lg"
                                    >
                                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Send Reset Link
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => {
                                        setError("");
                                        setForgot(false);
                                        setSent(false);
                                        setResetEmail("");
                                    }}
                                    className="w-full text-stone-600 hover:text-stone-800 hover:bg-stone-50 transition-all"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign In
                                </Button>
                            </div>
                        </form>
                    )}
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
        </div>
    );
}