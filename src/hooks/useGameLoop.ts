import { useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';

export const useGameLoop = () => {
    const { cps, addCode, updateMarket } = useGameStore();
    const lastTimeRef = useRef(Date.now());
    const marketTimeRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const now = Date.now();
            const delta = (now - lastTimeRef.current) / 1000; // Time in seconds
            lastTimeRef.current = now;

            if (delta > 0 && cps > 0) {
                addCode(cps * delta);
            }

            // Market Update every 3 seconds
            marketTimeRef.current += delta;
            if (marketTimeRef.current >= 3) {
                updateMarket();
                marketTimeRef.current = 0;
            }

        }, 100); // Update every 100ms for smoothness

        return () => clearInterval(interval);
    }, [cps, addCode, updateMarket]);
};
