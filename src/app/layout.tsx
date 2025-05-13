import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Providers } from '@/components/Providers';
import ScrollToTop from '@/components/ScrollToTop';

const inter = Inter({ subsets: ['latin'] });

// Simple loading component
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export const metadata: Metadata = {
  title: {
    template: '%s | BirJob',
    default: 'BirJob - Your Ultimate Job Aggregator',
  },
  description: 'Job board aggregator showing opportunities from multiple sources',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    other: [
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body className={`${inter.className} mobile-overflow-fix`}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<div className="h-16 bg-white dark:bg-gray-900 shadow-sm"></div>}>
              <Navbar />
            </Suspense>
            <main className="flex-grow">
              <Suspense fallback={<Loading />}>
                {children}
              </Suspense>
            </main>
            <Suspense fallback={<div className="h-48 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800"></div>}>
              <Footer />
            </Suspense>
            <Suspense fallback={null}>
              <ScrollToTop />
            </Suspense>
          </div>
        </Providers>
      </body>
    </html>
  );
}