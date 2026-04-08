// pages/Preferences.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import {
    X,
    Plus,
    GraduationCap,
    BookOpen,
    ChevronRight,
    AlertCircle,
    CheckCircle2,
    ArrowLeft,
    Sparkles,
    Search
} from "lucide-react";
import { useTest } from "../../context/TestContext";
import TestLoader from "../../components/test/TestLoader";

const classOptions = [
    { value: "10", label: "Class 10", icon: <BookOpen className="w-4 h-4" /> },
    { value: "12", label: "Class 12", icon: <GraduationCap className="w-4 h-4" /> }
];

const interestCategories = {
    "STEM": ["Math", "Physics", "Chemistry", "CS", "AI", "Robotics"],
    "Humanities": ["History", "Economics", "Psychology", "Law", "Literature"],
    "Creative & Bio": ["Design", "Architecture", "Medicine", "Biotech"]
};

const Preferences = () => {
    const navigate = useNavigate();
    const { generateTest } = useTest();

    const [studentClass, setStudentClass] = useState("");
    const [interestInput, setInterestInput] = useState("");
    const [interests, setInterests] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAddInterest = () => {
        const val = interestInput.trim();
        if (val && !interests.includes(val)) {
            setInterests([...interests, val]);
            setInterestInput("");
            setError("");
        }
    };

    const handleRemoveInterest = (i) => setInterests(interests.filter(item => item !== i));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!studentClass) return setError("Select your class");
        if (interests.length < 3) return setError(`Add ${3 - interests.length} more interests`);
        
        setLoading(true);
        try {
            await generateTest({ studentClass, interest: interests });
            navigate("/take-test");
        } catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
            <div className="max-w-5xl mx-auto px-4 py-6 md:py-10">
                
                {/* Slim Header */}
                <div className="flex items-center justify-between mb-8">
                    <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="h-8 px-2 text-zinc-800 hover:text-zinc-600 cursor-pointer">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                    
                    {/* Left: Essentials */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="space-y-1">
                            <h1 className="text-2xl font-bold tracking-tight">Test Setup</h1>
                            <p className="text-sm text-zinc-500">Kindly select your academic level and interests.</p>
                        </div>

                        <div className="space-y-3">
                            <Label className="text-xs font-bold uppercase text-zinc-400">Academic Level</Label>
                            <div className="grid grid-cols-2 gap-2">
                                {classOptions.map((opt) => (
                                    <button
                                        key={opt.value}
                                        onClick={() => setStudentClass(opt.value)}
                                        className={`flex items-center gap-3 p-3 rounded-md border text-sm transition-all cursor-pointer ${
                                            studentClass === opt.value 
                                            ? "border-primary bg-primary/5 text-primary ring-1 ring-primary" 
                                            : "border-zinc-200 hover:border-zinc-300 bg-zinc-50/50"
                                        }`}
                                    >
                                        {opt.icon}
                                        <span className="font-medium">{opt.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-zinc-50 border border-zinc-100 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-medium text-zinc-600">
                                <Sparkles className="h-3 w-3 text-amber-500" />
                                Custom AI Generation
                            </div>
                            <p className="text-[11px] leading-relaxed text-zinc-500">
                                Your test is generated in real-time based on your specific interests and grade level.
                            </p>
                        </div>
                    </div>

                    {/* Right: Interests Card */}
                    <Card className="lg:col-span-3 shadow-none border-zinc-200 overflow-hidden">
                        <CardContent className="p-0">
                            {/* Input Zone */}
                            <div className="p-5 border-b bg-zinc-50/30">
                                <div className="flex items-center justify-between mb-4">
                                    <Label className="text-xs font-bold uppercase text-zinc-400">Subject Interests</Label>
                                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${interests.length >= 3 ? "bg-emerald-100 text-emerald-700" : "bg-zinc-200 text-zinc-600"}`}>
                                        { interests.length >= 3 ? "Good to go!" : `${3 - interests.length} more needed` }
                                    </span>
                                </div>
                                
                                <div className="relative group mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
                                    <Input
                                        value={interestInput}
                                        onChange={(e) => setInterestInput(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInterest())}
                                        placeholder="Add topics (e.g. Quantum Physics)"
                                        className="pl-9 h-10 border-zinc-200 focus-visible:ring-1 focus-visible:ring-primary shadow-none text-sm"
                                    />
                                    <Button size="sm" onClick={handleAddInterest} className="absolute right-1 top-1 h-8 text-xs px-3 cursor-pointer" disabled={!interestInput.trim()}>
                                        Add
                                    </Button>
                                </div>

                                <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                                    <AnimatePresence>
                                        {interests.map((i) => (
                                            <motion.div key={i} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}>
                                                <Badge variant="secondary" className="pl-2 pr-1 py-1 rounded-sm bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors">
                                                    {i}
                                                    <button onClick={() => handleRemoveInterest(i)} className="ml-1.5 p-0.5 hover:text-destructive cursor-pointer">
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            </div>

                            {/* Suggestions Scroll */}
                            <ScrollArea className="h-[240px] px-5 py-4">
                                <div className="space-y-5">
                                    {Object.entries(interestCategories).map(([cat, items]) => (
                                        <div key={cat} className="space-y-2">
                                            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">{cat}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {items.filter(s => !interests.includes(s)).map((s) => (
                                                    <button
                                                        key={s}
                                                        onClick={() => setInterests([...interests, s])}
                                                        className="text-xs px-2.5 py-1 rounded border border-zinc-100 bg-white hover:border-primary/30 hover:bg-primary/[0.02] transition-all cursor-pointer"
                                                    >
                                                        + {s}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            {/* Footer Action */}
                            <div className="p-4 bg-zinc-50 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                                {error ? (
                                    <div className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                                        <AlertCircle className="h-3.5 w-3.5" /> {error}
                                    </div>
                                ) : <div className="hidden sm:block" />}
                                
                                <Button
                                    onClick={handleSubmit}
                                    disabled={!studentClass || interests.length < 3 || loading}
                                    className="w-full sm:w-auto h-10 px-8 rounded-md shadow-sm transition-all active:scale-[0.97] hover:bg-primary/80 cursor-pointer"
                                >
                                    {loading ? "Generating..." : "Generate Test"}
                                    {!loading && <ChevronRight className="ml-1.5 h-4 w-4" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <TestLoader open={loading} />
        </div>
    );
};

export default Preferences;