import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCollege } from "../../context/CollegeContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
    ArrowLeft, 
    MapPin, 
    School, 
    Sparkles, 
    CheckCircle2, 
    Target, 
    Scale, 
    AlertTriangle, 
    XCircle,
    Search,
    TrendingUp,
    LayoutDashboard
} from "lucide-react";
import { schadenToast } from "@/components/schadenToast/ToastConfig";

const Suggestion = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { getFilters, filters, getCollegeSuggestion } = useCollege();

    const [selectedState, setSelectedState] = useState("");
    const [suggestionData, setSuggestionData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadFilters = async () => {
            try { await getFilters(); } 
            catch (err) { console.error("Failed to load filters", err); }
        };
        loadFilters();
    }, []);

    const getAdmissionStatus = (diff) => {
        if (diff >= 10) return { 
            label: "Safe", icon: <CheckCircle2 className="h-4 w-4" />, 
            color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500",
            desc: "High probability of admission." 
        };
        if (diff >= 0) return { 
            label: "Target", icon: <Target className="h-4 w-4" />, 
            color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500",
            desc: "Good chance of selection." 
        };
        if (diff >= -10) return { 
            label: "Slight Risk", icon: <Scale className="h-4 w-4" />, 
            color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500",
            desc: "Admission is uncertain." 
        };
        if (diff >= -30) return { 
            label: "Reach", icon: <AlertTriangle className="h-4 w-4" />, 
            color: "text-orange-600", bg: "bg-orange-50", bar: "bg-orange-500",
            desc: "Competitive; very difficult." 
        };
        return { 
            label: "Dream", icon: <XCircle className="h-4 w-4" />, 
            color: "text-red-600", bg: "bg-red-50", bar: "bg-red-500",
            desc: "Admission is unlikely." 
        };
    };

    const handleSubmit = async () => {
        if (!selectedState) {
            schadenToast.error("Please select a state");
            return;
        }
        setLoading(true);
        try {
            const res = await getCollegeSuggestion({ testId, state: selectedState });
            setSuggestionData(res);
        } catch (err) {
            schadenToast.error("Failed to fetch suggestions");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 selection:bg-primary/10 pb-20">
            <div className="max-w-6xl mx-auto px-4 py-6 md:py-10">
                
                {/* Slim Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="h-8 px-2 text-zinc-500 hover:text-zinc-900">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        <Sparkles className="h-3 w-3 text-amber-500" />
                        AI Powered College Suggestions
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Search & Filters Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black tracking-tighter italic">COLLEGE <span className="text-primary">FINDER</span></h1>
                            <p className="text-sm text-zinc-500">Discover institutions matching your academic profile.</p>
                        </div>

                        <div className="p-6 bg-zinc-50 border border-zinc-200 rounded-2xl space-y-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Region Selection</label>
                                <select
                                    className="w-full bg-white border border-zinc-200 p-3 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                                    value={selectedState}
                                    onChange={(e) => setSelectedState(e.target.value)}
                                >
                                    <option value="">Select Target State</option>
                                    {filters?.states?.map((state, idx) => (
                                        <option key={idx} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>

                            <Button 
                                className="w-full h-12 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl shadow-xl shadow-zinc-200 transition-all active:scale-[0.98]"
                                onClick={handleSubmit} 
                                disabled={loading}
                            >
                                {loading ? "Analyzing Data..." : "Generate Recommendations"}
                            </Button>
                        </div>

                        {suggestionData && (
                            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                                <div className="flex items-center gap-2 text-xs font-bold text-primary uppercase mb-2">
                                    <TrendingUp className="h-3 w-3" /> Admission Insights
                                </div>
                                <p className="text-[11px] text-zinc-500 leading-relaxed font-medium">
                                    Our AI evaluated <strong>{suggestionData.total_colleges_evaluated}</strong> institutions in {selectedState}. 
                                    Predictions are based on your most recent test performance.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right: Results Content */}
                    <div className="lg:col-span-8 space-y-6">
                        <AnimatePresence mode="wait">
                            {!suggestionData && !loading ? (
                                <motion.div 
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                    className="h-[400px] flex flex-col items-center justify-center border border-dashed border-zinc-200 rounded-3xl bg-zinc-50/50 text-zinc-400"
                                >
                                    <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                        <Search className="h-6 w-6 opacity-20" />
                                    </div>
                                    <p className="text-sm font-medium">Select a state to see matching colleges</p>
                                </motion.div>
                            ) : loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="h-32 w-full bg-zinc-100 animate-pulse rounded-2xl" />
                                    ))}
                                </div>
                            ) : (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="space-y-6"
                                >
                                    {/* Stream Result Card */}
                                    <div className="bg-zinc-900 text-white p-6 rounded-3xl flex items-center justify-between overflow-hidden relative shadow-2xl shadow-zinc-300">
                                        <div className="relative z-10">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-1">Recommended Stream</p>
                                            <h2 className="text-3xl font-black italic">{suggestionData.predicted_stream}</h2>
                                        </div>
                                        <div className="h-24 w-24 bg-white/10 rounded-full blur-2xl absolute -right-4 -bottom-4" />
                                        <Sparkles className="h-10 w-10 text-amber-400 opacity-50 relative z-10" />
                                    </div>

                                    {/* College List */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between px-2">
                                            <h3 className="text-xs font-black text-zinc-400 uppercase tracking-widest">Recommended Institutions</h3>
                                            <Badge variant="outline" className="text-[10px] uppercase font-bold text-zinc-400 border-zinc-200">{suggestionData.recommendations.length} Matches Found</Badge>
                                        </div>

                                        {suggestionData.recommendations.map((college, idx) => {
                                            const status = getAdmissionStatus(college.score_difference);
                                            return (
                                                <motion.div
                                                    key={idx}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.05 }}
                                                >
                                                    <Card className="border-zinc-200 shadow-none hover:border-zinc-300 transition-all group overflow-hidden">
                                                        <CardContent className="p-0">
                                                            <div className="flex flex-col md:flex-row">
                                                                <div className="flex-1 p-6 space-y-4 border-b md:border-b-0 md:border-r border-zinc-100">
                                                                    <div className="flex items-center gap-2">
                                                                        <Badge className="bg-zinc-100 text-zinc-500 rounded font-bold text-[9px] border-none">#{college.rank} RANK</Badge>
                                                                        <Badge className="bg-zinc-900 text-white rounded font-bold text-[9px] uppercase tracking-wider">{college.college_type}</Badge>
                                                                    </div>
                                                                    <h3 className="text-lg font-bold text-zinc-900 group-hover:text-primary transition-colors leading-tight">
                                                                        {college.college_name}
                                                                    </h3>
                                                                    <div className="flex items-center gap-4 pt-1">
                                                                        <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-500">
                                                                            <MapPin className="h-3 w-3" /> {college.college_state}
                                                                        </div>
                                                                        <div className="flex items-center gap-1 text-[11px] font-bold text-zinc-500">
                                                                            <School className="h-3 w-3" /> Cutoff: {college.last_year_cutoff}%
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className={`md:w-64 p-6 flex flex-col justify-center ${status.bg}`}>
                                                                    <div className="flex items-center gap-2 mb-1">
                                                                        <span className={status.color}>{status.icon}</span>
                                                                        <span className={`text-xs font-black uppercase tracking-tighter ${status.color}`}>
                                                                            {status.label}
                                                                        </span >
                                                                    </div>
                                                                    <p className="text-[10px] font-bold text-zinc-500 leading-tight mb-4 uppercase tracking-tighter opacity-70 italic">
                                                                        {status.desc}
                                                                    </p>
                                                                    <div className="space-y-2">
                                                                        <div className="flex justify-between items-center">
                                                                            <span className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Match Score</span>
                                                                            <span className={`text-xs font-black ${status.color}`}>
                                                                                {college.score_difference > 0 ? "+" : ""}{college.score_difference}%
                                                                            </span>
                                                                        </div>
                                                                        <Progress 
                                                                            value={Math.min(Math.max((college.suitability_score * 100), 10), 100)} 
                                                                            className="h-1.5 bg-white shadow-inner" 
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                    
                                    <div className="pt-8 flex justify-center">
                                        <Button variant="outline" onClick={() => navigate("/dashboard")} className="rounded-xl px-8 h-12 text-zinc-500 border-zinc-200 cursor-pointer hover:text-zinc-900 hover:border-zinc-300 hover:bg-black hover:text-white  transition-all group">
                                            <LayoutDashboard className="mr-2 h-4 w-4" /> Return to Dashboard
                                        </Button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Suggestion;