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
        <div className="glass-panel p-4 rounded-xl border-red-500/20 bg-red-950/10 flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className={clsx("p-1.5 rounded-lg border",
                        techDebt > 0 ? "bg-red-500/10 text-red-500 border-red-500/30 animate-pulse" : "bg-green-500/10 text-green-500 border-green-500/30"
                    )}>
                        <AlertTriangle size={16} />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm flex items-center gap-2">
                            Technical Debt
                            {techDebt > 0 && <span className="text-[10px] bg-red-500/20 text-red-400 px-1.5 rounded uppercase tracking-wider">-{penaltyPct}% Yield</span>}
                        </h3>
                    </div>
                </div>
                <div className="text-right">
                    <div className="text-sm font-mono font-bold text-red-400">
                        {Math.floor(techDebt).toLocaleString()} <span className="text-[10px] text-text-muted">LOC</span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={takeShortcut}
                    className="py-2 px-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-[10px] font-black uppercase tracking-tight text-red-500 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                >
                    <Zap size={10} className="group-hover:text-yellow-400 transition-colors" />
                    Take Shortcut
                </button>

                <button
                    onClick={() => payDownDebt(linesOfCode)}
                    disabled={techDebt === 0 || linesOfCode === 0}
                    className="py-2 px-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-[10px] font-black uppercase tracking-tight text-green-500 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <TrendingDown size={10} />
                    Refactor
                </button>
            </div>
        </div>
    );
}
