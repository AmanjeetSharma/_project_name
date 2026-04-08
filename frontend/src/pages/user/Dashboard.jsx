import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis
} from "recharts";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Trophy,
  Calendar,
  Target,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Activity,
  User
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import { useTest } from "../../context/TestContext";
import PageLoader from "@/utils/PageLoader";

const Dashboard = () => {
  const { user } = useAuth();
  const { getUserAllTests } = useTest();
  const navigate = useNavigate();

  const [recentTests, setRecentTests] = useState([]);
  const [hasRunningTest, setHasRunningTest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTests: 0,
    completedTests: 0,
    averageScore: 0,
    growth: 0
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

      // Growth Logic: Highest - Second Highest
      let growthVal = 0;
      if (completed.length >= 2) {
        const sortedScores = completed
          .map(t => t.scores?.aggregate || 0)
          .sort((a, b) => b - a);
        growthVal = sortedScores[0] - sortedScores[1];
      }

      const avgScore = completed.length > 0
        ? completed.reduce((sum, t) => sum + (t.scores?.aggregate || 0), 0) / completed.length
        : 0;

      setStats({
        totalTests: tests.length,
        completedTests: completed.length,
        averageScore: Math.round(avgScore),
        growth: growthVal
      });
      setRecentTests(completed.slice(0, 3));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = [{ value: stats.averageScore, fill: '#18181b' }];

  const scoreConfig = (score) => {
    if (score >= 80) return { label: "Elite", bg: "bg-emerald-50", text: "text-emerald-600" };
    if (score >= 60) return { label: "Advanced", bg: "bg-blue-50", text: "text-blue-600" };
    return { label: "Standard", bg: "bg-slate-50", text: "text-slate-600" };
  };

  if (loading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">

        {/* --- Header --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 ring-4 ring-white shadow-xl">
              <AvatarFallback className="bg-zinc-900 text-white font-bold uppercase">
                {user?.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-zinc-900 uppercase">
                {user?.name?.split(" ")[0]} <span className="text-zinc-400 font-light italic">/ DASHBOARD</span>
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-zinc-500 border-zinc-200 font-medium">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </Badge>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate("/profile")}
              className="rounded-full px-6 border-zinc-200 hover:bg-zinc-100 hover:border-black/30 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              <User className="w-3 h-3 mr-2" /> Profile
            </Button>
            <Button
              onClick={() => navigate(hasRunningTest ? "/take-test" : "/preferences")}
              className="rounded-full bg-black text-white px-8 shadow-xl shadow-zinc-200 hover:bg-zinc-700 transition-all text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              {hasRunningTest ? "Continue Test" : "Take New Test"}
            </Button>
          </div>
        </div>

        {/* --- Top Stats --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={<Activity className={hasRunningTest ? "text-emerald-600" : "text-zinc-600"} />}
            label="Status"
            value={hasRunningTest ? "Active Session" : "Ready"}
            badge={hasRunningTest ? "Running" : "Available"}
            color={hasRunningTest ? "bg-emerald-50" : "bg-zinc-50"}
          />
          <StatCard icon={<Target className="text-violet-600" />} label="Accuracy" value={`${stats.averageScore}%`} color="bg-violet-50" />
          <StatCard icon={<Trophy className="text-amber-600" />} label="Completed" value={stats.completedTests} color="bg-amber-50" />
          <StatCard icon={<BookOpen className="text-blue-600" />} label="Attempts" value={stats.totalTests} color="bg-blue-50" />
        </div>

        {/* --- Main Section --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          <div className="lg:col-span-8">
            <Card className="border-none shadow-xl shadow-zinc-200/50 bg-white rounded-[2rem] overflow-hidden">
              <CardHeader className="p-8 border-b border-zinc-50 flex flex-row items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg font-bold tracking-tight uppercase">Recent Attempts</CardTitle>
                  <CardDescription className="text-xs font-medium">Review your latest performance metrics</CardDescription>
                </div>

                {/* VIEW ALL BUTTON */}
                {recentTests.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate("/all-tests")}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition-all gap-2 px-4 rounded-full cursor-pointer"
                  >
                    View All <ArrowRight className="h-3 w-3" />
                  </Button>
                )}
              </CardHeader>

              <CardContent className="p-0">
                {recentTests.length === 0 ? (
                  <div className="p-20 text-center text-zinc-400 font-medium">No activity recorded yet.</div>
                ) : (
                  <div className="divide-y divide-zinc-200">
                    {recentTests.map((test, idx) => {
                      const score = test.scores?.aggregate || 0;
                      const cfg = scoreConfig(score);
                      return (
                        <div
                          key={idx}
                          onClick={() => navigate(`/test-result/${test.testId}`)}
                          className="p-6 hover:bg-zinc-50/80 transition-all cursor-pointer group flex items-center justify-between"
                        >
                          <div className="flex items-center gap-6">
                            <div className={`h-10 w-10 rounded-xl ${cfg.bg} flex items-center justify-center font-black text-xs ${cfg.text}`}>
                              {score}%
                            </div>
                            <div>
                              <p className="text-xs font-black text-zinc-900 uppercase tracking-tighter">
                                {test.interest?.[0] || 'General Assessment'}
                              </p>
                              <p className="text-[10px] text-zinc-400 font-bold mt-1 uppercase">
                                {new Date(test.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="h-4 w-4 text-zinc-900 group-hover:text-zinc-500 transition-colors" />
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Performance Visualization */}
          <div className="lg:col-span-4">
            <Card className="border-none shadow-xl bg-white rounded-[2rem] p-8 flex flex-col items-center justify-center">
              <div className="text-center mb-2">
                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Efficiency</p>
                <h2 className="text-xl font-black italic tracking-tighter text-zinc-900 uppercase">Aggregate</h2>
              </div>

              <div className="relative w-full h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    cx="50%" cy="50%"
                    innerRadius="80%" outerRadius="100%"
                    barSize={12}
                    data={chartData}
                    startAngle={90} endAngle={450}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar
                      background={{ fill: '#f4f4f5' }}
                      clockWise
                      dataKey="value"
                      cornerRadius={10}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black italic tracking-tighter text-zinc-900">{stats.averageScore}%</span>
                  <span className="text-[9px] font-bold text-zinc-400 uppercase mt-0.5">Average</span>
                </div>
              </div>

              <div className="w-full mt-4">
                <div className="flex justify-between items-center bg-zinc-50 p-4 rounded-2xl border border-zinc-100">
                  <div className="flex items-center gap-2">
                    <TrendingUp className={`h-4 w-4 ${stats.growth >= 0 ? 'text-emerald-500' : 'text-rose-500'}`} />
                    <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Peak Growth</span>
                  </div>
                  <span className={`text-xs font-black ${stats.growth >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stats.growth > 0 ? `+${stats.growth}` : stats.growth}%
                  </span>
                </div>
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, badge, color }) => (
  <Card className="border-none shadow-md bg-white rounded-2xl p-6">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-xl ${color}`}>{icon}</div>
      {badge && <Badge variant="secondary" className="text-[9px] uppercase tracking-widest px-2">{badge}</Badge>}
    </div>
    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</p>
    <h3 className="text-xl font-black text-zinc-900 tracking-tighter">{value}</h3>
  </Card>
);

export default Dashboard;