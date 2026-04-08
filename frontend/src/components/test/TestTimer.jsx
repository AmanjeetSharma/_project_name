import { useState, useEffect } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TestTimer = ({ initialTime = 3600, onTimeUp, isActive = true }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (!isActive) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeUp?.();
                    return 0;
                }

                if (prev === 300) {
                    setShowWarning(true);
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isActive, onTimeUp]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    };

    const getColor = () => {
        if (timeLeft <= 60) return "text-red-600 animate-pulse";
        if (timeLeft <= 300) return "text-orange-600";
        return "text-gray-800";
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow">
                <Clock className="h-5 w-5 text-blue-500" />
                <span className={`font-mono text-xl font-bold ${getColor()}`}>
                    {formatTime(timeLeft)}
                </span>
            </div>

            {showWarning && (
                <Alert className="bg-orange-50 border-orange-200">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800 text-sm">
                        Only 5 minutes left! Please complete your test.
                    </AlertDescription>
                </Alert>
            )}
        </div>
    );
};

export default TestTimer;