import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useTest } from "../../../context/TestContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import {
    Clock,
    Eye,
    PlayCircle,
    Trophy,
    Calendar,
    TrendingUp,
    CheckCircle2,
    BarChart3,
    ArrowLeft,
    ChevronRight,
    Zap,
    Target,
    Award
} from "lucide-react";
import PageLoader from "@/utils/PageLoader";

const AllTests = () => {
    const { getUserAllTests, loading } = useTest();
    const navigate = useNavigate();

    const [tests, setTests] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [tab, setTab] = useState("all");
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        averageScore: 0,
        bestScore: 0
    });

    useEffect(() => {
        fetchTests();
    }, []);

    const fetchTests = async () => {
        try {
            const data = await getUserAllTests();
            setTests(data);
            setFiltered(data);

            const completed = data.filter(t => t.status === "submitted");
            const avgScore = completed.length > 0
                ? completed.reduce((sum, t) => sum + (t.scores?.aggregate || 0), 0) / completed.length
                : 0;
            const bestScore = completed.length > 0
                ? Math.max(...completed.map(t => t.scores?.aggregate || 0))
                : 0;

            setStats({
                total: data.length,
                completed: completed.length,
                averageScore: Math.round(avgScore),
                bestScore: bestScore
            });
        } catch (error) {
            console.error(error);
        }
    };

    const handleTab = (value) => {
        setTab(value);
        setFiltered(value === "all" ? tests : tests.filter(t => t.status === value));
    };

    const scoreConfig = (score) => {
        if (score >= 80) return { label: "Elite", cls: "bg-emerald-100 text-emerald-700 border-emerald-200", stroke: "#10b981", text: "text-emerald-600" };
        if (score >= 60) return { label: "Advanced", cls: "bg-blue-100 text-blue-700 border-blue-200", stroke: "#3b82f6", text: "text-blue-600" };
        return { label: "Standard", cls: "bg-slate-100 text-slate-700 border-slate-200", stroke: "#64748b", text: "text-slate-600" };
    };

    // if (loading) return <PageLoader />;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50 selection:bg-zinc-900 selection:text-white pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-8">

                {/* Header Section */}
                <div className="space-y-4">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate("/dashboard")}
                        className="h-8 px-0 text-slate-500 hover:text-slate-900 hover:bg-transparent group"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Back to Dashboard
                    </Button>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
                                My Assessments  
                            </h1>
                            <p className="text-sm text-slate-500 mt-1">
                                View all your assessment history and performance
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-3 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm">
                                <div className="p-1.5 bg-amber-50 rounded-lg">
                                    <Trophy className="h-4 w-4 text-amber-500" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Personal Best</p>
                                    <p className="text-xl font-bold text-slate-900">{stats.bestScore}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Total Tests", value: stats.total, icon: BarChart3, color: "text-slate-600", bg: "bg-slate-100" },
                        { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
                        { label: "Avg. Score", value: `${stats.averageScore}%`, icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-100" },
                        { label: "Milestones", value: Math.floor(stats.completed / 5), icon: Award, color: "text-amber-600", bg: "bg-amber-100" },
                    ].map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-300 rounded-2xl bg-white">
                                <CardContent className="p-5">
                                    <div className={`p-2 rounded-xl ${s.bg} w-fit mb-3`}>
                                        <s.icon className={`h-4 w-4 ${s.color}`} />
                                    </div>
                                    <p className="text-2xl font-bold text-slate-900">{s.value}</p>
                                    <p className="text-xs font-medium text-slate-500 mt-1 uppercase tracking-wide">{s.label}</p>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Test List Section */}
                <div className="space-y-6">
                    {/* Tabs */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <Tabs defaultValue="all" onValueChange={handleTab} className="w-full sm:w-auto">
                            <TabsList className="bg-slate-100 p-1 rounded-xl h-auto">
                                <TabsTrigger
                                    value="all"
                                    className="rounded-lg px-5 py-2 text-xs font-semibold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900"
                                >
                                    All Tests
                                </TabsTrigger>
                                <TabsTrigger
                                    value="submitted"
                                    className="rounded-lg px-5 py-2 text-xs font-semibold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900"
                                >
                                    Completed
                                </TabsTrigger>
                                <TabsTrigger
                                    value="in-progress"
                                    className="rounded-lg px-5 py-2 text-xs font-semibold uppercase tracking-wider data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-slate-900"
                                >
                                    In Progress
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>

                        <p className="text-xs text-slate-400">
                            {filtered.length} test{filtered.length !== 1 ? 's' : ''} found
                        </p>
                    </div>

                    {/* Test Cards */}
                    <div className="grid gap-3"> {/* Tighter gap */}
                        <AnimatePresence mode="popLayout">
                            {filtered.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12 border-2 border-dashed border-slate-100 rounded-3xl"
                                >
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3">
                                        <Search className="h-6 w-6 text-slate-300" />
                                    </div>
                                    <p className="text-slate-500 font-medium text-sm">No records found</p>
                                </motion.div>
                            ) : (
                                filtered.map((test, index) => {
                                    const score = test?.scores?.aggregate || 0;
                                    const cfg = scoreConfig(score);
                                    const isDone = test?.status === "submitted";
                                    const sectionCount = test?.sections?.length || 0;
                                    const interest = test?.interest?.[0] || "General Assessment";
                                    const className = test?.studentClass || "Standard";

                                    return (
                                        <motion.div
                                            key={test?.testId || index}
                                            layout
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                            transition={{ delay: index * 0.04, duration: 0.2 }}
                                        >
                                            {/* Card is no longer clickable */}
                                            <Card className="border border-slate-100 shadow-none hover:shadow-sm transition-all duration-200 bg-white rounded-xl overflow-hidden">
                                                <CardContent className="p-3 sm:p-4"> {/* Reduced padding */}
                                                    <div className="flex flex-row items-center gap-4">

                                                        {/* Icon Section - Slightly smaller */}
                                                        <div className="shrink-0">
                                                            {isDone ? (
                                                                <div className="relative h-11 w-11">
                                                                    <svg className="h-11 w-11 -rotate-90" viewBox="0 0 36 36">
                                                                        <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                                                                        <circle
                                                                            cx="18" cy="18" r="16" fill="none"
                                                                            stroke={cfg.stroke}
                                                                            strokeWidth="3"
                                                                            strokeDasharray={`${(score / 100) * 100.5} 100.5`}
                                                                            strokeLinecap="round"
                                                                            className="transition-all duration-700"
                                                                        />
                                                                    </svg>
                                                                    <span className={`absolute inset-0 flex items-center justify-center text-[10px] font-black ${cfg.text}`}>
                                                                        {score}%
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <div className="h-11 w-11 rounded-full bg-amber-50 flex items-center justify-center">
                                                                    <Zap className="h-5 w-5 text-amber-500 fill-current" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* Info Section - Tighter typography */}
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <span className={`text-[9px] font-black uppercase tracking-[0.05em] ${isDone ? cfg.text : "text-amber-600"}`}>
                                                                    {isDone ? cfg.label : "In Progress"}
                                                                </span>
                                                                <span className="w-1 h-1 rounded-full bg-slate-200" />
                                                                <span className="text-[10px] font-medium text-slate-400">
                                                                    {test?.createdAt ? new Date(test.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                                                                </span>
                                                            </div>

                                                            <h3 className="text-sm font-bold text-slate-900 truncate tracking-tight uppercase">
                                                                {interest}
                                                            </h3>

                                                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase mt-0.5">
                                                                <span>Cls {className}</span>
                                                                {sectionCount > 0 && (
                                                                    <>
                                                                        <span className="opacity-30">•</span>
                                                                        <span>{sectionCount} Mod</span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Action Section - Button is the ONLY clickable element */}
                                                        <div className="shrink-0 flex items-center gap-4">
                                                            <div className="hidden md:block text-right">
                                                                <p className={`text-[10px] font-black uppercase ${isDone ? "text-emerald-500/70" : "text-amber-500/70"}`}>
                                                                    {isDone ? "completed" : "ongoing"}
                                                                </p>
                                                            </div>
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                onClick={(e) => {
                                                                    e.stopPropagation(); // Precautionary
                                                                    navigate(isDone ? `/test-result/${test.testId}` : "/take-test");
                                                                }}
                                                                className="rounded-lg h-8 px-3 border-slate-200 font-bold text-[10px] uppercase tracking-wider hover:bg-slate-900 hover:text-white transition-all cursor-pointer"
                                                            >
                                                                {isDone ? "Results" : "Resume"}
                                                                <ChevronRight className="ml-1 h-3 w-3" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllTests;