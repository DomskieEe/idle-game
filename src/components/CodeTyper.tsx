import { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/useGameStore';
import { CODE_SNIPPETS } from '../data/snippets';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Terminal as TerminalIcon } from 'lucide-react';
import { clsx } from 'clsx';

export function CodeTyper() {
    const { addCode, isBurnout } = useGameStore();
    const [currentSnippet, setCurrentSnippet] = useState('');
    const [charIndex, setCharIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState('');
    const [codeHistory, setCodeHistory] = useState<string[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const terminalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!currentSnippet) {
            const randomSnippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
            setCurrentSnippet(randomSnippet);
            setCharIndex(0);
            setDisplayedText('');
        }
    }, [currentSnippet]);

    const handleCodeInput = (e?: React.KeyboardEvent | React.MouseEvent) => {
        if (isBurnout || !currentSnippet) return;

        // Prevent default if it's a keyboard event to avoid scrolling etc.
        if (e && 'key' in e) {
            // Ignore modifier keys
            if (['Control', 'Shift', 'Alt', 'Meta', 'CapsLock', 'Tab'].includes(e.key)) return;
            e.preventDefault();
        }

        const charsPerInput = 3;
        const nextIndex = Math.min(charIndex + charsPerInput, currentSnippet.length);
        const newChars = currentSnippet.slice(charIndex, nextIndex);

        setDisplayedText(currentSnippet.slice(0, nextIndex));
        setCharIndex(nextIndex);

        // Add code for each character typed
        addCode(newChars.length, true);

        if (nextIndex === currentSnippet.length) {
            // Snippet finished
            setCodeHistory(prev => [...prev.slice(-4), currentSnippet]);
            setCurrentSnippet('');
        }
    };

    // Keyboard listener when focused
    const handleKeyDown = (e: React.KeyboardEvent) => {
        handleCodeInput(e);
    };

    return (
        <div className="relative group">
            {/* Visual Glitch/Glow effects */}
            <div className={clsx(
                "absolute -inset-1 bg-primary/20 rounded-2xl blur-xl transition duration-500 pointer-events-none",
                isFocused ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            )} />

            <div
                ref={terminalRef}
                tabIndex={0}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={handleKeyDown}
                onClick={() => {
                    terminalRef.current?.focus();
                    if (currentSnippet) handleCodeInput();
                }}
                className={clsx(
                    "relative glass-panel rounded-2xl overflow-hidden shadow-2xl border-white/5 transition-all duration-500 outline-none",
                    isFocused ? "border-primary/50 ring-1 ring-primary/20" : "group-hover:border-primary/30"
                )}
            >
                {/* Terminal Header */}
                <div className="bg-white/[0.03] border-b border-white/5 px-4 py-3 flex items-center justify-between">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                    </div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted flex items-center gap-2">
                        <span className={clsx("w-1.5 h-1.5 rounded-full", isBurnout ? "bg-red-500" : "bg-primary animate-pulse")} />
                        {isFocused ? "Sequence Active: /dev/tty0" : "Terminal Offline - Click to Focus"}
                    </div>
                </div>

                {/* Terminal Content */}
                <div
                    className={clsx(
                        "h-[300px] p-6 font-mono text-sm overflow-hidden relative cursor-text transition-all duration-300",
                        isBurnout ? "opacity-30 grayscale saturate-0" : "bg-[#050507]/80"
                    )}
                >
                    {/* Background Text (History) */}
                    <div className="opacity-40 pointer-events-none select-none">
                        {codeHistory.map((line, i) => (
                            <div key={i} className="whitespace-pre flex gap-3 mb-1">
                                <span className="text-white/10 w-4 text-right select-none font-sans text-[10px]">{i + 1}</span>
                                <span className="text-text-muted">{line}</span>
                            </div>
                        ))}
                    </div>

                    {/* Current Typing Line */}
                    <div className="mt-2 flex gap-3 relative whitespace-pre">
                        <span className="text-white/10 w-4 text-right select-none font-sans text-[10px]">{codeHistory.length + 1}</span>
                        <div className="flex-1 flex overflow-hidden">
                            <span className="text-primary mr-2 select-none">$</span>
                            <span className="text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)] truncate">
                                {displayedText}
                            </span>
                            <motion.span
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="flex-shrink-0 w-2 h-5 bg-primary ml-1 shadow-[0_0_10px_rgba(249,115,22,0.8)]"
                            />
                        </div>
                    </div>

                    {/* Click to focus/start overlay */}
                    {!isBurnout && !isFocused && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none bg-black/20 backdrop-blur-[1px]">
                            <div className="flex flex-col items-center gap-4 bg-black/60 p-6 rounded-2xl border border-white/10">
                                <TerminalIcon size={32} className="text-primary animate-bounce" />
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">
                                    Input Required - Click to Start Typing
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Burnout Overlay */}
                    <AnimatePresence>
                        {isBurnout && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex flex-col items-center justify-center bg-red-950/20 backdrop-blur-[2px] z-10"
                            >
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex flex-col items-center gap-3">
                                    <Zap className="text-red-500 animate-bounce" size={40} />
                                    <h3 className="text-sm font-black text-red-500 uppercase tracking-widest">Core Overload</h3>
                                    <p className="text-[10px] text-red-400/70 uppercase font-black">Cooldown Required</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
