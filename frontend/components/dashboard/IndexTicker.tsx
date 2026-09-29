'use client';
import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { getMarketStatus } from '@/lib/api';

export default function IndexTicker() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // Fetch initial
        getMarketStatus().then(setData).catch(console.error);

        // Poll every 5 seconds
        const interval = setInterval(() => {
            getMarketStatus().then(setData).catch(console.error);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    if (!data) return (
        <div className="flex gap-4 animate-pulse">
            <div className="h-12 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
            <div className="h-12 w-32 bg-gray-200 dark:bg-gray-800 rounded-lg"></div>
        </div>
    );

    const renderTicker = (name: string, info: any) => {
        const isPositive = info.change >= 0;
        return (
            <div className={`
                flex items-center space-x-4 px-6 py-2 rounded-full border shadow-sm transition-all transform hover:scale-110 cursor-pointer
                ${isPositive
                    ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)]'
                    : 'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)]'}
            `}>
                <div className="flex flex-col">
                    <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">{name}</span>
                    <div className="flex items-baseline space-x-2">
                        <span className={`text-lg font-bold font-mono tracking-tight ${isPositive ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                            {info.price.toLocaleString('en-IN')}
                        </span>
                        <div className={`flex items-center text-xs font-bold ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            {isPositive ? <TrendingUp className="h-3 w-3 mr-0.5" /> : <TrendingDown className="h-3 w-3 mr-0.5" />}
                            {info.percent}%
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="w-full overflow-hidden bg-white/80 dark:bg-black/80 backdrop-blur-md border-y border-gray-200 dark:border-gray-800 py-3 relative group">
            {/* Gradient Masks */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white dark:from-black to-transparent z-10 pointer-events-none" />

            <div className="flex animate-marquee hover:pause-animation items-center space-x-8 whitespace-nowrap">
                {/* Duplicate content for seamless loop */}
                {[...Array(20)].map((_, i) => (
                    <div key={i} className="contents">
                        {data.nifty && renderTicker('NIFTY 50', data.nifty)}
                        {data.sensex && renderTicker('SENSEX', data.sensex)}
                        {/* Mock Global Indices for filler */}
                        <div className="flex items-center space-x-3 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default">
                            <span className="text-sm font-bold text-gray-500">S&P 500</span>
                            <span className="font-mono text-gray-700 dark:text-gray-300">4,785.20</span>
                            <span className="text-green-500 text-xs">+0.5%</span>
                        </div>
                        <div className="flex items-center space-x-3 opacity-60 grayscale hover:grayscale-0 transition-all cursor-default">
                            <span className="text-sm font-bold text-gray-500">NASDAQ</span>
                            <span className="font-mono text-gray-700 dark:text-gray-300">15,055.65</span>
                            <span className="text-red-500 text-xs">-0.1%</span>
                        </div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .hover\\:pause-animation:hover {
                    animation-play-state: paused;
                }
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
            `}</style>
        </div>
    );
}
