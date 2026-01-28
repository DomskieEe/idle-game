import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BUILDINGS } from '../data/buildings';
import { UPGRADES } from '../data/upgrades';
import { ACHIEVEMENTS } from '../data/achievements';
import { HARDWARE } from '../data/hardware';
import { CONTRACTS } from '../data/contracts';

interface GameState {
    linesOfCode: number;
    cps: number;
    clickPower: number;
    buildings: Record<string, number>; // id -> count
    upgrades: string[]; // ids of purchased upgrades
    hardware: string[]; // ids of purchased hardware
    achievements: string[]; // ids of unlocked achievements
    lastSaveTime: number;
    shares: number; // Prestige currency

    // Contracts System
    activeContractId: string | null;
    contractProgress: number; // LOC contributed to current contract
    contractsCompleted: string[]; // ids of completed contracts

    // Burnout System
    burnout: number; // 0 to 100
    isBurnout: boolean;

    // Statistics
    startTime: number;
    totalLinesOfCode: number;
    totalClicks: number;

    // UI State
    hasSeenIntro: boolean;

    // Actions
    addCode: (amount: number, fromClick?: boolean) => void;
    buyBuilding: (buildingId: string) => void;
    buyUpgrade: (upgradeId: string) => void;
    buyHardware: (hardwareId: string) => void;
    reduceBurnout: (amount: number) => void;
    recalculateCPS: (buildings: Record<string, number>, upgrades: string[]) => void;
    checkAchievements: () => void;
    prestige: () => void;
    resetGame: () => void;

    // Contract Actions
    acceptContract: (contractId: string) => void;
    cancelContract: () => void;
    completeContract: () => void;

    // UI Actions
    setHasSeenIntro: (seen: boolean) => void;
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            linesOfCode: 0,
            cps: 0,
            clickPower: 1,
            buildings: {},
            upgrades: [],
            hardware: [],
            achievements: [],
            shares: 0,
            burnout: 0,
            isBurnout: false,
            activeContractId: null,
            contractProgress: 0,
            contractsCompleted: [],
            hasSeenIntro: false,
            lastSaveTime: Date.now(),

            startTime: Date.now(),
            totalLinesOfCode: 0,
            totalClicks: 0,

            // UI Actions
            setHasSeenIntro: (seen) => set({ hasSeenIntro: seen }),


            addCode: (amount, fromClick = false) => {
                const state = get();

                // Burnout Logic
                let currentBurnout = state.burnout;
                let isNowBurnout = state.isBurnout;

                if (fromClick) {
                    if (state.isBurnout) return; // Cannot type if burnt out

                    // Calculate burnout increase based on Chairs
                    let burnoutIncrease = 2; // Base increase per type

                    // Apply Chair reduction
                    state.hardware.forEach(hId => {
                        const item = HARDWARE.find(h => h.id === hId);
                        if (item && item.type === 'chair') {
                            burnoutIncrease *= item.multiplier;
                        }
                    });

                    currentBurnout = Math.min(100, currentBurnout + burnoutIncrease);
                    if (currentBurnout >= 100) {
                        isNowBurnout = true;
                        // Auto recover after 10 seconds
                        setTimeout(() => {
                            useGameStore.setState({ isBurnout: false, burnout: 0 });
                        }, 10000);
                    }
                }

                set((state) => {
                    const newLines = state.linesOfCode + amount;
                    const newTotalLines = (state.totalLinesOfCode || 0) + amount;
                    const newContractProgress = state.activeContractId
                        ? state.contractProgress + amount
                        : state.contractProgress;

                    return {
                        linesOfCode: newLines,
                        totalLinesOfCode: newTotalLines,
                        totalClicks: fromClick ? (state.totalClicks || 0) + 1 : (state.totalClicks || 0),
                        lastSaveTime: Date.now(),
                        burnout: currentBurnout,
                        isBurnout: isNowBurnout,
                        contractProgress: newContractProgress
                    };
                });
                get().checkAchievements();
            },

