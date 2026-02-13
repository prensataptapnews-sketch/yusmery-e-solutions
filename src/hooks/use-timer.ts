import { useState, useEffect } from 'react';

export function useTimer(initialSeconds: number, onExpire: () => void) {
    const [seconds, setSeconds] = useState(initialSeconds);

    useEffect(() => {
        if (seconds <= 0) {
            // Prevent multiple calls if component stays mounted
            if (seconds === 0) onExpire();
            return;
        }

        const interval = setInterval(() => {
            setSeconds(s => {
                if (s <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return s - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [seconds, onExpire]);

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return {
        seconds,
        formatted: `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    };
}
