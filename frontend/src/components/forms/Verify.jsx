// pages/Verify.jsx
import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Mail } from "lucide-react";
import { isMobile, isBrowser, isTablet, browserName, osName } from "react-device-detect";

export default function Verify() {
    const { token } = useParams();
    const { verifyEmail } = useAuth();
    const navigate = useNavigate();
    
    const [status, setStatus] = useState("idle"); // idle, loading, success, error
    const [errorMessage, setErrorMessage] = useState("");
    const [countdown, setCountdown] = useState(3);

    // Get device info
    const getDeviceInfo = () => {
        let deviceType = "web";
        let deviceName = browserName || "Unknown Browser";
        
        if (isMobile) {
            deviceType = "mobile";
            deviceName = osName || "Mobile Device";
        } else if (isTablet) {
            deviceType = "tablet";
            deviceName = osName || "Tablet Device";
        } else if (isBrowser) {
            deviceType = "web";
            deviceName = browserName || "Desktop Browser";
        }
        
        return {
            device: deviceType,
            deviceName: deviceName,
            userAgent: navigator.userAgent
        };
    };

    const handleVerify = async () => {
        if (!token) {
            setStatus("error");
            setErrorMessage("Invalid verification link");
            return;
        }

        setStatus("loading");
        
        try {
            const deviceInfo = getDeviceInfo();
            console.log("Verifying with device:", deviceInfo.device);
            
            await verifyEmail(token, deviceInfo.device);
            setStatus("success");
            
            // Start countdown to redirect
            let counter = 3;
            const interval = setInterval(() => {
                counter--;
                setCountdown(counter);
                if (counter <= 0) {
                    clearInterval(interval);
                    navigate("/dashboard");
                }
            }, 1000);
            
        } catch (error) {
            console.error("Verification failed:", error);
            setStatus("error");
            
            let errorMsg = "Verification failed. Please try again or register for a new account.";
            if (error.response?.data?.message) {
                errorMsg = error.response.data.message;
            }
            setErrorMessage(errorMsg);
        }
    };

    // Get device display name
    const deviceDisplayName = getDeviceInfo().deviceName;

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        {status === "idle" && (
                            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <Mail className="h-8 w-8 text-blue-600" />
                            </div>
                        )}
                        {status === "loading" && (
                            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
                            </div>
                        )}
                        {status === "success" && (
                            <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="h-8 w-8 text-green-600" />
                            </div>
                        )}
                        {status === "error" && (
                            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="h-8 w-8 text-red-600" />
                            </div>
                        )}
                    </div>
                    
                    <CardTitle className="text-2xl">
                        {status === "idle" && "Verify Your Email"}
                        {status === "loading" && "Verifying..."}
                        {status === "success" && "Verification Successful!"}
                        {status === "error" && "Verification Failed"}
                    </CardTitle>
                    
                    <CardDescription>
                        {status === "idle" && "Click the button below to verify your email address"}
                        {status === "loading" && "Please wait while we verify your account"}
                        {status === "success" && `Redirecting to dashboard in ${countdown} seconds...`}
                        {status === "error" && errorMessage}
                    </CardDescription>
                </CardHeader>
                
                <CardContent>
                    {status === "idle" && (
                        <div className="space-y-4">
                            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
                                <p className="font-medium mb-2">Verification details:</p>
                                <div className="space-y-1">
                                    <p>• Device: {deviceDisplayName}</p>
                                    <p>• You'll be automatically logged in after verification</p>
                                    <p>• You'll be redirected to your dashboard</p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {status === "error" && (
                        <div className="space-y-3">
                            <div className="bg-red-50 rounded-lg p-4 text-sm text-red-600">
                                <p className="font-medium mb-2">Possible reasons:</p>
                                <ul className="list-disc list-inside space-y-1">
                                    <li>Link has already been used</li>
                                    <li>Link has expired (valid for 24 hours)</li>
                                    <li>Invalid verification token</li>
                                    <li>Account may already be verified</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </CardContent>
                
                <CardFooter>
                    {status === "idle" && (
                        <Button 
                            onClick={handleVerify} 
                            className="w-full"
                            size="lg"
                        >
                            Verify Email
                        </Button>
                    )}
                    
                    {status === "loading" && (
                        <Button disabled className="w-full" size="lg">
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Verifying...
                        </Button>
                    )}
                    
                    {status === "success" && (
                        <Button 
                            onClick={() => navigate("/dashboard")} 
                            className="w-full"
                            size="lg"
                        >
                            Go to Dashboard
                        </Button>
                    )}
                    
                    {status === "error" && (
                        <div className="flex flex-col space-y-2 w-full">
                            <Button onClick={handleVerify} variant="outline" className="w-full">
                                Try Again
                            </Button>
                            <Link to="/register">
                                <Button variant="ghost" className="w-full">
                                    Create New Account
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}