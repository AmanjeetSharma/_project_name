// pages/FindCollege.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Search,
    Filter,
    MapPin,
    Star,
    GraduationCap,
    BookOpen,
    Users,
    Award,
    ChevronRight,
    TrendingUp,
    Building2,
    School,
    DollarSign,
    Clock,
    ExternalLink,
    Heart,
    Share2,
    Download,
    X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const FindCollege = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedCourse, setSelectedCourse] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [feesRange, setFeesRange] = useState([0, 500000]);
    const [selectedColleges, setSelectedColleges] = useState([]);

    // Mock college data
    const colleges = [
        {
            id: 1,
            name: "Indian Institute of Technology Delhi",
            location: "Delhi",
            type: "IIT",
            course: "B.Tech",
            fees: 220000,
            rating: 4.8,
            reviews: 1245,
            acceptanceRate: "2%",
            placement: "₹25 LPA",
            image: "IIT Delhi",
            features: ["AICTE Approved", "NAAC A++", "NIRF Rank #1"],
            scholarships: ["Merit-cum-Means", "SC/ST Scholarship", "IIT Delhi Merit Scholarship"]
        },
        {
            id: 2,
            name: "National Institute of Technology Trichy",
            location: "Tamil Nadu",
            type: "NIT",
            course: "B.Tech",
            fees: 180000,
            rating: 4.6,
            reviews: 982,
            acceptanceRate: "3%",
            placement: "₹22 LPA",
            image: "NIT Trichy",
            features: ["AICTE Approved", "NAAC A+", "NIRF Rank #9"],
            scholarships: ["Institute Scholarship", "Central Sector Scholarship"]
        },
        {
            id: 3,
            name: "Birla Institute of Technology Mesra",
            location: "Jharkhand",
            type: "Private",
            course: "B.Tech",
            fees: 150000,
            rating: 4.5,
            reviews: 856,
            acceptanceRate: "5%",
            placement: "₹18 LPA",
            image: "BIT Mesra",
            features: ["UGC Approved", "NBA Accredited", "NIRF Rank #25"],
            scholarships: ["Merit Scholarship", "BIT Alumni Scholarship"]
        },
        {
            id: 4,
            name: "Delhi University",
            location: "Delhi",
            type: "Central University",
            course: "B.Sc",
            fees: 30000,
            rating: 4.4,
            reviews: 2156,
            acceptanceRate: "8%",
            placement: "₹12 LPA",
            image: "DU",
            features: ["UGC Approved", "NAAC A++", "NIRF Rank #12"],
            scholarships: ["National Scholarship", "Delhi University Merit Scholarship"]
        },
        {
            id: 5,
            name: "Vellore Institute of Technology",
            location: "Tamil Nadu",
            type: "Private",
            course: "B.Tech",
            fees: 200000,
            rating: 4.3,
            reviews: 1532,
            acceptanceRate: "15%",
            placement: "₹16 LPA",
            image: "VIT",
            features: ["UGC Approved", "NAAC A++", "NIRF Rank #18"],
            scholarships: ["VIT Merit Scholarship", "Sports Scholarship"]
        },
        {
            id: 6,
            name: "Jamia Millia Islamia",
            location: "Delhi",
            type: "Central University",
            course: "B.Tech",
            fees: 25000,
            rating: 4.2,
            reviews: 876,
            acceptanceRate: "4%",
            placement: "₹14 LPA",
            image: "JMI",
            features: ["UGC Approved", "NAAC A+", "NIRF Rank #20"],
            scholarships: ["Minority Scholarship", "Merit Scholarship"]
        }
    ];

    // Filter colleges based on search and filters
    const filteredColleges = colleges.filter(college => {
        const matchesSearch = college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            college.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesState = !selectedState || college.location === selectedState;
        const matchesCourse = !selectedCourse || college.course === selectedCourse;
        const matchesFees = college.fees >= feesRange[0] && college.fees <= feesRange[1];

        return matchesSearch && matchesState && matchesCourse && matchesFees;
    });

    const states = [...new Set(colleges.map(c => c.location))];
    const courses = [...new Set(colleges.map(c => c.course))];

    const handleSaveCollege = (collegeId) => {
        if (selectedColleges.includes(collegeId)) {
            setSelectedColleges(selectedColleges.filter(id => id !== collegeId));
        } else {
            setSelectedColleges([...selectedColleges, collegeId]);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-500 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-3xl mx-auto"
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                            Find Your Perfect College
                        </h1>
                        <p className="text-lg sm:text-xl text-blue-100 mb-8">
                            Discover top colleges across India with comprehensive information about courses, fees, placements, and more
                        </p>

                        {/* Search Bar */}
                        <div className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by college name or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 py-6 bg-white text-gray-900 rounded-xl"
                                />
                            </div>
                            <Button
                                onClick={() => setShowFilters(!showFilters)}
                                variant="secondary"
                                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                            >
                                <Filter className="h-4 w-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
            </div>

            {/* Filters Panel */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10"
                    >
                        <Card className="border-0 shadow-lg bg-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-semibold text-gray-900">Filter Colleges</h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setShowFilters(false)}
                                        className="text-gray-500"
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">State/UT</Label>
                                        <select
                                            value={selectedState}
                                            onChange={(e) => setSelectedState(e.target.value)}
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">All States</option>
                                            {states.map(state => (
                                                <option key={state} value={state}>{state}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Course Type</Label>
                                        <select
                                            value={selectedCourse}
                                            onChange={(e) => setSelectedCourse(e.target.value)}
                                            className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">All Courses</option>
                                            {courses.map(course => (
                                                <option key={course} value={course}>{course}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label className="text-sm font-medium mb-2 block">Annual Fees (₹)</Label>
                                        <Slider
                                            min={0}
                                            max={500000}
                                            step={10000}
                                            value={feesRange}
                                            onValueChange={setFeesRange}
                                            className="mt-2"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600 mt-2">
                                            <span>₹{feesRange[0].toLocaleString()}</span>
                                            <span>₹{feesRange[1].toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Results Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {filteredColleges.length} Colleges Found
                        </h2>
                        <p className="text-gray-500 mt-1">Based on your preferences</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Sort by: Relevance
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {filteredColleges.map((college, index) => (
                        <motion.div
                            key={college.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                <div className="relative h-48 bg-gradient-to-r from-gray-900 to-gray-500">
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-all" />
                                    <div className="absolute top-4 right-4 flex gap-2">
                                        <Button
                                            size="icon"
                                            variant="secondary"
                                            className="bg-white/90 hover:bg-white"
                                            onClick={() => handleSaveCollege(college.id)}
                                        >
                                            <Heart className={`h-4 w-4 ${selectedColleges.includes(college.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                        </Button>
                                        <Button size="icon" variant="secondary" className="bg-white/90 hover:bg-white">
                                            <Share2 className="h-4 w-4 text-gray-600" />
                                        </Button>
                                    </div>
                                    <div className="absolute bottom-4 left-4">
                                        <Badge className="bg-white/90 text-gray-900 hover:bg-white">
                                            {college.type}
                                        </Badge>
                                    </div>
                                </div>

                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-xl mb-1">{college.name}</CardTitle>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <MapPin className="h-4 w-4" />
                                                {college.location}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span className="font-semibold">{college.rating}</span>
                                                <span className="text-sm text-gray-500">({college.reviews})</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="flex flex-wrap gap-3">
                                        <Badge variant="outline" className="bg-blue-50">
                                            <GraduationCap className="h-3 w-3 mr-1" />
                                            {college.course}
                                        </Badge>
                                        <Badge variant="outline" className="bg-green-50">
                                            <DollarSign className="h-3 w-3 mr-1" />
                                            ₹{college.fees.toLocaleString()}/year
                                        </Badge>
                                        <Badge variant="outline" className="bg-purple-50">
                                            <TrendingUp className="h-3 w-3 mr-1" />
                                            {college.placement}
                                        </Badge>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Acceptance Rate</p>
                                            <p className="font-semibold text-gray-900">{college.acceptanceRate}</p>
                                        </div>
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">Avg Package</p>
                                            <p className="font-semibold text-gray-900">{college.placement}</p>
                                        </div>
                                        <div className="p-2 bg-gray-50 rounded-lg">
                                            <p className="text-xs text-gray-500">NIRF Rank</p>
                                            <p className="font-semibold text-gray-900">{college.features[2].split('#')[1]}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        {college.features.map((feature, idx) => (
                                            <Badge key={idx} variant="secondary" className="bg-gray-100">
                                                {feature}
                                            </Badge>
                                        ))}
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <Button className="flex-1 bg-gray-900 hover:bg-gray-800">
                                            View Details
                                            <ExternalLink className="h-4 w-4 ml-2" />
                                        </Button>
                                        <Button variant="outline" className="flex-1">
                                            <Download className="h-4 w-4 mr-2" />
                                            Brochure
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {filteredColleges.length === 0 && (
                    <div className="text-center py-12">
                        <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found</h3>
                        <p className="text-gray-500">Try adjusting your filters or search criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FindCollege;