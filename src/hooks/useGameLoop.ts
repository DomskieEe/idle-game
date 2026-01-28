import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export const useGameLoop = () => {
    const { cps, addCode } = useGameStore();
    const lastTimeRef = useRef(Date.now());

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const delta = (now - lastTimeRef.current) / 1000; // Time in seconds

            if (delta > 0 && cps > 0) {
                addCode(cps * delta);
            }

            lastTimeRef.current = now;
        }, 100); // Update every 100ms for smoothness

        return () => clearInterval(interval);
    }, [cps, addCode]);
};
