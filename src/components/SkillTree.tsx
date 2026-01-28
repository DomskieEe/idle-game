import { motion } from 'framer-motion';
import { Cpu, Zap, ShieldCheck, Monitor } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';
import { clsx } from 'clsx';

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
    const { specialization, setSpecialization } = useGameStore();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 border border-yellow-500/20 shadow-glow-primary">
                    <Zap size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">Specializations</h2>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Define your career path</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SPECIALIZATIONS.map((spec) => {
                    const isSelected = specialization === spec.id;
                    const Icon = spec.icon;

                    return (
                        <motion.button
                            key={spec.id}
                            onClick={() => setSpecialization(spec.id as any)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className={clsx(
                                "relative glass-card p-6 rounded-2xl text-left transition-all border group",
                                isSelected ? spec.borderColor + " " + spec.bgColor : "border-white/5 opacity-60 hover:opacity-100"
                            )}
                        >
                            {isSelected && (
                                <div className="absolute top-3 right-3">
                                    <div className={clsx("w-2 h-2 rounded-full animate-pulse", spec.color.replace('text-', 'bg-'))} />
                                </div>
                            )}

                            <div className={clsx("p-3 rounded-xl w-fit mb-4", isSelected ? "bg-white/10" : "bg-white/5")}>
                                <Icon size={24} className={spec.color} />
                            </div>

                            <h3 className="text-sm font-black text-white uppercase tracking-wider mb-1">{spec.title}</h3>
                            <div className={clsx("text-[10px] font-bold mb-4", spec.color)}>{spec.bonus}</div>

                            <p className="text-[11px] text-text-muted leading-relaxed">
                                {spec.desc}
                            </p>

                            {isSelected && (
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2">
                                    <ShieldCheck size={12} className={spec.color} />
                                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-white/50">Active Bonus Applied</span>
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {specialization === 'none' && (
                <div className="text-center p-4 bg-white/5 rounded-xl border border-dashed border-white/10">
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                        Select a path to unlock system-wide efficiency multipliers
                    </p>
                </div>
            )}
        </div>
    );
}
