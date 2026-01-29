import { motion } from 'framer-motion';
import { Cpu, Zap, ShieldCheck, Monitor, Layers, Code2, Database, Cloud, Server } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { clsx } from 'clsx';


type SkillNode = {
    id: string;
    title: string;
    icon: any;
    color: string;
    description: string;
    cost: number;
    parentId?: string;
    reqSpecialization?: string;
}

const SKILL_NODES: SkillNode[] = [
    // Frontend Tree
    { id: 'css_wizard', title: 'CSS Wizard', icon: Layers, color: 'text-pink-400', description: 'Pixel perfect. +50% Click Power.', cost: 50000, reqSpecialization: 'frontend' },
    { id: 'react_master', title: 'React Master', icon: Code2, color: 'text-cyan-400', description: 'Virtual DOM mastery. +20% Global CPS.', cost: 250000, parentId: 'css_wizard', reqSpecialization: 'frontend' },

    // Backend Tree
    { id: 'database_guru', title: 'Database Guru', icon: Database, color: 'text-green-400', description: 'Normalized schemas. +10% CPS.', cost: 50000, reqSpecialization: 'backend' },
    { id: 'cloud_architect', title: 'Cloud Architect', icon: Cloud, color: 'text-blue-400', description: 'Serverless scaling. +30% Global CPS.', cost: 250000, parentId: 'database_guru', reqSpecialization: 'backend' },

    // DevOps Tree
    { id: 'ci_cd_pipeline', title: 'CI/CD Pipeline', icon: Server, color: 'text-orange-400', description: 'Automated testing reduces bugs.', cost: 50000, reqSpecialization: 'devops' },
    { id: 'kubernetes_god', title: 'Kubernetes God', icon: ShieldCheck, color: 'text-red-400', description: 'Orchestration mastery. +50% Global CPS.', cost: 300000, parentId: 'ci_cd_pipeline', reqSpecialization: 'devops' }
];

const SPECIALIZATIONS = [
    {
        id: 'frontend',
        title: "Frontend Ninja",
        icon: Monitor,
        color: "text-accent-cyan",
        borderColor: "border-accent-cyan/30",
        bgColor: "bg-accent-cyan/10",
        bonus: "+100% Click Power",
        desc: "Master of interfaces. Your typing produces twice as much code."
    },
    {
        id: 'backend',
        title: "Backend Architect",
        icon: Cpu,
        color: "text-accent-purple",
        borderColor: "border-accent-purple/30",
        bgColor: "bg-accent-purple/10",
        bonus: "+50% Passive CPS",
        desc: "Optimizing the core. Your automated systems are more efficient."
    },
    {
        id: 'devops',
        title: "DevOps Master",
        icon: ShieldCheck,
        color: "text-red-500",
        borderColor: "border-red-500/30",
        bgColor: "bg-red-500/10",
        bonus: "-50% Stress Generation",
        desc: "Stability first. You can type for much longer without overheating."
    }
];

