import { motion } from 'framer-motion';
import { AlertTriangle, TrendingDown, Zap } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { clsx } from 'clsx';

export function TechDebtIndicator() {
    const { techDebt, cps, takeShortcut, payDownDebt, linesOfCode } = useGameStore();

    if (techDebt === 0 && linesOfCode < 2000) return null; // Hide until relevant

    // Impact calculation (visual only, logic is in store)
    const debtImpact = cps > 0 ? techDebt / (cps * 600) : 0;
    const penaltyPct = Math.min(75, Math.floor((1 - Math.max(0.25, 1 - (debtImpact * 0.5))) * 100));

    return (
        <div className="glass-panel rounded-2xl p-6 border-red-500/20 bg-red-950/10 relative overflow-hidden">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className={clsx("p-2 rounded-lg border",
                        techDebt > 0 ? "bg-red-500/10 text-red-500 border-red-500/30 animate-pulse" : "bg-green-500/10 text-green-500 border-green-500/30"
                    )}>
                        <AlertTriangle size={20} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-md">Technical Debt</h3>
                        <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">
                            Yield Penalty: <span className="text-red-500">-{penaltyPct}%</span>
                        </p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-xl font-mono font-bold text-red-400">
                        {Math.floor(techDebt).toLocaleString()} <span className="text-xs text-text-muted">LOC</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-3 mt-4">
                <button
                    onClick={takeShortcut}
                    className="p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-xl text-xs font-black uppercase tracking-tight text-red-500 transition-all active:scale-95 flex flex-col items-center gap-1 group"
                >
                    <div className="flex items-center gap-1">
                        <Zap size={12} className="group-hover:text-yellow-400 transition-colors" />
                        Take Shortcut
                    </div>
                    <span className="text-[9px] opacity-70 normal-case">+1 min production (Instant)</span>
                </button>

                <button
                    onClick={() => payDownDebt(linesOfCode)}
                    disabled={techDebt === 0 || linesOfCode === 0}
                    className="p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-xl text-xs font-black uppercase tracking-tight text-green-500 transition-all active:scale-95 flex flex-col items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <div className="flex items-center gap-1">
                        <TrendingDown size={12} />
                        Refactor Code
                    </div>
                    <span className="text-[9px] opacity-70 normal-case">Pay down with current LOC</span>
                </button>
            </div>
        </div>
    );
}
