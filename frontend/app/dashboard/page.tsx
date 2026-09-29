'use client';
import { useEffect, useState } from 'react';
import StockSearch from '@/components/dashboard/StockSearch';
import IndexTicker from '@/components/dashboard/IndexTicker';
import MarketMovers from '@/components/dashboard/MarketMovers';
import MarketLeaderboard from '@/components/dashboard/MarketLeaderboard';
import { motion } from 'framer-motion';
import { getTrendingStocks } from '@/lib/api';
import Link from 'next/link';
import { TrendingUp, ArrowRight } from 'lucide-react';

export default function Dashboard() {
    const [trending, setTrending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTrendingStocks()
            .then(data => {
                if (data && data.quotes) {
                    setTrending(data.quotes.slice(0, 8)); // Show top 8
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-x-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="max-w-7xl mx-auto space-y-8"
            >

                {/* Header */}
                <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Market Overview</h1>
                        <p className="text-gray-500 mt-1">Track live Indian indices and top movers.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <StockSearch />
                        <div className="flex items-center gap-2 bg-white dark:bg-gray-800 p-1.5 rounded-lg border border-gray-200 dark:border-gray-700">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-sm font-medium pr-1">Live</span>
                        </div>
                    </div>
                </motion.div>

                {/* Market Status Ticker */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <IndexTicker />
                </motion.div>

                {/* Top Gainers & Losers */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                >
                    <MarketMovers />
                </motion.div>

                {/* Market Leaders */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <MarketLeaderboard />
                </motion.div>

                {/* Trending Stocks */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            <TrendingUp className="h-6 w-6 text-blue-500" />
                            Trending Stocks
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {loading ? (
                            [1, 2, 3, 4].map(i => (
                                <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                            ))
                        ) : trending.length > 0 ? (
                            trending.map((stock) => (
                                <Link
                                    key={stock.symbol}
                                    href={`/dashboard/stocks/${stock.symbol}`}
                                    className="group bg-white dark:bg-gray-800 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-blue-500 hover:shadow-lg transition-all"
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="font-bold text-lg text-gray-900 dark:text-gray-100">{stock.symbol}</div>
                                        <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-all" />
                                    </div>
                                    <p className="text-sm text-gray-500 line-clamp-1">{stock.longName || stock.shortName || stock.symbol}</p>
                                </Link>
                            ))
                        ) : (
                            <div className="col-span-4 text-center text-gray-500 py-8">
                                No trending information available right now.
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
