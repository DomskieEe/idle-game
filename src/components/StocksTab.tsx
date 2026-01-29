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
                    <h2 className="text-lg font-black text-white uppercase tracking-tight">NASDAQ</h2>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Neural Automated Stock Data</p>
                </div>
                <div className="ml-auto flex items-center gap-2 bg-black/40 px-4 py-2 rounded-xl border border-white/5">
                    <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Funds:</span>
                    <span className="text-sm font-mono font-bold text-accent-cyan flex items-center gap-1">
                        <DollarSign size={14} />
                        {Math.floor(shares).toLocaleString()}
                    </span>
                </div>
            </div>

            <div className="glass-panel overflow-hidden border-white/5 bg-black/20 rounded-xl">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 p-3 border-b border-white/5 bg-white/5 text-[9px] font-black uppercase tracking-widest text-text-muted">
                    <div className="col-span-4 lg:col-span-3">Company</div>
                    <div className="col-span-3 lg:col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-right hidden lg:block">Change</div>
                    <div className="col-span-2 text-right">Owned</div>
                    <div className="col-span-3 lg:col-span-5 text-right pr-2">Actions</div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-white/5">
                    {STOCKS.map(stock => {
                        const currentPrice = stockPrices[stock.id] || stock.basePrice;
                        const change = ((currentPrice - stock.basePrice) / stock.basePrice) * 100;
                        const isPositive = change >= 0;
                        const owned = ownedStocks[stock.id] || 0;

                        return (
                            <motion.div
                                key={stock.id}
                                className="grid grid-cols-12 gap-2 p-3 items-center hover:bg-white/5 transition-colors group"
                            >
                                {/* Company Info */}
                                <div className="col-span-4 lg:col-span-3 flex items-center gap-3">
                                    <div className={clsx("w-8 h-8 rounded-lg flex items-center justify-center font-black text-[10px]",
                                        isPositive ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                    )}>
                                        {stock.symbol}
                                    </div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-xs font-bold text-white truncate">{stock.name}</h3>
                                        <p className="text-[9px] text-text-muted truncate hidden sm:block">{stock.desc}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div className="col-span-3 lg:col-span-2 text-right font-mono text-xs font-bold text-white">
                                    {currentPrice.toFixed(2)}
                                    <div className={clsx("text-[9px] lg:hidden", isPositive ? "text-green-500" : "text-red-500")}>
                                        {isPositive ? '+' : ''}{change.toFixed(1)}%
                                    </div>
                                </div>

                                {/* Change (Desktop) */}
                                <div className={clsx("col-span-2 text-right font-mono text-xs hidden lg:block", isPositive ? "text-green-500" : "text-red-500")}>
                                    {isPositive ? '+' : ''}{change.toFixed(1)}%
                                </div>

                                {/* Owned */}
                                <div className="col-span-2 text-right font-mono text-xs text-text-muted">
                                    {owned > 0 ? (
                                        <span className="text-white font-bold">{owned.toLocaleString()}</span>
                                    ) : (
                                        "-"
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="col-span-3 lg:col-span-5 flex justify-end gap-1.5">
                                    <button
                                        onClick={() => buyStock(stock.id, 1)}
                                        disabled={shares < currentPrice}
                                        className="h-7 px-2 lg:px-3 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 rounded text-[9px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        title={`Buy 1 for ${currentPrice.toFixed(0)}`}
                                    >
                                        Buy
                                    </button>
                                    <button
                                        onClick={() => buyStock(stock.id, 10)}
                                        disabled={shares < currentPrice * 10}
                                        className="h-7 px-2 lg:px-3 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 rounded text-[9px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all hidden sm:block"
                                        title={`Buy 10 for ${(currentPrice * 10).toFixed(0)}`}
                                    >
                                        Buy 10
                                    </button>

                                    <div className="w-px h-4 bg-white/10 mx-1 self-center" />

                                    <button
                                        onClick={() => sellStock(stock.id, owned)}
                                        disabled={owned < 1}
                                        className="h-7 px-2 lg:px-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded text-[9px] font-black uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    >
                                        Sell All
                                    </button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
