import { useState, useEffect, useRef } from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const TestTimer = ({ initialTime = 3600, onTimeUp, isActive = true }) => {
    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [showWarning, setShowWarning] = useState(false);

    // Ref to track completion so we don't trigger onTimeUp multiple times
    const hasEnded = useRef(false);

    useEffect(() => {
        if (!isActive || timeLeft <= 0) return;

        // Calculate end time once to avoid drift
        const endTime = Date.now() + timeLeft * 1000;

        const timer = setInterval(() => {
            const now = Date.now();
            const remaining = Math.max(0, Math.round((endTime - now) / 1000));

            if (remaining <= 300 && !showWarning) {
                setShowWarning(true);
            }

            if (remaining <= 0) {
                clearInterval(timer);
                if (!hasEnded.current) {
                    hasEnded.current = true;
                    onTimeUp?.();
                }
            }

            setTimeLeft(remaining);
        }, 500); // Check every 500ms for smoother sync

        return () => clearInterval(timer);
    }, [isActive]); // Note: Removed onTimeUp from deps to prevent unnecessary resets

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    const getColor = () => {
        if (timeLeft <= 60) return "text-red-600 animate-pulse font-black";
        if (timeLeft <= 300) return "text-orange-600 font-bold";
        return "text-zinc-600 font-bold";
    };

    return (
        <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-200 px-4 py-2.5 rounded-full">
                <Clock className={`h-4 w-4 ${timeLeft <= 60 ? 'text-red-500' : 'text-zinc-400'}`} />
                <span className={`font-mono text-sm ${getColor()}`}>
                    {formatTime(timeLeft)}
                </span>
            </div>

            {showWarning && timeLeft > 0 && (
                <div className="fixed top-20 right-4 max-w-xs animate-in slide-in-from-right">
                    <Alert className="bg-amber-50 border-amber-200 shadow-lg">
                        <AlertTriangle className="h-4 w-4 text-amber-600" />
                        <AlertDescription className="text-amber-800 text-xs font-medium">
                            5 minutes remaining. Progress is auto-saved.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
        </div>
    );
};

export default TestTimer;