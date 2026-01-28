import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { CodeTyper } from './CodeTyper';
import { useGameStore } from '../store/useGameStore';

// Mock snippet selection
vi.mock('../data/snippets', () => ({
    CODE_SNIPPETS: ['test']
}));

describe('CodeTyper', () => {
    beforeEach(() => {
        useGameStore.setState({
            linesOfCode: 0,
            clickPower: 1,
            addCode: (amount) => {
                const s = useGameStore.getState();
                useGameStore.setState({ linesOfCode: s.linesOfCode + amount });
            }
        });
    });

    it('renders the mocked snippet', () => {
        render(<CodeTyper />);
        expect(screen.getByText('test')).toBeInTheDocument();
    });

    it('adds code when typing correctly', () => {
        render(<CodeTyper />);
        const input = screen.getByRole('textbox') as HTMLInputElement;

        // Type 't' (Correct)
        fireEvent.change(input, { target: { value: 't' } });

        const state = useGameStore.getState();
        expect(state.linesOfCode).toBe(1); // 1 LOC per char
    });

    it('does not add code when typing same length but wrong char', () => {
        render(<CodeTyper />);
        const input = screen.getByRole('textbox') as HTMLInputElement;

        // Type 'x' (Wrong)
        fireEvent.change(input, { target: { value: 'x' } });

        const state = useGameStore.getState();
        expect(state.linesOfCode).toBe(0);
        // Input value should not update (blocked by component logic)
        expect(input.value).toBe('');
    });
});
