import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTest } from "../../context/TestContext";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";

import {
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Send,
    Maximize2,
    Minimize2
} from "lucide-react";

import TestTimer from "./TestTimer";
import useFullScreen from "./useFullscreen";
import { schadenToast } from "@/components/schadenToast/ToastConfig";

const TakeTest = () => {
    const navigate = useNavigate();
    const { submitTest, getRunningTest, loading } = useTest();
    const { isFullScreen, enterFullScreen, exitFullScreen } = useFullScreen();

    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [currentSection, setCurrentSection] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [loadingTest, setLoadingTest] = useState(true);

    // 🔥 LOAD TEST
    useEffect(() => {
        const load = async () => {
            try {
                const t = await getRunningTest();

                if (!t || t.status !== "in-progress") {
                    schadenToast.error("No active test found");
                    navigate("/dashboard");
                    return;
                }

                setTest(t);
                initializeAnswers(t);
                enterFullScreen();
            } catch (err) {
                navigate("/dashboard");
            } finally {
                setLoadingTest(false);
            }
        };

        load();

        return () => {
            exitFullScreen();
        };
    }, []);
    
    useEffect(() => {
        const handleFullScreenExit = () => {
            if (!document.fullscreenElement) {
                schadenToast.warning("Fullscreen is required!", {
                    description: "Re-entering fullscreen...",
                    duration: 3000
                });

                // force back after small delay
                setTimeout(() => {
                    enterFullScreen();
                }, 1000);
            }
        };

        document.addEventListener("fullscreenchange", handleFullScreenExit);

        return () => {
            document.removeEventListener("fullscreenchange", handleFullScreenExit);
        };
    }, [enterFullScreen]);

    const initializeAnswers = (t) => {
        const obj = {};

        t.sections.forEach((section, sIdx) => {
            obj[sIdx] = {};
            section.questions.forEach((q, qIdx) => {
                obj[sIdx][qIdx] = q.userAnswer || "";
            });
        });

        setAnswers(obj);
    };

    const handleAnswerChange = (sIdx, qIdx, value) => {
        setAnswers(prev => ({
            ...prev,
            [sIdx]: {
                ...prev[sIdx],
                [qIdx]: value
            }
        }));
    };

    const handleTimeUp = async () => {
        schadenToast.warning("Time up! Auto submitting...");
        await handleSubmit(true);
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
            await submitTest({
                testId: test._id,
                answers: formatted
            });

            exitFullScreen();
            navigate(`/test-result/${test._id}`);
        } catch (err) {
            setSubmitted(false);
        }
    };

    if (loadingTest) {
        return <div className="p-10 text-center">Loading test...</div>;
    }

    if (!test) {
        return <div className="p-10 text-center">No test found</div>;
    }

    const totalQuestions = test.sections.reduce(
        (acc, s) => acc + s.questions.length,
        0
    );

    const answered = Object.values(answers).reduce(
        (acc, sec) => acc + Object.values(sec).filter(v => v).length,
        0
    );

    const progress = (answered / totalQuestions) * 100;

    const section = test.sections[currentSection];

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Test</h2>

                <div className="flex gap-3 items-center">
                    <TestTimer onTimeUp={handleTimeUp} />

                    <Button onClick={isFullScreen ? exitFullScreen : enterFullScreen}>
                        {isFullScreen ? <Minimize2 /> : <Maximize2 />}
                    </Button>

                    <Button onClick={handleSubmit} disabled={submitted || loading}>
                        <Send className="mr-2 h-4 w-4" />
                        Submit
                    </Button>
                </div>
            </div>

            {/* PROGRESS */}
            <Progress value={progress} className="mb-4" />

            {/* SECTION NAV */}
            <div className="flex gap-2 mb-4">
                {test.sections.map((s, i) => (
                    <Button
                        key={i}
                        variant={i === currentSection ? "default" : "outline"}
                        onClick={() => setCurrentSection(i)}
                    >
                        {s.sectionName}
                    </Button>
                ))}
            </div>

            {/* QUESTIONS */}
            <Card>
                <CardHeader>
                    <CardTitle>{section.sectionName}</CardTitle>
                </CardHeader>

                <CardContent>
                    {section.questions.map((q, idx) => (
                        <div key={idx} className="mb-6">
                            <p className="font-medium mb-2">
                                {idx + 1}. {q.question}
                            </p>

                            <RadioGroup
                                value={answers[currentSection]?.[idx] || ""}
                                onValueChange={(val) =>
                                    handleAnswerChange(currentSection, idx, val)
                                }
                            >
                                {q.options.map((opt, i) => (
                                    <div key={i} className="flex gap-2 items-center">
                                        <RadioGroupItem value={opt} id={`${idx}-${i}`} />
                                        <Label htmlFor={`${idx}-${i}`}>{opt}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* NAV BUTTONS */}
            <div className="flex justify-between mt-6">
                <Button
                    disabled={currentSection === 0}
                    onClick={() => setCurrentSection(p => p - 1)}
                >
                    <ChevronLeft /> Prev
                </Button>

                <Button
                    disabled={currentSection === test.sections.length - 1}
                    onClick={() => setCurrentSection(p => p + 1)}
                >
                    Next <ChevronRight />
                </Button>
            </div>

            {/* WARNING */}
            {answered < totalQuestions && (
                <Alert className="mt-4">
                    <AlertCircle />
                    <AlertDescription>
                        {totalQuestions - answered} unanswered questions
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default TakeTest;