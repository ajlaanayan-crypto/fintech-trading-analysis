'use client';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    TimeSeriesScale
} from 'chart.js';
import { Line, Bar, Chart } from 'react-chartjs-2';
import { useMemo, useState } from 'react';
import 'chartjs-adapter-date-fns';
import { enUS } from 'date-fns/locale';
import { CandlestickController, CandlestickElement, OhlcController, OhlcElement } from 'chartjs-chart-financial';
import { motion } from 'framer-motion';

ChartJS.register(
    CategoryScale,
    LinearScale,
    TimeScale,
    TimeSeriesScale,
    PointElement,
    LineElement,
    BarElement,
    CandlestickController,
    CandlestickElement,
    OhlcController,
    OhlcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

// Add range prop
interface StockChartProps {
    history: any;
    symbol: string;
    range: string;
}

export default function StockChart({ history, symbol, range }: StockChartProps) {

    const [chartType, setChartType] = useState<'line' | 'area' | 'candle' | 'bar'>('area');

    const chartData = useMemo(() => {
        if (!history || !history.quotes || !Array.isArray(history.quotes) || history.quotes.length === 0) {
            return null;
        }

        const quotes = history.quotes;
        const color = quotes[quotes.length - 1].close >= quotes[0].close ? 'rgb(19, 115, 51)' : 'rgb(165, 14, 14)';
        const bgColor = quotes[quotes.length - 1].close >= quotes[0].close ? 'rgba(19, 115, 51, 0.1)' : 'rgba(165, 14, 14, 0.1)';

        if (chartType === 'candle' || chartType === 'bar') {
            return {
                datasets: [{
                    label: symbol,
                    data: quotes.map((q: any) => ({
                        x: new Date(q.date).valueOf(), // Time scale requires timestamp or date string
                        o: q.open,
                        h: q.high,
                        l: q.low,
                        c: q.close
                    })),
                    color: {
                        up: 'rgb(19, 115, 51)',
                        down: 'rgb(165, 14, 14)',
                        unchanged: '#999',
                    },
                    borderColor: {
                        up: 'rgb(19, 115, 51)',
                        down: 'rgb(165, 14, 14)',
                        unchanged: '#999',
                    },
                    borderWidth: 1 // Thinner border for candles
                }]
            };
        }

        // Line and Area
        const labels = quotes.map((q: any) => {
            const date = new Date(q.date);
            if (['1D', '5D'].includes(range)) {
                return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
        });

        return {
            labels,
            datasets: [{
                label: `${symbol} Price`,
                data: quotes.map((q: any) => q.close),
                borderColor: color,
                backgroundColor: bgColor,
                borderWidth: 2,
                tension: 0.1,
                fill: chartType === 'area',
                pointRadius: 0,
                pointHoverRadius: 6,
                pointHoverBackgroundColor: color,
            }],
        };
    }, [history, symbol, range, chartType]);

    const options: any = {
        responsive: true,
        maintainAspectRatio: false,
        aspectRatio: 2, // Enforce wider ratio if aspect ratio is maintained
        plugins: {
            legend: { display: false },
            tooltip: {
                mode: 'index',
                intersect: false,
                callbacks: {
                    label: (context: any) => {
                        if (chartType === 'candle' || chartType === 'bar') {
                            const v = context.raw;
                            return `O: ${v.o} H: ${v.h} L: ${v.l} C: ${v.c}`;
                        }
                        return `${context.dataset.label}: ${context.formattedValue}`;
                    }
                }
            },
        },
        scales: {
            x: {
                // Optimize spacing for bars/candles
                barPercentage: 0.8,
                categoryPercentage: 0.9,
                display: true,
                type: (chartType === 'candle' || chartType === 'bar') ? 'time' : 'category',
                time: {
                    unit: ['1D', '5D'].includes(range) ? 'hour' : 'day',
                    displayFormats: {
                        hour: 'HH:mm',
                        day: 'MMM dd'
                    },
                    tooltipFormat: 'MMM dd HH:mm'
                },
                grid: { display: false },
                ticks: {
                    maxTicksLimit: 8,
                    color: '#9ca3af'
                }
            },
            y: {
                grid: { color: 'rgba(200, 200, 200, 0.1)' },
                ticks: { color: '#9ca3af' }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    if (!chartData) {
        return <div className="h-full flex items-center justify-center text-gray-400">Loading Chart...</div>;
    }

    // Helper to render correct chart component
    const renderChart = () => {
        if (chartType === 'candle') {
            // @ts-ignore - Types for financial charts might be missing
            return <Chart type="candlestick" data={chartData} options={options} />;
        }
        if (chartType === 'bar') {
            // @ts-ignore
            return <Chart type="ohlc" data={chartData} options={options} />;
        }
        return <Line data={chartData} options={options} />;
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col h-full"
        >
            {/* Chart Controls */}
            <div className="flex justify-end mb-2 gap-1">
                {(['line', 'area', 'candle', 'bar'] as const).map((type) => (
                    <button
                        key={type}
                        onClick={() => setChartType(type)}
                        className={`text-xs px-3 py-1 rounded-md font-medium transition-colors
                            ${chartType === type
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            <div className="flex-1 min-h-0">
                {renderChart()}
            </div>
        </motion.div>
    );
}
