// pages/TestResult.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTest } from "../../../context/TestContext";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
    Trophy,
    Brain,
    Clock,
    Calendar,
    Sparkles,
    BarChart3,
    LayoutDashboard,
    ChevronRight,
    Circle
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
            <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
            </div>
        );
    }

    if (!data) return null;

    const { test, result } = data;
    const aggregateScore = result?.scores?.aggregate || 0;

    const getScoreStatus = (score) => {
        if (score > 90) return { label: "Excellent", color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500" };
        if (score > 75) return { label: "Very Good", color: "text-green-600", bg: "bg-green-50", bar: "bg-green-500" };
        if (score > 60) return { label: "Good", color: "text-blue-600", bg: "bg-blue-50", bar: "bg-blue-500" };
        if (score > 40) return { label: "Needs Improvement", color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-500" };
        return { label: "Bad Performance", color: "text-red-600", bg: "bg-red-50", bar: "bg-red-500" };
    };
    const status = getScoreStatus(aggregateScore);
    const totalQuestions = test.sections.reduce((acc, s) => acc + s.questions.length, 0);
    const correctCount = test.sections.reduce((acc, s) => acc + s.questions.filter(q => q.isCorrect).length, 0);

    return (
        <div className="min-h-screen bg-[#fafafa] pb-12">
            <div className="max-w-350 mx-auto p-4 md:p-8">

                {/* --- Header Area --- */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div className="space-y-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate("/dashboard")}
                            className="h-8 px-0 text-zinc-500 hover:bg-transparent hover:text-zinc-900 cursor-pointer"
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                        </Button>
                        <h1 className="text-3xl font-black tracking-tighter text-zinc-900 uppercase italic leading-none">
                            Performance <span className="text-zinc-400 font-light not-italic">/ REPORT</span>
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            onClick={() => navigate(`/suggestion/${testId}`)}
                            className="bg-zinc-900 hover:bg-zinc-800 text-white shadow-xl rounded-full h-11 px-8 group font-bold text-xs uppercase cursor-pointer"
                        >
                            <Sparkles className="mr-2 h-4 w-4 text-amber-400 group-hover:rotate-12 transition-transform" />
                            Get College Suggestions
                        </Button>
                    </div>
                </div>

                {/* --- Main Grid --- */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: Summary Statistics */}
                    <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-8">
                        <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden">
                            <div className={`h-2 w-full ${status.bar}`} />
                            <CardContent className="p-8 space-y-8">
                                <div className="text-center space-y-2">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Aggregate Score</p>
                                    <div className="flex items-baseline justify-center gap-1">
                                        <span className={`text-6xl font-black italic tracking-tighter ${status.color}`}>{aggregateScore}</span>
                                        <span className="text-zinc-300 text-xl font-bold">%</span>
                                    </div>
                                    <Badge className={`${status.bg} ${status.color} border-none rounded-full px-4 font-bold uppercase text-[10px]`}>
                                        {status.label}
                                    </Badge>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-50">
                                    <div className="bg-zinc-50 rounded-2xl p-4 text-center">
                                        <p className="text-xl font-black text-zinc-900">{correctCount}</p>
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase">Correct</p>
                                    </div>
                                    <div className="bg-zinc-50 rounded-2xl p-4 text-center">
                                        <p className="text-xl font-black text-zinc-900">
                                            {Math.floor((new Date(test.submittedAt) - new Date(test.startedAt)) / 60000)}m
                                        </p>
                                        <p className="text-[9px] font-bold text-zinc-400 uppercase">Duration</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-none shadow-md bg-white rounded-2xl p-6">
                            <h3 className="text-xs font-black uppercase text-zinc-400 tracking-widest mb-4 flex items-center gap-2">
                                <BarChart3 className="h-3 w-3" /> Module Breakdown
                            </h3>
                            <div className="space-y-4">
                                {Object.entries(result.scores || {}).filter(([k]) => k !== 'aggregate').map(([key, val], i) => (
                                    <div key={i} className="space-y-1">
                                        <div className="flex justify-between text-[10px] font-black uppercase">
                                            <span className="text-zinc-500">{key}</span>
                                            <span className="text-zinc-900">{val}%</span>
                                        </div>
                                        <Progress value={val} className="h-1" />
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* RIGHT COLUMN: Question Audit */}
                    <div className="lg:col-span-8">
                        <Card className="border-none shadow-xl bg-white rounded-[2rem] overflow-hidden min-h-[600px]">
                            <CardHeader className="p-8 border-b border-zinc-50 bg-zinc-50/30 flex-row items-center gap-4 space-y-0">
                                <div className="p-2.5 bg-zinc-900 rounded-xl shadow-lg shadow-zinc-200">
                                    <Brain className="h-5 w-5 text-white" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black uppercase tracking-tight">Audit Log</CardTitle>
                                    <CardDescription className="text-xs font-medium">Verification of user responses vs correct solutions</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Tabs defaultValue="0" className="w-full">
                                    <TabsList className="w-full justify-start rounded-none bg-white p-0 h-14 border-b border-zinc-100 overflow-x-auto no-scrollbar">
                                        {test.sections.map((section, idx) => (
                                            <TabsTrigger
                                                key={idx}
                                                value={idx.toString()}
                                                className="rounded-none h-full px-8 text-[10px] font-black uppercase tracking-widest text-zinc-400 data-[state=active]:text-zinc-900 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-zinc-900 transition-all"
                                            >
                                                {section.sectionName}
                                            </TabsTrigger>
                                        ))}
                                    </TabsList>

                                    {test.sections.map((section, sIdx) => (
                                        <TabsContent key={sIdx} value={sIdx.toString()} className="m-0 p-6 md:p-8 space-y-8">
                                            {section.questions.map((q, qIdx) => (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    key={qIdx}
                                                    className="space-y-4"
                                                >
                                                    <div className="flex gap-4">
                                                        <span className="flex-shrink-0 h-7 w-7 rounded-lg bg-zinc-100 flex items-center justify-center text-xs font-black italic text-zinc-500">
                                                            {qIdx + 1}
                                                        </span>
                                                        <p className="font-bold text-zinc-900 leading-snug pt-1">
                                                            {q.question}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-1 gap-2 ml-11">
                                                        {q.options.map((option, oIdx) => {
                                                            const isUserChoice = q.userAnswer === option;
                                                            const isCorrectAnswer = q.correctAnswer === option;

                                                            let itemClass = "border-zinc-100 bg-white text-zinc-500";
                                                            if (isUserChoice && q.isCorrect) itemClass = "border-emerald-200 bg-emerald-50/50 text-emerald-700 ring-1 ring-emerald-500";
                                                            if (isUserChoice && !q.isCorrect) itemClass = "border-red-200 bg-red-50/50 text-red-700 ring-1 ring-red-500";
                                                            if (!isUserChoice && isCorrectAnswer) itemClass = "border-emerald-200 bg-emerald-50/50 text-emerald-700";

                                                            return (
                                                                <div key={oIdx} className={`flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${itemClass}`}>
                                                                    <div className="flex items-center gap-3">
                                                                        {isUserChoice ? (
                                                                            q.isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
                                                                        ) : (
                                                                            <Circle className="h-4 w-4 opacity-20" />
                                                                        )}
                                                                        <span className="text-sm font-semibold">{option}</span>
                                                                    </div>

                                                                    <div className="flex gap-2">
                                                                        {isUserChoice && (
                                                                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-tighter border-current bg-white">
                                                                                Your Choice
                                                                            </Badge>
                                                                        )}
                                                                        {isCorrectAnswer && (
                                                                            <Badge className="text-[9px] font-black uppercase tracking-tighter bg-emerald-600 text-white border-none">
                                                                                Correct
                                                                            </Badge>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Explanation Nudge if you have it in data, else a divider */}
                                                    <div className="h-px bg-zinc-50 w-full mt-8" />
                                                </motion.div>
                                            ))}
                                        </TabsContent>
                                    ))}
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TestResult;