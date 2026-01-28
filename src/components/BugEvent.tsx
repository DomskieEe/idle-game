import { motion, AnimatePresence } from 'framer-motion';
import { Bug as BugIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useGameStore } from '../store/useGameStore';

export function BugEvent() {
    const { addCode, cps } = useGameStore();
    const [position, setPosition] = useState<{ x: number, y: number } | null>(null);

    useEffect(() => {
        // Random spawn timer: Every 20-60 seconds
        const loop = () => {
            const timeout = Math.random() * 40000 + 20000;

            return setTimeout(() => {
                // Spawn bug at random position (10% to 90% of screen to stay visible)
                setPosition({
                    x: Math.random() * 80 + 10,
                    y: Math.random() * 80 + 10
                });

                // Despawn after 5 seconds if not clicked
                setTimeout(() => {
                    setPosition(null);
                    // Schedule next spawn
                    loop();
                }, 5000);

            }, timeout);
        };

        const timer = loop();
        return () => clearTimeout(timer);
    }, []);

    const handleClick = () => {
        if (!position) return;

        // Reward: 30 seconds worth of CPS or base 100 LOC
        const reward = Math.max(100, Math.floor(cps * 30));
        addCode(reward);

        setPosition(null);
    };

    return (
        <AnimatePresence>
            {position && (
                <motion.button
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 1, rotate: 360 }}
                    exit={{ scale: 0, rotate: 0 }}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.8 }}
                    onClick={handleClick}
                    className="fixed z-50 p-3 bg-red-500 rounded-full shadow-lg shadow-red-500/50 cursor-pointer animate-pulse"
                    style={{
                        top: `${position.y}%`,
                        left: `${position.x}%`
                    }}
                >
                    <BugIcon className="text-white" size={32} />
                </motion.button>
            )}
        </AnimatePresence>
    );
}
