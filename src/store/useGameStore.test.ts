import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from './useGameStore';

describe('useGameStore', () => {
    // Reset store before each test
    beforeEach(() => {
        useGameStore.getState().resetGame();
    });

    it('should initialize with default values', () => {
        const state = useGameStore.getState();
        expect(state.linesOfCode).toBe(0);
        expect(state.clickPower).toBe(1);
        expect(state.cps).toBe(0);
    });

    it('should increment linesOfCode and clicks on addCode', () => {
        const store = useGameStore.getState();
        store.addCode(10, true);

        const newState = useGameStore.getState();
        expect(newState.linesOfCode).toBe(10);
        expect(newState.totalLinesOfCode).toBe(10);
        expect(newState.totalClicks).toBe(1);
    });

    it('should purchase a building if affordable', () => {
        const store = useGameStore.getState();
        // Give enough money
        store.addCode(100);

        // Buy 'intern' (id: 'intern', cost: 10)
        store.buyBuilding('intern');

        const state = useGameStore.getState();
        expect(state.buildings['intern']).toBe(1);
        expect(state.linesOfCode).toBeGreaterThan(0); // 100 - 10 = 90
        expect(state.cps).toBeGreaterThan(0); // Intern adds CPS
    });

    it('should NOT purchase a building if too expensive', () => {
        const store = useGameStore.getState();
        store.addCode(5); // Not enough for intern (10)

        store.buyBuilding('intern');

        const state = useGameStore.getState();
        expect(state.buildings['intern']).toBeUndefined();
        expect(state.linesOfCode).toBe(5);
    });

    it('should apply upgrades to click power', () => {
        const store = useGameStore.getState();
        // Give tons of money to buy upgrade
        store.addCode(1000);

        // 'mechanical_keyboard' doubles click power (cost 500)
        store.buyUpgrade('mechanical_keyboard');

        const state = useGameStore.getState();
        expect(state.upgrades).toContain('mechanical_keyboard');
        expect(state.clickPower).toBe(2);
    });

    it('should unlock achievements', () => {
        const store = useGameStore.getState();

        // 'first_line' requires 10 LOC
        store.addCode(10);

        const state = useGameStore.getState();
        expect(state.achievements).toContain('first_line');
    });

    it('should handle prestige mechanics', () => {
        const store = useGameStore.getState();

        // Add 1,000,000 LOC to qualify for 1 share
        store.addCode(1000000);

        store.prestige();

        const state = useGameStore.getState();
        expect(state.shares).toBe(1); // sqrt(1M / 1M) = 1
        expect(state.linesOfCode).toBe(0); // Reset currency
        expect(state.buildings).toEqual({}); // Reset buildings

        // Check multiplier effect (1 share = +10% base click power)
        // Base click power is 1. 1 * 1.1 = 1.1
        // Wait, clickPower logic in store is: clickPower = 1 * prestigeMultiplier
        expect(state.clickPower).toBeCloseTo(1.1);
    });
});
