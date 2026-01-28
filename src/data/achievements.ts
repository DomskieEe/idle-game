export interface Achievement {
    id: string;
    name: string;
    description: string;
    condition: (state: any) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_line',
        name: 'Hello World',
        description: 'Write your first 10 lines of code.',
        condition: (state) => state.linesOfCode >= 10,
    },
    {
        id: 'script_kiddie',
        name: 'Script Kiddie',
        description: 'Accumulate 1,000 LOC.',
        condition: (state) => state.linesOfCode >= 1000,
    },
    {
        id: 'junior_dev_hire',
        name: 'Delegation',
        description: 'Hire your first Junior Developer.',
        condition: (state) => (state.buildings['junior_dev'] || 0) >= 1,
    },
    {
        id: 'startup_founder',
        name: 'Startup Founder',
        description: 'Reach 10,000 LOC. Time to get a hoodie.',
        condition: (state) => state.linesOfCode >= 10000,
    },
    {
        id: 'automation_expert',
        name: 'Automation Expert',
        description: 'Reach 100 LOC/sec.',
        condition: (state) => state.cps >= 100,
    },
    {
        id: 'tech_mogul',
        name: 'Tech Mogul',
        description: 'Reach 1,000,000 LOC.',
        condition: (state) => state.linesOfCode >= 1000000,
    }
];
