import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, GraduationCap, Brain, BookOpen } from "lucide-react";

export default function About() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6 md:p-12">
            {/* Hero Section */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-5xl mx-auto text-center mb-16"
            >
                <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                    One-Stop Personalized Career & Education Advisor
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                    Helping Class 10 & 12 students make smarter academic and career decisions with AI-driven guidance and personalized insights.
                </p>
            </motion.div>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-16">
                {[
                    {
                        icon: <Brain className="w-6 h-6" />,
                        title: "AI-Powered Guidance",
                        desc: "Get personalized recommendations based on aptitude tests and your interests.",
                    },
                    {
                        icon: <GraduationCap className="w-6 h-6" />,
                        title: "Career & Stream Selection",
                        desc: "Discover the best subject streams and career paths tailored just for you.",
                    },
                    {
                        icon: <BookOpen className="w-6 h-6" />,
                        title: "Education Insights",
                        desc: "Access details about government colleges, entrance exams, and eligibility.",
                    },
                    {
                        icon: <Sparkles className="w-6 h-6" />,
                        title: "Scholarships & Opportunities",
                        desc: "Explore scholarships and financial aid options to support your education.",
                    },
                    {
                        icon: <Brain className="w-6 h-6" />,
                        title: "Progress Tracking",
                        desc: "Stay on track with reminders, updates, and performance monitoring.",
                    },
                    {
                        icon: <GraduationCap className="w-6 h-6" />,
                        title: "Secure Access",
                        desc: "Verified login with SMS authentication ensures safe and reliable usage.",
                    },
                ].map((feature, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Card className="h-full rounded-2xl shadow-md hover:shadow-xl transition">
                            <CardContent className="p-6 flex flex-col gap-4">
                                <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold">{feature.title}</h3>
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                    {feature.desc}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* About Section */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="max-w-4xl mx-auto text-center"
            >
                <h2 className="text-3xl md:text-4xl font-bold mb-6">About This Platform</h2>
                <p className="text-muted-foreground leading-relaxed text-lg">
                    This platform is designed to simplify one of the most important decisions in a student’s life — choosing the right academic path and career. By combining modern web technologies with intelligent analysis, it provides a single place where students can explore streams, careers, colleges, and opportunities without confusion.
                </p>
                <p className="text-muted-foreground leading-relaxed text-lg mt-4">
                    Our goal is to reduce uncertainty, improve decision-making, and ensure that every student — regardless of background — has access to the right guidance at the right time.
                </p>

                <Button className="mt-8 rounded-2xl px-6 py-4 text-lg">
                    Get Started
                </Button>
            </motion.div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mt-16 text-center text-sm text-muted-foreground"
            >
                &copy; {new Date().getFullYear()} Career & Education Advisor. All rights reserved.
            </motion.div>
        </div>
    );
}
