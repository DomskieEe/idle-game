import { motion } from 'framer-motion';
import { Home, Building2, Building, LandPlot, Zap, Users } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { clsx } from 'clsx';

const OFFICE_DATA = [
    { title: "Garage Startup", desc: "Where all legends begin.", icon: Home, limit: 20, cost: 50000 },
    { title: "Developer Hub", desc: "A cozy coworking space.", icon: Building2, limit: 50, cost: 500000 },
    { title: "Growth Stage", desc: "Expanding the enterprise.", icon: Building, limit: 150, cost: 5000000 },
    { title: "Tech Tower", desc: "Dominating the digital sky.", icon: LandPlot, limit: Infinity, cost: 0 }
];

export function OfficeDashboard() {
    const { officeLevel, upgradeOffice, linesOfCode, buildings } = useGameStore();
    const currentOffice = OFFICE_DATA[officeLevel];
    const nextOffice = officeLevel < 3 ? OFFICE_DATA[officeLevel + 1] : null;

    const totalPersonnel = Object.values(buildings).reduce((a, b) => a + b, 0);
    const canAfford = nextOffice ? linesOfCode >= currentOffice.cost : false;

    return (
        <div className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary border border-primary/20 shadow-glow-primary">
                        <currentOffice.icon size={24} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">{currentOffice.title}</h2>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold italic">{currentOffice.desc}</p>
                    </div>
                </div>

                <div className="text-right">
                    <div className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Capacity</div>
                    <div className="text-xl font-mono font-bold text-white flex items-center justify-end gap-2">
                        <Users size={16} className="text-primary" />
                        {totalPersonnel} <span className="text-text-muted text-xs">/ {currentOffice.limit === Infinity ? '∞' : currentOffice.limit}</span>
                    </div>
                </div>
            </div>

            {/* Capacity Bar */}
            <div className="mb-6">
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden p-px border border-white/5 flex">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (totalPersonnel / (currentOffice.limit === Infinity ? totalPersonnel : currentOffice.limit)) * 100)}%` }}
                        className={clsx(
                            "h-full rounded-full transition-colors",
                            totalPersonnel >= currentOffice.limit ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]" : "bg-primary"
                        )}
                    />
                </div>
                {totalPersonnel >= currentOffice.limit && (
                    <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mt-2 animate-pulse">
                        Infrastructure Maxed - Upgrade Required
                    </p>
                )}
            </div>

            {/* Upgrade Button */}
            {nextOffice && (
                <div className="relative">
                    <button
                        onClick={upgradeOffice}
                        disabled={!canAfford}
                        className={clsx(
                            "w-full py-3 rounded-xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2",
                            canAfford
                                ? "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 active:scale-[0.98]"
                                : "bg-white/5 text-text-muted border border-white/5 cursor-not-allowed opacity-50"
                        )}
                    >
                        <Zap size={14} className={canAfford ? "animate-pulse" : ""} />
                        Relocate to {nextOffice.title} | {currentOffice.cost.toLocaleString()} LOC
                    </button>
                    {!canAfford && (
                        <div className="mt-2 text-center">
                            <span className="text-[8px] text-text-muted uppercase font-bold tracking-widest">
                                Insufficient Assets for Relocation
                            </span>
                        </div>
                    )}
                </div>
            )}

            {officeLevel === 3 && (
                <div className="text-center py-2">
                    <span className="text-[10px] font-black text-yellow-500 uppercase tracking-[0.3em] glow-primary">
                        Maximum Infrastructure Scale Achieved
                    </span>
                </div>
            )}
        </div>
    );
}
