export interface HardwareItem {
    id: string;
    name: string;
    description: string;
    cost: number;
    type: 'keyboard' | 'chair' | 'monitor';
    multiplier: number; // Effectiveness multiplier
    effect: string; // Text description of effect
}

export const HARDWARE: HardwareItem[] = [
    {
        id: 'mech_keyboard_v1',
        name: 'Basic Mechanical',
        description: 'Clicky blue switches. Loud but effective.',
        cost: 500,
        type: 'keyboard',
        multiplier: 1.2,
        effect: '+20% LOC per keystroke'
    },
    {
        id: 'ergo_chair_v1',
        name: 'Office Chair',
        description: 'Better than a kitchen stool.',
        cost: 1000,
        type: 'chair',
        multiplier: 0.9,
        effect: '-10% Burnout Buildup'
    },
    {
        id: 'monitor_dual',
        name: 'Dual Monitors',
        description: 'Double the screens, double the productivity.',
        cost: 2500,
        type: 'monitor',
        multiplier: 1.15,
        effect: '+15% Passive CPS'
    },
    {
        id: 'mech_keyboard_v2',
        name: 'Custom 60% Keeb',
        description: 'Lubed switches, heavy brass plate.',
        cost: 5000,
        type: 'keyboard',
        multiplier: 1.5,
        effect: '+50% LOC per keystroke'
    },
    {
        id: 'ergo_chair_v2',
        name: 'Herman Miller',
        description: 'Your back will thank you.',
        cost: 10000,
        type: 'chair',
        multiplier: 0.5,
        effect: '-50% Burnout Buildup'
    }
];
