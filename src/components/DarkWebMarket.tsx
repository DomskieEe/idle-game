import { motion } from 'framer-motion';
import { Skull, Zap, AlertTriangle, ShieldOff } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { clsx } from 'clsx';

export function DarkWebMarket() {
    const { illegalAIActive, toggleIllegalAI } = useGameStore();

    return (
        <div className="space-y-6">
            {/* Header with Glitch Effect */}
            <div className="relative p-6 bg-red-950/20 border border-red-500/20 rounded-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent)] pointer-events-none" />

                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-3 bg-red-500/10 rounded-xl text-red-500 border border-red-500/20 animate-pulse">
                        <Skull size={24} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white italic tracking-tighter uppercase">The Dark Web</h2>
                        <p className="text-[10px] text-red-500/60 uppercase tracking-[0.3em] font-bold">Encrypted Node Access Established</p>
                    </div>
                </div>
            </div>

            {/* Warning Banner */}
            <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl flex items-center gap-3">
                <AlertTriangle size={18} className="text-orange-500 shrink-0" />
                <p className="text-[10px] text-orange-200/60 leading-relaxed font-bold uppercase tracking-tight">
                    Warning: High-risk protocols active. System breaches may result in total LOC liquidation.
                    Proceed at your own liability.
                </p>
            </div>

            {/* Illegal AI Product */}
            <div className="grid gap-4">
                <div className={clsx(
                    "glass-card p-6 rounded-2xl border transition-all duration-700",
                    illegalAIActive ? "border-red-500/40 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]" : "border-white/5"
                )}>
                    <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                            <div className={clsx(
                                "p-3 rounded-xl border transition-all",
                                illegalAIActive ? "bg-red-500/20 shadow-glow-red text-red-500" : "bg-white/5 text-text-muted"
                            )}>
                                <Zap size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-white text-base">Illegal AI v3.0</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Experimental Binary</span>
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            <div className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-1">Status</div>
                            <div className={clsx(
                                "text-xs font-mono font-bold uppercase",
                                illegalAIActive ? "text-red-500 animate-pulse" : "text-text-muted"
                            )}>
                                {illegalAIActive ? "Injecting Data..." : "Idle"}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                                <span className="text-[8px] text-text-muted uppercase font-bold block mb-1">Benefit</span>
                                <span className="text-sm font-mono font-bold text-white uppercase">+100% Total CPS</span>
                            </div>
                            <div className="p-3 bg-black/40 rounded-xl border border-red-500/10">
                                <span className="text-[8px] text-red-500/60 uppercase font-bold block mb-1">Risk</span>
                                <span className="text-sm font-mono font-bold text-red-500 uppercase">0.5% Hack Rate</span>
                            </div>
                        </div>

                        <button
                            onClick={() => toggleIllegalAI(!illegalAIActive)}
                            className={clsx(
                                "w-full py-4 rounded-xl font-black uppercase tracking-[0.4em] text-[10px] transition-all relative overflow-hidden",
                                illegalAIActive
                                    ? "bg-red-600 text-white shadow-lg active:scale-95"
                                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                            )}
                        >
                            {illegalAIActive ? "Abort Protocol" : "Initiate Injection"}
                            {illegalAIActive && (
                                <motion.div
                                    className="absolute inset-0 bg-white/10 pointer-events-none"
                                    animate={{ opacity: [0, 0.2, 0] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                />
                            )}
                        </button>
                    </div>
                </div>

                {/* More Dark Web Items (Placeholders) */}
                <div className="glass-card p-6 rounded-2xl border border-white/5 opacity-40 grayscale flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-xl text-text-muted">
                            <ShieldOff size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-white text-sm">Anti-Detection Mask</h3>
                            <p className="text-[10px] text-text-muted uppercase">Coming Soon...</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-xs font-mono font-bold text-white">50K <span className="text-[10px] font-sans">SHARES</span></div>
                    </div>
                </div>
            </div>

            <style>{`
                .shadow-glow-red { box-shadow: 0 0 15px rgba(239, 68, 68, 0.3); }
            `}</style>
        </div>
    );
}
