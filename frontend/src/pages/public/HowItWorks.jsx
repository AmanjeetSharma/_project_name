// pages/HowItWorks.jsx
import { motion } from "framer-motion";
import {
    Brain,
    Target,
    GraduationCap,
    Briefcase,
    Award,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
    Users,
    BookOpen,
    Sparkles,
    Shield,
    Clock,
    BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const HowItWorks = () => {
    const steps = [
        {
            number: "01",
            title: "Take Aptitude Assessment",
            description: "Complete our comprehensive aptitude test that evaluates your strengths, interests, and cognitive abilities across multiple domains.",
            icon: Brain,
            color: "from-blue-500 to-blue-600",
            duration: "15-20 mins",
            features: ["Multiple Intelligence Test", "Interest Inventory", "Personality Assessment"]
        },
        {
            number: "02",
            title: "AI-Powered Analysis",
            description: "Our advanced AI algorithms analyze your results to identify patterns and match you with suitable career paths and educational streams.",
            icon: TrendingUp,
            color: "from-purple-500 to-purple-600",
            duration: "Instant",
            features: ["Machine Learning Models", "Pattern Recognition", "Career Matching"]
        },
        {
            number: "03",
            title: "Get Personalized Recommendations",
            description: "Receive detailed, personalized recommendations for subject streams, higher education options, and career paths tailored to your profile.",
            icon: Target,
            color: "from-green-500 to-green-600",
            duration: "Comprehensive",
            features: ["Stream Selection", "College Suggestions", "Career Roadmap"]
        },
        {
            number: "04",
            title: "Explore Opportunities",
            description: "Discover detailed information about recommended colleges, entrance exams, scholarships, and career paths with real-time updates.",
            icon: GraduationCap,
            color: "from-orange-500 to-orange-600",
            duration: "Ongoing",
            features: ["College Database", "Exam Prep", "Scholarship Info"]
        },
        {
            number: "05",
            title: "Track Progress & Stay Updated",
            description: "Monitor your progress, get reminders for important deadlines, and receive real-time updates on admissions and results.",
            icon: Clock,
            color: "from-red-500 to-red-600",
            duration: "Continuous",
            features: ["Progress Tracking", "Deadline Alerts", "Result Updates"]
        },
        {
            number: "06",
            title: "Make Informed Decisions",
            description: "Use our comprehensive insights and resources to make confident decisions about your academic and career future.",
            icon: Award,
            color: "from-indigo-500 to-indigo-600",
            duration: "Lifelong",
            features: ["Expert Guidance", "Peer Support", "Success Stories"]
        }
    ];

    const features = [
        {
            icon: Shield,
            title: "Verified Information",
            description: "All college and career information is verified from official sources"
        },
        {
            icon: Users,
            title: "Expert Guidance",
            description: "Get advice from experienced career counselors and education experts"
        },
        {
            icon: BookOpen,
            title: "Comprehensive Database",
            description: "Access detailed information about 5000+ colleges and 200+ career paths"
        },
        {
            icon: Sparkles,
            title: "AI-Powered Insights",
            description: "Advanced algorithms provide personalized recommendations based on your profile"
        },
        {
            icon: BarChart3,
            title: "Progress Analytics",
            description: "Track your improvement with detailed analytics and performance metrics"
        },
        {
            icon: Clock,
            title: "Real-time Updates",
            description: "Stay informed with instant notifications about admissions and results"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-gray-900 to-gray-500 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <Badge className="bg-white/20 text-white border-0 mb-4">
                            Simple & Effective
                        </Badge>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
                            How It Works
                        </h1>
                        <p className="text-lg sm:text-xl text-blue-100 mb-6">
                            Your journey to a successful career starts here. Follow these simple steps to discover your perfect path.
                        </p>
                        <p className="text-blue-100 text-sm">
                            Join thousands of students who have found their dream career with our platform
                        </p>
                    </motion.div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-50 to-transparent" />
            </div>

            {/* Steps Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-r ${step.color} text-white flex-shrink-0`}>
                                            <step.icon className="h-6 w-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge className="bg-gray-100 text-gray-600">
                                                    Step {step.number}
                                                </Badge>
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {step.duration}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                {step.title}
                                            </h3>
                                            <p className="text-gray-600 mb-4">
                                                {step.description}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {step.features.map((feature, idx) => (
                                                    <Badge key={idx} variant="outline" className="bg-gray-50">
                                                        <CheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Key Features Section */}
            <div className="bg-gray-50/80 py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Why Choose Our Platform?
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            We provide everything you need to make informed decisions about your future
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="border-0 shadow-md hover:shadow-lg transition-all h-full">
                                    <CardContent className="p-6 text-center">
                                        <div className="p-3 bg-blue-50 rounded-full w-fit mx-auto mb-4">
                                            <feature.icon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Success Stats */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { number: "10,000+", label: "Students Guided", icon: Users },
                            { number: "500+", label: "Colleges Listed", icon: GraduationCap },
                            { number: "95%", label: "Success Rate", icon: TrendingUp },
                            { number: "200+", label: "Career Paths", icon: Briefcase }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                viewport={{ once: true }}
                            >
                                <Card className="border-0 shadow-lg text-center">
                                    <CardContent className="p-6">
                                        <stat.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                                        <div className="text-3xl font-bold text-gray-900 mb-1">
                                            {stat.number}
                                        </div>
                                        <p className="text-sm text-gray-600">{stat.label}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-gray-900 to-gray-500 text-white py-16">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl font-bold mb-4">
                            Ready to Start Your Journey?
                        </h2>
                        <p className="text-lg text-blue-100 mb-8">
                            Join thousands of students who have already found their perfect career path
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                                Get Started Now
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                Take Aptitude Test
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;