export function SkillTree() {
    const { specialization, setSpecialization, skillsUnlocked, unlockSkill, linesOfCode, addCode, shares } = useGameStore();

    const canUnlockFullStack = shares > 0; // Requires at least 1 prestige

    const handleUnlockSkill = (skill: SkillNode) => {
        if (linesOfCode >= skill.cost && !skillsUnlocked.includes(skill.id)) {
            addCode(-skill.cost); // Deduct cost manually as helper assumes state update only
            unlockSkill(skill.id);
        }
    };

    return (
        <div className="h-full flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 border border-yellow-500/20 shadow-glow-primary">
                        <Zap size={20} />
                    </div>
                    <div>
                        <h2 className="text-lg font-black text-white uppercase tracking-tight">Skill Matrix</h2>
                        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Define your career path</p>
                    </div>
                </div>
                {specialization !== 'none' && (
                    <button
                        onClick={() => setSpecialization('none')}
                        className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest px-3 py-1 bg-red-500/10 rounded-lg border border-red-500/20 transition-colors"
                    >
                        Respec
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left Column: Specialization Choice */}
                <div className="md:col-span-4 flex flex-col gap-3">
                    {SPECIALIZATIONS.map((spec) => {
                        const isSelected = specialization === spec.id || specialization === 'fullstack';
                        const isLocked = specialization !== 'none' && !isSelected;
                        const Icon = spec.icon;

                        return (
                            <motion.button
                                key={spec.id}
                                onClick={() => specialization === 'none' && setSpecialization(spec.id as any)}
                                disabled={isLocked}
                                whileHover={!isLocked && specialization === 'none' ? { scale: 1.02, x: 5 } : {}}
                                className={clsx(
                                    "relative w-full text-left p-4 rounded-xl border transition-all duration-300",
                                    isSelected
                                        ? clsx(spec.bgColor, spec.borderColor)
                                        : "bg-white/5 border-white/5 hover:bg-white/10",
                                    isLocked && "opacity-40 grayscale cursor-not-allowed"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={clsx("p-2 rounded-lg", isSelected ? "bg-white/20 text-white" : "bg-black/20 text-text-muted")}>
                                        <Icon size={20} className={isSelected ? "" : spec.color} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={clsx("text-xs font-black uppercase tracking-wider", isSelected ? "text-white" : "text-text-muted group-hover:text-white")}>
                                            {spec.title}
                                        </h3>
                                        {isSelected && (
                                            <p className="text-[9px] font-bold text-white/70 mt-0.5">{spec.bonus}</p>
                                        )}
                                    </div>
                                    {isSelected && <ShieldCheck size={14} className="text-white" />}
                                </div>
                            </motion.button>
                        );
                    })}
                </div>

                {/* Right Column: Tree View */}
                <div className="md:col-span-8">
                    {specialization === 'none' ? (
                        <div className="h-full min-h-[300px] flex flex-col items-center justify-center p-8 border border-dashed border-white/10 rounded-2xl bg-white/5 text-center">
                            <Monitor size={48} className="text-white/10 mb-4" />
                            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-2">System Unspecialized</h3>
                            <p className="text-xs text-text-muted max-w-xs mb-6">Select a career path on the left to initialize your development framework and unlock advanced skills.</p>

                            {canUnlockFullStack && (
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    onClick={() => setSpecialization('fullstack')}
                                    className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white font-black uppercase tracking-widest shadow-lg shadow-purple-500/20 flex items-center gap-2"
                                >
                                    <Layers size={16} /> Ascend to Full Stack
                                </motion.button>
                            )}
                        </div>
                    ) : (
                        <div className="bg-black/20 rounded-2xl p-6 border border-white/5 relative overflow-hidden min-h-[400px]">
                            {/* Background Pattern */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />

                            <h3 className="relative z-10 text-xs font-black text-white uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Layers size={14} className="text-primary" />
                                Growth Tree: <span className="text-primary">{specialization}</span>
                            </h3>

                            <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {SKILL_NODES.filter(n => n.reqSpecialization === specialization || specialization === 'fullstack').map(node => {
                                    const isUnlocked = skillsUnlocked.includes(node.id);
                                    const parentUnlocked = !node.parentId || skillsUnlocked.includes(node.parentId);
                                    const canAfford = linesOfCode >= node.cost;

                                    return (
                                        <div key={node.id} className="relative group">
                                            {/* Visual Connector Line (Fake Tree) */}
                                            {node.parentId && (
                                                <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-white/10" />
                                            )}

                                            <button
                                                onClick={() => handleUnlockSkill(node)}
                                                disabled={isUnlocked || !parentUnlocked || !canAfford}
                                                className={clsx(
                                                    "w-full p-4 rounded-xl border-2 transition-all text-left relative overflow-hidden",
                                                    isUnlocked
                                                        ? "bg-green-500/10 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]"
                                                        : !parentUnlocked
                                                            ? "bg-black/40 border-white/5 opacity-50 cursor-not-allowed"
                                                            : canAfford
                                                                ? "bg-surface hover:bg-white/5 border-white/10 hover:border-primary/50"
                                                                : "bg-surface border-red-500/30 opacity-80 cursor-not-allowed"
                                                )}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className={clsx("p-2 rounded-lg", isUnlocked ? "bg-green-500/20 text-green-400" : "bg-white/5 text-text-muted")}>
                                                        <node.icon size={18} />
                                                    </div>
                                                    {isUnlocked ? (
                                                        <ShieldCheck size={16} className="text-green-500" />
                                                    ) : (
                                                        <span className={clsx("text-[10px] font-mono font-bold", canAfford ? "text-primary" : "text-red-500")}>
                                                            {node.cost >= 1000 ? (node.cost / 1000) + 'k' : node.cost}
                                                        </span>
                                                    )}
                                                </div>

                                                <h4 className={clsx("font-bold text-sm mb-1", isUnlocked ? "text-green-400" : "text-white")}>
                                                    {node.title}
                                                </h4>
                                                <p className="text-[10px] text-text-muted leading-tight">
                                                    {node.description}
                                                </p>

                                                {!parentUnlocked && (
                                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                                                        <span className="text-[9px] font-black uppercase text-text-muted tracking-widest border border-white/10 px-2 py-1 rounded bg-black/50">
                                                            Locked
                                                        </span>
                                                    </div>
                                                )}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Full Stack Prestige Card */}
                            {canUnlockFullStack && specialization !== 'fullstack' && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => setSpecialization('fullstack')}
                                    className="mt-6 w-full p-1 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                                >
                                    <div className="bg-black/80 rounded-xl p-4 flex items-center justify-between backdrop-blur-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/10 rounded-lg text-white">
                                                <Layers size={20} />
                                            </div>
                                            <div className="text-left">
                                                <h3 className="text-sm font-black text-white uppercase">Full Stack Access</h3>
                                                <p className="text-[10px] text-text-muted">Unlocks all trees simultaneously</p>
                                            </div>
                                        </div>
                                        <span className="text-[9px] font-bold bg-white/20 text-white px-2 py-1 rounded uppercase tracking-wider">
                                            Prestige
                                        </span>
                                    </div>
                                </motion.button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
