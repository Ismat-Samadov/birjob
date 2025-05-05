// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jobry - Find Your Next Opportunity',
  description: 'Job board aggregator showing opportunities from multiple sources',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <footer className="bg-gray-50 border-t border-gray-200 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-semibold text-gray-600">Jobry</h3>
                <p className="text-sm text-gray-500">Your Ultimate Job Aggregator</p>
              </div>
              <div className="text-sm text-gray-500">
                © 2025 Jobry | All rights reserved
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}