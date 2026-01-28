export interface Contract {
    id: string;
    name: string;
    description: string;
    locRequired: number;
    requirements: {
        buildingId: string;
        count: number;
    }[];
    rewardLOC: number;
    rewardShares?: number;
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Legendary';
}

export const CONTRACTS: Contract[] = [
    {
        id: 'fix_css_bugs',
        name: 'Fix CSS Layouts',
        description: 'A local bakery needs their website fixed. It is mostly alignment issues.',
        locRequired: 500,
        requirements: [],
        rewardLOC: 2000,
        difficulty: 'Easy'
    },
    {
        id: 'simple_landing_page',
        name: 'Startup Landing Page',
        description: 'Build a high-conversion landing page for a new AI toothbrush startup.',
        locRequired: 2500,
        requirements: [
            { buildingId: 'intern', count: 1 }
        ],
        rewardLOC: 10000,
        difficulty: 'Easy'
    },
    {
        id: 'ecommerce_backend',
        name: 'E-commerce API',
        description: 'Develop a robust backend for a niche sneaker store.',
        locRequired: 15000,
        requirements: [
            { buildingId: 'junior_dev', count: 2 }
        ],
        rewardLOC: 50000,
        difficulty: 'Medium'
    },
    {
        id: 'fintech_app',
        name: 'Fintech Mobile App',
        description: 'Create a secure payment processing app. Security is paramount.',
        locRequired: 100000,
        requirements: [
            { buildingId: 'senior_dev', count: 1 },
            { buildingId: 'junior_dev', count: 3 }
        ],
        rewardLOC: 350000,
        difficulty: 'Hard'
    },
    {
        id: 'global_social_network',
        name: 'Social Network MVP',
        description: 'The next big thing. Scalability is the main challenge.',
        locRequired: 1000000,
        requirements: [
            { buildingId: 'ai_copilot', count: 1 },
            { buildingId: 'senior_dev', count: 5 }
        ],
        rewardLOC: 5000000,
        rewardShares: 5,
        difficulty: 'Legendary'
    }
];
