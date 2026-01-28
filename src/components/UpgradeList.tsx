import { useGameStore } from '../store/useGameStore';
import { UPGRADES } from '../data/upgrades';
import { motion } from 'framer-motion';
import { Zap, Coffee, Keyboard, Check } from 'lucide-react';

const icons: Record<string, any> = {
    click: Keyboard,
    building: Coffee,
    global: Zap,
};

export function UpgradeList() {
    const { linesOfCode, upgrades, buyUpgrade } = useGameStore();

    return (
        <div className="flex flex-col gap-4">
            {UPGRADES.map((upgrade) => {
                const isBought = upgrades.includes(upgrade.id);
                const canAfford = linesOfCode >= upgrade.cost && !isBought;
                const Icon = icons[upgrade.type] || Zap;

                return (
                    <motion.button
                        key={upgrade.id}
                        onClick={() => buyUpgrade(upgrade.id)}
                        disabled={!canAfford && !isBought}
                        whileHover={canAfford ? { scale: 1.02, x: 5 } : {}}
                        whileTap={canAfford ? { scale: 0.98 } : {}}
                        className={`
              flex items-center justify-between p-4 rounded-xl border transition-colors text-left
              ${isBought
                                ? 'bg-green-500/10 border-green-500/50 cursor-default'
                                : canAfford
                                    ? 'bg-surface border-secondary hover:border-yellow-500/50 cursor-pointer'
                                    : 'bg-surface/50 border-secondary/30 opacity-50 cursor-not-allowed'}
            `}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-lg ${isBought ? 'bg-green-500/20 text-green-500' : 'bg-secondary'}`}>
                                {isBought ? <Check size={24} /> : <Icon size={24} className={canAfford ? 'text-yellow-500' : 'text-muted'} />}
                            </div>
                            <div>
                                <h3 className={`font-bold ${isBought ? 'text-green-500' : 'text-white'}`}>{upgrade.name}</h3>
                                <div className="text-xs text-muted">
                                    {upgrade.description}
                                </div>
                            </div>
                        </div>

                        <div className="text-right">
                            {isBought ? (
                                <div className="text-sm font-bold text-green-500">OWNED</div>
                            ) : (
                                <div className="text-sm font-mono font-bold text-yellow-500">
                                    {upgrade.cost.toLocaleString()} LOC
                                </div>
                            )}
                        </div>
                    </motion.button>
                );
            })}
        </div>
    );
}
