'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getStockQuote, getStockHistory } from '@/lib/api';
import StockChart from '@/components/StockChart';
import StockNews from '@/components/StockNews';
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function StockDetailPage() {
    const params = useParams();
    const rawSymbol = params?.symbol;
    const stockSymbol = Array.isArray(rawSymbol) ? rawSymbol[0] : rawSymbol;

    // Yahoo symbols often need decoding if passed as URL param
    const symbol = stockSymbol ? decodeURIComponent(stockSymbol) : '';

    const [quote, setQuote] = useState<any>(null);
    const [history, setHistory] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [range, setRange] = useState('1M');

    useEffect(() => {
        if (symbol) {
            if (!quote) setLoading(true);

            const fetchQuote = getStockQuote(symbol);
            const fetchHistory = getStockHistory(symbol, range);

            Promise.all([fetchQuote, fetchHistory])
                .then(([quoteData, historyData]) => {
                    setQuote(quoteData);
                    setHistory(historyData);
                })
                .catch(err => {
                    console.error("Failed to load stock data", err);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [symbol, range]);

    if (loading && !quote) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (!quote) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Stock not found</h2>
            <Link href="/dashboard" className="mt-4 text-blue-500 hover:underline">Return to Dashboard</Link>
        </div>
    );

    const isPositive = quote.regularMarketChange >= 0;
    const priceColor = isPositive ? 'text-green-600' : 'text-red-600';

    // Use market time if available, or current time fallback but labeled correctly
    const marketTime = quote.regularMarketTime ? new Date(quote.regularMarketTime) : new Date();

    // Helper to determine status label
    const getStatusLabel = () => {
        if (quote.marketState === 'CLOSED') {
            const date = new Date(quote.regularMarketTime);
            return `Market Closed`;
        }
        if (quote.exchangeDataDelayedBy > 0) {
            return `Data delayed ${quote.exchangeDataDelayedBy}m`;
        }
        return 'Real-time Data';
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Back Button */}
                <Link href="/dashboard" className="inline-flex items-center text-gray-500 hover:text-blue-600 transition-colors">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Dashboard
                </Link>

                {/* Main Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Chart and Stats (2/3 width) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header Section */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-2">
                            <div>
                                <div className="flex items-center gap-3 text-sm font-medium text-gray-500 mb-2">
                                    <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs tracking-wider">{quote.fullExchangeName === 'NSE' ? 'NSE' : 'BSE'}</span>
                                    <span>•</span>
                                    <span>{symbol?.split('.')[0]}</span>
                                </div>
                                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white tracking-tight leading-tight">
                                    {quote.longName || quote.shortName || symbol}
                                </h1>
                            </div>
                            <button className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all transform hover:scale-105 font-medium text-sm">
                                <span className="text-xl leading-none">+</span> Follow
                            </button>
                        </div>

                        {/* Price Section */}
                        <div className="bg-white dark:bg-gray-900/50 backdrop-blur-sm p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                            <div className="flex items-baseline gap-3">
                                <span className="text-6xl font-bold text-gray-900 dark:text-white tracking-tighter">
                                    {Number(quote.regularMarketPrice).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-xl text-gray-500 font-medium">INR</span>
                            </div>
                            <div className={`flex items-center gap-4 mt-2 ${priceColor}`}>
                                <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${isPositive ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                                    {isPositive ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                                    <span className="text-xl font-bold tracking-tight">
                                        {quote.regularMarketChange > 0 ? '+' : ''}{Number(quote.regularMarketChange).toFixed(2)}
                                    </span>
                                    <span className="text-xl font-bold tracking-tight">
                                        ({Number(quote.regularMarketChangePercent).toFixed(2)}%)
                                    </span>
                                </div>
                                <span className="text-sm text-gray-500 font-medium ml-2">
                                    Today
                                </span>
                            </div>
                            <p className="text-xs text-gray-400 mt-4 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                                {marketTime.toLocaleString()} IST • {getStatusLabel()}
                            </p>
                        </div>

                        {/* Chart Section - Increased Height */}
                        <div className="bg-white dark:bg-black rounded-3xl border border-gray-100 dark:border-gray-800 p-1 shadow-2xl shadow-gray-200/50 dark:shadow-black/50 overflow-hidden relative group">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
                            <div className="p-6 relative z-10">
                                {/* Time Range Tabs */}
                                <div className="flex gap-2 border-b border-gray-100 dark:border-gray-800 mb-6 overflow-x-auto no-scrollbar pb-2">
                                    {['1D', '5D', '1M', '6M', 'YTD', '1Y', '5Y', 'Max'].map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setRange(r)}
                                            className={`px-4 py-2 text-sm font-semibold rounded-xl transition-all relative ${range === r
                                                ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                                                : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>
                                <div className="h-[400px] w-full flex items-center justify-center">
                                    {history ? <StockChart history={history} symbol={symbol || ''} range={range} /> : <div className="text-gray-400 animate-pulse">Loading Chart...</div>}
                                </div>
                            </div>
                        </div>

                        {/* Key Statistics Grid */}
                        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-8 shadow-sm">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-2">
                                <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
                                Key Statistics
                            </h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-12">
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Open</p>
                                    <p className="font-medium text-gray-900 dark:text-white text-2xl tracking-tight">{quote.regularMarketOpen?.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">High</p>
                                    <p className="font-medium text-gray-900 dark:text-white text-2xl tracking-tight">{quote.regularMarketDayHigh?.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Low</p>
                                    <p className="font-medium text-gray-900 dark:text-white text-2xl tracking-tight">{quote.regularMarketDayLow?.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Mkt cap</p>
                                    <p className="font-medium text-gray-900 dark:text-white text-2xl tracking-tight">
                                        {quote.marketCap ? (quote.marketCap / 10000000).toFixed(2) + 'Cr' : '-'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">P/E ratio</p>
                                    <p className="font-medium text-gray-900 dark:text-white text-2xl tracking-tight">{quote.trailingPE?.toFixed(2) || '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Div yield</p>
                                    <p className="font-medium text-gray-900 dark:text-white text-2xl tracking-tight">{quote.dividendYield ? (quote.dividendYield).toFixed(2) + '%' : '-'}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">52-wk high</p>
                                    <p className="font-medium text-gray-900 dark:text-white text-2xl tracking-tight">{quote.fiftyTwoWeekHigh?.toLocaleString('en-IN')}</p>
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">52-wk low</p>
                                    <p className="font-medium text-gray-900 dark:text-white text-2xl tracking-tight">{quote.fiftyTwoWeekLow?.toLocaleString('en-IN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: News & AI (1/3 width) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="sticky top-24">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 px-1">
                                <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
                                Latest News & AI Analysis
                            </h3>
                            <div className="max-h-[calc(100vh-120px)] overflow-y-auto pr-2 custom-scrollbar space-y-4">
                                <StockNews symbol={symbol || ''} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
