import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { BUILDINGS } from '../data/buildings';
import { UPGRADES } from '../data/upgrades';
import { ACHIEVEMENTS } from '../data/achievements';
import { HARDWARE } from '../data/hardware';
import { type Contract, generateContract } from '../data/contracts';
import { STOCKS } from '../data/stocks';

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
    availableContracts: Contract[];
    contractsCompleted: number; // count of completed contracts

    // Burnout System
    burnout: number; // 0 to 100
    isBurnout: boolean;

    // Technical Debt System
    techDebt: number; // Accumulated debt
    takeShortcut: () => void;
    payDownDebt: (amount: number) => void;

    // Stock Market
    stockPrices: Record<string, number>; // id -> current price
    ownedStocks: Record<string, number>; // id -> count owned
    buyStock: (stockId: string, amount: number) => void;
    sellStock: (stockId: string, amount: number) => void;
    updateMarket: () => void;

    // Statistics
    startTime: number;
    totalLinesOfCode: number;
    totalClicks: number;

    // UI State
    hasSeenIntro: boolean;

    // Advanced Systems
    specialization: 'none' | 'frontend' | 'backend' | 'devops' | 'fullstack';
    skillsUnlocked: string[];
    officeLevel: number;
    darkWebUnlocked: boolean;
    illegalAIActive: boolean;

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

    // Advanced Actions
    setSpecialization: (spec: 'none' | 'frontend' | 'backend' | 'devops' | 'fullstack') => void;
    unlockSkill: (skillId: string) => void;
    upgradeOffice: () => void;
    toggleIllegalAI: (active: boolean) => void;

    // Contract Actions
    acceptContract: (contractId: string) => void;
    cancelContract: () => void;
    completeContract: () => void;
    generateDailyContracts: () => void;

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
            techDebt: 0,
            stockPrices: STOCKS.reduce((acc, s) => ({ ...acc, [s.id]: s.basePrice }), {}),
            ownedStocks: {},
            activeContractId: null,
            contractProgress: 0,
            contractsCompleted: 0,
            availableContracts: [],
            hasSeenIntro: false,
            specialization: 'none',
            skillsUnlocked: [],
            officeLevel: 0,
            darkWebUnlocked: false,
            illegalAIActive: false,
            lastSaveTime: Date.now(),

            startTime: Date.now(),
            totalLinesOfCode: 0,
            totalClicks: 0,

            // UI Actions
            setHasSeenIntro: (seen) => set({ hasSeenIntro: seen }),

            // Advanced Actions
            setSpecialization: (spec) => {
                set({ specialization: spec });
                get().recalculateCPS(get().buildings, get().upgrades);
            },

            unlockSkill: (skillId) => {
                const state = get();
                if (state.skillsUnlocked.includes(skillId)) return;

                // Cost Logic handled in UI, but we could add verification here
                set({
                    skillsUnlocked: [...state.skillsUnlocked, skillId],
                    linesOfCode: state.linesOfCode - 0 // Assumed handled before call, or add cost arg
                });
                get().recalculateCPS(state.buildings, state.upgrades);
            },

            upgradeOffice: () => {
                const state = get();
                const costs = [50000, 500000, 5000000];
                const currentCost = costs[state.officeLevel];

                if (state.officeLevel < 3 && state.linesOfCode >= currentCost) {
                    set(s => ({
                        linesOfCode: s.linesOfCode - currentCost,
                        officeLevel: s.officeLevel + 1
                    }));
                }
            },

            toggleIllegalAI: (active) => {
                set({ illegalAIActive: active });
            },

            takeShortcut: () => {
                const state = get();
                const gain = state.cps * 60; // 1 minute of production instantly
                const penalty = gain * 1.5; // Debt is 1.5x the gain

                set({
                    linesOfCode: state.linesOfCode + gain,
                    techDebt: state.techDebt + penalty
                });
                get().recalculateCPS(state.buildings, state.upgrades);
            },

            payDownDebt: (amount) => {
                const state = get();
                const actualPay = Math.min(amount, state.techDebt, state.linesOfCode);

                set({
                    linesOfCode: state.linesOfCode - actualPay,
                    techDebt: state.techDebt - actualPay
                });
                get().recalculateCPS(state.buildings, state.upgrades);
            },

            buyStock: (stockId, amount) => {
                const state = get();
                const currentPrice = state.stockPrices[stockId];
                const cost = currentPrice * amount; // Cost is in SHARES

                if (state.shares >= cost) {
                    set({
                        shares: state.shares - cost,
                        ownedStocks: {
                            ...state.ownedStocks,
                            [stockId]: (state.ownedStocks[stockId] || 0) + amount
                        }
                    });
                }
            },

            sellStock: (stockId, amount) => {
                const state = get();
                const owned = state.ownedStocks[stockId] || 0;

                if (owned >= amount) {
                    const currentPrice = state.stockPrices[stockId];
                    const revenue = currentPrice * amount; // Revenue is in SHARES

                    set({
                        shares: state.shares + revenue,
                        ownedStocks: {
                            ...state.ownedStocks,
                            [stockId]: owned - amount
                        }
                    });
                }
            },

            updateMarket: () => {
                const state = get();
                // Random Walk Logic
                const newPrices = { ...state.stockPrices };

                STOCKS.forEach(stock => {
                    const current = newPrices[stock.id] || stock.basePrice;
                    const volatility = stock.volatility;
                    const changePct = (Math.random() * volatility * 2) - volatility; // -vol to +vol

                    // drift slightly up generally over time (bullish bias)
                    const drift = 0.001;

                    let newPrice = current * (1 + changePct + drift);
                    // Clamp prices
                    newPrice = Math.max(1, Math.min(newPrice, stock.basePrice * 10)); // Min 1, Max 10x base

                    newPrices[stock.id] = newPrice;
                });

                set({ stockPrices: newPrices });
            },


            addCode: (amount, fromClick = false) => {
                const state = get();

                // Burnout Logic
                let currentBurnout = state.burnout;
                let isNowBurnout = state.isBurnout;

                if (fromClick) {
                    if (state.isBurnout) return; // Cannot type if burnt out

                    // Calculate burnout increase based on Chairs
                    let burnoutIncrease = 2; // Base increase per type

                    // DevOps Specialization: -50% stress
                    if (state.specialization === 'devops') burnoutIncrease *= 0.5;

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

                // Dark Web Check: Unlock at 10k LOC
                const shouldUnlockDarkWeb = !state.darkWebUnlocked && state.totalLinesOfCode >= 10000;

                // Illegal AI Hack Check
                if (state.illegalAIActive && !fromClick && Math.random() < 0.005) { // 0.5% chance per tick to get hacked
                    set({
                        linesOfCode: 0,
                        illegalAIActive: false
                    });
                    // You could add a notification here later
                }

                set((state) => {
                    let clickAmount = amount;
                    // Frontend Ninja: Double Click Power
                    if (fromClick && (state.specialization === 'frontend' || state.specialization === 'fullstack')) {
                        clickAmount *= 2;
                    }

                    if (fromClick && state.skillsUnlocked.includes('css_wizard')) {
                        clickAmount *= 1.5;
                    }

                    const newLines = state.linesOfCode + clickAmount;
                    const newTotalLines = (state.totalLinesOfCode || 0) + clickAmount;
                    const newContractProgress = state.activeContractId
                        ? state.contractProgress + clickAmount
                        : state.contractProgress;

                    return {
                        linesOfCode: newLines,
                        totalLinesOfCode: newTotalLines,
                        totalClicks: fromClick ? (state.totalClicks || 0) + 1 : (state.totalClicks || 0),
                        lastSaveTime: Date.now(),
                        burnout: currentBurnout,
                        isBurnout: isNowBurnout,
                        contractProgress: newContractProgress,
                        darkWebUnlocked: state.darkWebUnlocked || shouldUnlockDarkWeb
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

                // Office Slot Limits
                const totalPersonnel = Object.values(state.buildings).reduce((a, b) => a + b, 0);
                const limits = [20, 50, 150, Infinity];
                if (totalPersonnel >= limits[state.officeLevel]) return; // Office is full!

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

                // Specialization Bonuses
                if (state.specialization === 'backend' || state.specialization === 'fullstack') {
                    newCPS *= 1.5;
                }

                // Sub-skill Bonuses
                if (state.skillsUnlocked.includes('react_master')) globalMultiplier *= 1.2;
                if (state.skillsUnlocked.includes('cloud_architect')) globalMultiplier *= 1.3;
                if (state.skillsUnlocked.includes('kubernetes_god')) globalMultiplier *= 1.5;

                // Illegal AI: Double CPS
                if (state.illegalAIActive) {
                    newCPS *= 2;
                }

                // Tech Debt Penalty
                // Penalty scales with debt relative to production capacity (base income)
                // If debt > 10 mins of CPS, penalty starts kicking in hard
                const debtImpact = state.cps > 0 ? state.techDebt / (state.cps * 600) : 0; // Ratio to 10 mins production
                // Cap penalty at 75% reduction
                const penaltyMultiplier = Math.max(0.25, 1 - (debtImpact * 0.5));

                if (state.techDebt > 0) {
                    newCPS *= penaltyMultiplier;
                }

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
                    techDebt: 0,
                    stockPrices: STOCKS.reduce((acc, s) => ({ ...acc, [s.id]: s.basePrice }), {}),
                    ownedStocks: {},
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
                    contractsCompleted: 0,
                    availableContracts: []
                });
            },

            acceptContract: (contractId) => {
                const state = get();
                if (state.activeContractId) return; // Already have a contract

                const contract = state.availableContracts.find(c => c.id === contractId);
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

                const contract = state.availableContracts.find(c => c.id === state.activeContractId);
                if (!contract) return;

                if (state.contractProgress >= contract.locRequired) {
                    // Generate a replacement contract
                    const newContract = generateContract(state.cps, state.linesOfCode);

                    set(state => ({
                        linesOfCode: state.linesOfCode + contract.rewardLOC,
                        shares: state.shares + (contract.rewardShares || 0),
                        contractsCompleted: state.contractsCompleted + 1,
                        activeContractId: null,
                        contractProgress: 0,
                        // Remove completed, add new one
                        availableContracts: [...state.availableContracts.filter(c => c.id !== contract.id), newContract]
                    }));
                    get().checkAchievements();
                }
            },

            generateDailyContracts: () => {
                const state = get();
                if (state.availableContracts.length > 0) return;

                const newContracts = Array(3).fill(null).map(() =>
                    generateContract(state.cps, state.linesOfCode)
                );
                set({ availableContracts: newContracts });
            }
        }),
        {
            name: 'devempire-storage',
            storage: createJSONStorage(() => localStorage),
        }
    )
);
