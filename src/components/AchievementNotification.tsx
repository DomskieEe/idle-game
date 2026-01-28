import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/useGameStore';
import { ACHIEVEMENTS } from '../data/achievements';
import { Trophy } from 'lucide-react';
import { useEffect, useState } from 'react';

export function AchievementNotification() {
    const { achievements } = useGameStore();
    const [queue, setQueue] = useState<string[]>([]);
    const [current, setCurrent] = useState<string | null>(null);

    // When achievements change, start simple queue system
    // NOTE: This implementation has a limitation. It only detects the *list* change.
    // Ideally, we'd diff the lists or have an event. For MVP, we check length or use a ref.
    // Actually, let's just use a simpler method: Store "seen" achievements in local component state.
    const [seen, setSeen] = useState<Set<string>>(new Set(achievements));

    useEffect(() => {
        const newUnlocks = achievements.filter(id => !seen.has(id));
        if (newUnlocks.length > 0) {
            setQueue(prev => [...prev, ...newUnlocks]);
            setSeen(prev => {
                const next = new Set(prev);
                newUnlocks.forEach(id => next.add(id));
                return next;
            });
        }
    }, [achievements]);

    useEffect(() => {
        if (!current && queue.length > 0) {
            const next = queue[0];
            setCurrent(next);
            setQueue(prev => prev.slice(1));

            setTimeout(() => {
                setCurrent(null);
            }, 3000);
        }
    }, [queue, current]);

    const achievement = current ? ACHIEVEMENTS.find(a => a.id === current) : null;

    return (
        <div className="fixed bottom-8 right-8 z-50 pointer-events-none">
            <AnimatePresence>
                {current && achievement && (
                    <motion.div
                        key={current}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        className="bg-surface border border-yellow-500 p-4 rounded-xl shadow-2xl flex items-center gap-4 w-80"
                    >
                        <div className="bg-yellow-500/20 p-3 rounded-full">
                            <Trophy className="text-yellow-500" size={24} />
                        </div>
                        <div>
                            <h4 className="text-yellow-500 font-bold text-sm">ACHIEVEMENT UNLOCKED</h4>
                            <p className="text-white font-bold">{achievement.name}</p>
                            <p className="text-xs text-muted">{achievement.description}</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
