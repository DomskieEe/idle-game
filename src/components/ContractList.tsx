import { useGameStore } from '../store/useGameStore';
import { CheckCircle2, ClipboardList, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { useEffect } from 'react';

export function ContractList() {
    const {
        activeContractId,
        contractProgress,
        availableContracts,
        contractsCompleted,
        acceptContract,
        cancelContract,
        completeContract,
        generateDailyContracts
    } = useGameStore();

    useEffect(() => {
        if (availableContracts.length === 0) {
            generateDailyContracts();
        }
    }, [availableContracts.length, generateDailyContracts]);

    const activeContract = availableContracts.find(c => c.id === activeContractId);

    // Migration Fix: If we have an ID but no contract object (legacy save), reset it
    useEffect(() => {
        if (activeContractId && !activeContract && availableContracts.length > 0) {
            cancelContract();
        }
    }, [activeContractId, activeContract, availableContracts, cancelContract]);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-accent-cyan/10 rounded-lg text-accent-cyan border border-accent-cyan/20">
                        <ClipboardList size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Freelance Market</h2>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Open Bounties</p>
                    </div>
                </div>
                <div className="text-[10px] font-bold text-accent-cyan/50 uppercase tracking-widest">
                    Completed: {contractsCompleted}
                </div>
            </div>

            {/* Active Contract Info */}
            {activeContract && (
                <div className="relative group overflow-hidden">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan to-blue-600 rounded-2xl blur opacity-20" />
                    <div className="relative glass-card bg-accent-cyan/[0.03] border-accent-cyan/30 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">{activeContract.name}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={clsx(
                                        "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border",
                                        activeContract.rarity === 'Common' && "border-white/10 text-text-muted",
                                        activeContract.rarity === 'Uncommon' && "border-green-500/30 text-green-500",
                                        activeContract.rarity === 'Rare' && "border-blue-500/30 text-blue-500",
                                        activeContract.rarity === 'Mythic' && "border-purple-500/30 text-purple-500"
                                    )}>
                                        {activeContract.rarity}
                                    </span>
                                    <p className="text-xs text-text-muted">{activeContract.description}</p>
                                </div>
                            </div>
                            <button
                                onClick={cancelContract}
                                className="p-2 text-text-muted hover:text-red-400 transition-colors bg-white/5 rounded-lg hover:bg-red-500/10"
                                title="Cancel Contract"
                            >
                                <XCircle size={18} />
                            </button>
                        </div>

                        <div className="space-y-3 mt-6">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                <span className="text-text-muted">Deployment Progress</span>
                                <span className="text-accent-cyan font-mono">
                                    {Math.min(100, Math.floor((contractProgress / activeContract.locRequired) * 100))}%
                                </span>
                            </div>
                            <div className="h-2 bg-black/40 rounded-full overflow-hidden p-0.5 flex">
                                <motion.div
                                    className="h-full bg-gradient-to-r from-accent-cyan to-blue-500 rounded-full glow-cyan"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min(100, (contractProgress / activeContract.locRequired) * 100)}%` }}
                                />
                            </div>
                        </div>

                        <button
                            onClick={completeContract}
                            disabled={contractProgress < activeContract.locRequired}
                            className={clsx(
                                "w-full mt-6 py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 active:scale-[0.98]",
                                contractProgress >= activeContract.locRequired
                                    ? "bg-accent-cyan text-white shadow-lg glow-cyan hover:scale-[1.01]"
                                    : "bg-white/5 text-text-muted cursor-not-allowed grayscale"
                            )}
                        >
                            <CheckCircle2 size={14} />
                            Deploy Project & Invoicing
                        </button>
                    </div>
                </div>
            )}

            {/* List of Available Contracts */}
            <div className="grid gap-4">
                {availableContracts
                    .filter(c => c.id !== activeContractId)
                    .map(contract => {
                        return (
                            <div
                                key={contract.id}
                                className={clsx(
                                    "group glass-card p-5 rounded-2xl relative overflow-hidden",
                                    "hover:border-accent-cyan/30 transition-all border-white/5"
                                )}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-white text-sm tracking-tight">{contract.name}</h4>
                                        </div>
                                        <div className="flex gap-2">
                                            <span className={clsx(
                                                "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border",
                                                contract.difficulty === 'Easy' && "border-green-500/30 text-green-500 bg-green-500/5",
                                                contract.difficulty === 'Medium' && "border-yellow-500/30 text-yellow-500 bg-yellow-500/5",
                                                contract.difficulty === 'Hard' && "border-orange-500/30 text-orange-500 bg-orange-500/5",
                                                contract.difficulty === 'Legendary' && "border-red-500/30 text-red-500 bg-red-500/5"
                                            )}>
                                                {contract.difficulty}
                                            </span>
                                            <span className={clsx(
                                                "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border",
                                                contract.rarity === 'Common' && "border-white/10 text-text-muted",
                                                contract.rarity === 'Uncommon' && "border-green-500/30 text-green-500",
                                                contract.rarity === 'Rare' && "border-blue-500/30 text-blue-500",
                                                contract.rarity === 'Mythic' && "border-purple-500/30 text-purple-500"
                                            )}>
                                                {contract.rarity}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-white font-black font-mono">+{contract.rewardLOC.toLocaleString()} <span className="text-[10px] text-text-muted font-sans font-bold">LOC</span></div>
                                        {contract.rewardShares && <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-tighter">+{contract.rewardShares} Shares</div>}
                                    </div>
                                </div>

                                <button
                                    onClick={() => acceptContract(contract.id)}
                                    disabled={!!activeContractId}
                                    className={clsx(
                                        "w-full mt-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        !activeContractId
                                            ? "bg-white/5 hover:bg-white/10 text-white border border-white/10 active:scale-95"
                                            : "bg-black/20 text-text-muted cursor-not-allowed opacity-50"
                                    )}
                                >
                                    {!!activeContractId ? "Finish Active Project First" : "Initiate Project"}
                                </button>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
