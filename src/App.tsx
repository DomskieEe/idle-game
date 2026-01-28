import { Terminal, Briefcase, Zap, X, Monitor, Trophy } from 'lucide-react';
import { useGameLoop } from './hooks/useGameLoop';
import { useGameStore } from './store/useGameStore';
import { CodeTyper } from './components/CodeTyper';
import { BuildingList } from './components/BuildingList';
import { UpgradeList } from './components/UpgradeList';
import { AchievementList } from './components/AchievementList';
import { AchievementNotification } from './components/AchievementNotification';
import { BugEvent } from './components/BugEvent';
import { HardwareShop } from './components/HardwareShop';
import { BurnoutBar } from './components/BurnoutBar';
import { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { FileCode } from 'lucide-react';

import { PrestigeModal } from './components/PrestigeModal';
import { ContractList } from './components/ContractList';

import { IntroScreen } from './components/IntroScreen';

function App() {
  useGameLoop(); // Start logic
  const { linesOfCode, cps, lastSaveTime, addCode, shares, resetGame, hasSeenIntro } = useGameStore();
  const [activeTab, setActiveTab] = useState<'buildings' | 'upgrades' | 'achievements' | 'hardware' | 'contracts'>('buildings');
  const [offlineEarnings, setOfflineEarnings] = useState<number | null>(null);
  const [isPrestigeOpen, setIsPrestigeOpen] = useState(false);
  const [resetConfirmation, setResetConfirmation] = useState(false);

  useEffect(() => {
    // Check for offline progress
    const now = Date.now();
    const timeDiff = now - lastSaveTime;

    // If more than 10 seconds passed
    if (timeDiff > 10000 && cps > 0) {
      const secondsOffline = timeDiff / 1000;
      const earned = Math.floor(secondsOffline * cps);
      if (earned > 0) {
        setOfflineEarnings(earned);
        addCode(earned);
      }
    }
  }, []); // Run once on mount

  return (
    <div className="min-h-screen bg-transparent text-text flex flex-col items-center p-4 md:p-8 font-sans relative">
      <div className="fixed inset-0 bg-[#050507] -z-10" /> {/* Solid bg fallback */}

      {!hasSeenIntro && <IntroScreen />}

      <AchievementNotification />
      <BugEvent />
      <PrestigeModal isOpen={isPrestigeOpen} onClose={() => setIsPrestigeOpen(false)} />

      {/* Offline Earnings Modal */}
      <AnimatePresence>
        {offlineEarnings !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <div className="bg-surface border border-primary p-8 rounded-2xl max-w-md w-full shadow-2xl text-center relative">
              <button
                onClick={() => setOfflineEarnings(null)}
                className="absolute top-4 right-4 text-muted hover:text-white"
              >
                <X />
              </button>

              <h2 className="text-2xl font-bold text-white mb-4">Welcome Back!</h2>
              <p className="text-muted mb-6">While you were away, your empire generated:</p>

              <div className="text-4xl font-mono font-bold text-primary mb-8">
                +{offlineEarnings.toLocaleString()} LOC
              </div>

              <button
                onClick={() => setOfflineEarnings(null)}
                className="bg-primary text-white py-3 px-8 rounded-xl font-bold hover:bg-orange-700 transition-colors w-full"
              >
                Collect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="w-full max-w-5xl flex justify-between items-center mb-12 p-6 glass-panel rounded-2xl sticky top-4 z-50">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl border border-primary/20 text-primary glow-primary">
            <Terminal size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white leading-none mb-1">
              IDLE game
            </h1>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/80">Code Builder</span>
          </div>
        </div>

        <div className="text-right">
          <div className="text-3xl font-mono font-black text-white tracking-tighter sm:text-4xl">
            {Math.floor(linesOfCode).toLocaleString()} <span className="text-text-muted text-sm font-sans font-medium uppercase tracking-normal ml-1">LOC</span>
          </div>
          <div className="text-xs font-mono text-primary flex items-center justify-end gap-1">
            <Zap size={12} className="fill-current" />
            {cps.toFixed(1)} lines/sec
          </div>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* Left: Actions */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          <BurnoutBar />
          <CodeTyper />

          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Current Infrastructure
            </h3>
            <ul className="text-sm text-text-muted space-y-3">
              <li className="flex justify-between items-center">
                <span>System Status</span>
                <span className="text-white font-medium bg-green-500/10 text-green-400 px-2 py-0.5 rounded text-[10px] uppercase">Optimal</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Core Clock</span>
                <span className="text-white font-mono uppercase">Stable 1.0.2</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-white/5">
              {!resetConfirmation ? (
                <button
                  onClick={() => setResetConfirmation(true)}
                  className="text-[9px] font-black uppercase tracking-[0.2em] text-red-500/50 hover:text-red-500 transition-colors flex items-center gap-2"
                >
                  <Zap size={10} />
                  Emergency Reformat
                </button>
              ) : (
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-red-500 uppercase animate-pulse">Confirm Purge?</span>
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        resetGame();
                        setResetConfirmation(false);
                      }}
                      className="text-[9px] font-black text-red-500 underline uppercase tracking-widest"
                    >
                      YES
                    </button>
                    <button
                      onClick={() => setResetConfirmation(false)}
                      className="text-[9px] font-black text-text-muted uppercase tracking-widest"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200" />
            <div className="relative glass-panel rounded-2xl p-6 flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-500/10 rounded-lg text-yellow-500 border border-yellow-500/20">
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white leading-tight">IPO Readiness</h3>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider font-bold">{shares} Shares Held</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">Liquidate your current assets for permanent market influence multipliers.</p>
              <button
                onClick={() => setIsPrestigeOpen(true)}
                className="w-full py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95"
              >
                Go Public (IPO)
              </button>
            </div>
          </div>
        </section>

        {/* Right: Shop Tabs */}
        <section className="lg:col-span-7 glass-panel rounded-3xl p-2 h-fit">
          {/* Tab Headers */}
          <div className="flex p-2 gap-1 bg-black/20 rounded-2xl mb-4">
            <button
              onClick={() => setActiveTab('buildings')}
              className={clsx(
                "flex-1 py-3 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider",
                activeTab === 'buildings' ? "bg-primary text-white shadow-lg glow-primary" : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Briefcase size={14} /> <span>Build</span>
            </button>
            <button
              onClick={() => setActiveTab('contracts')}
              className={clsx(
                "flex-1 py-3 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider",
                activeTab === 'contracts' ? "bg-accent-cyan text-white shadow-lg shadow-accent-cyan/20" : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <FileCode size={14} /> <span>Contracts</span>
            </button>
            <button
              onClick={() => setActiveTab('hardware')}
              className={clsx(
                "flex-1 py-3 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider",
                activeTab === 'hardware' ? "bg-accent-purple text-white shadow-lg shadow-accent-purple/20" : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Monitor size={14} /> <span>Rig</span>
            </button>
            <button
              onClick={() => setActiveTab('upgrades')}
              className={clsx(
                "flex-1 py-3 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider",
                activeTab === 'upgrades' ? "bg-accent-pink text-white shadow-lg shadow-accent-pink/20" : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Zap size={14} /> <span>Upgrades</span>
            </button>
            <button
              onClick={() => setActiveTab('achievements')}
              className={clsx(
                "flex-1 py-3 px-2 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider",
                activeTab === 'achievements' ? "bg-yellow-500 text-white shadow-lg shadow-yellow-500/20" : "text-text-muted hover:text-white hover:bg-white/5"
              )}
            >
              <Trophy size={14} /> <span>Awards</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="min-h-[400px]">
            {activeTab === 'buildings' && <BuildingList />}
            {activeTab === 'contracts' && <ContractList />}
            {activeTab === 'hardware' && <HardwareShop />}
            {activeTab === 'upgrades' && <UpgradeList />}
            {activeTab === 'achievements' && <AchievementList />}
          </div>
        </section>

      </main>
    </div>
  );
}

export default App;
