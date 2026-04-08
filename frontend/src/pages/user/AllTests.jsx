import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useTest } from "../../context/TestContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
    Clock, 
    Eye, 
    PlayCircle, 
    Trophy, 
    Calendar,
    TrendingUp,
    CheckCircle2,
    XCircle,
    BarChart3,
    ArrowLeft,
    Award
} from "lucide-react";

const AllTests = () => {
    const { getUserAllTests, loading } = useTest();
    const navigate = useNavigate();

    const [tests, setTests] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [tab, setTab] = useState("all");
    const [stats, setStats] = useState({
        total: 0,
        completed: 0,
        inProgress: 0,
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
            
            // Calculate stats
            const completed = data.filter(t => t.status === "submitted");
            const inProgress = data.filter(t => t.status === "in-progress");
            const avgScore = completed.length > 0
                ? completed.reduce((sum, t) => sum + (t.scores?.aggregate || 0), 0) / completed.length
                : 0;
            const bestScore = completed.length > 0
                ? Math.max(...completed.map(t => t.scores?.aggregate || 0))
                : 0;
            
            setStats({
                total: data.length,
                completed: completed.length,
                inProgress: inProgress.length,
                averageScore: Math.round(avgScore),
                bestScore: bestScore
            });
        } catch (error) {
            console.error("Failed to fetch tests:", error);
        }
    };

    const handleTab = (value) => {
        setTab(value);
        if (value === "all") {
            setFiltered(tests);
        } else {
            setFiltered(tests.filter(t => t.status === value));
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return "text-green-600";
        if (score >= 60) return "text-blue-600";
        if (score >= 40) return "text-yellow-600";
        return "text-red-600";
    };

    const getScoreBadge = (score) => {
        if (score >= 80) return { label: "Excellent", variant: "default", color: "bg-green-500" };
        if (score >= 60) return { label: "Good", variant: "default", color: "bg-blue-500" };
        if (score >= 40) return { label: "Average", variant: "secondary", color: "bg-yellow-500" };
        return { label: "Needs Improvement", variant: "destructive", color: "bg-red-500" };
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your tests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            <div className="max-w-7xl mx-auto p-6 md:p-8">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Button 
                                    variant="ghost" 
                                    onClick={() => navigate("/dashboard")}
                                    className="hover:bg-gray-100"
                                >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Back to Dashboard
                                </Button>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                My Attempted Tests
                            </h1>
                            <p className="text-gray-500 mt-1">
                                View and manage all your test attempts
                            </p>
                        </div>
                        
                        {stats.total > 0 && (
                            <Badge variant="outline" className="px-4 py-2">
                                <Trophy className="h-4 w-4 mr-2 text-yellow-500" />
                                Best Score: {stats.bestScore}%
                            </Badge>
                        )}
                    </div>
                </motion.div>

                {/* Stats Cards */}
                {stats.total > 0 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
                    >
                        <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Total Tests</p>
                                        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                                    </div>
                                    <div className="p-3 bg-blue-100 rounded-full">
                                        <BarChart3 className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Completed</p>
                                        <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
                                    </div>
                                    <div className="p-3 bg-green-100 rounded-full">
                                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">In Progress</p>
                                        <p className="text-3xl font-bold text-yellow-600">{stats.inProgress}</p>
                                    </div>
                                    <div className="p-3 bg-yellow-100 rounded-full">
                                        <Clock className="h-6 w-6 text-yellow-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-white">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Average Score</p>
                                        <p className={`text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>
                                            {stats.averageScore}%
                                        </p>
                                    </div>
                                    <div className="p-3 bg-purple-100 rounded-full">
                                        <TrendingUp className="h-6 w-6 text-purple-600" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                )}

                {/* Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-6"
                >
                    <Tabs defaultValue="all" onValueChange={handleTab}>
                        <TabsList className="bg-gray-100">
                            <TabsTrigger value="all" className="data-[state=active]:bg-white">
                                All Tests ({stats.total})
                            </TabsTrigger>
                            <TabsTrigger value="submitted" className="data-[state=active]:bg-white">
                                Completed ({stats.completed})
                            </TabsTrigger>
                            <TabsTrigger value="in-progress" className="data-[state=active]:bg-white">
                                In Progress ({stats.inProgress})
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </motion.div>

                {/* Tests List */}
                {filtered.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card className="border-0 shadow-lg text-center py-12">
                            <CardContent>
                                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                                    <Clock className="h-10 w-10 text-gray-400" />
                                </div>
                                <p className="text-gray-500 font-medium text-lg">No tests found</p>
                                <p className="text-sm text-gray-400 mt-1">
                                    {tab === "all" 
                                        ? "You haven't taken any tests yet" 
                                        : tab === "submitted" 
                                        ? "No completed tests yet" 
                                        : "No tests in progress"}
                                </p>
                                <Button 
                                    className="mt-4"
                                    onClick={() => navigate("/dashboard")}
                                >
                                    Take Test
                                </Button>
                            </CardContent>
                        </Card>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((test, index) => {
                            const score = test.scores?.aggregate || 0;
                            const scoreBadge = getScoreBadge(score);
                            const isCompleted = test.status === "submitted";
                            
                            return (
                                <motion.div
                                    key={test.testId}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                        <CardContent className="p-0">
                                            <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-3 flex-wrap">
                                                        <Badge className={isCompleted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}>
                                                            {isCompleted ? "Completed" : "In Progress"}
                                                        </Badge>
                                                        
                                                        <div className="flex items-center gap-1 text-sm text-gray-500">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(test.createdAt)}
                                                        </div>
                                                        
                                                        {test.submittedAt && (
                                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                <Clock className="h-3 w-3" />
                                                                Submitted: {formatDate(test.submittedAt)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    
                                                    {isCompleted ? (
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <p className="text-sm text-gray-500">Overall Score</p>
                                                                <Badge className={scoreBadge.color}>
                                                                    {scoreBadge.label}
                                                                </Badge>
                                                            </div>
                                                            <div className="flex items-center gap-4 flex-wrap">
                                                                <div>
                                                                    <p className={`text-3xl font-bold ${getScoreColor(score)}`}>
                                                                        {score}%
                                                                    </p>
                                                                    <Progress 
                                                                        value={score} 
                                                                        className="w-32 h-2 mt-1" 
                                                                    />
                                                                </div>
                                                                
                                                                {test.scores && Object.entries(test.scores)
                                                                    .filter(([key]) => key !== 'aggregate')
                                                                    .slice(0, 3)
                                                                    .map(([key, value]) => (
                                                                        <div key={key} className="text-center">
                                                                            <p className="text-xs text-gray-500 capitalize">{key}</p>
                                                                            <p className={`font-semibold ${getScoreColor(value)}`}>
                                                                                {value}%
                                                                            </p>
                                                                        </div>
                                                                    ))
                                                                }
                                                                
                                                                {Object.keys(test.scores || {}).filter(k => k !== 'aggregate').length > 3 && (
                                                                    <div className="text-xs text-gray-400">
                                                                        +{Object.keys(test.scores).filter(k => k !== 'aggregate').length - 3} more
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex items-center gap-2 text-yellow-600">
                                                                <Clock className="h-5 w-5" />
                                                                <span className="font-medium">Test in progress</span>
                                                            </div>
                                                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                                                Continue where you left off
                                                            </Badge>
                                                        </div>
                                                    )}
                                                </div>
                                                
                                                <Button
                                                    onClick={() =>
                                                        isCompleted
                                                            ? navigate(`/test-result/${test.testId}`)
                                                            : navigate("/take-test")
                                                    }
                                                    className={isCompleted 
                                                        ? "bg-primary hover:bg-primary/90" 
                                                        : "bg-yellow-600 hover:bg-yellow-700"
                                                    }
                                                    size="lg"
                                                >
                                                    {isCompleted ? (
                                                        <>
                                                            <Eye className="mr-2 h-4 w-4" />
                                                            View Results
                                                        </>
                                                    ) : (
                                                        <>
                                                            <PlayCircle className="mr-2 h-4 w-4" />
                                                            Continue Test
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllTests;