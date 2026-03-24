// pages/Home.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GraduationCap, Search, Users, Trophy, ArrowRight, CheckCircle } from "lucide-react";

export default function Home() {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: <Search className="h-8 w-8 text-blue-600" />,
            title: "Find Your Perfect College",
            description: "Search through thousands of colleges based on your preferences, location, and academic interests."
        },
        {
            icon: <Users className="h-8 w-8 text-indigo-600" />,
            title: "Community Reviews",
            description: "Read authentic reviews from current students and alumni to make informed decisions."
        },
        {
            icon: <Trophy className="h-8 w-8 text-purple-600" />,
            title: "Compare & Decide",
            description: "Compare colleges side-by-side based on rankings, fees, placements, and more."
        }
    ];

    const steps = [
        { number: "01", title: "Create Account", description: "Sign up with your email and get started" },
        { number: "02", title: "Set Preferences", description: "Tell us what you're looking for in a college" },
        { number: "03", title: "Explore Options", description: "Discover colleges that match your criteria" },
        { number: "04", title: "Apply & Connect", description: "Apply to your favorite colleges directly" }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="text-center">
                        <div className="flex justify-center mb-6">
                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl">
                                <GraduationCap className="h-12 w-12 text-white" />
                            </div>
                        </div>
                        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-6">
                            Find Your Dream College
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                            Discover the perfect college for your future. Compare institutions, read reviews, and make informed decisions with CollegeFinder.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            {isAuthenticated ? (
                                <Link to="/dashboard">
                                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                        Go to Dashboard
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                </Link>
                            ) : (
                                <>
                                    <Link to="/register">
                                        <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                            Get Started Free
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Button>
                                    </Link>
                                    <Link to="/login">
                                        <Button size="lg" variant="outline">
                                            Sign In
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose CollegeFinder?</h2>
                        <p className="text-lg text-gray-600">Everything you need to find the perfect college in one place</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-center mb-4">{feature.icon}</div>
                                    <CardTitle>{feature.title}</CardTitle>
                                    <CardDescription>{feature.description}</CardDescription>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works Section */}
            <div className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-lg text-gray-600">Simple steps to find your perfect college</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        {steps.map((step, index) => (
                            <div key={index} className="text-center">
                                <div className="relative">
                                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                                        {step.number}
                                    </div>
                                    {index < steps.length - 1 && (
                                        <div className="hidden md:block absolute top-6 left-full w-full h-0.5 bg-gradient-to-r from-blue-200 to-indigo-200">
                                            <ArrowRight className="absolute right-0 top-1/2 transform translate-y-1/2 text-blue-400" />
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                                <p className="text-gray-600 text-sm">{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
                        <div>
                            <div className="text-4xl font-bold mb-2">10,000+</div>
                            <div className="text-blue-100">Colleges Listed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">50,000+</div>
                            <div className="text-blue-100">Student Reviews</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold mb-2">100,000+</div>
                            <div className="text-blue-100">Happy Students</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-lg text-gray-600 mb-8">Join thousands of students who found their dream college with CollegeFinder</p>
                    {!isAuthenticated && (
                        <Link to="/register">
                            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                                Create Free Account
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}