            reduceBurnout: (amount) => {
                set(state => ({
                    burnout: Math.max(0, state.burnout - amount)
                }));
            },

            buyBuilding: (buildingId) => {
                const state = get();
                const building = BUILDINGS.find(b => b.id === buildingId);
                if (!building) return;

                const count = state.buildings[buildingId] || 0;
                const cost = Math.floor(building.baseCost * Math.pow(1.15, count));

                if (state.linesOfCode >= cost) {
                    const newCount = count + 1;
                    const newBuildings = { ...state.buildings, [buildingId]: newCount };

                    get().recalculateCPS(newBuildings, state.upgrades);

                    set((state) => ({
                        linesOfCode: state.linesOfCode - cost,
                        buildings: newBuildings,
                        lastSaveTime: Date.now()
                    }));
                    get().checkAchievements();
                }
            },

            buyUpgrade: (upgradeId) => {
                const state = get();
                const upgrade = UPGRADES.find(u => u.id === upgradeId);
                if (!upgrade || state.upgrades.includes(upgradeId)) return;

                if (state.linesOfCode >= upgrade.cost) {
                    const newUpgrades = [...state.upgrades, upgradeId];
                    get().recalculateCPS(state.buildings, newUpgrades);

                    // Handle click power upgrades immediately
                    let newClickPower = 1;
                    const prestigeMultiplier = 1 + (state.shares * 0.1);

                    newUpgrades.forEach(uId => {
                        const u = UPGRADES.find(def => def.id === uId);
                        if (u && u.type === 'click') newClickPower *= u.multiplier;
                    });

                    // Apply Hardware Multipliers to Click Power
                    state.hardware.forEach(hId => {
                        const item = HARDWARE.find(h => h.id === hId);
                        if (item && item.type === 'keyboard') {
                            newClickPower *= item.multiplier;
                        }
                    });

                    // Apply prestige boost to click power as well
                    newClickPower *= prestigeMultiplier;

                    set((state) => ({
                        linesOfCode: state.linesOfCode - upgrade.cost,
                        upgrades: newUpgrades,
                        clickPower: newClickPower,
                        lastSaveTime: Date.now()
                    }));
                    get().checkAchievements();
                }
            },

            buyHardware: (hardwareId) => {
                const state = get();
                const item = HARDWARE.find(h => h.id === hardwareId);
                if (!item || state.hardware.includes(hardwareId)) return;

                if (state.linesOfCode >= item.cost) {
                    const newHardware = [...state.hardware, hardwareId];

                    // Recalculate Click Power
                    let newClickPower = 1;
                    const prestigeMultiplier = 1 + (state.shares * 0.1);

                    state.upgrades.forEach(uId => {
                        const u = UPGRADES.find(def => def.id === uId);
                        if (u && u.type === 'click') newClickPower *= u.multiplier;
                    });

                    newHardware.forEach(hId => {
                        const h = HARDWARE.find(def => def.id === hId);
                        if (h && h.type === 'keyboard') {
                            newClickPower *= h.multiplier;
                        }
                    });

                    newClickPower *= prestigeMultiplier;

                    // Recalculate Passive CPS logic if Monitor
                    if (item.type === 'monitor') {
                        // Trigger recalculate
                        get().recalculateCPS(state.buildings, state.upgrades);
                    }

                    set(state => ({
                        linesOfCode: state.linesOfCode - item.cost,
                        hardware: newHardware,
                        clickPower: newClickPower
                    }));
                }
            },

            checkAchievements: () => {
                const state = get();
                const newUnlocked: string[] = [];

                ACHIEVEMENTS.forEach(achievement => {
                    if (!state.achievements.includes(achievement.id)) {
                        if (achievement.condition(state)) {
                            newUnlocked.push(achievement.id);
                        }
                    }
                });

                if (newUnlocked.length > 0) {
                    set((state) => ({
                        achievements: [...state.achievements, ...newUnlocked]
                    }));
                }
            },

