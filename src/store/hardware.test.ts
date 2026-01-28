import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore } from './useGameStore';
import { HARDWARE } from '../data/hardware';

describe('Hardware & Burnout System', () => {
    beforeEach(() => {
        useGameStore.setState({
            linesOfCode: 0,
            clickPower: 1,
            hardware: [],
            upgrades: [],
            burnout: 0,
            isBurnout: false,
            shares: 0,
            buildings: {}
        });
    });

    it('allows buying hardware when affordable', () => {
        const item = HARDWARE[0]; // Basic Keyboard (500 cost)
        useGameStore.setState({ linesOfCode: 5000 });
        
        useGameStore.getState().buyHardware(item.id);
        
        const state = useGameStore.getState();
        expect(state.hardware).toContain(item.id);
        expect(state.linesOfCode).toBe(4500);
    });

    it('applies keyboard multiplier to click power', () => {
        const item = HARDWARE.find(h => h.type === 'keyboard');
        if (!item) throw new Error('No keyboard found in test');

        useGameStore.setState({ linesOfCode: 10000 });
        
        // Before buy
        expect(useGameStore.getState().clickPower).toBe(1);

        // Buy Keyboard (1.2x)
        useGameStore.getState().buyHardware(item.id);

        expect(useGameStore.getState().clickPower).toBeCloseTo(1.2);
    });

    it('increases burnout when typing (clicking)', () => {
        // Mock typing action via addCode(amount, true)
        useGameStore.getState().addCode(1, true);
        
        expect(useGameStore.getState().burnout).toBeGreaterThan(0);
    });

    it('triggers burnout state at 100%', () => {
        useGameStore.setState({ burnout: 99 });
        vi.useFakeTimers();

        useGameStore.getState().addCode(1, true);
        
        // 99 + base increase (2) > 100
        expect(useGameStore.getState().isBurnout).toBe(true);
        
        // Verify cooldown (10s)
        vi.advanceTimersByTime(10000);
        expect(useGameStore.getState().isBurnout).toBe(false);
        expect(useGameStore.getState().burnout).toBe(0);

        vi.useRealTimers();
    });

    it('chairs reduce burnout buildup', () => {
        const chair = HARDWARE.find(h => h.type === 'chair');
        if (!chair) throw new Error('No chair found');

        // Test Base Buildup
        useGameStore.setState({ hardware: [], burnout: 0 });
        useGameStore.getState().addCode(1, true);
        const baseBuildup = useGameStore.getState().burnout;

        // Test with Chair
        useGameStore.setState({ hardware: [chair.id], burnout: 0 });
        useGameStore.getState().addCode(1, true);
        const reducedBuildup = useGameStore.getState().burnout;

        expect(reducedBuildup).toBeLessThan(baseBuildup);
    });
});
