import { STOCKS } from '../data/stocks'; // Make sure this path is correct based on where you put stocks.ts
import { useGameStore } from '../store/useGameStore';
import { clsx } from 'clsx';
import { DollarSign, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export function StocksTab() {
    const { shares, stockPrices, ownedStocks, buyStock, sellStock } = useGameStore();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 border border-blue-500/20 shadow-glow-primary">
                    <Activity size={20} />
                </div>
                <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">NASDAQ (Neural Automated Stock Data)</h2>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Trade shares for profit</p>
                </div>
                <div className="ml-auto flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                    <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Portfolio Funds:</span>
                    <span className="text-sm font-mono font-bold text-accent-cyan flex items-center gap-1">
                        <DollarSign size={14} />
                        {Math.floor(shares).toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {STOCKS.map(stock => {
                    const currentPrice = stockPrices[stock.id] || stock.basePrice;
                    const change = ((currentPrice - stock.basePrice) / stock.basePrice) * 100;
                    const isPositive = change >= 0;
                    const owned = ownedStocks[stock.id] || 0;

                    return (
                        <motion.div
                            key={stock.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card p-4 rounded-xl flex items-center justify-between border border-white/5 hover:border-white/10 transition-colors"
                        >
                            <div className="flex items-center gap-4 w-1/3">
                                <div className={clsx("w-10 h-10 rounded-lg flex items-center justify-center font-black text-xs",
                                    isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                )}>
                                    {stock.symbol}
                                </div>
                                <div>
                                    <h3 className="text-sm font-bold text-white">{stock.name}</h3>
                                    <p className="text-[10px] text-text-muted">{stock.desc}</p>
                                </div>
                            </div>

                            <div className="flex-1 flex justify-center gap-8">
                                <div className="text-center">
                                    <div className="text-[9px] text-text-muted uppercase tracking-wider mb-1">Price</div>
                                    <div className="text-sm font-mono font-bold text-white flex items-center gap-1">
                                        {currentPrice.toFixed(2)}
                                        <span className={clsx("text-[10px]", isPositive ? "text-green-500" : "text-red-500")}>
                                            ({isPositive ? '+' : ''}{change.toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <div className="text-[9px] text-text-muted uppercase tracking-wider mb-1">Owned</div>
                                    <div className="text-sm font-mono font-bold text-white">
                                        {owned.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-1/3 justify-end">
                                <button
                                    onClick={() => buyStock(stock.id, 1)}
                                    disabled={shares < currentPrice}
                                    className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 rounded-lg text-[10px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Buy
                                </button>
                                <button
                                    onClick={() => buyStock(stock.id, 10)}
                                    disabled={shares < currentPrice * 10}
                                    className="px-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 rounded-lg text-[10px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Buy 10
                                </button>
                                <div className="w-px h-8 bg-white/10 mx-2" />
                                <button
                                    onClick={() => sellStock(stock.id, 1)}
                                    disabled={owned < 1}
                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-[10px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Sell
                                </button>
                                <button
                                    onClick={() => sellStock(stock.id, owned)}
                                    disabled={owned < 1}
                                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg text-[10px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    Sell All
                                </button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
