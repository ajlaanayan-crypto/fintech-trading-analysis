'use client';

import { useEffect, useState } from 'react';
import { getMovers } from '@/lib/api';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown, Sparkles, RefreshCw } from 'lucide-react';

export default function MarketMovers() {
    const [gainers, setGainers] = useState<any[]>([]);
    const [losers, setLosers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovers = () => {
            getMovers()
                .then(data => {
                    setGainers(data.gainers || []);
                    setLosers(data.losers || []);
                })
                .catch(err => console.error("Failed to load movers", err))
                .finally(() => setLoading(false));
        };

        // Initial fetch
        fetchMovers();

        // Poll every 10 seconds
        const interval = setInterval(fetchMovers, 10000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return <div className="animate-pulse h-64 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Top Gainers */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                        <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Top Gainers</h3>
                    <div className="ml-auto flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full animate-pulse">
                        <RefreshCw className="h-3 w-3" />
                        Live
                    </div>
                </div>

                <div className="space-y-4">
                    {gainers.slice(0, 5).map((stock, idx) => (
                        <div key={stock.symbol} className="group">
                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <Link href={`/dashboard/stocks/${stock.symbol}`} className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{stock.symbol.split('.')[0]}</p>
                                            <p className="text-sm text-gray-500 truncate max-w-[150px]">{stock.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900 dark:text-white">₹{Number(stock.price).toFixed(2)}</p>
                                            <p className="text-sm font-medium text-green-600 flex items-center justify-end gap-1">
                                                +{Number(stock.percent).toFixed(2)}%
                                                <ArrowUpRight className="h-3 w-3" />
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            {/* Display AI Reason for the top item if available */}
                            {idx === 0 && stock.reason && (
                                <div className="mx-3 mt-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 text-sm text-gray-700 dark:text-gray-300">
                                    <div className="flex items-start gap-2">
                                        <Sparkles className="h-4 w-4 text-blue-500 mt-0.5" />
                                        <p><span className="font-medium text-blue-700 dark:text-blue-400">AI Insight:</span> {stock.reason}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Losers */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                        <TrendingDown className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Top Losers</h3>
                </div>

                <div className="space-y-4">
                    {losers.slice(0, 5).map((stock, idx) => (
                        <div key={stock.symbol} className="group">
                            <div className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                                <Link href={`/dashboard/stocks/${stock.symbol}`} className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">{stock.symbol.split('.')[0]}</p>
                                            <p className="text-sm text-gray-500 truncate max-w-[150px]">{stock.name}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-gray-900 dark:text-white">₹{Number(stock.price).toFixed(2)}</p>
                                            <p className="text-sm font-medium text-red-600 flex items-center justify-end gap-1">
                                                {Number(stock.percent).toFixed(2)}%
                                                <ArrowDownRight className="h-3 w-3" />
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            {/* Display AI Reason for the top item if available */}
                            {idx === 0 && stock.reason && (
                                <div className="mx-3 mt-2 mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800 text-sm text-gray-700 dark:text-gray-300">
                                    <div className="flex items-start gap-2">
                                        <Sparkles className="h-4 w-4 text-red-500 mt-0.5" />
                                        <p><span className="font-medium text-red-700 dark:text-red-400">AI Insight:</span> {stock.reason}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
