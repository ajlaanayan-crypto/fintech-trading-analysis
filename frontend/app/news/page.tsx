'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getGeneralNews } from '@/lib/api';

export default function GlobalNewsPage() {
    const [news, setNews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getGeneralNews()
            .then((data) => setNews(data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 text-center"
                >
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Global Business News</h1>
                    <p className="text-gray-500 dark:text-gray-400">Latest financial headlines from around the world</p>
                </motion.div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-48 bg-gray-200 dark:bg-gray-800 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {news.map((item, idx) => (
                            <NewsCard key={item.uuid || idx} item={item} index={idx} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function NewsCard({ item, index }: { item: any; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
            className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-500/30 transition-all flex flex-col h-full cursor-pointer relative overflow-hidden"
            onClick={() => window.open(item.link, '_blank')}
        >
            {/* 3D Tilt Effect Highlight (simulated with CSS gradient on hover) */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

            <div className="flex justify-between items-start mb-4">
                <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs px-2 py-1 rounded-md font-medium">
                    {item.publisher || 'Yahoo Finance'}
                </span>
                <span className="text-xs text-gray-400">
                    {item.providerPublishTime ? new Date(item.providerPublishTime * 1000).toLocaleDateString() : 'Today'}
                </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-3 group-hover:text-blue-600 transition-colors">
                {item.title}
            </h3>

            <div className="mt-auto pt-4 flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all">
                Read Article →
            </div>
        </motion.div>
    );
}
