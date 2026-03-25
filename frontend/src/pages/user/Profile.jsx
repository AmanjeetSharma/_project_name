// pages/Profile.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    User,
    Mail,
    BookOpen,
    Award,
    GraduationCap,
    Save,
    Edit2,
    Loader2,
    TrendingUp,
    Briefcase,
    Heart,
    ChevronLeft,
    Menu,
    Key
} from "lucide-react";
import { GoXCircle } from "react-icons/go";

const Profile = () => {
    const { user } = useAuth();
    const { updateProfile, updatingProfile } = useUser();
    const navigate = useNavigate();

    const [profileForm, setProfileForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        education: {
            class: user?.education?.class || "",
            stream: user?.education?.stream || "",
            school: user?.education?.school || "",
            percentage: user?.education?.percentage || ""
        },
        address: {
            city: user?.address?.city || "",
            state: user?.address?.state || "",
            country: user?.address?.country || "",
            zipCode: user?.address?.zipCode || ""
        },
        interests: user?.interests || [],
        skills: user?.skills || []
    });

    const [isEditing, setIsEditing] = useState(false);
    const [newInterest, setNewInterest] = useState("");
    const [newSkill, setNewSkill] = useState("");
    const [activeTab, setActiveTab] = useState("personal");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const stats = [
        { icon: TrendingUp, label: "Aptitude Score", value: "85%" },
        { icon: BookOpen, label: "Tests Taken", value: "5" },
        { icon: Award, label: "Achievements", value: "3" },
        { icon: Briefcase, label: "Career Matches", value: "4" }
    ];

    const getInitials = (name) => {
        return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U';
    };

    const handleUpdateProfile = async (e) => {
        if (e) e.preventDefault();
        try {
            await updateProfile(profileForm);
            setIsEditing(false);
        } catch (error) {
            // Error handled in context
        }
    };

    const addInterest = () => {
        if (newInterest && !profileForm.interests.includes(newInterest)) {
            setProfileForm({
                ...profileForm,
                interests: [...profileForm.interests, newInterest]
            });
            setNewInterest("");
        }
    };

    const removeInterest = (interest) => {
        setProfileForm({
            ...profileForm,
            interests: profileForm.interests.filter(i => i !== interest)
        });
    };

    const addSkill = () => {
        if (newSkill && !profileForm.skills.includes(newSkill)) {
            setProfileForm({
                ...profileForm,
                skills: [...profileForm.skills, newSkill]
            });
            setNewSkill("");
        }
    };

    const removeSkill = (skill) => {
        setProfileForm({
            ...profileForm,
            skills: profileForm.skills.filter(s => s !== skill)
        });
    };

    const tabs = [
        { id: "personal", label: "Personal Info", icon: User },
        { id: "education", label: "Education", icon: GraduationCap },
        { id: "interests", label: "Interests & Skills", icon: Heart }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-4 sm:py-6 md:py-8">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 sm:mb-6 md:mb-8"
                >
                    {/* Mobile Back Button and Actions Row */}
                    <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/dashboard')}
                            size="sm"
                            className="sm:hidden -ml-2"
                        >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => navigate('/dashboard')}
                            size="sm"
                            className="hidden sm:flex"
                        >
                            ← Back to Dashboard
                        </Button>

                        {/* Mobile Action Buttons */}
                        <div className="flex items-center gap-2 sm:hidden">
                            <Button
                                onClick={() => navigate('/change-password')}
                                variant="outline"
                                size="sm"
                                className="border-gray-300 hover:bg-gray-50"
                            >
                                <Key className="h-4 w-4" />
                            </Button>
                            <Button
                                onClick={() => setIsEditing(!isEditing)}
                                variant={isEditing ? "destructive" : "default"}
                                size="sm"
                                className={!isEditing ? "bg-gray-900 hover:bg-gray-800" : ""}
                            >
                                {isEditing ? (
                                    <GoXCircle className="h-4 w-4" />
                                ) : (
                                    <Edit2 className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Desktop Header */}
                    <div className="hidden sm:flex sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                My Profile
                            </h1>
                            <p className="text-sm sm:text-base text-gray-500 mt-1">Manage your personal information and preferences</p>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => navigate('/change-password')}
                                variant="outline"
                                className="border-gray-300 hover:bg-gray-50"
                            >
                                <Key className="h-4 w-4 mr-2" />
                                Change Password
                            </Button>
                            <Button
                                onClick={() => setIsEditing(!isEditing)}
                                variant={isEditing ? "destructive" : "default"}
                                className={!isEditing ? "bg-gray-900 hover:bg-gray-800" : ""}
                            >
                                {isEditing ? (
                                    <>
                                        <GoXCircle className="h-4 w-4 mr-2" />
                                        Cancel
                                    </>
                                ) : (
                                    <>
                                        <Edit2 className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Header Text */}
                    <div className="sm:hidden text-center mt-2">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            My Profile
                        </h1>
                        <p className="text-xs text-gray-500 mt-1">Manage your information</p>
                    </div>
                </motion.div>

                {/* Stats Cards - Responsive Grid */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6 md:mb-8"
                >
                    {stats.map((stat, index) => (
                        <Card key={index} className="border-0 shadow-lg">
                            <CardContent className="p-2 sm:p-3 md:p-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] sm:text-xs md:text-sm text-gray-500">{stat.label}</p>
                                        <p className="text-sm sm:text-lg md:text-2xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8 text-blue-500 opacity-50" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </motion.div>

                {/* Email Address Display Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mb-6"
                >
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-gray-50 to-white">
                        <CardContent className="p-4 sm:p-5">
                            <div className="flex items-center justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <Mail className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Email Address</p>
                                        <p className="text-base sm:text-lg font-semibold text-gray-900">{user?.email || "Not provided"}</p>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-green-100 text-green-700">
                                    Verified
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Mobile Tab Selector Dropdown */}
                <div className="sm:hidden mb-4">
                    <div className="relative">
                        <Button
                            variant="outline"
                            className="w-full justify-between bg-white shadow-sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            <div className="flex items-center gap-2">
                                {(() => {
                                    const currentTab = tabs.find(t => t.id === activeTab);
                                    const Icon = currentTab?.icon;
                                    return Icon && <Icon className="h-4 w-4" />;
                                })()}
                                <span>{tabs.find(t => t.id === activeTab)?.label}</span>
                            </div>
                            <Menu className="h-4 w-4" />
                        </Button>
                        {isMobileMenuOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50">
                                {tabs.map((tab) => {
                                    const Icon = tab.icon;
                                    return (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setActiveTab(tab.id);
                                                setIsMobileMenuOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${activeTab === tab.id ? 'bg-gray-50 text-gray-900 font-medium' : 'text-gray-600'
                                                }`}
                                        >
                                            <Icon className="h-4 w-4" />
                                            {tab.label}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Main Profile Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-5">
                    {/* Desktop Tabs */}
                    <div className="hidden sm:block">
                        <TabsList className="inline-flex bg-transparent border-0 p-0 gap-2 md:gap-3">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <TabsTrigger
                                        key={tab.id}
                                        value={tab.id}
                                        className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:border data-[state=active]:border-gray-100 rounded-xl px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-medium text-gray-600 data-[state=active]:text-gray-900 hover:bg-white/50 hover:shadow-md transition-all duration-200 flex items-center gap-1 sm:gap-2 cursor-pointer"
                                    >
                                        <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                                        <span>{tab.label}</span>
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </div>

                    {/* Personal Info Tab */}
                    <TabsContent value="personal">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                        <User className="h-4 w-4 sm:h-5 sm:w-5" />
                                        Personal Information
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Your basic information and contact details</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                                    <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
                                        {/* Avatar Section */}
                                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
                                            <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mx-auto sm:mx-0">
                                                <AvatarFallback className="bg-gradient-to-r from-gray-900 to-gray-600 text-white text-base sm:text-xl">
                                                    {getInitials(user?.name)}
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                            <div className="space-y-2">
                                                <Label className="text-sm">Full Name</Label>
                                                <Input
                                                    value={profileForm.name}
                                                    onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={`text-sm ${!isEditing ? "bg-gray-50" : ""}`}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-sm">Address</Label>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                                <Input
                                                    placeholder="City"
                                                    value={profileForm.address.city}
                                                    onChange={(e) => setProfileForm({
                                                        ...profileForm,
                                                        address: { ...profileForm.address, city: e.target.value }
                                                    })}
                                                    disabled={!isEditing}
                                                    className={`text-sm ${!isEditing ? "bg-gray-50" : ""}`}
                                                />
                                                <Input
                                                    placeholder="State"
                                                    value={profileForm.address.state}
                                                    onChange={(e) => setProfileForm({
                                                        ...profileForm,
                                                        address: { ...profileForm.address, state: e.target.value }
                                                    })}
                                                    disabled={!isEditing}
                                                    className={`text-sm ${!isEditing ? "bg-gray-50" : ""}`}
                                                />
                                                <Input
                                                    placeholder="Country"
                                                    value={profileForm.address.country}
                                                    onChange={(e) => setProfileForm({
                                                        ...profileForm,
                                                        address: { ...profileForm.address, country: e.target.value }
                                                    })}
                                                    disabled={!isEditing}
                                                    className={`text-sm ${!isEditing ? "bg-gray-50" : ""}`}
                                                />
                                                <Input
                                                    placeholder="Zip Code"
                                                    value={profileForm.address.zipCode}
                                                    onChange={(e) => setProfileForm({
                                                        ...profileForm,
                                                        address: { ...profileForm.address, zipCode: e.target.value }
                                                    })}
                                                    disabled={!isEditing}
                                                    className={`text-sm ${!isEditing ? "bg-gray-50" : ""}`}
                                                />
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="flex justify-end gap-3 pt-2 sm:pt-4">
                                                <Button
                                                    type="submit"
                                                    disabled={updatingProfile}
                                                    className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto"
                                                    size="sm"
                                                >
                                                    {updatingProfile && <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
                                                    <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                                    Save Changes
                                                </Button>
                                            </div>
                                        )}
                                    </form>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    {/* Education Tab */}
                    <TabsContent value="education">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                        <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5" />
                                        Education Details
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Your academic background</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                        <div className="space-y-2">
                                            <Label className="text-sm">Current Class</Label>
                                            <Input
                                                value={profileForm.education.class}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    education: { ...profileForm.education, class: e.target.value }
                                                })}
                                                disabled={!isEditing}
                                                className={`text-sm ${!isEditing ? "bg-gray-50" : ""}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm">Stream / Subject</Label>
                                            <Input
                                                value={profileForm.education.stream}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    education: { ...profileForm.education, stream: e.target.value }
                                                })}
                                                disabled={!isEditing}
                                                className={`text-sm ${!isEditing ? "bg-gray-50" : ""}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm">School/College Name</Label>
                                            <Input
                                                value={profileForm.education.school}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    education: { ...profileForm.education, school: e.target.value }
                                                })}
                                                disabled={!isEditing}
                                                className={`text-sm ${!isEditing ? "bg-gray-50" : ""}`}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-sm">Percentage / CGPA</Label>
                                            <Input
                                                value={profileForm.education.percentage}
                                                onChange={(e) => setProfileForm({
                                                    ...profileForm,
                                                    education: { ...profileForm.education, percentage: e.target.value }
                                                })}
                                                disabled={!isEditing}
                                                className={`text-sm ${!isEditing ? "bg-gray-50" : ""}`}
                                            />
                                        </div>
                                    </div>

                                    {isEditing && (
                                        <div className="flex justify-end gap-3 pt-4 sm:pt-6">
                                            <Button
                                                onClick={handleUpdateProfile}
                                                disabled={updatingProfile}
                                                className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto"
                                                size="sm"
                                            >
                                                {updatingProfile && <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
                                                <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                                Save Changes
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    </TabsContent>

                    {/* Interests & Skills Tab */}
                    <TabsContent value="interests">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-4 sm:space-y-6"
                        >
                            <Card className="border-0 shadow-lg">
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                        <Heart className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                                        Areas of Interest
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Subjects and fields that interest you</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                                        {profileForm.interests.map((interest, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm bg-blue-100 text-blue-700 hover:bg-blue-200"
                                            >
                                                {interest}
                                                {isEditing && (
                                                    <button
                                                        onClick={() => removeInterest(interest)}
                                                        className="ml-1 sm:ml-2 hover:text-red-600 text-xs"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </Badge>
                                        ))}
                                    </div>
                                    {isEditing && (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Input
                                                placeholder="Add an interest (e.g., Mathematics, Physics)"
                                                value={newInterest}
                                                onChange={(e) => setNewInterest(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addInterest()}
                                                className="text-sm"
                                            />
                                            <Button onClick={addInterest} type="button" size="sm" className="w-full sm:w-auto">
                                                Add
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <Card className="border-0 shadow-lg">
                                <CardHeader className="p-4 sm:p-6">
                                    <CardTitle className="text-lg sm:text-xl flex items-center gap-2">
                                        <Award className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                                        Skills & Abilities
                                    </CardTitle>
                                    <CardDescription className="text-xs sm:text-sm">Your technical and soft skills</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                                    <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                                        {profileForm.skills.map((skill, index) => (
                                            <Badge
                                                key={index}
                                                variant="secondary"
                                                className="px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm bg-green-100 text-green-700 hover:bg-green-200"
                                            >
                                                {skill}
                                                {isEditing && (
                                                    <button
                                                        onClick={() => removeSkill(skill)}
                                                        className="ml-1 sm:ml-2 hover:text-red-600 text-xs"
                                                    >
                                                        ×
                                                    </button>
                                                )}
                                            </Badge>
                                        ))}
                                    </div>
                                    {isEditing && (
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <Input
                                                placeholder="Add a skill (e.g., Programming, Communication)"
                                                value={newSkill}
                                                onChange={(e) => setNewSkill(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                                                className="text-sm"
                                            />
                                            <Button onClick={addSkill} type="button" size="sm" className="w-full sm:w-auto">
                                                Add
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {isEditing && (
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleUpdateProfile}
                                        disabled={updatingProfile}
                                        className="bg-gray-900 hover:bg-gray-800 w-full sm:w-auto"
                                        size="sm"
                                    >
                                        {updatingProfile && <Loader2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 animate-spin" />}
                                        <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                        Save All Changes
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default Profile;