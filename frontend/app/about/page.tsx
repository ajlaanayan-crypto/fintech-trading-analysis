'use client';
import { Target, Users, Globe } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

            {/* Hero Section */}
            <section className="bg-white dark:bg-black py-20 px-4 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">Who We Are</h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
                        We are a team of traders, engineers, and data scientists dedicated to democratizing
                        financial information. Our mission is to provide institutional-grade analytics to every retail investor.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12">
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Target className="h-8 w-8 text-blue-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Our Mission</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            To empower 100 million retail investors with data-driven insights and AI tools.
                        </p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Globe className="h-8 w-8 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Global Reach</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Coverage of NSE, BSE, NYSE, and NASDAQ. One platform for the world.
                        </p>
                    </div>
                    <div className="text-center p-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Users className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold mb-4">Community</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            Join a community of like-minded investors sharing strategies and news.
                        </p>
                    </div>
                </div>
            </section>

            {/* Team Section Placeholder */}
            <section className="bg-white dark:bg-gray-800/50 py-20 px-4">
                <div className="max-w-5xl mx-auto text-center">
                    <h2 className="text-3xl font-bold mb-12">Built by Traders, for Traders</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Team Members */}
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl">
                                <div className="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
                                <h4 className="font-bold">Team Member {i + 1}</h4>
                                <p className="text-sm text-gray-500">Co-Founder</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

        </div>
    );
}
