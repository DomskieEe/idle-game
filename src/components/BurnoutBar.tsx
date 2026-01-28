import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap } from 'lucide-react';
import { useEffect } from 'react';
import { clsx } from 'clsx';

export function BurnoutBar() {
    const { burnout, isBurnout, reduceBurnout } = useGameStore();

    useEffect(() => {
        const interval = setInterval(() => {
            if (!isBurnout && burnout > 0) {
                reduceBurnout(1); // Recover 1% per tick
            }
        }, 200); // 5% per second recovery
        return () => clearInterval(interval);
    }, [burnout, isBurnout, reduceBurnout]);

    return (
        <div className="w-full relative group">
            <div className="flex justify-between items-center mb-2 px-1">
                <div className="flex items-center gap-2">
                    <Zap size={14} className={clsx("transition-colors", isBurnout ? "text-red-500 animate-pulse" : "text-text-muted")} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                        Stress Level
                    </span>
                </div>
                <span className={clsx(
                    "font-mono text-[10px] font-bold",
                    burnout > 80 ? "text-red-500" : burnout > 50 ? "text-yellow-500" : "text-primary"
                )}>
                    {Math.floor(burnout)}%
                </span>
            </div>

            <div className="h-4 bg-black/40 rounded-full border border-white/5 p-1 relative overflow-hidden glass-panel">
                <motion.div
                    className={clsx(
                        "h-full rounded-full transition-colors duration-500",
                        isBurnout ? "bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)]" :
                            burnout > 80 ? "bg-orange-500" : "bg-primary"
                    )}
                    initial={{ width: 0 }}
                    animate={{ width: `${burnout}%` }}
                />

                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.1)_50%,transparent_100%)] w-20 animate-[move-right_3s_linear_infinite]" />
            </div>

            <AnimatePresence>
                {isBurnout && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute -bottom-6 left-0 right-0 text-center"
                    >
                        <span className="text-[9px] font-black text-red-500 uppercase tracking-[0.3em] glow-red">
                            Over ka na sa type! pahinga muna.
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @keyframes move-right {
                    from { transform: translateX(-100%); }
                    to { transform: translateX(500%); }
                }
                .glow-red { text-shadow: 0 0 8px rgba(239, 68, 68, 0.5); }
            `}</style>
        </div>
    );
}
