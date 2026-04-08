import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  Brain,
  ArrowRight,
  Trophy,
  Clock,
  Calendar,
  Award,
  Target,
  BookOpen,
  ChevronRight,
  CheckCircle2,
  BarChart3,
  TrendingUp,
  Zap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTest } from "../../context/TestContext";

const stagger = {
  container: { animate: { transition: { staggerChildren: 0.05 } } },
  item: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] } },
  },
};

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserAllTests } = useTest();
  const navigate = useNavigate();

  const [recentTests, setRecentTests] = useState([]);
  const [hasRunningTest, setHasRunningTest] = useState(false);
  const [stats, setStats] = useState({
    totalTests: 0,
    completedTests: 0,
    averageScore: 0,
    inProgressTests: 0,
  });

  useEffect(() => {
    if (user?._id) fetchTestHistory();
  }, [user]);

  const fetchTestHistory = async () => {
    try {
      const tests = await getUserAllTests();
      const completed = tests.filter((t) => t.status === "submitted");
      const inProgress = tests.filter((t) => t.status === "in-progress");
      setHasRunningTest(inProgress.length > 0);
      const avgScore =
        completed.length > 0
          ? completed.reduce((sum, t) => sum + (t.scores?.aggregate || 0), 0) / completed.length
          : 0;
      setStats({
        totalTests: tests.length,
        completedTests: completed.length,
        averageScore: Math.round(avgScore),
        inProgressTests: inProgress.length,
      });
      setRecentTests(completed.slice(0, 3));
    } catch (err) {
      console.error("Failed to fetch test history:", err);
    }
  };

  const getInitials = (name) =>
    name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const scoreConfig = (score) => {
    if (score >= 80) return { label: "Excellent", cls: "bg-emerald-50 text-emerald-700 border-emerald-200", text: "text-emerald-600", stroke: "#10b981" };
    if (score >= 60) return { label: "Good", cls: "bg-blue-50 text-blue-700 border-blue-200", text: "text-blue-600", stroke: "#3b82f6" };
    if (score >= 40) return { label: "Average", cls: "bg-amber-50 text-amber-700 border-amber-200", text: "text-amber-600", stroke: "#f59e0b" };
    return { label: "Needs Work", cls: "bg-red-50 text-red-700 border-red-200", text: "text-red-600", stroke: "#ef4444" };
  };

  const statCards = [
    { title: "Completed", value: stats.completedTests, icon: Trophy, trend: "+12%", bg: "from-emerald-50 to-emerald-100/50", iconBg: "bg-emerald-100", iconCls: "text-emerald-600" },
    { title: "In Progress", value: stats.inProgressTests, icon: Clock, trend: "Active", bg: "from-blue-50 to-blue-100/50", iconBg: "bg-blue-100", iconCls: "text-blue-600" },
    { title: "Avg. Score", value: `${stats.averageScore}%`, icon: TrendingUp, trend: stats.averageScore > 60 ? "Above avg" : "Improving", bg: "from-violet-50 to-violet-100/50", iconBg: "bg-violet-100", iconCls: "text-violet-600" },
    { title: "Total Tests", value: stats.totalTests, icon: BookOpen, trend: "Lifetime", bg: "from-amber-50 to-amber-100/50", iconBg: "bg-amber-100", iconCls: "text-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">

        {/* Header Section */}
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <motion.div variants={stagger.item} className="flex items-center gap-4">
            <Avatar className="ring-2 ring-white shadow-lg shrink-0 h-14 w-14 sm:h-16 sm:w-16">
              <AvatarFallback className="bg-gradient-to-br from-slate-600 to-slate-900 text-white text-base sm:text-lg font-semibold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                Welcome back, {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-sm text-slate-400 mt-1 flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5" />
                {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
              </p>
            </div>
          </motion.div>

          <motion.div variants={stagger.item} className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              className="h-9 bg-white text-black hover:bg-black hover:text-white shadow-sm px-5 transition-all duration-200 hover:shadow-md cursor-pointer"
            >
              <GraduationCap className="mr-2 h-4 w-4" />
              Profile
            </Button>
            <Button
              size="sm"
              onClick={() => navigate(hasRunningTest ? "/take-test" : "/preferences")}
              className="h-9 bg-black hover:bg-slate-700 text-white shadow-sm px-5 transition-all duration-200 hover:shadow-md cursor-pointer"
            >
              <Brain className="mr-2 h-4 w-4 text-purple-400" />
              {hasRunningTest ? "Continue Test" : "Start New Test"}
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={stagger.container}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
          {statCards.map((s) => (
            <motion.div key={s.title} variants={stagger.item}>
              <Card className="border-0 bg-gradient-to-br shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden group">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-xl ${s.iconBg}`}>
                      <s.icon className={`h-5 w-5 ${s.iconCls}`} />
                    </div>
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-full">
                      {s.trend}
                    </span>
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-1">
                    {s.value}
                  </p>
                  <p className="text-sm font-medium text-slate-600">{s.title}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">

          {/* Recent Tests Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="lg:col-span-2"
          >
            <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden h-full">
              <CardHeader className="px-6 py-5 flex flex-row items-center justify-between border-b border-slate-100">
                <div>
                  <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <Clock className="h-5 w-5 text-slate-400" />
                    Recent Activity
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-500 mt-1">
                    Your latest test attempts and scores
                  </CardDescription>
                </div>
                {stats.totalTests > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/all-tests")}
                    className="text-slate-500 hover:text-slate-700 hover:bg-slate-100"
                  >
                    View All
                    <ArrowRight className="ml-2 h-3.5 w-3.5" />
                  </Button>
                )}
              </CardHeader>

              <CardContent className="p-0">
                {recentTests.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                    <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                      <Zap className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="text-base font-medium text-slate-600">No tests taken yet</p>
                    <p className="text-sm text-slate-400 mt-1 max-w-xs">
                      Start your first assessment to track your progress
                    </p>
                    <Button
                      className="mt-6 bg-slate-900 hover:bg-slate-800 text-white"
                      onClick={() => navigate("/preferences")}
                    >
                      Begin Journey
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {recentTests.map((test, idx) => {
                      const score = test.scores?.aggregate || 0;
                      const cfg = scoreConfig(score);
                      const subScores = Object.entries(test.scores || {}).filter(([k]) => k !== "aggregate").slice(0, 3);

                      return (
                        <motion.div
                          key={test.testId}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                          className="group cursor-pointer hover:bg-slate-50/80 transition-all duration-200"
                          onClick={() => navigate(`/test-result/${test.testId}`)}
                        >
                          <div className="px-6 py-5">
                            <div className="flex items-center gap-5">
                              {/* Score Ring */}
                              <div className="shrink-0 relative h-16 w-16">
                                <svg className="h-16 w-16 -rotate-90" viewBox="0 0 36 36">
                                  <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="2.5" />
                                  <circle
                                    cx="18" cy="18" r="15" fill="none"
                                    stroke={cfg.stroke}
                                    strokeWidth="2.5"
                                    strokeDasharray={`${(score / 100) * 94.2} 94.2`}
                                    strokeLinecap="round"
                                    className="transition-all duration-700 ease-out"
                                  />
                                </svg>
                                <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${cfg.text}`}>
                                  {score}
                                </span>
                              </div>

                              {/* Test Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border ${cfg.cls}`}>
                                    {cfg.label}
                                  </span>
                                  <span className="text-sm text-slate-400">
                                    {new Date(test.createdAt).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric"
                                    })}
                                  </span>
                                </div>
                                {subScores.length > 0 && (
                                  <div className="flex items-center gap-4 flex-wrap">
                                    {subScores.map(([key, val]) => (
                                      <div key={key} className="flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                        <span className="text-sm text-slate-500 capitalize">{key}:</span>
                                        <span className="text-sm font-semibold text-slate-700">{val}%</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-slate-500 transition-all group-hover:translate-x-0.5 shrink-0" />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Performance Sidebar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Card className="border-0 shadow-lg bg-white rounded-2xl overflow-hidden sticky top-6">
              <CardHeader className="px-6 py-5 border-b border-slate-100">
                <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Award className="h-5 w-5 text-slate-400" />
                  Performance Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {/* Overall Score Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-baseline">
                    <span className="text-sm font-medium text-slate-600">Overall Average</span>
                    <span className="text-2xl font-bold text-slate-900">{stats.averageScore}%</span>
                  </div>
                  <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${stats.averageScore}%` }}
                      transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs text-slate-400">
                    Based on {stats.completedTests} completed assessments
                  </p>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/30 rounded-xl p-4 text-center">
                    <CheckCircle2 className="h-5 w-5 text-emerald-600 mx-auto mb-2" />
                    <p className="text-xs text-emerald-600 font-medium mb-1">Completed</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.completedTests}</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100/30 rounded-xl p-4 text-center">
                    <Target className="h-5 w-5 text-blue-600 mx-auto mb-2" />
                    <p className="text-xs text-blue-600 font-medium mb-1">Accuracy</p>
                    <p className="text-2xl font-bold text-slate-900">{stats.averageScore}%</p>
                  </div>
                </div>

                {/* In Progress Alert */}
                {hasRunningTest && (
                  <button
                    onClick={() => navigate("/take-test")}
                    className="w-full group flex items-center justify-between px-5 py-3.5 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <span className="flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500" />
                        </span>
                      </div>
                      <span className="text-sm font-medium text-blue-700">Test in Progress</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                {/* Achievement Badge */}
                {stats.completedTests >= 5 && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    <div className="p-2 bg-amber-100 rounded-full">
                      <Trophy className="h-5 w-5 text-amber-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-700">Achievement Unlocked</p>
                      <p className="text-xs text-slate-400">5+ tests completed</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;