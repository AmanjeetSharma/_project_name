import { useState, useEffect, useCallback } from "react";

const useFullScreen = () => {
    const [isFullScreen, setIsFullScreen] = useState(false);

    const enterFullScreen = useCallback(async () => {
        try {
            const elem = document.documentElement;
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            }
        } catch (err) {
            console.warn("Fullscreen not allowed:", err);
        }
    }, []);

    const exitFullScreen = useCallback(async () => {
        try {
            if (document.exitFullscreen) {
                await document.exitFullscreen();
            }
        } catch (err) {
            console.warn("Exit fullscreen failed:", err);
        }
    }, []);

    useEffect(() => {
        const handleChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };

        document.addEventListener("fullscreenchange", handleChange);

        return () => {
            document.removeEventListener("fullscreenchange", handleChange);
        };
    }, []);

    return { isFullScreen, enterFullScreen, exitFullScreen };
};

export default useFullScreen;