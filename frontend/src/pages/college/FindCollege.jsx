// pages/FindCollege.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Filter,
    MapPin,
    TrendingUp,
    Building2,
    ExternalLink,
    Share2,
    X,
    Loader2,
    ChevronLeft,
    ChevronRight,
    RotateCcw,
    Sparkles
} from "lucide-react";
import { schadenToast } from "@/components/schadenToast/ToastConfig.jsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { useCollege } from "../../context/CollegeContext";
import { FaBookmark } from "react-icons/fa6";
import { FaStar } from "react-icons/fa";

const FindCollege = () => {
    const navigate = useNavigate();
    const { loading, colleges, pagination, getColleges, stateUTs } = useCollege();

    const [searchQuery, setSearchQuery] = useState("");
    const [selectedState, setSelectedState] = useState("");
    const [selectedStream, setSelectedStream] = useState("");
    const [selectedType, setSelectedType] = useState("");
    const [showFilters, setShowFilters] = useState(false);
    const [cutoffRange, setCutoffRange] = useState([0, 100]);
    const [tempCutoffRange, setTempCutoffRange] = useState([0, 100]);
    const [savedColleges, setSavedColleges] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState("");
    const [hasAppliedFilters, setHasAppliedFilters] = useState(false);
    const [stateSearchQuery, setStateSearchQuery] = useState("");

    const streams = [...new Set(colleges.flatMap(c => c.streams).filter(Boolean))];
    const types = [...new Set(colleges.map(c => c.type).filter(Boolean))];

    const filteredStates = stateUTs.filter(state =>
        state.toLowerCase().includes(stateSearchQuery.toLowerCase())
    );

    const hasActiveFilters = selectedState || selectedStream || selectedType ||
        cutoffRange[0] > 0 || cutoffRange[1] < 100;

    const applyFilters = () => {
        setCutoffRange(tempCutoffRange);
        setHasAppliedFilters(true);
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSelectedState("");
        setSelectedStream("");
        setSelectedType("");
        setTempCutoffRange([0, 100]);
        setCutoffRange([0, 100]);
        setHasAppliedFilters(false);
        setCurrentPage(1);
        setStateSearchQuery("");
    };

    useEffect(() => {
        const fetchColleges = async () => {
            const params = {
                page: currentPage,
                limit: 10,
                ...(selectedState && { state: selectedState }),
                ...(selectedStream && { stream: selectedStream }),
                ...(selectedType && { type: selectedType }),
                ...(cutoffRange[0] > 0 && { minCutoff: cutoffRange[0] }),
                ...(cutoffRange[1] < 100 && { maxCutoff: cutoffRange[1] }),
            };
            await getColleges(params);
        };
        fetchColleges();
    }, [currentPage, selectedState, selectedStream, selectedType, cutoffRange]);

    const filteredColleges = colleges.filter(college => {
        return (
            college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            college.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            college.location?.state?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const toggleSave = (collegeId) => {
        setSavedColleges(prev => {
            const isSaved = prev.includes(collegeId);

            if (!isSaved) {
                // Only show toast when adding/ saving
                schadenToast.success("College Bookmarked", {
                    duration: 1500,
                    position: "top-center",
                });
            }

            return isSaved
                ? prev.filter(id => id !== collegeId)
                : [...prev, collegeId];
        });
    };

    const handleViewDetails = (collegeId) => {
        navigate(`/colleges/${collegeId}`);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= (pagination?.totalPages || 1)) {
            setCurrentPage(page);
            setPageInput("");
        }
    };

    const handlePageInputSubmit = (e) => {
        e.preventDefault();
        const pageNum = parseInt(pageInput);
        if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= (pagination?.totalPages || 1)) {
            setCurrentPage(pageNum);
            setPageInput("");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section with Blur Effect */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative max-w-6xl mx-auto px-4 py-12 sm:py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-2xl mx-auto"
                    >
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">
                            Find Your Perfect College
                        </h1>
                        <p className="text-sm sm:text-base text-gray-200 mb-6">
                            Discover top colleges across India — courses, fees, placements & more
                        </p>

                        {/* Search Bar */}
                        <div className="flex gap-2 max-w-xl mx-auto">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search by name or location..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 py-2 h-10 bg-white text-gray-900 rounded-lg text-sm"
                                />
                            </div>
                            <Button
                                onClick={() => setShowFilters(!showFilters)}
                                size="sm"
                                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 h-10 px-3"
                            >
                                <Filter className="h-4 w-4 sm:mr-1.5" />
                                <span className="hidden sm:inline text-sm">Filters</span>
                            </Button>
                        </div>
                    </motion.div>
                </div>
                {/* Gradient blur overlay at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent" />
            </div>

            {/* Filters Panel with Blur Effect */}
            <AnimatePresence>
                {showFilters && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-sm sticky top-0 z-20"
                    >
                        <div className="max-w-6xl mx-auto px-4 py-4">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-sm font-semibold text-gray-900">Filter Colleges</h3>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowFilters(false)}
                                    className="h-7 w-7 p-0 text-gray-400"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {/* State/UT */}
                                <div>
                                    <Label className="text-xs font-medium mb-1.5 block text-gray-600">State/UT</Label>
                                    <div className="relative mb-1.5">
                                        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Search state..."
                                            value={stateSearchQuery}
                                            onChange={(e) => setStateSearchQuery(e.target.value)}
                                            className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/80"
                                        />
                                    </div>
                                    <select
                                        value={selectedState}
                                        onChange={(e) => setSelectedState(e.target.value)}
                                        className="w-full p-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/80"
                                        size={Math.min(4, filteredStates.length + 1)}
                                    >
                                        <option value="">All States/UTs</option>
                                        {filteredStates.map(state => (
                                            <option key={state} value={state}>{state}</option>
                                        ))}
                                    </select>
                                    {filteredStates.length === 0 && stateSearchQuery && (
                                        <p className="text-xs text-red-500 mt-1">No matching state found</p>
                                    )}
                                </div>

                                {/* Stream */}
                                <div>
                                    <Label className="text-xs font-medium mb-1.5 block text-gray-600">Stream</Label>
                                    <select
                                        value={selectedStream}
                                        onChange={(e) => setSelectedStream(e.target.value)}
                                        className="w-full p-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/80"
                                    >
                                        <option value="">All Streams</option>
                                        {streams.map(stream => (
                                            <option key={stream} value={stream}>{stream}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* College Type */}
                                <div>
                                    <Label className="text-xs font-medium mb-1.5 block text-gray-600">College Type</Label>
                                    <select
                                        value={selectedType}
                                        onChange={(e) => setSelectedType(e.target.value)}
                                        className="w-full p-1.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/80"
                                    >
                                        <option value="">All Types</option>
                                        {types.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Cutoff */}
                                <div>
                                    <Label className="text-xs font-medium mb-1.5 block text-gray-600">
                                        Cutoff: {tempCutoffRange[0]}% – {tempCutoffRange[1]}%
                                    </Label>
                                    <Slider
                                        min={0}
                                        max={100}
                                        step={1}
                                        value={tempCutoffRange}
                                        onValueChange={setTempCutoffRange}
                                        className="mt-3"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
                                <Button
                                    onClick={resetFilters}
                                    variant="outline"
                                    size="sm"
                                    className="flex-1 text-sm h-8 cursor-pointer"
                                >
                                    <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                                    Reset
                                </Button>
                                <Button
                                    onClick={applyFilters}
                                    size="sm"
                                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-sm h-8 cursor-pointer"
                                >
                                    <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                                    Apply Filters
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Filters */}
            {hasActiveFilters && (
                <div className="max-w-6xl mx-auto px-4 mt-3">
                    <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-blue-50/80 backdrop-blur-sm rounded-lg border border-blue-100">
                        <span className="text-xs font-medium text-blue-700">Active:</span>
                        {selectedState && <Badge className="text-xs h-5 bg-blue-100 text-blue-700 hover:bg-blue-100">State: {selectedState}</Badge>}
                        {selectedStream && <Badge className="text-xs h-5 bg-blue-100 text-blue-700 hover:bg-blue-100">Stream: {selectedStream}</Badge>}
                        {selectedType && <Badge className="text-xs h-5 bg-blue-100 text-blue-700 hover:bg-blue-100">Type: {selectedType}</Badge>}
                        {(cutoffRange[0] > 0 || cutoffRange[1] < 100) && (
                            <Badge className="text-xs h-5 bg-blue-100 text-blue-700 hover:bg-blue-100">
                                Cutoff: {cutoffRange[0]}%–{cutoffRange[1]}%
                            </Badge>
                        )}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={resetFilters}
                            className="ml-auto h-6 text-xs text-blue-700 hover:text-blue-800 hover:bg-blue-100 px-2"
                        >
                            <RotateCcw className="h-3 w-3 mr-1" />
                            Clear All
                        </Button>
                    </div>
                </div>
            )}

            {/* Results Section with Background Blur */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-base sm:text-lg font-bold text-gray-900">
                            {loading ? "Loading..." : `${filteredColleges.length} Colleges Found`}
                        </h2>
                        <p className="text-xs text-gray-500">Based on your preferences</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <Loader2 className="h-7 w-7 animate-spin text-gray-900" />
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredColleges.map((college, index) => {
                                const isSaved = savedColleges.includes(college._id);
                                return (
                                    <motion.div
                                        key={college._id}
                                        initial={{ opacity: 0, y: 12 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.04 }}
                                    >
                                        <Card className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden bg-white/90 backdrop-blur-sm">
                                            <CardHeader className="pb-2 pt-4 px-4">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="flex-1 min-w-0">
                                                        <CardTitle className="text-sm sm:text-base font-semibold leading-snug line-clamp-2 text-gray-900">
                                                            {college.name}
                                                        </CardTitle>
                                                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                                                            <MapPin className="h-3 w-3 flex-shrink-0" />
                                                            <span className="truncate">
                                                                {college.location?.city}, {college.location?.state}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-1 flex-shrink-0">
                                                        {/* Star button — synced with bookmark */}
                                                        <span
                                                            className="p-1.5 rounded-md transition-colors"
                                                        >
                                                            <FaStar
                                                                className={`h-5 w-5 transition-colors ${isSaved
                                                                    ? "text-yellow-400 fill-yellow-400"
                                                                    : "text-gray-300"
                                                                    }`}
                                                            />
                                                        </span>
                                                        <button
                                                            className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
                                                            aria-label="Share"
                                                        >
                                                            <Share2 className="h-4 w-4 text-gray-400" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </CardHeader>

                                            <CardContent className="px-4 pb-4 space-y-3">
                                                {/* Stats Row */}
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-2.5 border border-gray-100">
                                                        <div className="flex items-center justify-between mb-0.5">
                                                            <span className="text-xs text-gray-500">Cutoff</span>
                                                            <TrendingUp className="h-3 w-3 text-green-500" />
                                                        </div>
                                                        <p className="text-lg font-bold text-gray-900 leading-none">
                                                            {college.cutoff}%
                                                        </p>
                                                        <p className="text-xs text-green-600 mt-0.5">Required Score</p>
                                                    </div>
                                                    <div className="bg-gray-50/80 backdrop-blur-sm rounded-lg p-2.5 border border-gray-100">
                                                        <div className="flex items-center justify-between mb-0.5">
                                                            <span className="text-xs text-gray-500">Type</span>
                                                            <Building2 className="h-3 w-3 text-blue-500" />
                                                        </div>
                                                        <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
                                                            {college.type}
                                                        </p>
                                                        <p className="text-xs text-gray-500 mt-0.5">Institution</p>
                                                    </div>
                                                </div>

                                                {/* Streams */}
                                                <div>
                                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Streams</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {college.streams?.slice(0, 3).map((stream, idx) => (
                                                            <Badge
                                                                key={idx}
                                                                variant="outline"
                                                                className="text-xs h-5 px-1.5 bg-white/80 border-gray-200 text-gray-600"
                                                            >
                                                                {stream}
                                                            </Badge>
                                                        ))}
                                                        {college.streams?.length > 3 && (
                                                            <Badge variant="outline" className="text-xs h-5 px-1.5 bg-gray-100/80 border-gray-200 text-gray-500">
                                                                +{college.streams.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex gap-2 pt-1">
                                                    <Button
                                                        size="sm"
                                                        className="flex-1 h-8 text-xs bg-gray-900 hover:bg-gray-800"
                                                        onClick={() => handleViewDetails(college._id)}
                                                    >
                                                        View Details
                                                        <ExternalLink className="h-3 w-3 ml-1.5" />
                                                    </Button>
                                                    {/* Bookmark button — synced with star */}
                                                    <button
                                                        onClick={() => toggleSave(college._id)}
                                                        className={`h-8 w-8 flex items-center justify-center rounded-md border transition-colors ${isSaved
                                                            ? "border-gray-900 bg-gray-900 text-white"
                                                            : "border-gray-200 hover:border-gray-300 text-gray-500 hover:bg-gray-50"
                                                            }`}
                                                        aria-label="Bookmark college"
                                                    >
                                                        <FaBookmark className="h-3.5 w-3.5" />
                                                    </button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 mt-6">
                                <div className="flex items-center gap-1">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronLeft className="h-4 w-4" />
                                    </Button>

                                    <div className="flex gap-1">
                                        {(() => {
                                            const totalPages = pagination.totalPages;
                                            const current = currentPage;
                                            let pages = [];

                                            if (totalPages <= 7) {
                                                for (let i = 1; i <= totalPages; i++) pages.push(i);
                                            } else if (current <= 3) {
                                                pages = [1, 2, 3, 4, '...', totalPages];
                                            } else if (current >= totalPages - 2) {
                                                pages = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
                                            } else {
                                                pages = [1, '...', current - 1, current, current + 1, '...', totalPages];
                                            }

                                            return pages.map((page, idx) =>
                                                page === '...' ? (
                                                    <span key={idx} className="px-2 py-1 text-xs text-gray-400">...</span>
                                                ) : (
                                                    <Button
                                                        key={idx}
                                                        variant={currentPage === page ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => handlePageChange(page)}
                                                        className={`h-8 w-8 p-0 text-xs ${currentPage === page ? "bg-gray-900 hover:bg-gray-800" : ""}`}
                                                    >
                                                        {page}
                                                    </Button>
                                                )
                                            );
                                        })()}
                                    </div>

                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === pagination.totalPages}
                                        className="h-8 w-8 p-0"
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </div>

                                <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5">
                                    <span className="text-xs text-gray-500">Go to</span>
                                    <input
                                        type="number"
                                        value={pageInput}
                                        onChange={(e) => setPageInput(e.target.value)}
                                        min={1}
                                        max={pagination.totalPages}
                                        className="w-14 px-2 py-1 text-xs border border-gray-300 rounded-md text-center focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white/80"
                                        placeholder="..."
                                    />
                                    <Button type="submit" size="sm" variant="outline" className="h-7 text-xs px-2">Go</Button>
                                </form>
                            </div>
                        )}

                        {filteredColleges.length === 0 && (
                            <div className="text-center py-12">
                                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-sm font-medium text-gray-900 mb-1">No colleges found</h3>
                                <p className="text-xs text-gray-500">Try adjusting your filters or search criteria</p>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default FindCollege;