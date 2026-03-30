// pages/CollegeDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    ArrowLeft,
    MapPin,
    Star,
    GraduationCap,
    Building2,
    TrendingUp,
    ExternalLink,
    Heart,
    Share2,
    Download,
    CheckCircle,
    Globe,
    Phone,
    Mail,
    Calendar,
    Loader2,
    XCircle,
    BookOpen,
    Award,
    Users,
    DollarSign,
    Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollege } from "../../context/CollegeContext";

const CollegeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loading, selectedCollege, getCollegeById } = useCollege();
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (id) {
            getCollegeById(id);
        }
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    if (!selectedCollege) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50">
                <Building2 className="h-16 w-16 text-gray-300 mb-4" />
                <h2 className="text-xl font-semibold text-gray-900 mb-2">College not found</h2>
                <p className="text-gray-500 mb-4">The college you're looking for doesn't exist or has been removed.</p>
                <Button onClick={() => navigate("/colleges")} className="bg-gray-900 hover:bg-gray-800">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Colleges
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white">
                <div className="absolute inset-0 bg-black/30" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Button
                            variant="ghost"
                            onClick={() => navigate("/colleges")}
                            className="mb-6 text-white hover:bg-white/20"
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Colleges
                        </Button>

                        <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                                        {selectedCollege.collegeId}
                                    </Badge>
                                    <Badge className={`${selectedCollege.admissionStatus === 'Open' ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'} border-0`}>
                                        {selectedCollege.admissionStatus}
                                    </Badge>
                                </div>
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                                    {selectedCollege.name}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-gray-200">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5" />
                                        <span>{selectedCollege.location?.city}, {selectedCollege.location?.state}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                        <span>4.5 Rating</span>
                                    </div>
                                    <Badge className="bg-white/20 text-white hover:bg-white/30">
                                        {selectedCollege.type}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <Button
                                    variant="secondary"
                                    className="bg-white/20 hover:bg-white/30 text-white"
                                    onClick={() => setIsSaved(!isSaved)}
                                >
                                    <Heart className={`h-4 w-4 mr-2 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                                    {isSaved ? "Saved" : "Save"}
                                </Button>
                                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white">
                                    <Share2 className="h-4 w-4 mr-2" />
                                    Share
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <Tabs defaultValue="overview" className="w-full">
                                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="courses">Courses & Fees</TabsTrigger>
                                    <TabsTrigger value="admission">Admission</TabsTrigger>
                                </TabsList>

                                <TabsContent value="overview" className="mt-6 space-y-6">
                                    {/* About Section */}
                                    <Card className="border-0 shadow-md">
                                        <CardHeader>
                                            <CardTitle className="text-xl">About {selectedCollege.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-600 leading-relaxed">
                                                {selectedCollege.name} is a {selectedCollege.type} located in {selectedCollege.location?.city}, {selectedCollege.location?.state}.
                                                Affiliated with {selectedCollege.affiliation}, this institution offers quality education across {selectedCollege.streams?.join(', ')} streams.
                                                The college has a cutoff of {selectedCollege.cutoff}% and provides excellent academic environment.
                                            </p>
                                        </CardContent>
                                    </Card>

                                    {/* Key Highlights */}
                                    <Card className="border-0 shadow-md">
                                        <CardHeader>
                                            <CardTitle className="text-xl">Key Highlights</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <GraduationCap className="h-5 w-5 text-blue-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Streams Offered</p>
                                                        <p className="font-semibold text-gray-900">{selectedCollege.streams?.join(', ')}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <TrendingUp className="h-5 w-5 text-green-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Cutoff Percentage</p>
                                                        <p className="font-semibold text-gray-900">{selectedCollege.cutoff}%</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <Building2 className="h-5 w-5 text-purple-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">College Type</p>
                                                        <p className="font-semibold text-gray-900">{selectedCollege.type}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                    <Award className="h-5 w-5 text-yellow-500" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Affiliation</p>
                                                        <p className="font-semibold text-gray-900">{selectedCollege.affiliation}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Facilities */}
                                    <Card className="border-0 shadow-md">
                                        <CardHeader>
                                            <CardTitle className="text-xl">Facilities & Infrastructure</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                                {selectedCollege.facilities?.map((facility, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                                        <span className="text-sm text-gray-700">{facility}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>

                                    {/* Scholarships */}
                                    {selectedCollege.scholarshipsAvailableStatus && selectedCollege.scholarshipsAvailable?.length > 0 && (
                                        <Card className="border-0 shadow-md">
                                            <CardHeader>
                                                <CardTitle className="text-xl">Scholarships Available</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex flex-wrap gap-2">
                                                    {selectedCollege.scholarshipsAvailable.map((scholarship, idx) => (
                                                        <Badge key={idx} className="bg-green-100 text-green-700">
                                                            {scholarship}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    )}
                                </TabsContent>

                                <TabsContent value="courses" className="mt-6">
                                    <Card className="border-0 shadow-md">
                                        <CardHeader>
                                            <CardTitle className="text-xl">Courses Offered</CardTitle>
                                            <CardDescription>Detailed information about courses, duration, and eligibility</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                {selectedCollege.streams?.map((stream, idx) => (
                                                    <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                                        <div className="flex flex-wrap justify-between items-start mb-3">
                                                            <h3 className="font-semibold text-gray-900 text-lg">{stream}</h3>
                                                            <Badge className="bg-blue-100 text-blue-700">Full Time</Badge>
                                                        </div>
                                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                                            <div>
                                                                <p className="text-gray-500">Duration</p>
                                                                <p className="font-medium">3-4 Years</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500">Eligibility</p>
                                                                <p className="font-medium">10+2 with {selectedCollege.cutoff}%</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-gray-500">Course Type</p>
                                                                <p className="font-medium">Regular</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                <TabsContent value="admission" className="mt-6 space-y-6">
                                    <Card className="border-0 shadow-md">
                                        <CardHeader>
                                            <CardTitle className="text-xl">Admission Process</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0">1</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Application Form</h4>
                                                    <p className="text-gray-600">Fill out the online application form with your personal and academic details.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0">2</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Merit List / Entrance Exam</h4>
                                                    <p className="text-gray-600">Admission based on merit or entrance exam scores. Minimum cutoff required: {selectedCollege.cutoff}%</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0">3</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Counseling & Seat Allotment</h4>
                                                    <p className="text-gray-600">Shortlisted candidates will be called for counseling and seat allotment process.</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold flex-shrink-0">4</div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Document Verification & Fee Payment</h4>
                                                    <p className="text-gray-600">Complete document verification and pay the admission fee to confirm your seat.</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock className="h-4 w-4 text-yellow-600" />
                                                    <span className="font-semibold text-yellow-800">Current Status</span>
                                                </div>
                                                <p className="text-yellow-700">
                                                    Admissions are currently {selectedCollege.admissionStatus?.toLowerCase()}.
                                                    {selectedCollege.admissionStatus === 'Closed' && ' Applications for the current session are not being accepted.'}
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Contact Information */}
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-xl">Contact Information</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                        <div>
                                            <p className="text-sm text-gray-500">Address</p>
                                            <p className="text-gray-700">{selectedCollege.location?.city}, {selectedCollege.location?.state}</p>
                                        </div>
                                    </div>
                                    {selectedCollege.contact?.phone && (
                                        <div className="flex items-center gap-3">
                                            <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Phone</p>
                                                <p className="text-gray-700">+91-{selectedCollege.contact.phone}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedCollege.contact?.email && (
                                        <div className="flex items-center gap-3">
                                            <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Email</p>
                                                <p className="text-gray-700">{selectedCollege.contact.email}</p>
                                            </div>
                                        </div>
                                    )}
                                    {selectedCollege.contact?.website && (
                                        <div className="flex items-center gap-3">
                                            <Globe className="h-5 w-5 text-gray-400 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Website</p>
                                                <a href={selectedCollege.contact.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline break-all">
                                                    {selectedCollege.contact.website}
                                                </a>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="border-0 shadow-md">
                                <CardHeader>
                                    <CardTitle className="text-xl">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Button className="w-full bg-gray-900 hover:bg-gray-800">
                                        <Download className="h-4 w-4 mr-2" />
                                        Download Brochure
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        disabled={selectedCollege.admissionStatus === 'Closed'}
                                    >
                                        <ExternalLink className="h-4 w-4 mr-2" />
                                        Apply Now
                                    </Button>
                                    <Button variant="outline" className="w-full">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Schedule a Visit
                                    </Button>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CollegeDetails;