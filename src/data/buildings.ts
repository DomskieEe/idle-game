export interface Building {
    id: string;
    name: string;
    description: string;
    baseCost: number;
    baseCPS: number;
}

export const BUILDINGS: Building[] = [
    {
        id: 'intern',
        name: 'Intern',
        description: 'A cheap hire. Writes spaghetti code, but hey, it runs.',
        baseCost: 15,
        baseCPS: 0.5,
    },
    {
        id: 'junior_dev',
        name: 'Junior Developer',
        description: 'Fresh out of bootcamp. Needs supervision.',
        baseCost: 100,
        baseCPS: 3,
    },
    {
        id: 'senior_dev',
        name: 'Senior Developer',
        description: 'Writes clean code and refuses to attend meetings.',
        baseCost: 1100,
        baseCPS: 12,
    },
    {
        id: 'ai_copilot',
        name: 'AI Copilot',
        description: 'Writes code faster than you can think.',
        baseCost: 12000,
        baseCPS: 50,
    }
];
