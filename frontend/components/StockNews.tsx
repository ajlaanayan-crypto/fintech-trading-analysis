'use client';

import { useEffect, useState } from 'react';
import { getStockNews, analyzeStockNews } from '@/lib/api';
import { ExternalLink, Sparkles, Newspaper, TrendingUp, TrendingDown, Minus, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

interface NewsItem {
    uuid: string;
    title: string;
    publisher: string;
    link: string;
    providerPublishTime: number; // Unix timestamp
    thumbnail?: {
        resolutions: { url: string }[];
    };
}

export default function StockNews({ symbol }: { symbol: string }) {
    const [news, setNews] = useState<NewsItem[]>([]);
    const [analysis, setAnalysis] = useState<{ summary: string, sentiment: string } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (symbol) {
            setLoading(true);

            // Fetch News
            getStockNews(symbol)
                .then(data => {
                    setNews(data || []);
                    // Fetch Analysis only if we have news
                    if (data && data.length > 0) {
                        analyzeStockNews(symbol).then(setAnalysis).catch(console.error);
                    }
                })
                .catch(console.error)
                .finally(() => setLoading(false));
        }
    }, [symbol]);

    if (loading) return <div className="animate-pulse space-y-4">
        {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-xl"></div>)}
    </div>;

    if (news.length === 0) return (
        <div className="text-center py-8 text-gray-500">
            <Newspaper className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No recent news found for {symbol}</p>
        </div>
    );

    return (
        <div className="space-y-6 perspective-1000">

            {/* AI Insight Card with 3D effect */}
            {analysis && (
                <motion.div
                    initial={{ opacity: 0, y: 20, rotateX: -10 }}
                    animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    whileHover={{ scale: 1.02, rotateX: 2, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800 shadow-sm relative overflow-hidden group transform-gpu"
                >
                    <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
                        <Sparkles className="h-24 w-24 text-blue-600" />
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-lg">
                            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                        </div>
                        <h3 className="font-bold text-blue-900 dark:text-blue-100">AI Market Insight</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold uppercase ${analysis.sentiment === 'Bullish' ? 'bg-green-100 text-green-700' :
                                analysis.sentiment === 'Bearish' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                            }`}>
                            {analysis.sentiment}
                        </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed relative z-10">
                        {analysis.summary}
                    </p>
                </motion.div>
            )}

            {/* News List */}
            <div className="space-y-4">
                {news.map((item, idx) => (
                    <motion.a
                        key={item.uuid}
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02, x: 5, backgroundColor: "var(--bg-hover)" }}
                        className="block bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 rounded-xl hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all group"
                        style={{ '--bg-hover': 'rgba(59, 130, 246, 0.05)' } as any}
                    >
                        <div className="flex justify-between items-start gap-3">
                            {item.thumbnail?.resolutions?.[0]?.url && (
                                <img
                                    src={item.thumbnail.resolutions[0].url}
                                    alt=""
                                    className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                    <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-1.5 py-0.5 rounded">
                                        {item.publisher}
                                    </span>
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        • <Calendar className="h-3 w-3" />
                                        {new Date(item.providerPublishTime * 1000).toLocaleDateString()}
                                    </span>
                                </div>
                                <h4 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {item.title}
                                </h4>
                            </div>
                            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1" />
                        </div>
                    </motion.a>
                ))}
            </div>
        </div>
    );
}
