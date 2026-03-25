// ForgotPassword.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePassword } from "../../context/PasswordContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
    Loader2,
    Mail,
    ArrowLeft,
    CheckCircle2,
    Shield,
    Sparkles
} from "lucide-react";

export default function ForgotPassword() {
    const [resetEmail, setResetEmail] = useState("");
    const [sent, setSent] = useState(false);
    const [error, setError] = useState("");

    const { forgotPassword, loading: passwordLoading } = usePassword();
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        setError("");

        if (!resetEmail) {
            setError("Enter your email");
            return;
        }

        try {
            await forgotPassword(resetEmail);
            setSent(true);
        } catch (err) {
            // Error already handled in context with toast
            setError("Failed to send reset link");
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
                            Forgot Password
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            We'll send you a reset link to your email
                        </CardDescription>
                    </CardHeader>

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
                                    <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-stone-100 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-amber-100">
                                        <CheckCircle2 className="h-8 w-8 text-amber-600" strokeWidth={1.5} />
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
                                                    Check your inbox and spam folder. The link will expire in 10 minutes.
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
                                                name="reset-email"
                                                autoComplete="email"
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
                                    className="w-full bg-stone-800 hover:bg-stone-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 mb-3 cursor-pointer"
                                    disabled={passwordLoading}
                                    size="lg"
                                >
                                    {passwordLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Send Reset Link
                                </Button>
                            )}

                            <Button
                                type="button"
                                variant="ghost"
                                onClick={() => navigate("/login")}
                                className="w-full text-stone-600 hover:text-stone-800 hover:bg-stone-100 transition-all cursor-pointer"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Sign In
                            </Button>
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
        </div>
    );
}