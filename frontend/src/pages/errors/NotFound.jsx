// pages/NotFound.jsx
import { motion, useAnimation } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Compass } from "lucide-react";
import { useEffect } from "react";

const NotFound = () => {
    const navigate = useNavigate();
    const controls = useAnimation();
    const entranceControls = useAnimation();

    useEffect(() => {
        // Entrance animation
        entranceControls.start({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                ease: [0.25, 0.46, 0.45, 0.94] // Custom cubic-bezier for smooth feel
            }
        });

        // Glitch effect
        let timeoutId;

        const triggerGlitch = () => {
            // Randomize glitch timing between 1.5s and 5.5s
            const randomDelay = Math.random() * 4000 + 1500;

            timeoutId = setTimeout(() => {
                // Main glitch animation
                controls.start({
                    x: [0, -5, 4, -3, 5, -4, 3, -2, 4, -3, 2, -1, 1, 0],
                    y: [0, 2, -3, 4, -2, 3, -1, -2, 1, 0],
                    skew: [0, 8, -6, 10, -8, 5, -3, 2, -1, 0],
                    scale: [1, 1.03, 0.97, 1.02, 0.98, 1.01, 0.99, 1],
                    rotate: [0, 0.5, -0.8, 1, -0.5, 0.3, -0.2, 0],
                    transition: { duration: 0.3, ease: "easeInOut" }
                });

                // RGB split effect
                setTimeout(() => {
                    controls.start({
                        textShadow: [
                            "0 0 0px rgba(0,0,0,0)",
                            "3px 0 0px rgba(245,158,11,0.6), -3px 0 0px rgba(59,130,246,0.6)",
                            "-4px 0 0px rgba(245,158,11,0.6), 4px 0 0px rgba(59,130,246,0.6)",
                            "2px 0 0px rgba(245,158,11,0.6), -2px 0 0px rgba(59,130,246,0.6)",
                            "-3px 0 0px rgba(245,158,11,0.6), 3px 0 0px rgba(59,130,246,0.6)",
                            "0 0 0px rgba(0,0,0,0)"
                        ],
                        transition: { duration: 0.25 }
                    });
                }, 50);

                // Secondary shake for more intensity
                setTimeout(() => {
                    controls.start({
                        x: [0, -2, 2, -1, 1, 0],
                        y: [0, 1, -1, 0],
                        transition: { duration: 0.1 }
                    });
                }, 150);

                // Schedule next glitch
                triggerGlitch();
            }, randomDelay);
        };

        triggerGlitch();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [controls, entranceControls]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background via-background to-secondary/10 p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={entranceControls}
                className="text-center space-y-6 max-w-md w-full"
            >
                {/* 404 Text with Glitch Effect */}
                <div className="relative">
                    <motion.h1
                        animate={controls}
                        className="text-8xl md:text-9xl font-bold tracking-tighter bg-linear-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
                        style={{
                            willChange: "transform",
                            display: "inline-block"
                        }}
                    >
                        404
                    </motion.h1>

                    {/* Decorative accent with gradient */}
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-60 h-0.5 bg-linear-to-r from-transparent via-primary/70 to-transparent" />                </div>

                {/* Error message with staggered entrance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5, ease: "easeOut" }}
                    className="space-y-3"
                >
                    <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                        Page not found
                    </h2>
                    <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                        The page you're looking for doesn't exist or has been moved to a different URL.
                    </p>
                </motion.div>

                {/* Action buttons with staggered entrance */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row gap-3 justify-center pt-2"
                >
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        size="lg"
                        className="gap-2 transition-all duration-200 active:scale-95 hover:shadow-md"
                    >
                        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                        Go Back
                    </Button>

                    <Button
                        onClick={() => navigate("/")}
                        size="lg"
                        className="gap-2 transition-all duration-200 active:scale-95 hover:shadow-lg"
                    >
                        <Home className="h-4 w-4 transition-transform group-hover:scale-110" />
                        Go Home
                    </Button>
                </motion.div>

                {/* Helpful hint with staggered entrance */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="pt-6"
                >
                    <div className="inline-flex items-center gap-2 text-xs text-muted-foreground/60">
                        <Compass className="h-3 w-3" />
                        <span>Check the URL or return to the homepage</span>
                    </div>
                </motion.div>

                {/* Decorative background with fade-in */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.8 }}
                    className="fixed inset-0 -z-10 pointer-events-none"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 md:w-100 md:h-100 bg-primary/5 rounded-full blur-2xl" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFound;