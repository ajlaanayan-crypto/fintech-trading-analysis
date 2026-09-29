'use client';
import { Check } from 'lucide-react';
import Link from 'next/link';

export default function PricingPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-20 px-4">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                    Simple, Transparent Pricing
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Choose the plan that best fits your trading needs. No hidden fees.
                </p>
            </div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

                {/* Free Plan */}
                <div className="bg-white dark:bg-black p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-blue-500 transition-all">
                    <h2 className="text-2xl font-bold mb-2">Basic</h2>
                    <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-extrabold">Free</span>
                        <span className="text-gray-500 ml-2">/forever</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Essential tools for casual investors.</p>
                    <ul className="space-y-4 mb-8 text-left">
                        <FeatureItem text="Real-time NSE/BSE Quotes (15m delay)" />
                        <FeatureItem text="Basic Stock Charts (1D, 5D)" />
                        <FeatureItem text="Daily Market News" />
                        <FeatureItem text="Watchlist (Up to 5 stocks)" />
                    </ul>
                    <Link href="/dashboard" className="block w-full text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors">
                        Get Started
                    </Link>
                </div>

                {/* Pro Plan */}
                <div className="relative bg-white dark:bg-black p-8 rounded-2xl border-2 border-blue-600 shadow-xl transform scale-105 z-10">
                    <div className="absolute top-0 center-0 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-bold">
                        Most Popular
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Pro</h2>
                    <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-extrabold">₹499</span>
                        <span className="text-gray-500 ml-2">/month</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">Advanced tools for active traders.</p>
                    <ul className="space-y-4 mb-8 text-left">
                        <FeatureItem text="Real-time Live Data (No delay)" />
                        <FeatureItem text="Advanced Charts (TradingView Style)" />
                        <FeatureItem text="Unlimited Watchlists" />
                        <FeatureItem text="AI Chatbot Insights" />
                        <FeatureItem text="Email Alerts" />
                    </ul>
                    <button className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors">
                        Start Free Trial
                    </button>
                </div>

                {/* Enterprise Plan */}
                <div className="bg-white dark:bg-black p-8 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm hover:border-purple-500 transition-all">
                    <h2 className="text-2xl font-bold mb-2">Elite</h2>
                    <div className="flex items-baseline mb-6">
                        <span className="text-4xl font-extrabold">₹999</span>
                        <span className="text-gray-500 ml-2">/month</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">For professional analysis.</p>
                    <ul className="space-y-4 mb-8 text-left">
                        <FeatureItem text="Everything in Pro" />
                        <FeatureItem text="Multi-screen Layouts" />
                        <FeatureItem text="API Access" />
                        <FeatureItem text="Priority Support" />
                        <FeatureItem text="Algorithmic Trading Tools" />
                    </ul>
                    <button className="block w-full text-center bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-semibold py-3 rounded-lg transition-colors">
                        Contact Sales
                    </button>
                </div>
            </div>
        </div>
    );
}

function FeatureItem({ text }: { text: string }) {
    return (
        <li className="flex items-center text-gray-600 dark:text-gray-300">
            <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
            <span>{text}</span>
        </li>
    );
}
