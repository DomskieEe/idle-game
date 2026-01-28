export interface Upgrade {
    id: string;
    name: string;
    description: string;
    cost: number;
    trigger: (state: any) => boolean; // Condition to unlock/show
    effect: (state: any) => any; // Description of effect (handled in store)
}

export const UPGRADES = [
    {
        id: 'mechanical_keyboard',
        name: 'Mechanical Keyboard',
        description: 'Clicking is twice as effective.',
        cost: 500,
        type: 'click', // 'click' | 'building' | 'global'
        multiplier: 2,
        target: 'all',
    },
    {
        id: 'coffee_machine',
        name: 'Espresso Machine',
        description: 'Interns work 2x faster.',
        cost: 2000,
        type: 'building',
        multiplier: 2,
        target: 'intern',
    },
    {
        id: 'dual_monitors',
        name: 'Dual Monitors',
        description: 'Junior Devs are 50% more efficient.',
        cost: 5000,
        type: 'building',
        multiplier: 1.5,
        target: 'junior_dev',
    },
    {
        id: 'git_gud',
        name: 'Git Gud',
        description: 'Global production increased by 10%.',
        cost: 50000,
        type: 'global',
        multiplier: 1.1,
        target: 'all',
    },
    {
        id: 'tech_react',
        name: 'React.js Mastery',
        description: 'Junior Devs are 2x more effective.',
        cost: 100000,
        type: 'building',
        multiplier: 2,
        target: 'junior_dev',
    },
    {
        id: 'tech_python',
        name: 'Python Scripts',
        description: 'Senior Devs automate 50% more.',
        cost: 250000,
        type: 'building',
        multiplier: 1.5,
        target: 'senior_dev',
    },
    {
        id: 'tech_docker',
        name: 'Docker Containers',
        description: 'Servers run 20% more efficiently.',
        cost: 1000000,
        type: 'building',
        multiplier: 1.2,
        target: 'server',
    }
];
