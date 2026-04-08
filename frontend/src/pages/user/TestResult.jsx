// pages/TestResult.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTest } from "../../context/TestContext";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Trophy,
    Brain,
    Target,
    Clock,
    Calendar,
    Sparkles,
    BarChart3,
    AlertCircle,
    LayoutDashboard
} from "lucide-react";

const TestResult = () => {
    const { testId } = useParams();
    const navigate = useNavigate();
    const { getTestById } = useTest();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResult();
    }, [testId]);

    const fetchResult = async () => {
        try {
            const res = await getTestById(testId);
            setData(res);
        } catch (err) {
            navigate("/dashboard");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-sm font-medium text-zinc-500">Analyzing results...</p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const { test, result } = data;
    const aggregateScore = result?.scores?.aggregate || 0;

    const getScoreStatus = (score) => {
        if (score >= 80) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" };
        if (score >= 60) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-100" };
        if (score >= 40) return { label: "Average", color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" };
        return { label: "Needs Review", color: "text-red-600", bg: "bg-red-50", border: "border-red-100" };
    };

    const status = getScoreStatus(aggregateScore);

    const totalQuestions = test.sections.reduce((acc, s) => acc + s.questions.length, 0);
    const correctCount = test.sections.reduce((acc, s) => acc + s.questions.filter(q => q.isCorrect).length, 0);

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-zinc-950 pb-20">
            <div className="max-w-5xl mx-auto p-4 md:p-8">
                
                {/* Compact Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                    <div className="space-y-2">
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => navigate("/dashboard")}
                            className="h-8 px-0 text-zinc-500 hover:bg-transparent hover:text-zinc-900"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Performance Report</h1>
                        <div className="flex items-center gap-3 text-sm text-zinc-500">
                            <Calendar className="h-4 w-4" />
                            {new Date(test.submittedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>

                    {/* Primary Action Button */}
                    <Button 
                        onClick={() => navigate(`/suggestion/${testId}`)}
                        className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-lg shadow-zinc-200 dark:shadow-none h-11 px-6 rounded-xl group cursor-pointer"
                    >
                        <Sparkles className="mr-2 h-4 w-4 text-purple-400 group-hover:rotate-12 transition-transform" />
                        Get College Suggestions
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
                    {/* Score Card */}
                    <Card className="lg:col-span-1 border-none shadow-sm bg-white overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-xs font-bold uppercase tracking-wider text-zinc-400">Total Score</span>
                                <Trophy className={`h-5 w-5 ${status.color}`} />
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-5xl font-black ${status.color}`}>{aggregateScore}</span>
                                <span className="text-zinc-400 font-semibold">%</span>
                            </div>
                            <p className={`mt-2 text-sm font-bold uppercase tracking-tighter ${status.color}`}>
                                Status: {status.label}
                            </p>
                            <Progress value={aggregateScore} className="mt-6 h-1.5 bg-zinc-100" />
                        </CardContent>
                    </Card>

                    {/* Stats Grid */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        <div className="p-6 rounded-xl bg-white border border-zinc-100 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center gap-2 text-zinc-500 mb-4">
                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                <span className="text-xs font-bold uppercase">Accuracy</span>
                            </div>
                            <div className="text-2xl font-bold">{correctCount} <span className="text-zinc-400 text-sm font-normal">/ {totalQuestions} Correct</span></div>
                        </div>

                        <div className="p-6 rounded-xl bg-white border border-zinc-100 shadow-sm flex flex-col justify-between">
                            <div className="flex items-center gap-2 text-zinc-500 mb-4">
                                <Clock className="h-4 w-4 text-blue-500" />
                                <span className="text-xs font-bold uppercase">Time Spent</span>
                            </div>
                            <div className="text-2xl font-bold">
                                {Math.floor((new Date(test.submittedAt) - new Date(test.startedAt)) / 60000)}m 
                                <span className="text-zinc-400 text-sm font-normal ml-1">Total Duration</span>
                            </div>
                        </div>

                        <div className="col-span-2 p-6 rounded-xl bg-white border border-zinc-100 shadow-sm flex items-center justify-between">
                            <div className="space-y-1">
                                <div className="flex items-center gap-2 text-zinc-500">
                                    <BarChart3 className="h-4 w-4 text-primary" />
                                    <span className="text-xs font-bold uppercase">Section Breakdown</span>
                                </div>
                                <p className="text-[11px] text-zinc-400">View performance detail across all modules</p>
                            </div>
                            <div className="flex -space-x-2">
                                {Object.keys(result.scores || {}).filter(k => k !== 'aggregate').map((_, i) => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-bold">
                                        S{i+1}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Review */}
                <Card className="border-none shadow-sm bg-white overflow-hidden">
                    <CardHeader className="border-b border-zinc-50 px-6 py-4">
                        <div className="flex items-center gap-2">
                            <Brain className="h-5 w-5 text-zinc-400" />
                            <CardTitle className="text-lg">Response Review</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Tabs defaultValue="0" className="w-full">
                            <TabsList className="w-full justify-start rounded-none bg-zinc-50/50 p-0 h-12 border-b border-zinc-100 overflow-x-auto no-scrollbar">
                                {test.sections.map((section, idx) => (
                                    <TabsTrigger 
                                        key={idx} 
                                        value={idx.toString()}
                                        className="rounded-none h-full px-6 text-xs font-bold data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-primary"
                                    >
                                        {section.sectionName.toUpperCase()}
                                    </TabsTrigger>
                                ))}
                            </TabsList>

                            {test.sections.map((section, sIdx) => (
                                <TabsContent key={sIdx} value={sIdx.toString()} className="m-0 p-6">
                                    <div className="grid gap-4">
                                        {section.questions.map((q, qIdx) => (
                                            <div 
                                                key={qIdx}
                                                className={`p-4 rounded-xl border transition-colors ${
                                                    q.isCorrect ? 'bg-emerald-50/30 border-emerald-100' : 'bg-red-50/30 border-red-100'
                                                }`}
                                            >
                                                <div className="flex gap-4">
                                                    <div className={`mt-1 flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center ${
                                                        q.isCorrect ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                                                    }`}>
                                                        {q.isCorrect ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <p className="text-sm font-semibold text-zinc-900 leading-snug">
                                                            {qIdx + 1}. {q.question}
                                                        </p>
                                                        <div className="flex flex-wrap gap-4 text-xs">
                                                            <div className="space-y-1">
                                                                <span className="text-zinc-400 font-medium">Your Answer:</span>
                                                                <p className={`font-bold ${q.isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                                                                    {q.userAnswer || "Skipped"}
                                                                </p>
                                                            </div>
                                                            {!q.isCorrect && (
                                                                <div className="space-y-1">
                                                                    <span className="text-zinc-400 font-medium">Correct Answer:</span>
                                                                    <p className="text-emerald-700 font-bold">{q.correctAnswer}</p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            ))}
                        </Tabs>
                    </CardContent>
                </Card>

                {/* Bottom Navigation */}
                <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate("/dashboard")}
                        className="w-full sm:w-auto h-11 px-8 rounded-xl border-zinc-200"
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
                    </Button>
                    <Button 
                        onClick={() => navigate(`/suggestion/${testId}`)}
                        className="w-full sm:w-auto h-11 px-8 rounded-xl bg-primary text-white shadow-lg shadow-primary/20"
                    >
                        <Sparkles className="mr-2 h-4 w-4" /> Get Improvement Plan
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default TestResult;