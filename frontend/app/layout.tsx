import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import ChatBot from '@/components/ChatBot';
// import GlobalLoader from '@/components/GlobalLoader'; // Optional: Use if we have a global loading state provider
import * as motion from 'framer-motion/client'; // Use client proxy for server component or just 'framer-motion' if 'use client' is top level.
// Wait, RootLayout is Server Component by default using 'next' metadata. 
// We should NOT make RootLayout client component if we can avoid it.
// Better: Wrap main in a Client Component "PageWrapper".

// Let's stick to simple main className for now and do animations in pages, 
// OR use a Providers/Wrapper component.
// Reverting to standard layout but adding a comment.
// For now, let's just keep the file clean. I will revert the "motion.main" change in next step 
// or use a client wrapper component. 
// ACTUALLY, I'll create a ClientWrapper for the body content.

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fintech Trading Analysis - Real-time Stock Analysis',
  description: 'Track Indian and Global stocks with ease.',
};

import ClientLayout from './ClientLayout';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-black text-gray-900 dark:text-gray-100`}>
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
