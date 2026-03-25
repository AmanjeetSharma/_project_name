// pages/Sessions.jsx (Updated with AlertDialog)
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "react-hot-toast";
import {
    Monitor,
    Smartphone,
    Globe,
    LogOut,
    Shield,
    Clock,
    Calendar,
    AlertTriangle,
    CheckCircle2,
    Loader2,
    Laptop,
    Tablet,
    Info,
    ShieldAlert,
    Lock,
    History,
    RefreshCw
} from "lucide-react";
import { formatDistanceToNow, isValid, parseISO } from "date-fns";

const Sessions = () => {
    const { sessions, loadingSessions, getUserSessions, logoutSession } = useUser();
    const { logoutAll } = useAuth();
    const navigate = useNavigate();
    const [currentSession, setCurrentSession] = useState(null);
    const [logoutLoading, setLogoutLoading] = useState(null);
    const [showLogoutDialog, setShowLogoutDialog] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadSessions();
        // Get current session from localStorage or context
        const current = localStorage.getItem('currentSession');
        if (current) {
            setCurrentSession(JSON.parse(current));
        }
    }, []);

    const loadSessions = async () => {
        await getUserSessions();
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        try {
            await loadSessions();
            toast.success("Sessions refreshed");
        } catch (error) {
            toast.error("Failed to refresh sessions");
        } finally {
            setRefreshing(false);
        }
    };

    const handleSessionLogout = async (sessionId) => {
        setLogoutLoading(sessionId);
        try {
            await logoutSession(sessionId);
            await loadSessions(); // Refresh after terminating
        } catch (error) {
        } finally {
            setLogoutLoading(null);
        }
    };

    const handleLogoutAll = async () => {
        setShowLogoutDialog(false);
        try {
            await logoutAll();
            await loadSessions(); // Refresh after logout all
        } catch (error) {
        }
    };

    const openLogoutDialog = () => {
        setShowLogoutDialog(true);
    };

    const getDeviceIcon = (device, userAgent) => {
        const deviceType = device?.toLowerCase() || '';
        const ua = userAgent?.toLowerCase() || '';

        if (deviceType === 'web' || ua.includes('windows') || ua.includes('mac')) {
            return <Monitor className="h-5 w-5" />;
        } else if (deviceType === 'mobile' || ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
            return <Smartphone className="h-5 w-5" />;
        } else if (ua.includes('tablet') || ua.includes('ipad')) {
            return <Tablet className="h-5 w-5" />;
        } else if (ua.includes('laptop') || ua.includes('notebook')) {
            return <Laptop className="h-5 w-5" />;
        }
        return <Globe className="h-5 w-5" />;
    };

    const getDeviceName = (device, userAgent) => {
        const ua = userAgent?.toLowerCase() || '';
        const deviceType = device?.toLowerCase() || '';

        // Clean up device name if it's "postman " or similar
        if (deviceType === 'postman' || deviceType === 'postman ') {
            return 'Postman API Client';
        }

        if (ua.includes('windows')) return 'Windows PC';
        if (ua.includes('mac')) return 'Mac';
        if (ua.includes('iphone')) return 'iPhone';
        if (ua.includes('android')) return 'Android Device';
        if (ua.includes('ipad')) return 'iPad';
        if (ua.includes('linux')) return 'Linux';

        // Return cleaned device name if available
        if (device && device.trim()) {
            return device.trim().charAt(0).toUpperCase() + device.trim().slice(1);
        }

        return 'Unknown Device';
    };

    const getBrowserName = (userAgent) => {
        const ua = userAgent?.toLowerCase() || '';

        if (ua.includes('postman')) return 'Postman';
        if (ua.includes('chrome') && !ua.includes('edg')) return 'Chrome';
        if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
        if (ua.includes('firefox')) return 'Firefox';
        if (ua.includes('edg')) return 'Edge';
        if (ua.includes('opera')) return 'Opera';
        return 'Unknown Browser';
    };

    const formatDateSafely = (dateString) => {
        if (!dateString) return 'Unknown date';

        try {
            const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
            if (isValid(date)) {
                return formatDistanceToNow(date, { addSuffix: true });
            }
            return 'Invalid date';
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Date unavailable';
        }
    };

    const formatDateOnly = (dateString) => {
        if (!dateString) return 'Unknown';

        try {
            const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
            if (isValid(date)) {
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                });
            }
            return 'Invalid date';
        } catch (error) {
            return 'Date unavailable';
        }
    };

    const getLastActive = (session) => {
        // Use latestLogin if available, otherwise use firstLogin, otherwise use current date
        if (session.latestLogin) return session.latestLogin;
        if (session.lastActive) return session.lastActive;
        if (session.firstLogin) return session.firstLogin;
        if (session.createdAt) return session.createdAt;
        return null;
    };

    const isCurrentSession = (session) => {
        return session.isCurrent === true || (currentSession && session.id === currentSession.id);
    };

    const isSessionActive = (session) => {
        // Check if session is active based on isActive flag or last activity
        if (session.isActive === false) return false;

        // Current session is always considered active
        if (isCurrentSession(session)) return true;

        const lastActive = getLastActive(session);
        if (lastActive) {
            try {
                const date = typeof lastActive === 'string' ? parseISO(lastActive) : new Date(lastActive);
                if (isValid(date)) {
                    // Consider session active if last activity was within last 30 minutes
                    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
                    return date > thirtyMinutesAgo;
                }
            } catch (error) {
                console.error('Error checking session activity:', error);
            }
        }

        return session.isActive !== false;
    };

    const getSessionStatus = (session) => {
        if (isCurrentSession(session)) {
            return { label: "Current Session", color: "bg-green-100 text-green-700", icon: CheckCircle2 };
        }

        const isActive = isSessionActive(session);
        if (!isActive) {
            return { label: "Inactive", color: "bg-gray-100 text-gray-500", icon: History };
        }

        return { label: "Active", color: "bg-blue-100 text-blue-700", icon: Clock };
    };

    // Log sessions data for debugging
    useEffect(() => {
        if (sessions && sessions.length > 0) {
        }
    }, [sessions]);

    const activeSessionCount = sessions?.filter(s => isSessionActive(s) && !isCurrentSession(s)).length || 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-4 sm:py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 sm:mb-8"
                >
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/dashboard')}
                        className="mb-3 sm:mb-4 text-sm sm:text-base hover:bg-gray-200 px-3 cursor-pointer"
                    >
                        ← Back to Dashboard
                    </Button>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                Active Sessions
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your connected devices and sessions</p>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button
                                onClick={handleRefresh}
                                variant="outline"
                                disabled={refreshing || loadingSessions}
                                className="border-gray-300 hover:bg-gray-100 flex-1 sm:flex-none"
                                size="sm"
                            >
                                {refreshing || loadingSessions ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="h-4 w-4" />
                                )}
                                <span className="ml-2 sm:inline">Refresh</span>
                            </Button>
                            {sessions && sessions.length > 0 && (
                                <Button
                                    onClick={openLogoutDialog}
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 text-white flex-1 sm:flex-none"
                                    size="sm"
                                >
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout All Devices
                                </Button>
                            )}
                        </div>
                    </div>
                </motion.div>

                {/* Security Info Card - Enhanced */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-6 sm:mb-8"
                >
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 overflow-hidden">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                                <div className="flex-shrink-0">
                                    <div className="p-2 sm:p-3 bg-blue-100 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
                                        <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 text-base sm:text-lg mb-2">
                                        Session Management & Security
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mt-3">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                <span className="font-medium">Current session:</span> This is the device you're using now
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Clock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                <span className="font-medium">Active sessions:</span> Shows devices with recent activity
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <History className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                <span className="font-medium">Inactive sessions:</span> Shows devices with no recent activity
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                <span className="font-medium">Unrecognized device?</span> Terminate immediately
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <Lock className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                <span className="font-medium">Auto logout:</span> Sessions expire after 7 days
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <ShieldAlert className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                                            <p className="text-xs sm:text-sm text-gray-600">
                                                <span className="font-medium">Suspicious activity?</span> Change password immediately
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Sessions List */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Card className="border-0 shadow-lg">
                        <CardHeader className="pb-3 sm:pb-4">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                                    <Monitor className="h-5 w-5" />
                                    Connected Devices
                                </CardTitle>
                                <Badge variant="secondary" className="bg-gray-100">
                                    Last refreshed: {new Date().toLocaleTimeString()}
                                </Badge>
                            </div>
                            <CardDescription className="text-sm">
                                <div className="flex items-center gap-2">
                                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                        {sessions?.filter(s => isSessionActive(s)).length || 0} active
                                    </Badge>
                                    <Badge variant="secondary" className="bg-gray-100 text-gray-600 hover:bg-gray-100">
                                        {sessions?.filter(s => !isSessionActive(s) && !isCurrentSession(s)).length || 0} inactive
                                    </Badge>
                                </div>
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {loadingSessions ? (
                                <div className="flex justify-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                </div>
                            ) : (
                                <div className="space-y-3 sm:space-y-4">
                                    <AnimatePresence>
                                        {sessions && sessions.length > 0 ? (
                                            sessions.map((session, index) => {
                                                const status = getSessionStatus(session);
                                                const isCurrent = isCurrentSession(session);
                                                const isActive = isSessionActive(session);
                                                const lastActive = getLastActive(session);
                                                const sessionId = session.sessionId || session.id || session.token;
                                                const StatusIcon = status.icon;

                                                return (
                                                    <motion.div
                                                        key={sessionId || index}
                                                        initial={{ opacity: 0, x: -20 }}
                                                        animate={{ opacity: 1, x: 0 }}
                                                        exit={{ opacity: 0, x: 20 }}
                                                        transition={{ delay: index * 0.05 }}
                                                        className={`p-4 sm:p-5 rounded-xl border transition-all ${isCurrent
                                                            ? 'border-green-200 bg-green-50/30 shadow-md'
                                                            : isActive
                                                                ? 'border-blue-100 hover:border-blue-200 hover:shadow-md'
                                                                : 'border-gray-100 bg-gray-50/50 hover:border-gray-200'
                                                            }`}
                                                    >
                                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                                            <div className="flex items-start gap-3 sm:gap-4">
                                                                <div className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${isCurrent ? 'bg-green-100' : isActive ? 'bg-blue-100' : 'bg-gray-200'
                                                                    }`}>
                                                                    {getDeviceIcon(session.device, session.userAgent)}
                                                                </div>
                                                                <div className="space-y-2 flex-1 min-w-0">
                                                                    <div className="flex flex-wrap items-center gap-2">
                                                                        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                                                                            {getDeviceName(session.device, session.userAgent)}
                                                                        </h3>
                                                                        <Badge className={`${status.color} flex items-center gap-1`}>
                                                                            <StatusIcon className="h-3 w-3" />
                                                                            {status.label}
                                                                        </Badge>
                                                                        {isCurrent && (
                                                                            <Badge variant="outline" className="border-green-300 text-green-700">
                                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                                Current
                                                                            </Badge>
                                                                        )}
                                                                    </div>

                                                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs sm:text-sm text-gray-600">
                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                            <Globe className="h-3 w-3 flex-shrink-0" />
                                                                            <span className="truncate">{getBrowserName(session.userAgent)}</span>
                                                                        </div>
                                                                        {lastActive && (
                                                                            <div className="flex items-center gap-2 min-w-0">
                                                                                <Clock className="h-3 w-3 flex-shrink-0" />
                                                                                <span className="truncate">
                                                                                    Last active: {formatDateSafely(lastActive)}
                                                                                </span>
                                                                            </div>
                                                                        )}
                                                                        <div className="flex items-center gap-2 min-w-0">
                                                                            <Calendar className="h-3 w-3 flex-shrink-0" />
                                                                            <span className="truncate">
                                                                                Created: {formatDateOnly(session.firstLogin || session.createdAt)}
                                                                            </span>
                                                                        </div>
                                                                        {session.ip && (
                                                                            <div className="flex items-center gap-2 min-w-0">
                                                                                <Shield className="h-3 w-3 flex-shrink-0" />
                                                                                <span className="truncate">IP: {session.ip}</span>
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    {session.location && (
                                                                        <p className="text-xs text-gray-500 mt-1 truncate">
                                                                            📍 {session.location}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Show terminate button only for active non-current sessions */}
                                                            {!isCurrent && isActive && sessionId && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => handleSessionLogout(sessionId)}
                                                                    disabled={logoutLoading === sessionId}
                                                                    className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 w-full lg:w-auto"
                                                                >
                                                                    {logoutLoading === sessionId ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <>
                                                                            <LogOut className="h-4 w-4 mr-2" />
                                                                            Terminate
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            )}

                                                            {/* Show message for inactive sessions */}
                                                            {!isCurrent && !isActive && (
                                                                <div className="flex items-center gap-2 text-xs text-gray-600 bg-gray-100 px-3 py-2 rounded-lg w-full lg:w-auto justify-center">
                                                                    <History className="h-3 w-3" />
                                                                    <span>Session offline</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })
                                        ) : (
                                            <div className="text-center py-12">
                                                <Shield className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500">No active sessions found</p>
                                                <p className="text-xs sm:text-sm text-gray-400 mt-1">
                                                    Your session information will appear here when you log in
                                                </p>
                                            </div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Additional Info Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-6 sm:mt-8"
                >
                    <Card className="border-0 shadow-md bg-white">
                        <CardContent className="p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
                                <div className="flex-shrink-0">
                                    <div className="p-2 bg-gray-100 rounded-full">
                                        <Info className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
                                    </div>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-gray-900 text-sm sm:text-base mb-2">About Session Management</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                                        Your account security is important. Sessions automatically expire after 7 days of inactivity.
                                        You can terminate any active session from this page. If you notice any suspicious activity,
                                        we recommend changing your password immediately and terminating all other sessions.
                                    </p>
                                    <div className="mt-3 pt-3 border-t border-gray-100">
                                        <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                                            <span className="flex items-center gap-1">
                                                <CheckCircle2 className="h-3 w-3 text-green-500" />
                                                Encrypted connection
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Shield className="h-3 w-3 text-blue-500" />
                                                Secure session storage
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="h-3 w-3 text-purple-500" />
                                                Auto-logout after inactivity
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Alert Dialog for Logout All */}
            <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" />
                            Logout from All Devices
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {activeSessionCount > 0 ? (
                                <>
                                    You have {activeSessionCount} active session{activeSessionCount !== 1 ? 's' : ''} on other devices.
                                    This action will log you out from all other devices. Your current session will remain active.
                                </>
                            ) : (
                                "You don't have any other active sessions. Your current session will remain active."
                            )}
                            <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <p className="text-sm text-yellow-800 flex items-start gap-2">
                                    <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                                    <span>This action cannot be undone. You'll need to log in again on those devices.</span>
                                </p>
                            </div>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLogoutAll}
                            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                            Logout All Devices
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default Sessions;