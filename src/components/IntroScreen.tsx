import { motion } from 'framer-motion';
import { Terminal, Users, FileCode, Zap, Cpu, TrendingUp } from 'lucide-react';
import { useGameStore } from '../store/useGameStore';

export function IntroScreen() {
    const setHasSeenIntro = useGameStore((state) => state.setHasSeenIntro);

    const mechanics = [
        {
            icon: <Terminal className="text-primary" size={24} />,
            title: "Keyboard Typing",
            description: "click ng mouse or type randomlu sa keyboard! Bawat pindot ay nag-ge-generate ng Lines of Code (LOC) para sa iyong code hub."
        },
        {
            icon: <Users className="text-accent-cyan" size={24} />,
            title: "Hire Ka Ng Team",
            description: "Hire ng mga Interns at Senior Architects para sila na ang bahala sa pag-produce ng LOC habang na bobored ka."
        },
        {
            icon: <FileCode className="text-accent-purple" size={24} />,
            title: "Freelance Market",
            description: "Tanggapin ang mga high-stakes contracts. Siguraduhin na may sapat kang staff para sa malaking LOC rewards."
        },
        {
            icon: <Zap className="text-red-500" size={24} />,
            title: "Stress & Burnout",
            description: "Dahan-dahan lang! Kapag masyadong mabilis ang pag-type, maaring mag-overheat ang system at ma-burnout ka."
        },
        {
            icon: <Cpu className="text-accent-pink" size={24} />,
            title: "Upgrade ang Rig",
            description: "Bili ng bagong keyboard, monitor, at ergonomic chairs para mas mabilis ang production at iwas-stress."
        },
        {
            icon: <TrendingUp className="text-yellow-500" size={24} />,
            title: "Mag-IPO na!",
            description: "Kapag sikat na ang empire mo, mag-IPO para mag-reset. Makakakuha ka ng Shares at permanent multipliers."
        }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 overflow-y-auto bg-background/90 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="max-w-4xl w-full glass-panel rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
            >
                {/* Header Section */}
                <div className="relative h-48 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/20 to-transparent pointer-events-none" />
                    <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

                    <motion.div
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="p-4 bg-primary/10 rounded-2xl border border-primary/20 text-primary glow-primary mb-4"
                    >
                        <Terminal size={40} />
                    </motion.div>

                    <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic">
                        IDLE <span className="text-primary">Game</span>
                    </h1>
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary/60 mt-2">
                        System Initialization Sequence... Loading na po
                    </p>
                </div>

                {/* Mechanics Grid */}
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-black/40">
                    {mechanics.map((m, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className="glass-card p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors group"
                        >
                            <div className="p-3 bg-white/5 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
                                {m.icon}
                            </div>
                            <h3 className="text-white font-bold text-sm mb-2 uppercase tracking-tight">{m.title}</h3>
                            <p className="text-text-muted text-[11px] leading-relaxed">
                                {m.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Footer / Start Button */}
                <div className="p-8 border-t border-white/5 flex flex-col items-center gap-6 bg-surface/20">
                    <div className="flex flex-col items-center text-center max-w-lg">
                        <h4 className="text-white font-bold text-sm mb-1 uppercase tracking-wider">Mission Mo</h4>
                        <p className="text-[11px] text-text-muted italic">
                            "Bumuo ng ultimate software empire habang inaalagaan ang thermal load at technical debt. Huwad na developer? Hindi dito!"
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(249, 115, 22, 0.4)" }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setHasSeenIntro(true)}
                        className="px-12 py-4 bg-primary text-white font-black uppercase tracking-[0.3em] rounded-xl text-xs glow-primary hover:bg-primary-glow transition-all active:scale-95"
                    >
                        Simulan Na Yung Grind
                    </motion.button>

                    <p className="text-[8px] text-white/20 uppercase tracking-[0.2em] font-bold">
                        Version 1.0.2 // Enterprise Edition // Secure Connection Stable
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
