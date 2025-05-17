// src/app/layout.tsx (Complete Updated File)
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Providers } from '@/components/Providers';
import ScrollToTop from '@/components/ScrollToTop';

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

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
  description: 'Find jobs from 50+ sources in one place with personalized notifications, daily alerts, and expert career advice',
  metadataBase: new URL('https://birjob.com'),
  keywords: ['job search', 'job aggregator', 'job alerts', 'career advice', 'job notifications', 'remote jobs'],
  authors: [{ name: 'BirJob Team' }],
  creator: 'Ismat-Samadov',
  publisher: 'BirJob',
  formatDetection: {
    email: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://birjob.com',
    title: 'BirJob - Your Ultimate Job Aggregator',
    description: 'Find jobs from 50+ sources in one place with personalized notifications',
    siteName: 'BirJob',
    images: [
      {
        url: 'https://birjob.com/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'BirJob - Your Ultimate Job Aggregator',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@birjob',
    creator: '@birjob',
    title: 'BirJob - Your Ultimate Job Aggregator',
    description: 'Find jobs from 50+ sources in one place with personalized notifications',
    images: ['https://birjob.com/images/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-video-preview': -1,
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
    yahoo: 'your-yahoo-verification-code',
  },
  alternates: {
    canonical: 'https://birjob.com',
    languages: {
      'en-US': 'https://birjob.com',
      'az-AZ': 'https://birjob.com/az',
    },
  },
};

export function reportWebVitals(metric: any) {
  // Replace with your analytics service
  if (window.gtag) {
    window.gtag('event', 'web-vitals', {
      event_category: 'Web Vitals',
      event_label: metric.name,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="canonical" href="https://birjob.com" />
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