            recalculateCPS: (buildings, upgrades) => {
                const state = get();
                let newCPS = 0;

                // Calculate multipliers per building type
                const buildingMultipliers: Record<string, number> = {};
                let globalMultiplier = 1;

                upgrades.forEach(uId => {
                    const u = UPGRADES.find(def => def.id === uId);
                    if (!u) return;
                    if (u.type === 'global') globalMultiplier *= u.multiplier;
                    if (u.type === 'building') {
                        buildingMultipliers[u.target] = (buildingMultipliers[u.target] || 1) * u.multiplier;
                    }
                });

                BUILDINGS.forEach(b => {
                    const count = buildings[b.id] || 0;
                    const multiplier = buildingMultipliers[b.id] || 1;
                    newCPS += count * b.baseCPS * multiplier;
                });

                // Apply Hardware (Monitors)
                state.hardware?.forEach(hId => {
                    const h = HARDWARE.find(def => def.id === hId);
                    if (h && h.type === 'monitor') {
                        globalMultiplier *= h.multiplier;
                    }
                });

                // Apply Prestige Multiplier (+10% per share)
                const prestigeMultiplier = 1 + ((state.shares || 0) * 0.1);
                newCPS *= globalMultiplier * prestigeMultiplier;

                set({ cps: newCPS });
            },

            prestige: () => {
                const state = get();
                const potentialShares = Math.floor(Math.sqrt(state.totalLinesOfCode / 1000000));
                const newShares = Math.max(0, potentialShares - state.shares);

                if (newShares <= 0) return;

                const totalShares = state.shares + newShares;
                const prestigeMultiplier = 1 + (totalShares * 0.1);

                set({
                    linesOfCode: 0,
                    cps: 0,
                    clickPower: 1 * prestigeMultiplier, // Base click power boosted
                    buildings: {},
                    upgrades: [],
                    hardware: [], // Reset Hardware
                    burnout: 0,
                    isBurnout: false,
                    activeContractId: null,
                    contractProgress: 0,
                    // Keep achievements, lifetime stats, and completed contracts
                    shares: totalShares,
                    lastSaveTime: Date.now()
                });
            },

            resetGame: () => {
                set({
                    linesOfCode: 0,
                    cps: 0,
                    clickPower: 1,
                    buildings: {},
                    upgrades: [],
                    hardware: [],
                    achievements: [],
                    shares: 0,
                    burnout: 0,
                    isBurnout: false,
                    lastSaveTime: Date.now(),
                    startTime: Date.now(),
                    totalLinesOfCode: 0,
                    totalClicks: 0,
                    activeContractId: null,
                    contractProgress: 0,
                    contractsCompleted: []
                });
            },

            acceptContract: (contractId) => {
                const state = get();
                if (state.activeContractId) return; // Already have a contract

                const contract = CONTRACTS.find(c => c.id === contractId);
                if (!contract) return;

                // Check requirements
                const meetsRequirements = contract.requirements.every(req =>
                    (state.buildings[req.buildingId] || 0) >= req.count
                );

                if (!meetsRequirements) return;

                set({
                    activeContractId: contractId,
                    contractProgress: 0
                });
            },

            cancelContract: () => {
                set({
                    activeContractId: null,
                    contractProgress: 0
                });
            },

            completeContract: () => {
                const state = get();
                if (!state.activeContractId) return;

                const contract = CONTRACTS.find(c => c.id === state.activeContractId);
                if (!contract) return;

                if (state.contractProgress >= contract.locRequired) {
                    set(state => ({
                        linesOfCode: state.linesOfCode + contract.rewardLOC,
                        shares: state.shares + (contract.rewardShares || 0),
                        contractsCompleted: [...state.contractsCompleted, contract.id],
                        activeContractId: null,
                        contractProgress: 0
                    }));
                    get().checkAchievements();
                }
            }
        }),
        {
            name: 'devempire-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
