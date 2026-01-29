import { TrendingUp, AlertTriangle, X } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function PrestigeModal({ isOpen, onClose }: Props) {
    const { totalLinesOfCode, shares, prestige } = useGameStore();

    const totalPotentialShares = Math.floor(Math.sqrt(totalLinesOfCode / 1000000));
    const pendingShares = Math.max(0, totalPotentialShares - Math.floor(shares));
    const currentBonus = (Math.floor(shares) * 10).toLocaleString();
    const nextBonus = ((Math.floor(shares) + pendingShares) * 10).toLocaleString();

    const handlePrestige = () => {
        if (pendingShares > 0) {
            prestige();
            onClose();
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                >
                    <motion.div
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        className="bg-surface border border-yellow-500 rounded-2xl max-w-lg w-full relative overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-yellow-500/10 p-6 border-b border-yellow-500/30 flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-yellow-500 flex items-center gap-2">
                                <TrendingUp /> IPO / Prestige
                            </h2>
                            <button onClick={onClose} className="text-muted hover:text-white"><X /></button>
                        </div>

                        <div className="p-8">
                            <div className="text-center mb-8">
                                <p className="text-muted mb-2">Current Lifetime Earnings</p>
                                <div className="text-3xl font-mono font-bold text-white mb-6">
                                    {Math.floor(totalLinesOfCode).toLocaleString()} LOC
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-black/30 p-4 rounded-xl border border-secondary/50">
                                        <div className="text-sm text-muted">Current Shares</div>
                                        <div className="text-2xl font-bold text-yellow-500">{Math.floor(shares).toLocaleString()}</div>
                                        <div className="text-xs text-green-400">+{currentBonus}% Bonus</div>
                                    </div>
                                    <div className="bg-yellow-500/20 p-4 rounded-xl border border-yellow-500">
                                        <div className="text-sm text-yellow-200">Pending Shares</div>
                                        <div className="text-2xl font-bold text-white">+{pendingShares.toLocaleString()}</div>
                                        <div className="text-xs text-yellow-200">New Bonus: +{nextBonus}%</div>
                                    </div>
                                </div>

                                <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl text-left flex gap-3">
                                    <AlertTriangle className="text-red-500 shrink-0" />
                                    <div className="text-sm text-red-200">
                                        <span className="font-bold text-red-400">Warning:</span> Going public will reset your Buildings, Upgrades, and Current LOC. You will keep your Achievements and gain <strong>{pendingShares} Shares</strong>.
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handlePrestige}
                                disabled={pendingShares <= 0}
                                className={`
                        w-full py-4 rounded-xl font-bold text-lg transition-all
                        ${pendingShares > 0
                                        ? 'bg-yellow-500 text-black hover:bg-yellow-400 shadow-lg shadow-yellow-500/20'
                                        : 'bg-secondary text-muted cursor-not-allowed'}
                     `}
                            >
                                {pendingShares > 0 ? `Reset & Claim ${pendingShares} Shares` : 'Need more lifetime LOC to ascend'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
