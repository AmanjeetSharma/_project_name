// pages/Verify.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Mail, LogIn, ArrowRight, Shield, Clock, AlertCircle } from "lucide-react";

export default function Verify() {
    const { token } = useParams();
    const { verifyEmail } = useAuth();
    const navigate = useNavigate();

    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleVerify = async () => {
        if (!token) {
            setStatus("error");
            setErrorMessage("Invalid verification link");
            return;
        }

        setStatus("loading");

        try {
            const response = await verifyEmail(token);
            setStatus("success");
            setSuccessMessage(response?.message || "Your email has been verified successfully");
        } catch (error) {
            console.error("Verification failed:", error);
            setStatus("error");

            let errorMsg = "Verification failed. The link may be invalid or expired.";
            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }
            setErrorMessage(errorMsg);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-50 p-4">
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-100/30 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-stone-100/40 rounded-full blur-3xl" />
            </div>

            <Card className="w-full max-w-md relative overflow-hidden border-0 shadow-2xl shadow-black/5 bg-white/80 backdrop-blur-sm">
                {/* Premium accent line */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gray-900 via-stone-700 to-amber-500" />

                <CardHeader className="text-center pt-8 pb-6">
                    <div className="flex justify-center mb-6 relative">
                        <div className="absolute inset-0 blur-xl opacity-50">
                            {status === "idle" && <div className="w-20 h-20 rounded-full bg-amber-100" />}
                            {status === "loading" && <div className="w-20 h-20 rounded-full bg-stone-200 animate-pulse" />}
                            {status === "success" && <div className="w-20 h-20 rounded-full bg-emerald-100" />}
                            {status === "error" && <div className="w-20 h-20 rounded-full bg-red-100" />}
                        </div>
                        <div className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${status === "idle" ? "bg-gradient-to-br from-amber-100 to-stone-100 shadow-lg" :
                            status === "loading" ? "bg-gradient-to-br from-stone-200 to-stone-100 shadow-lg" :
                                status === "success" ? "bg-gradient-to-br from-emerald-100 to-emerald-50 shadow-lg shadow-emerald-100" :
                                    "bg-gradient-to-br from-red-100 to-red-50 shadow-lg shadow-red-100"
                            }`}>
                            {status === "idle" && (
                                <Mail className="h-10 w-10 text-stone-700" strokeWidth={1.5} />
                            )}
                            {status === "loading" && (
                                <Loader2 className="h-10 w-10 text-stone-600 animate-spin" strokeWidth={1.5} />
                            )}
                            {status === "success" && (
                                <CheckCircle2 className="h-10 w-10 text-emerald-600" strokeWidth={1.5} />
                            )}
                            {status === "error" && (
                                <XCircle className="h-10 w-10 text-red-600" strokeWidth={1.5} />
                            )}
                        </div>
                    </div>

                    <CardTitle className="text-3xl font-light tracking-tight text-stone-800">
                        {status === "idle" && "Verify Your Identity"}
                        {status === "loading" && "Processing"}
                        {status === "success" && "Welcome to CollegeFinder"}
                        {status === "error" && "Verification Issue"}
                    </CardTitle>

                    <CardDescription className="text-stone-500 text-sm mt-2 leading-relaxed">
                        {status === "idle" && "Complete your registration by verifying your email address"}
                        {status === "loading" && "Please wait while we confirm your credentials"}
                        {status === "success" && successMessage}
                        {status === "error" && errorMessage}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 px-8">
                    {status === "idle" && (
                        <div className="space-y-4">
                            <div className="bg-gradient-to-br from-stone-50 to-white rounded-xl p-5 border border-stone-200/60 shadow-sm">
                                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Shield className="h-3 w-3" />
                                    Verification Benefits
                                </p>
                                <div className="space-y-2">
                                    {[
                                        "Secure access to your dashboard",
                                        "Full platform features unlocked",
                                        "Priority support access"
                                    ].map((benefit, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-stone-600">
                                            <div className="w-1 h-1 rounded-full bg-amber-500" />
                                            <span>{benefit}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="space-y-3">
                            <div className="bg-gradient-to-br from-red-50 to-amber-50 rounded-xl p-5 border border-red-100 shadow-sm">
                                <p className="text-xs font-semibold text-red-600 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <AlertCircle className="h-3 w-3" />
                                    Common Issues
                                </p>
                                <ul className="space-y-2 text-sm text-stone-600">
                                    <li className="flex items-start gap-2">
                                        <Clock className="h-4 w-4 text-amber-500 mt-0.5" />
                                        <span>Link expired (valid for 24 hours)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                                        <span>Link already used or invalid</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <Shield className="h-4 w-4 text-amber-500 mt-0.5" />
                                        <span>Account may already be verified</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-5 border border-emerald-100 shadow-sm text-center">
                            <p className="text-sm font-medium text-emerald-800 mb-2">✓ Account Activated</p>
                            <p className="text-sm text-emerald-700">You now can login to your account</p>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="px-8 pb-8 pt-2">
                    {status === "idle" && (
                        <Button
                            onClick={handleVerify}
                            className="w-full bg-stone-800 hover:bg-stone-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group"
                            size="lg"
                        >
                            <span>Verify Email Address</span>
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    )}

                    {status === "loading" && (
                        <Button disabled className="w-full bg-stone-400 cursor-not-allowed" size="lg">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying Credentials...
                        </Button>
                    )}

                    {status === "success" && (
                        <div className="flex flex-col space-y-3 w-full">
                            <Link to="/login">
                                <Button className="w-full bg-stone-800 hover:bg-stone-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 group" size="lg">
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Sign In to Your Account
                                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="flex flex-col space-y-3 w-full">
                            <Button
                                onClick={handleVerify}
                                variant="outline"
                                className="w-full bg-gray-900 text-white transition-all cursor-pointer hover:border-gray-900 hover:text-gray-900 hover:bg-gray-100"
                                size="lg"
                            >
                                Try Again
                            </Button>
                            <Link to="/register">
                                <Button variant="ghost" className="w-full text-stone-600 hover:text-stone-800 hover:bg-stone-50 cursor-pointer">
                                    Create New Account
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardFooter>

                {/* Subtle texture overlay */}
            </Card>
        </div>
    );
}