import { useGameStore } from '../store/useGameStore';
import { CONTRACTS } from '../data/contracts';
import { BUILDINGS } from '../data/buildings';
import { CheckCircle2, ClipboardList, XCircle, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

export function ContractList() {
    const {
        buildings,
        activeContractId,
        contractProgress,
        contractsCompleted,
        acceptContract,
        cancelContract,
        completeContract
    } = useGameStore();

    const activeContract = CONTRACTS.find(c => c.id === activeContractId);

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
            </div>

            {/* Active Contract Info */}
            {activeContract && (
                <div className="relative group overflow-hidden">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-cyan to-blue-600 rounded-2xl blur opacity-20" />
                    <div className="relative glass-card bg-accent-cyan/[0.03] border-accent-cyan/30 rounded-2xl p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-xl font-bold text-white tracking-tight">{activeContract.name}</h3>
                                <p className="text-xs text-text-muted mt-1">{activeContract.description}</p>
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
                {CONTRACTS.map(contract => {
                    const isCompleted = contractsCompleted.includes(contract.id);
                    const isActive = activeContractId === contract.id;
                    const meetsRequirements = contract.requirements.every(req =>
                        (buildings[req.buildingId] || 0) >= req.count
                    );
                    const isLocked = !meetsRequirements && !isCompleted;

                    return (
                        <div
                            key={contract.id}
                            className={clsx(
                                "group glass-card p-5 rounded-2xl relative overflow-hidden",
                                isActive ? "border-accent-cyan/50 bg-accent-cyan/5 shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]" :
                                    isCompleted ? "border-green-500/20 opacity-60" :
                                        isLocked ? "opacity-40 grayscale" : ""
                            )}
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-bold text-white text-sm tracking-tight">{contract.name}</h4>
                                        {isCompleted && <Trophy size={14} className="text-yellow-500" />}
                                    </div>
                                    <span className={clsx(
                                        "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border",
                                        contract.difficulty === 'Easy' && "border-green-500/30 text-green-500 bg-green-500/5",
                                        contract.difficulty === 'Medium' && "border-yellow-500/30 text-yellow-500 bg-yellow-500/5",
                                        contract.difficulty === 'Hard' && "border-orange-500/30 text-orange-500 bg-orange-500/5",
                                        contract.difficulty === 'Legendary' && "border-red-500/30 text-red-500 bg-red-500/5"
                                    )}>
                                        {contract.difficulty}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-white font-black font-mono">+{contract.rewardLOC.toLocaleString()} <span className="text-[10px] text-text-muted font-sans font-bold">LOC</span></div>
                                    {contract.rewardShares && <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-tighter">+{contract.rewardShares} Shares</div>}
                                </div>
                            </div>

                            {/* Requirements */}
                            <div className="flex flex-wrap gap-1.5 mt-auto">
                                {contract.requirements.map(req => {
                                    const buildingName = BUILDINGS.find(b => b.id === req.buildingId)?.name || req.buildingId;
                                    const hasRequirement = (buildings[req.buildingId] || 0) >= req.count;
                                    return (
                                        <span
                                            key={req.buildingId}
                                            className={clsx(
                                                "text-[9px] px-2 py-1 rounded-md border flex items-center gap-1.5 font-bold uppercase tracking-tight",
                                                hasRequirement ? "border-white/10 text-white/60 bg-white/5" : "border-red-500/20 text-red-400 bg-red-500/5"
                                            )}
                                        >
                                            <div className={clsx("w-1 h-1 rounded-full", hasRequirement ? "bg-green-500" : "bg-red-500")} />
                                            {req.count}x {buildingName}
                                        </span>
                                    );
                                })}
                            </div>

                            {!isActive && !isCompleted && (
                                <button
                                    onClick={() => acceptContract(contract.id)}
                                    disabled={!meetsRequirements || !!activeContractId}
                                    className={clsx(
                                        "w-full mt-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                        !activeContractId && meetsRequirements
                                            ? "bg-white/5 hover:bg-white/10 text-white border border-white/10 active:scale-95"
                                            : "bg-black/20 text-text-muted cursor-not-allowed opacity-50"
                                    )}
                                >
                                    {!!activeContractId ? "Active Project Exists" : meetsRequirements ? "Initiate Project" : "Access Restricted"}
                                </button>
                            )}

                            {isActive && (
                                <div className="mt-4 text-center text-[10px] font-black uppercase tracking-widest text-accent-cyan bg-accent-cyan/10 py-3 rounded-xl border border-accent-cyan/20 animate-pulse">
                                    Operational
                                </div>
                            )}

                            {isCompleted && (
                                <div className="mt-4 text-center text-[10px] font-black uppercase tracking-widest text-green-500 bg-green-500/10 py-3 rounded-xl border border-green-500/20">
                                    Project Archived
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
