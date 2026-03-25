// pages/NotFound.jsx
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-background to-secondary/20 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6 max-w-md"
            >
                {/* Animated 404 text */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 260,
                        damping: 20,
                        delay: 0.1
                    }}
                    className="relative"
                >
                    <h1 className="text-8xl md:text-9xl font-bold bg-linear-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                        404
                    </h1>
                    <motion.div
                        animate={{
                            y: [0, -10, 0],
                            rotate: [0, -5, 5, 0]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 3
                        }}
                        className="absolute -top-4 -right-4 text-2xl"
                    >
                        🤔
                    </motion.div>
                </motion.div>

                {/* Error message */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-2"
                >
                    <h2 className="text-2xl md:text-3xl font-semibold">
                        Page Not Found
                    </h2>
                    <p className="text-muted-foreground">
                        Oops! The page you're looking for doesn't exist or has been moved.
                    </p>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex flex-col sm:flex-row gap-3 justify-center pt-4"
                >
                    <Button
                        onClick={() => navigate(-1)}
                        variant="outline"
                        className="gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Go Back
                    </Button>

                    <Button
                        onClick={() => navigate("/")}
                        className="gap-2"
                    >
                        <Home className="h-4 w-4" />
                        Go Home
                    </Button>
                </motion.div>

                {/* Decorative elements */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute inset-0 -z-10 overflow-hidden"
                >
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-primary/5 rounded-full blur-3xl" />
                </motion.div>
            </motion.div>
        </div>
    );
};

export default NotFound;