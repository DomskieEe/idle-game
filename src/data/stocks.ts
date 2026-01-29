export type Stock = {
    id: string;
    symbol: string;
    name: string;
    basePrice: number;
    volatility: number; // 0 to 1, higher means wilder swings
    desc: string;
};

export const STOCKS: Stock[] = [
    { id: 'microhard', symbol: 'MHD', name: 'Microhard', basePrice: 100, volatility: 0.1, desc: 'Reliable, steady growth.' },
    { id: 'jungle', symbol: 'JGL', name: 'Jungle', basePrice: 250, volatility: 0.2, desc: 'E-commerce giant.' },
    { id: 'pear', symbol: 'PAR', name: 'Pear', basePrice: 500, volatility: 0.3, desc: 'Premium tech, volatile releases.' },
    { id: 'faceblock', symbol: 'FBK', name: 'Faceblock', basePrice: 50, volatility: 0.6, desc: 'Social media rollercoaster.' },
    { id: 'cryptocoin', symbol: 'DOG', name: 'DogeDev', basePrice: 10, volatility: 0.9, desc: 'To the moon? Or zero.' }
];
