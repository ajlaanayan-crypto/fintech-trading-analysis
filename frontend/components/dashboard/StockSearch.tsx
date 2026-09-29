'use client';
import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { searchStocks } from '@/lib/api';
import Link from 'next/link';

// Debounce hook could be added here for optimization

export default function StockSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const handler = setTimeout(async () => {
            if (query.length > 2) {
                setLoading(true);
                try {
                    const data = await searchStocks(query).catch(() => []);
                    setResults(Array.isArray(data) ? data : []);
                } catch (e) {
                    console.error("Search failed", e);
                    setResults([]);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [query]);

    return (
        <div className="relative w-full max-w-md">
            <div className="relative">
                <input
                    type="text"
                    className="w-full pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                    placeholder="Search Indian stocks (e.g. Reliance, TCS)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>

            {(results.length > 0 || loading) && query.length > 2 && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-50 overflow-hidden">
                    {loading ? (
                        <div className="p-4 text-center text-gray-500">Searching...</div>
                    ) : (
                        <ul>
                            {results.map((stock: any) => (
                                <li key={stock.symbol}>
                                    <Link
                                        href={`/dashboard/stocks/${stock.symbol}`}
                                        className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex justify-between items-center"
                                    >
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-gray-100">{stock.symbol}</div>
                                            <div className="text-sm text-gray-500">{stock.name}</div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs text-gray-400 border border-gray-200 dark:border-gray-600 px-2 py-1 rounded">{stock.region}</span>
                                            <span className="text-[10px] text-gray-400 mt-1">{stock.type}</span>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
}
