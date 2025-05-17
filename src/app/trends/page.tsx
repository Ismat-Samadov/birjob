// src/app/trends/page.tsx (Complete File)
import ClientWrapper from "@/components/ClientWrapper";
import JobTrendsVisualization from "@/components/JobTrendsVisualization";
import ErrorBoundary from "@/components/ErrorBoundary";
import InfoBox from "@/components/InfoBox";
import { Info } from "lucide-react";
import React from "react";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Market Trends & Insights | BirJob',
  description: 'Analyze current job market trends, hiring companies, and most active job sources to optimize your job search strategy',
  openGraph: {
    title: 'Job Market Trends & Insights | BirJob',
    description: 'Analyze current job market trends, hiring companies, and active job sources',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1635741042374-64875ac3ed60?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        width: 1200,
        height: 630,
        alt: 'BirJob Job Market Trends',
      },
    ],
    url: 'https://birjob.com/trends',
  },
  alternates: {
    canonical: 'https://birjob.com/trends',
  },
};

export default function TrendsPage() {
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Current Job Market Trends
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-4 max-w-3xl mx-auto">
            Explore what&apos;s happening right now in the job market. This dashboard shows the latest data 
            from our most recent scraping cycle, highlighting active job sources and top hiring companies.
          </p>
          
          <div className="mb-8 max-w-3xl mx-auto">
            <InfoBox title="About Our Job Data" icon={<Info className="h-5 w-5" />}>
              This dashboard displays current job market data using our truncate-and-load approach, 
              meaning it reflects the latest snapshot rather than historical trends. Each new scrape 
              completely refreshes the data with the most recent available positions. All company 
              analytics are case-insensitive to ensure accurate grouping regardless of formatting.
            </InfoBox>
          </div>
          
          <ErrorBoundary>
            <JobTrendsVisualization />
          </ErrorBoundary>
          
          <div className="mt-10 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Understanding Our Data
            </h2>
            <div className="text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                BirJob uses a <span className="font-medium">truncate-and-load approach</span> for data collection, 
                which means the visualizations show the current job market snapshot rather than historical trends. 
                Each time our scraper runs, it refreshes the entire dataset with the latest available positions.
              </p>
              <p>
                The <span className="font-medium">Job Sources</span> tab shows which platforms are currently providing the most 
                job listings, helping you focus your search efforts on the most active job boards. Each source&apos;s percentage 
                contribution is calculated to show its relative importance in the market.
              </p>
              <p>
                The <span className="font-medium">Companies</span> tab displays the organizations with the most open positions, 
                giving you insight into which companies are actively hiring. Company names are analyzed case-insensitively, 
                ensuring that variations like &quot;Azercell&quot; and &quot;Azercell Company&quot; are correctly grouped together.
              </p>
              <p>
                Use these insights to optimize your job search by focusing on the most active sources and 
                targeting companies that are actively recruiting for multiple positions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
}