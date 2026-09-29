'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, BarChart2, Zap, Shield, TrendingUp, Globe, Activity } from 'lucide-react';
import Hero3D from '@/components/Hero3D';
import IndexTicker from '@/components/dashboard/IndexTicker';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function Home() {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaEffect && myRef.current) {
      // Load Three.js and Vanta dynamically to avoid SSR issues
      import('three').then(THREE => {
        // @ts-ignore
        window.THREE = THREE; // Vanta expects THREE on window
        import('vanta/dist/vanta.net.min').then(VANTA => {
          setVantaEffect(VANTA.default({
            el: myRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: 0x3b82f6, // Blue
            backgroundColor: 0xffffff, // White
            points: 12.00,
            maxDistance: 22.00,
            spacing: 16.00
          }));
        });
      });
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  // Handle Dark mode background color change if needed, 
  // currently Vanta doesn't support live update of backgroundColor easily without destroy/recreate.
  // We will stick to a neutral transparent look or handle theme change.
  // For now, let's make it work on light/dark by using a very light gray or adaptive 0x000000 for dark mode check.

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-[#0a0a0a] overflow-x-hidden">

      {/* Hero Section with Vanta Background */}
      <section className="relative w-full pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden" ref={myRef}>
        {/* We remove static gradients to let Vanta shine, or keep them subtle */}
        <div className="absolute inset-0 bg-white/50 dark:bg-black/80 z-0 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">

          {/* Text Content */}
          <motion.div
            className="text-center lg:text-left"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50/80 dark:bg-blue-900/40 backdrop-blur-sm text-blue-600 dark:text-blue-400 font-medium text-sm mb-6 border border-blue-100 dark:border-blue-800">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Live Indian Market Data
            </motion.div>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 dark:text-white mb-6 leading-tight">
              Invest in the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
                Future of Finance
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
              Experience the next generation of market analysis. Real-time NSE/BSE data,
              interactive 3D visualizations, and AI-powered insights at your fingertips.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link href="/dashboard" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-blue-600 px-8 font-medium text-white transition-all duration-300 hover:bg-blue-700 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25 z-20">
                <span className="mr-2">Get Started</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="#features" className="group inline-flex h-12 items-center justify-center rounded-md border border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm px-8 font-medium text-gray-900 dark:text-white transition-all hover:bg-white dark:hover:bg-gray-900 z-20">
                Explore Features
              </Link>
            </motion.div>
          </motion.div>

          {/* 3D Visual - Keeping Hero3D for the globe effect on top of Vanta if desired, or replacing it. 
              The user wants Vanta, we can keep the Globe as a centerpiece or remove it. 
              Let's keep it as it complements the tech feel. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative h-[400px] md:h-[500px] w-full"
          >
            <Hero3D />
            {/* Floating Cards (Decorative) */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute top-10 right-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 z-20 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">NIFTY 50</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">+1.24%</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-20 left-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-4 rounded-xl shadow-xl border border-white/20 z-20 hidden md:block"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">Market Activity</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">High Volatility</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Live Ticker Strip */}
      <div className="w-full border-y border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/50 backdrop-blur-sm">
        <IndexTicker />
      </div>

      {/* Features Section */}
      <section id="features" className="w-full py-24 px-4 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
              Powerful Tools for Modern Traders
            </h2>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Everything you need to analyze, track, and trade the markets with confidence.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<BarChart2 className="h-8 w-8 text-blue-500" />}
              title="Advanced Charts"
              description="Professional-grade technical indicators, interactive drawing tools, and multi-timeframe analysis."
              delay={0}
            />
            <FeatureCard
              icon={<Zap className="h-8 w-8 text-yellow-500" />}
              title="Real-Time Data"
              description="Lightning fast updates for NSE & BSE stocks. Never miss a market movement again."
              delay={0.2}
            />
            <FeatureCard
              icon={<Globe className="h-8 w-8 text-purple-500" />}
              title="Global & Local"
              description="Track Indian indices alongside global markets. Get a complete view of the financial world."
              delay={0.4}
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8 text-green-500" />}
              title="Secure Platform"
              description="Enterprise-grade security ensures your watchlists and strategies remain private and protected."
              delay={0.6}
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8 text-pink-500" />}
              title="Smart Insights"
              description="AI-powered analysis to help you identify trends and potential breakout stocks instantly."
              delay={0.8}
            />
            <FeatureCard
              icon={<Activity className="h-8 w-8 text-cyan-500" />}
              title="Live News"
              description="Stay ahead with real-time news feeds curated specifically for your watchlist portfolio."
              delay={1.0}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] opacity-20"></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative z-10"
          >
            <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
            <p className="text-blue-100 mb-8 max-w-xl mx-auto text-lg">
              Join thousands of traders who are making smarter decisions with our advanced analytics platform.
            </p>
            <Link href="/dashboard" className="inline-block bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all">
              Launch Dashboard
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: any, title: string, description: string, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -10 }}
      className="bg-white dark:bg-gray-900/50 backdrop-blur-lg p-8 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-lg hover:shadow-xl hover:border-blue-500/30 transition-all dark:hover:bg-gray-800"
    >
      <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
}
