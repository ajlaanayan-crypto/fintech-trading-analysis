'use client';

import { useEffect, useState } from 'react';
import { getMarketLeaders } from '@/lib/api';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import Link from 'next/link';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function MarketLeaderboard() {
    const [leaders, setLeaders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getMarketLeaders()
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    setLeaders(data);
                } else {
                    setError('No market data available');
                }
            })
            .catch(err => {
                console.error("Failed to fetch leaders:", err);
                // Show the actual error message to help debugging
                setError(`Failed: ${err.message || 'Unknown error'}`);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="animate-pulse h-96 bg-gray-100 dark:bg-gray-800 rounded-2xl"></div>;
    if (error) return <div className="h-96 flex items-center justify-center text-red-500 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900">{error}</div>;

    // Ensure we have data before rendering chart
    if (!leaders || leaders.length === 0) return null;

    const chartData = {
        labels: leaders.map(l => l.symbol.split('.')[0]),
        datasets: [
            {
                data: leaders.map(l => l.marketCap),
                backgroundColor: [
                    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
                    '#ec4899', '#6366f1', '#14b8a6', '#f97316', '#64748b'
                ],
                borderWidth: 0,
                hoverOffset: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false, // We'll build a custom legend
            },
            tooltip: {
                callbacks: {
                    label: function (context: any) {
                        const value = context.raw;
                        const total = context.chart._metasets[context.datasetIndex].total;
                        const percentage = ((value / total) * 100).toFixed(1) + '%';
                        return ` Market Cap: ₹${(value / 10000000).toFixed(2)} Cr (${percentage})`;
                    }
                }
            }
        },
        onHover: (event: any, elements: any) => {
            if (elements.length > 0) {
                setHoveredIndex(elements[0].index);
            } else {
                setHoveredIndex(null);
            }
        }
    };

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Market Leaders</h3>
                    <p className="text-gray-500">Top 10 Indian Companies by Market Cap</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-12">
                {/* Chart */}
                <div className="w-full md:w-1/2 max-w-[300px] relative">
                    <Pie data={chartData} options={options} />
                    {/* Center Text overlay if needed, or simple clean look */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-center">
                        <span className="text-4xl font-bold text-gray-200 dark:text-gray-700 opacity-20">TOP 10</span>
                    </div>
                </div>

                {/* Custom Legend / List */}
                <div className="w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {leaders.map((stock, idx) => (
                        <Link href={`/dashboard/stocks/${stock.symbol}`} key={stock.symbol}>
                            <div
                                className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 border
                                    ${hoveredIndex === idx
                                        ? 'bg-gray-50 dark:bg-gray-800 border-blue-200 dark:border-blue-700 scale-105 shadow-md'
                                        : 'border-transparent hover:bg-gray-50 dark:hover:bg-gray-800'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: chartData.datasets[0].backgroundColor[idx] }}
                                    ></div>
                                    <div>
                                        <p className="font-semibold text-gray-900 dark:text-white">{stock.symbol.split('.')[0]}</p>
                                        <p className="text-xs text-gray-500 truncate max-w-[100px]">{stock.name}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                        {stock.marketCap ? `₹${(stock.marketCap / 10000000).toFixed(0)}Cr` : 'N/A'}
                                    </p>
                                    <p className={`text-xs font-semibold ${stock.percent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {stock.percent > 0 ? '+' : ''}{Number(stock.percent).toFixed(2)}%
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
