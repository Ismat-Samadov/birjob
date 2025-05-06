import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientWrapper from '@/components/ClientWrapper';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Providers } from '@/components/Providers';
import ScrollToTop from '@/components/ScrollToTop';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Birjob - Find Your Next Opportunity',
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
      <body className={inter.className}>
        <ClientWrapper>
          <Providers>
            <div className="flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">{children}</main>
              <Footer />
              <ScrollToTop />
            </div>
          </Providers>
        </ClientWrapper>
      </body>
    </html>
  );
}
