// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { LogOut, Globe, Smartphone, Monitor, Loader2, User, Shield, Mail, MapPin, Calendar } from "lucide-react";

export default function Dashboard() {
    const { user, logout, logoutAll } = useAuth();
    const { 
        updateProfile, 
        updatingProfile, 
        sessions, 
        loadingSessions, 
        getUserSessions, 
        logoutSession 
    } = useUser();
    const navigate = useNavigate();
    
    const [profileForm, setProfileForm] = useState({
        name: user?.name || "",
        address: {
            city: user?.address?.city || "",
            state: user?.address?.state || "",
            country: user?.address?.country || "",
            zipCode: user?.address?.zipCode || ""
        }
    });

    useEffect(() => {
        loadSessions();
    }, []);

    const loadSessions = async () => {
        await getUserSessions();
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const handleLogoutAll = async () => {
        await logoutAll();
        navigate("/login");
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(profileForm);
        } catch (error) {
            console.error("Failed to update profile");
        }
    };

    const handleSessionLogout = async (sessionToken) => {
        await logoutSession(sessionToken);
    };

    const getDeviceIcon = (device) => {
        switch (device?.toLowerCase()) {
            case 'web':
                return <Monitor className="h-4 w-4" />;
            case 'mobile':
                return <Smartphone className="h-4 w-4" />;
            default:
                return <Globe className="h-4 w-4" />;
        }
    };

    const getDeviceBadge = (device) => {
        switch (device?.toLowerCase()) {
            case 'web':
                return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Desktop</Badge>;
            case 'mobile':
                return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Mobile</Badge>;
            default:
                return <Badge variant="secondary" className="bg-gray-100 text-gray-700">Unknown</Badge>;
        }
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2) || 'U';
    };

    const formatDate = (date) => {
        if (!date) return "Unknown";
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50/50 py-8">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                            <p className="text-sm text-gray-500 mt-1">Manage your account settings and preferences</p>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={handleLogout}
                            className="text-gray-600 hover:text-gray-700"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign Out
                        </Button>
                    </div>
                </div>

                {/* Welcome Card */}
                <Card className="mb-8 border-0 shadow-sm">
                    <CardContent className="p-6">
                        <div className="flex items-center space-x-4">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback className="bg-gray-100 text-gray-600 text-xl">
                                    {getInitials(user?.name)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-medium text-gray-900">Welcome back, {user?.name?.split(' ')[0]}!</h2>
                                <p className="text-sm text-gray-500 mt-1">We're glad to see you again</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tabs */}
                <Tabs defaultValue="profile" className="space-y-6">
                    <TabsList className="bg-transparent border-b rounded-none p-0 space-x-8">
                        <TabsTrigger 
                            value="profile" 
                            className="data-[state=active]:border-b-2 data-[state=active]:border-gray-800 data-[state=active]:text-gray-900 rounded-none px-0 pb-2 text-gray-500"
                        >
                            <User className="h-4 w-4 mr-2" />
                            Profile
                        </TabsTrigger>
                        <TabsTrigger 
                            value="sessions" 
                            className="data-[state=active]:border-b-2 data-[state=active]:border-gray-800 data-[state=active]:text-gray-900 rounded-none px-0 pb-2 text-gray-500"
                        >
                            <Shield className="h-4 w-4 mr-2" />
                            Active Sessions
                        </TabsTrigger>
                    </TabsList>

                    {/* Profile Tab */}
                    <TabsContent value="profile">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-medium">Profile Information</CardTitle>
                                <CardDescription className="text-sm text-gray-500">
                                    Update your personal details
                                </CardDescription>
                            </CardHeader>
                            <Separator />
                            <form onSubmit={handleUpdateProfile}>
                                <CardContent className="space-y-6 pt-6">
                                    {/* Name Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={profileForm.name}
                                            onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                            className="border-gray-200 focus:border-gray-400"
                                            placeholder="Enter your full name"
                                        />
                                    </div>

                                    {/* Email Field */}
                                    <div className="space-y-2">
                                        <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="email"
                                                value={user?.email}
                                                disabled
                                                className="pl-9 bg-gray-50 border-gray-200 text-gray-500"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400">Email address cannot be changed</p>
                                    </div>

                                    {/* Address Section */}
                                    <div className="space-y-3">
                                        <Label className="text-sm font-medium text-gray-700">Address Information</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                                <Input
                                                    placeholder="City"
                                                    value={profileForm.address.city}
                                                    onChange={(e) => setProfileForm({
                                                        ...profileForm,
                                                        address: { ...profileForm.address, city: e.target.value }
                                                    })}
                                                    className="pl-9 border-gray-200"
                                                />
                                            </div>
                                            <Input
                                                placeholder="State"
                                                value={profileForm.address.state}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    address: { ...profileForm.address, state: e.target.value }
                                                })}
                                                className="border-gray-200"
                                            />
                                            <Input
                                                placeholder="Country"
                                                value={profileForm.address.country}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    address: { ...profileForm.address, country: e.target.value }
                                                })}
                                                className="border-gray-200"
                                            />
                                            <Input
                                                placeholder="Zip Code"
                                                value={profileForm.address.zipCode}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    address: { ...profileForm.address, zipCode: e.target.value }
                                                })}
                                                className="border-gray-200"
                                            />
                                        </div>
                                    </div>
                                </CardContent>
                                <Separator />
                                <CardFooter className="pt-6">
                                    <Button 
                                        type="submit" 
                                        disabled={updatingProfile}
                                        className="bg-gray-900 hover:bg-gray-800 text-white"
                                    >
                                        {updatingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {updatingProfile ? "Saving..." : "Save Changes"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    {/* Sessions Tab */}
                    <TabsContent value="sessions">
                        <Card className="border-0 shadow-sm">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg font-medium">Active Sessions</CardTitle>
                                <CardDescription className="text-sm text-gray-500">
                                    Devices and browsers where you're currently logged in
                                </CardDescription>
                            </CardHeader>
                            <Separator />
                            <CardContent className="pt-6">
                                {loadingSessions ? (
                                    <div className="flex justify-center py-12">
                                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {sessions.length > 0 ? (
                                            sessions.map((session, index) => (
                                                <div 
                                                    key={index} 
                                                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-4">
                                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                                            {getDeviceIcon(session.device)}
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center space-x-2 mb-1">
                                                                <p className="text-sm font-medium text-gray-900 capitalize">
                                                                    {session.device || "Unknown Device"}
                                                                </p>
                                                                {getDeviceBadge(session.device)}
                                                            </div>
                                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                                <div className="flex items-center">
                                                                    <Calendar className="h-3 w-3 mr-1" />
                                                                    <span>{formatDate(session.createdAt)}</span>
                                                                </div>
                                                                {session.ip && (
                                                                    <span>IP: {session.ip}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleSessionLogout(session.token || session.sessionId)}
                                                        className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-12">
                                                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-sm text-gray-500">No active sessions found</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                                {sessions.length > 0 && (
                                    <div className="mt-6 pt-4 border-t">
                                        <Button 
                                            variant="outline" 
                                            onClick={handleLogoutAll} 
                                            className="w-full border-gray-200 text-gray-600 hover:bg-gray-50"
                                        >
                                            <LogOut className="h-4 w-4 mr-2" />
                                            Logout from all devices
                                        </Button>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}