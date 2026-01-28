import { useGameStore } from '../store/useGameStore';
import { BUILDINGS } from '../data/buildings';
import { Briefcase, Terminal, Zap, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

const icons: Record<string, any> = {
    intern: Briefcase,
    junior_dev: Terminal,
    senior_dev: User,
    ai_copilot: Zap
};

export function BuildingList() {
    const { linesOfCode, buildings, buyBuilding } = useGameStore();

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-primary/10 rounded-lg text-primary border border-primary/20">
                    <Briefcase size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Personnel</h2>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Scaling Infrastructure</p>
                </div>
            </div>

            <div className="grid gap-3">
                {BUILDINGS.map((building) => {
                    const count = buildings[building.id] || 0;
                    const cost = Math.floor(building.baseCost * Math.pow(1.15, count));
                    const canAfford = linesOfCode >= cost;
                    const Icon = icons[building.id] || User;

                    return (
                        <motion.button
                            key={building.id}
                            onClick={() => buyBuilding(building.id)}
                            disabled={!canAfford}
                            whileHover={canAfford ? { scale: 1.01 } : {}}
                            whileTap={canAfford ? { scale: 0.98 } : {}}
                            className={clsx(
                                "group glass-card p-4 rounded-2xl flex items-center justify-between text-left transition-all",
                                !canAfford ? "opacity-50 grayscale bg-black/5" : "hover:bg-white/[0.04]"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <div className={clsx(
                                    "p-3 rounded-xl transition-all",
                                    canAfford ? "bg-primary/10 text-primary border border-primary/20" : "bg-white/5 text-text-muted border border-white/5"
                                )}>
                                    <Icon size={24} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm tracking-tight">{building.name}</h4>
                                    <p className="text-[10px] text-text-muted max-w-[180px] line-clamp-1 group-hover:line-clamp-none">
                                        {building.description}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] font-mono text-primary font-bold">+{building.baseCPS} <span className="text-[8px] font-sans">LOC/s</span></span>
                                    </div>
                                </div>
                            </div>

                            <div className="text-right">
                                <div className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">
                                    Qty: <span className="text-white font-mono">{count}</span>
                                </div>
                                <div className={clsx(
                                    "font-mono font-bold text-sm",
                                    canAfford ? "text-white" : "text-red-500/50"
                                )}>
                                    {cost.toLocaleString()} <span className="text-[10px] font-sans font-bold text-text-muted">LOC</span>
                                </div>
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
