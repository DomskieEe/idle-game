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
    rarity: 'Common' | 'Uncommon' | 'Rare' | 'Mythic';
}

const CLIENTS = [
    'Local Bakery', 'Startup Inc', 'Fintech Corp', 'MegaBank', 'Social Media Giant',
    'AI Research Lab', 'Crypto Exchange', 'Game Studio', 'Government Agency', 'Non-Profit'
];

const TASKS = [
    'Fix CSS Layouts', 'Build Landing Page', 'Optimize Database', 'Refactor Legacy Code',
    'Implement Auth Flow', 'Design API', 'Migrate to Cloud', 'Train AI Model', 'Audit Security', 'Develop Mobile App'
];

const DESCRIPTIONS = [
    'Needs it done yesterday.', 'Offering exposure as payment.', 'The last dev quit.',
    'Scalability is key.', 'Must be mobile-responsive.', 'Strict NDA required.',
    ' CEO wants to see results.', 'Budget is tight.', 'Make it pop.', 'Using bleeding edge tech.'
];

export function generateContract(playerCPS: number, playerLOC: number): Contract {
    const isEarlyGame = playerLOC < 5000;
    const baseDifficulty = isEarlyGame ? 100 : Math.max(500, playerCPS * 60); // At least 1 minute of work

    // Random Variance (0.5x to 3x)
    const multiplier = 0.5 + Math.random() * 2.5;
    const locRequired = Math.floor(baseDifficulty * multiplier);

    // Difficulty Rating
    let difficulty: Contract['difficulty'] = 'Easy';
    if (multiplier > 1.5) difficulty = 'Medium';
    if (multiplier > 2.2) difficulty = 'Hard';
    if (multiplier > 2.8) difficulty = 'Legendary';

    // Rarity System (affects rewards)
    let rarity: Contract['rarity'] = 'Common';
    const roll = Math.random();
    if (roll > 0.6) rarity = 'Uncommon';
    if (roll > 0.85) rarity = 'Rare';
    if (roll > 0.98) rarity = 'Mythic';

    // Reward Calculation
    let rewardMultiplier = 1.5; // Base 50% profit
    if (rarity === 'Uncommon') rewardMultiplier = 2.0;
    if (rarity === 'Rare') rewardMultiplier = 3.5;
    if (rarity === 'Mythic') rewardMultiplier = 10.0;

    const rewardLOC = Math.floor(locRequired * rewardMultiplier);

    // Shares reward for Mythic only
    const rewardShares = rarity === 'Mythic' ? Math.max(1, Math.floor(multiplier)) : undefined;

    // Random Content
    const client = CLIENTS[Math.floor(Math.random() * CLIENTS.length)];
    const task = TASKS[Math.floor(Math.random() * TASKS.length)];
    const desc = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];

    return {
        id: `contract_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: `${task} for ${client}`,
        description: `Client: ${client}. ${desc}`,
        locRequired,
        requirements: [], // For procedural, maybe skip building reqs to avoid soft-locking, or add simple ones later
        rewardLOC,
        rewardShares,
        difficulty,
        rarity
    };
}
