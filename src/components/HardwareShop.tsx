import { HARDWARE } from '../data/hardware';
import { useGameStore } from '../store/useGameStore';
import { Monitor, Keyboard, Armchair } from 'lucide-react';

export function HardwareShop() {
    const { linesOfCode, buyHardware, hardware } = useGameStore();

    const getIcon = (type: string) => {
        switch (type) {
            case 'keyboard': return <Keyboard size={18} />;
            case 'chair': return <Armchair size={18} />;
            case 'monitor': return <Monitor size={18} />;
            default: return <Monitor size={18} />;
        }
    };

    return (
        <div className="flex flex-col gap-4 pb-20">
            {HARDWARE.map((item) => {
                const isOwned = hardware.includes(item.id);
                const canAfford = linesOfCode >= item.cost;

                return (
                    <button
                        key={item.id}
                        onClick={() => buyHardware(item.id)}
                        disabled={isOwned || !canAfford}
                        className={`
              flex items-center justify-between p-4 rounded-xl border transition-all text-left group
              ${isOwned
                                ? 'bg-green-900/10 border-green-500/50 opacity-70'
                                : canAfford
                                    ? 'bg-surface border-secondary hover:border-primary hover:shadow-lg hover:-translate-y-1'
                                    : 'bg-surface/50 border-secondary/30 opacity-50 cursor-not-allowed'}
            `}
                    >
                        <div className="flex items-center gap-4">
                            <div className={`
                 w-12 h-12 rounded-lg flex items-center justify-center
                 ${isOwned ? 'bg-green-500/20 text-green-400' : 'bg-primary/10 text-primary'}
              `}>
                                {getIcon(item.type)}
                            </div>

                            <div>
                                <h4 className="font-bold text-white flex items-center gap-2">
                                    {item.name}
                                    {isOwned && <span className="text-xs bg-green-500 text-black px-2 py-0.5 rounded-full">OWNED</span>}
                                </h4>
                                <p className="text-xs text-muted mb-1">{item.description}</p>
                                <p className="text-xs font-mono text-yellow-500">{item.effect}</p>
                            </div>
                        </div>

                        <div className="text-right">
                            {isOwned ? (
                                <div className="text-green-500 text-sm font-bold">Installs</div>
                            ) : (
                                <div className={`font-mono font-bold ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                                    ${item.cost.toLocaleString()}
                                </div>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
}
