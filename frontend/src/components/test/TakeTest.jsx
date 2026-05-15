import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTest } from "../../context/TestContext";
import { motion as Motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import PageLoader from "@/utils/PageLoader";

import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Send,
    Maximize2,
    Minimize2,
    Menu,
    CheckCircle2,
    Circle,
    BookOpen,
    Bookmark,
    BookmarkCheck,
    Clock
} from "lucide-react";

import TestTimer from "./TestTimer";
import useFullScreen from "./useFullscreen";
import { shadcnToast } from "@/components/shadcnToast/ToastConfig";

const TakeTest = () => {
    const navigate = useNavigate();
    const { submitTest, getRunningTest, saveTestProgress, loading } = useTest();
    const { isFullScreen, enterFullScreen, exitFullScreen } = useFullScreen();

    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [markedForReview, setMarkedForReview] = useState({});
    const [currentSection, setCurrentSection] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loadingTest, setLoadingTest] = useState(true);
    const [sectionOpen, setSectionOpen] = useState(false);
    const [initialTime, setInitialTime] = useState(3600); // Default 1 hour

    useEffect(() => {
        const load = async () => {
            try {
                const response = await getRunningTest();

                // Check if test expired
                if (response.expired) {
                    shadcnToast.error("Test time expired! Redirecting...");
                    navigate(`/test-result/${response.testId}`);
                    return;
                }

                const t = response;
                if (!t || t.status !== "in-progress") {
                    shadcnToast.error("No active test found");
                    navigate("/dashboard");
                    return;
                }

                setTest(t);
                initializeAnswers(t);
                enterFullScreen();

                // Set initial time from remainingTime or calculate from totalTime
                if (t.remainingTime !== undefined) {
                    setInitialTime(t.remainingTime);
                } else if (t.totalTime) {
                    const elapsed = (Date.now() - new Date(t.startedAt).getTime()) / 1000;
                    const remaining = Math.max(0, t.totalTime - elapsed);
                    setInitialTime(remaining);
                }
            } catch (err) {
                console.error(err);
                navigate("/dashboard");
            } finally {
                setLoadingTest(false);
            }
        };
        load();
        return () => exitFullScreen();
    }, []);

    useEffect(() => {
        const handleFullScreenExit = () => {
            if (!document.fullscreenElement && !submitted) {
                shadcnToast.warning("Focus mode required!", {
                    description: "Please remain in fullscreen.",
                    duration: 3000
                });
                setTimeout(() => enterFullScreen(), 1000);
            }
        };
        document.addEventListener("fullscreenchange", handleFullScreenExit);
        return () => document.removeEventListener("fullscreenchange", handleFullScreenExit);
    }, [enterFullScreen, submitted]);

    const initializeAnswers = (t) => {
        const obj = {};
        const reviewObj = {};
        t.sections.forEach((section, sIdx) => {
            obj[sIdx] = {};
            reviewObj[sIdx] = {};
            section.questions.forEach((q, qIdx) => {
                obj[sIdx][qIdx] = q.userAnswer || "";
                reviewObj[sIdx][qIdx] = Boolean(q.markedForReview);
            });
        });
        setAnswers(obj);
        setMarkedForReview(reviewObj);
    };

    const saveQuestionProgress = async (sIdx, qIdx, userAnswer, isMarked) => {
        if (!test?._id) return;

        try {
            await saveTestProgress({
                testId: test._id,
                sectionIndex: sIdx,
                questionIndex: qIdx,
                userAnswer,
                markedForReview: isMarked,
            });
        } catch (err) {
            console.error(err);
            shadcnToast.error("Could not save this question. Please try again.");
        }
    };

    const handleAnswerChange = (sIdx, qIdx, value) => {
        const isMarked = Boolean(markedForReview[sIdx]?.[qIdx]);

        setAnswers(prev => ({
            ...prev,
            [sIdx]: { ...prev[sIdx], [qIdx]: value }
        }));

        saveQuestionProgress(sIdx, qIdx, value, isMarked);
    };

    const handleReviewToggle = (sIdx, qIdx) => {
        const nextMarked = !markedForReview[sIdx]?.[qIdx];
        const currentAnswer = answers[sIdx]?.[qIdx] || "";

        setMarkedForReview(prev => ({
            ...prev,
            [sIdx]: { ...prev[sIdx], [qIdx]: nextMarked }
        }));

        saveQuestionProgress(sIdx, qIdx, currentAnswer, nextMarked);
    };

    const handleSubmit = async () => {
        if (submitted || !test) return;
        setSubmitted(true);
        const formatted = test.sections.map((section, sIdx) => ({
            sectionName: section.sectionName,
            questions: section.questions.map((q, qIdx) => ({
                question: q.question,
                userAnswer: answers[sIdx]?.[qIdx] || null
            }))
        }));
        try {
            await submitTest({ testId: test._id, answers: formatted });
            exitFullScreen();
            navigate(`/test-result/${test._id}`);
        } catch {
            setSubmitted(false);
            shadcnToast.error("Failed to submit test. Please try again.");
        }
    };

    const handleTimeUp = async () => {
        if (submitted) return;
        shadcnToast.warning("Time's up! Auto-submitting your test...");
        await handleSubmit();
    };

    if (loadingTest) return (
        <div className="min-h-screen flex items-center justify-center">
            {/* <PageLoader /> */}
        </div>
    );

    if (!test) return null;

    const totalQuestions = test.sections.reduce((acc, s) => acc + s.questions.length, 0);
    const answeredCount = Object.values(answers).reduce((acc, sec) => acc + Object.values(sec).filter(v => v).length, 0);
    const reviewCount = Object.values(markedForReview).reduce((acc, sec) => acc + Object.values(sec).filter(Boolean).length, 0);
    const progress = (answeredCount / totalQuestions) * 100;
    const currentSectionData = test.sections[currentSection];

    return (
        <div className="min-h-screen bg-zinc-50/50 flex flex-col selection:bg-zinc-900 selection:text-white">

            {/* --- Top Navigation Bar --- */}
            <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-zinc-200">
                <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <Sheet open={sectionOpen} onOpenChange={setSectionOpen}>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon" className="lg:hidden rounded-full">
                                    <Menu className="h-4 w-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="w-[300px] p-0">
                                <SheetHeader className="p-6 border-b">
                                    <SheetTitle className="text-sm font-black uppercase tracking-widest">Navigator</SheetTitle>
                                </SheetHeader>
                                <div className="p-4 space-y-2">
                                    <SectionNavList
                                        test={test}
                                        answers={answers}
                                        markedForReview={markedForReview}
                                        current={currentSection}
                                        set={setCurrentSection}
                                        close={() => setSectionOpen(false)}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>
                        <div className="hidden md:block">
                            <h1 className="text-sm font-black uppercase tracking-tighter italic">EXAM <span className="text-zinc-400">SESSION</span></h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <TestTimer
                            initialTime={initialTime}
                            onTimeUp={handleTimeUp}
                            isActive={!submitted}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={isFullScreen ? exitFullScreen : enterFullScreen}
                            className="hidden sm:flex rounded-full text-zinc-400 cursor-pointer hover:bg-zinc-100 hover:text-zinc-900 transition-all"
                        >
                            {isFullScreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={submitted || loading}
                            className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full px-6 shadow-lg shadow-zinc-200 active:scale-95 transition-all cursor-pointer"
                        >
                            <Send className="h-3.5 w-3.5 mr-2" />
                            Submit
                        </Button>
                    </div>
                </div>
                <Progress value={progress} className="h-0.5 rounded-none bg-transparent" />
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 p-4 md:p-8">

                {/* --- Sidebar (Desktop Only) --- */}
                <aside className="hidden lg:block lg:col-span-3 space-y-6">
                    <div className="sticky top-28 space-y-6">
                        <div className="space-y-2">
                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-1">Structure</p>
                            <SectionNavList
                                test={test}
                                answers={answers}
                                markedForReview={markedForReview}
                                current={currentSection}
                                set={setCurrentSection}
                            />
                        </div>

                        <Card className="border-none shadow-2xl bg-zinc-900 text-white overflow-hidden rounded-[2rem] relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />

                            <CardContent className="p-8 flex flex-col items-center justify-center text-center space-y-4 relative z-10">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                        Progress Status
                                    </p>
                                    <h3 className="text-3xl font-black italic tracking-tighter">
                                        {Math.round(progress)}%
                                    </h3>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-zinc-300 uppercase tracking-tight">
                                    <BookOpen className="h-3 w-3 text-zinc-400" />
                                    <span>{answeredCount} <span className="text-zinc-500 mx-1">/</span> {totalQuestions} Solved</span>
                                </div>
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/10 border border-amber-300/20 text-[10px] font-bold text-amber-200 uppercase tracking-tight">
                                    <Bookmark className="h-3 w-3" />
                                    <span>{reviewCount} Marked</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </aside>

                {/* --- Question Content --- */}
                <section className="lg:col-span-9 space-y-4 pb-20">
                    <AnimatePresence mode="wait">
                        <Motion.div
                            key={currentSection}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                        >
                            <div className="flex items-center justify-between mb-4 px-1">
                                <div>
                                    <h2 className="text-xl font-black tracking-tight text-zinc-900">{currentSectionData.sectionName}</h2>
                                    <p className="text-[12px] text-zinc-400">Select the appropriate answer below.</p>
                                </div>
                                <div className="hidden sm:block">
                                    <Badge variant="secondary" className="rounded-full bg-zinc-100 text-zinc-500 font-bold px-2 py-0 text-[10px]">
                                        Section {currentSection + 1}
                                    </Badge>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {currentSectionData.questions.map((q, qIdx) => (
                                    <Card key={qIdx} className="border-zinc-200 shadow-none hover:border-zinc-300 transition-all rounded-xl overflow-hidden">
                                        <CardHeader className="bg-zinc-50/50 py-3 px-4 border-b border-zinc-100">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex gap-3 min-w-0">
                                                    <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-zinc-900 text-white text-[10px] font-bold italic">
                                                        {qIdx + 1}
                                                    </span>
                                                    <p className="font-bold text-zinc-800 text-sm leading-snug pt-0.5">
                                                        {q.question}
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant={markedForReview[currentSection]?.[qIdx] ? "default" : "outline"}
                                                    size="sm"
                                                    onClick={() => handleReviewToggle(currentSection, qIdx)}
                                                    className={`h-8 shrink-0 rounded-full px-3 text-[11px] font-bold ${markedForReview[currentSection]?.[qIdx]
                                                        ? "bg-amber-500 text-white hover:bg-amber-600"
                                                        : "border-amber-200 text-amber-700 hover:bg-amber-50"
                                                        }`}
                                                >
                                                    {markedForReview[currentSection]?.[qIdx] ? (
                                                        <BookmarkCheck className="h-3.5 w-3.5 mr-1.5" />
                                                    ) : (
                                                        <Bookmark className="h-3.5 w-3.5 mr-1.5" />
                                                    )}
                                                    Review
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-3 px-4">
                                            <RadioGroup
                                                value={answers[currentSection]?.[qIdx] || ""}
                                                onValueChange={(val) => handleAnswerChange(currentSection, qIdx, val)}
                                                className="grid grid-cols-1 sm:grid-cols-2 gap-2"
                                            >
                                                {q.options.map((opt, optIdx) => (
                                                    <div key={optIdx}>
                                                        <RadioGroupItem
                                                            value={opt}
                                                            id={`q${qIdx}-o${optIdx}`}
                                                            className="sr-only"
                                                        />
                                                        <Label
                                                            htmlFor={`q${qIdx}-o${optIdx}`}
                                                            className={`flex items-center gap-2.5 p-2.5 rounded-lg border transition-all cursor-pointer group ${answers[currentSection]?.[qIdx] === opt
                                                                ? "border-zinc-900 bg-zinc-900/[0.02] ring-1 ring-zinc-900"
                                                                : "border-zinc-100 bg-white hover:border-zinc-200"
                                                                }`}
                                                        >
                                                            <div className={`h-3.5 w-3.5 rounded-full border flex items-center justify-center transition-all ${answers[currentSection]?.[qIdx] === opt ? "border-zinc-900 bg-zinc-900" : "border-zinc-300 group-hover:border-zinc-400"
                                                                }`}>
                                                                <div className="h-1 w-1 rounded-full bg-white" />
                                                            </div>
                                                            <span className={`text-xs font-semibold transition-colors ${answers[currentSection]?.[qIdx] === opt ? "text-zinc-900" : "text-zinc-500"
                                                                }`}>
                                                                {opt}
                                                            </span>
                                                        </Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </Motion.div>
                    </AnimatePresence>

                    {/* Bottom Navigation */}
                    <div className="flex items-center justify-between gap-4 pt-6 border-t border-zinc-200 mt-10">
                        <Button
                            variant="ghost"
                            disabled={currentSection === 0}
                            onClick={() => {
                                setCurrentSection(p => p - 1);
                                window.scrollTo(0, 0);
                            }}
                            className="h-12 px-6 rounded-full font-bold text-zinc-500"
                        >
                            <ChevronLeft className="h-4 w-4 mr-2" />
                            Previous
                        </Button>

                        <div className="flex gap-2">
                            {answeredCount < totalQuestions && (
                                <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 px-4 py-2 rounded-full border border-amber-100">
                                    <AlertCircle className="h-3.5 w-3.5" />
                                    {totalQuestions - answeredCount} Pending
                                </div>
                            )}
                            <Button
                                variant="outline"
                                disabled={currentSection === test.sections.length - 1}
                                onClick={() => {
                                    setCurrentSection(p => p + 1);
                                    window.scrollTo(0, 0);
                                }}
                                className="h-12 px-8 rounded-full border-zinc-200 font-bold"
                            >
                                Next Section
                                <ChevronRight className="h-4 w-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

// --- Sub-component for Navigation List ---
const SectionNavList = ({ test, answers, markedForReview, current, set, close }) => (
    <div className="space-y-1">
        {test.sections.map((s, i) => {
            const solved = Object.values(answers[i] || {}).filter(v => v).length;
            const marked = Object.values(markedForReview[i] || {}).filter(Boolean).length;
            const total = s.questions.length;
            const isDone = solved === total;

            return (
                <button
                    key={i}
                    onClick={() => {
                        set(i);
                        if (close) close();
                    }}
                    className={`w-full group flex items-center justify-between p-3.5 rounded-xl transition-all cursor-pointer ${i === current
                        ? "bg-white border-2 border-zinc-900 shadow-sm"
                        : "border-2 border-transparent bg-zinc-100 hover:bg-zinc-200"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        {isDone ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                            <Circle className={`h-4 w-4 ${i === current ? "text-zinc-900" : "text-zinc-300"}`} />
                        )}
                        <span className={`text-xs font-bold uppercase tracking-tight ${i === current ? "text-zinc-900" : "text-zinc-500"}`}>
                            {s.sectionName}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        {marked > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600">
                                <Bookmark className="h-3 w-3 fill-amber-500/20" />
                                {marked}
                            </span>
                        )}
                        <span className="text-[10px] font-black text-zinc-400">{solved}/{total}</span>
                    </div>
                </button>
            );
        })}
    </div>
);

export default TakeTest;
