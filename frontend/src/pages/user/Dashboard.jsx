// pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    BookOpen,
    Award,
    Calendar,
    Clock,
    ChevronRight,
    Sparkles,
    Target,
    GraduationCap,
    Briefcase,
    Trophy,
    ArrowRight,
    Brain,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Mock data for dashboard
    const [progressData, setProgressData] = useState({
        completedTests: 3,
        totalTests: 5,
        recommendedCourses: 4,
        upcomingDeadlines: 2,
        aptitudeScore: 85,
        careerMatches: 3
    });

    const [recentActivities, setRecentActivities] = useState([
        { id: 1, title: "Completed Aptitude Test", date: "2024-03-20", type: "test", score: "85%" },
        { id: 2, title: "New Career Recommendation", date: "2024-03-19", type: "career", match: "Data Science" },
        { id: 3, title: "Scholarship Deadline", date: "2024-03-25", type: "deadline", name: "National Merit Scholarship" },
        { id: 4, title: "Course Progress", date: "2024-03-18", type: "course", progress: "60%" }
    ]);

    const [aptitudeData, setAptitudeData] = useState([
        { subject: "Mathematics", score: 85 },
        { subject: "Science", score: 78 },
        { subject: "English", score: 92 },
        { subject: "Logical Reasoning", score: 70 },
        { subject: "General Knowledge", score: 88 }
    ]);

    const careerPaths = [
        { name: "Data Science", match: 92, color: "#3B82F6", requirements: ["Mathematics", "Programming"] },
        { name: "Engineering", match: 88, color: "#10B981", requirements: ["Physics", "Mathematics"] },
        { name: "Medicine", match: 76, color: "#F59E0B", requirements: ["Biology", "Chemistry"] }
    ];

    const upcomingEvents = [
        { name: "JEE Main 2024", date: "2024-04-15", type: "exam" },
        { name: "NEET 2024", date: "2024-05-05", type: "exam" },
        { name: "Scholarship Application", date: "2024-03-30", type: "scholarship" }
    ];

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    };

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const getActivityIcon = (type) => {
        switch (type) {
            case 'test': return <Brain className="h-4 w-4 text-blue-500" />;
            case 'career': return <Briefcase className="h-4 w-4 text-green-500" />;
            case 'deadline': return <Calendar className="h-4 w-4 text-red-500" />;
            case 'course': return <BookOpen className="h-4 w-4 text-purple-500" />;
            default: return <Sparkles className="h-4 w-4 text-gray-500" />;
        }
    };

    const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header Section with Animation */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8"
                >
                    <div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            Welcome back, {user?.name?.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-gray-500 mt-1">Your personalized career guidance dashboard</p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="outline"
                            onClick={() => navigate('/profile')}
                            className="border-gray-400 hover:bg-gray-200 cursor-pointer hover:bg-gray-900 hover:text-white"
                        >
                            <GraduationCap className="h-4 w-4 mr-2" />
                            View Profile
                        </Button>
                    </div>
                </motion.div>

                {/* Stats Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                >
                    {[
                        { icon: Brain, label: "Aptitude Score", value: `${progressData.aptitudeScore}%`, color: "from-blue-500 to-blue-600", trend: "+5%" },
                        { icon: Target, label: "Career Matches", value: progressData.careerMatches, color: "from-green-500 to-green-600", trend: "+2" },
                        { icon: BookOpen, label: "Courses Completed", value: `${progressData.completedTests}/${progressData.totalTests}`, color: "from-purple-500 to-purple-600", trend: "2 left" },
                        { icon: Award, label: "Recommendations", value: progressData.recommendedCourses, color: "from-orange-500 to-orange-600", trend: "new" }
                    ].map((stat, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300 }}
                        >
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-r ${stat.color} bg-opacity-10`}>
                                            <stat.icon className="h-6 w-6 text-white" />
                                        </div>
                                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                                            {stat.trend}
                                        </Badge>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Aptitude Progress Chart */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-2"
                    >
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-blue-500" />
                                    Aptitude Analysis
                                </CardTitle>
                                <CardDescription>Your performance across different subjects</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-80">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={aptitudeData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                            <XAxis dataKey="subject" stroke="#6B7280" />
                                            <YAxis stroke="#6B7280" />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                                }}
                                            />
                                            <Line
                                                type="monotone"
                                                dataKey="score"
                                                stroke="#3B82F6"
                                                strokeWidth={2}
                                                dot={{ fill: '#3B82F6', strokeWidth: 2 }}
                                                activeDot={{ r: 8 }}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Career Recommendations */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <Card className="border-0 shadow-lg h-full">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-purple-500" />
                                    AI Career Matches
                                </CardTitle>
                                <CardDescription>Based on your aptitude and interests</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {careerPaths.map((career, index) => (
                                    <motion.div
                                        key={index}
                                        whileHover={{ scale: 1.02 }}
                                        className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl cursor-pointer hover:shadow-md transition-all"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-gray-900">{career.name}</h3>
                                            <Badge style={{ backgroundColor: career.color }} className="text-white">
                                                {career.match}% Match
                                            </Badge>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${career.match}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-2 rounded-full"
                                                style={{ backgroundColor: career.color }}
                                            />
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {career.requirements.map((req, idx) => (
                                                <Badge key={idx} variant="outline" className="text-xs">
                                                    {req}
                                                </Badge>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                                <Button
                                    variant="ghost"
                                    className="w-full mt-4 text-blue-600 hover:text-blue-700"
                                    onClick={() => navigate('/career-guidance')}
                                >
                                    View All Recommendations
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Recent Activity */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="lg:col-span-2"
                    >
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-gray-500" />
                                    Recent Activity
                                </CardTitle>
                                <CardDescription>Your latest achievements and updates</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {recentActivities.map((activity, index) => (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-white rounded-lg shadow-sm">
                                                    {getActivityIcon(activity.type)}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{activity.title}</p>
                                                    <p className="text-sm text-gray-500">{activity.date}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="h-5 w-5 text-gray-400" />
                                        </motion.div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>

                    {/* Upcoming Events */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-0 shadow-lg">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-orange-500" />
                                    Upcoming Deadlines
                                </CardTitle>
                                <CardDescription>Important dates and events</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {upcomingEvents.map((event, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ x: 5 }}
                                            className="p-3 border border-gray-100 rounded-lg"
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <p className="font-medium text-gray-900">{event.name}</p>
                                                <Badge variant="outline" className="text-xs">
                                                    {event.type}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-gray-500">{event.date}</p>
                                        </motion.div>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full mt-4"
                                    onClick={() => navigate('/calendar')}
                                >
                                    View Full Calendar
                                    <Calendar className="h-4 w-4 ml-2" />
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;