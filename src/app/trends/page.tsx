// src/app/trends/page.tsx
import ClientWrapper from "@/components/ClientWrapper";
import JobTrendsVisualization from "@/components/JobTrendsVisualization";

export default function TrendsPage() {
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Job Market Trends
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Explore the latest job market trends across different sources and industries. 
            This visualization helps you identify which platforms have the most job listings
            and how the job market is evolving over time.
          </p>
          <JobTrendsVisualization />
        </div>
      </div>
    </ClientWrapper>
  );
}