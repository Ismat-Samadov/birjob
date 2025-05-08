// src/app/trends/page.tsx
import ClientWrapper from "@/components/ClientWrapper";
import JobTrendsVisualization from "@/components/JobTrendsVisualization";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function TrendsPage() {
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Current Job Market Trends
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Explore what's happening right now in the job market. This dashboard shows the latest data 
            from our most recent scraping cycle, highlighting active job sources, top positions, 
            and trending job categories.
          </p>
          
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
                The <span className="font-medium">Job Categories</span> tab extracts the first word from each job title 
                (converted to lowercase) to help identify common position types like "senior," "junior," or "lead." 
                This provides insight into the current demand for different position levels and types.
              </p>
              <p>
                Use these insights to optimize your job search by focusing on the most active sources and 
                tailoring your resume to match the most in-demand job categories and titles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ClientWrapper>
  ); (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
            Current Job Market Trends
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Explore what's happening right now in the job market. This dashboard shows the latest data 
            from our most recent scraping cycle, highlighting active job sources, top positions, 
            and trending job categories.
          </p>
          <JobTrendsVisualization />
          
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
                The <span className="font-medium">Job Categories</span> tab extracts the first word from each job title 
                (converted to lowercase) to help identify common position types like "senior," "junior," or "lead." 
                This provides insight into the current demand for different position levels and types.
              </p>
              <p>
                Use these insights to optimize your job search by focusing on the most active sources and 
                tailoring your resume to match the most in-demand job categories and titles.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
}