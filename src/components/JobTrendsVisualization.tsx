// src/components/JobTrendsVisualization.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, List, Database, Filter, Info, BarChart3, Clock, AlertCircle } from 'lucide-react';
import { useToast } from "@/context/ToastContext";
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import HorizontalBarChart from './HorizontalBarChart';
import DashboardStatCard from './DashboardStatCard';
import EmptyState from './EmptyState';
import Loader from './Loader';

// Define interface for source data
interface SourceData {
  name: string;
  value: number;
}

// Define interface for job title data
interface JobTitleData {
  title: string;
  count: number;
}

// Define interface for job category data
interface JobCategoryData {
  category: string;
  count: number;
}

// Interface for API response
interface TrendsResponse {
  sourceData: SourceData[];
  jobTitleData: JobTitleData[];
  jobCategoryData: JobCategoryData[];
  filters: string[];
  totalJobs: number;
  totalSources: number;
  lastUpdated: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4CAF50', '#e91e63', '#9c27b0', 
                '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39'];

const JobTrendsVisualization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sources' | 'titles' | 'categories'>('sources');
  const [sourceData, setSourceData] = useState<SourceData[]>([]);
  const [jobTitleData, setJobTitleData] = useState<JobTitleData[]>([]);
  const [jobCategoryData, setJobCategoryData] = useState<JobCategoryData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filters, setFilters] = useState<string[]>(['all']);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [totalSources, setTotalSources] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const { trackEvent } = useAnalytics();

  // Function to fetch data from API
  const fetchData = async (filter = 'all'): Promise<void> => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/trends?filter=${filter}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data: TrendsResponse = await response.json();
      
      setSourceData(data.sourceData || []);
      setJobTitleData(data.jobTitleData || []);
      setJobCategoryData(data.jobCategoryData || []);
      setFilters(['all', ...(data.filters || [])]);
      setTotalJobs(data.totalJobs || 0);
      setTotalSources(data.totalSources || 0);
      setLastUpdated(data.lastUpdated || new Date().toISOString());
      
      // Track successful data load
      trackEvent({
        category: 'Trends',
        action: 'Data Loaded',
        label: `Filter: ${filter}`
      });
    } catch (err) {
      console.error('Error fetching trend data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load trend data');
      
      addToast({
        title: "Error",
        description: "Failed to load trend data. Please try again later.",
        type: "destructive",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData(activeFilter);
    // Track page view
    trackEvent({
      category: 'Trends',
      action: 'View',
      label: 'Trends Page'
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFilterChange = (filter: string): void => {
    setActiveFilter(filter);
    fetchData(filter);
    
    // Track filter change
    trackEvent({
      category: 'Trends',
      action: 'Filter Change',
      label: filter
    });
  };

  const handleTabChange = (tab: 'sources' | 'titles' | 'categories'): void => {
    setActiveTab(tab);
    
    // Track tab change
    trackEvent({
      category: 'Trends',
      action: 'Tab Change',
      label: tab
    });
  };

  // Format datetime with hours and minutes
  const formatDateTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleString('en-US', { 
        month: 'long', 
        day: 'numeric', 
        year: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch (e) {
      return 'Invalid date';
    }
  };

  // Format data for the HorizontalBarChart component
  const formatSourceData = () => {
    return sourceData.map(item => ({
      label: item.name,
      value: item.value
    }));
  };

  const formatJobTitleData = () => {
    return jobTitleData.map(item => ({
      label: item.title,
      value: item.count
    }));
  };

  const formatJobCategoryData = () => {
    return jobCategoryData.map(item => ({
      label: item.category,
      value: item.count
    }));
  };

  // Calculate total values
  const totalSourceValue = sourceData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-lg dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold">Current Job Market Snapshot</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div className="flex space-x-4">
                <Button 
                  variant={activeTab === 'sources' ? "default" : "outline"} 
                  onClick={() => handleTabChange('sources')}
                  className="flex items-center"
                  size="sm"
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  Job Sources
                </Button>
                <Button 
                  variant={activeTab === 'titles' ? "default" : "outline"} 
                  onClick={() => handleTabChange('titles')}
                  className="flex items-center"
                  size="sm"
                >
                  <List className="h-4 w-4 mr-2" />
                  Top Job Titles
                </Button>
                <Button 
                  variant={activeTab === 'categories' ? "default" : "outline"} 
                  onClick={() => handleTabChange('categories')}
                  className="flex items-center"
                  size="sm"
                >
                  <Database className="h-4 w-4 mr-2" />
                  Job Categories
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {filters.map((filter, index) => (
                  <Button 
                    key={index}
                    variant={activeFilter === filter ? "default" : "outline"} 
                    onClick={() => handleFilterChange(filter)}
                    size="sm"
                    disabled={isLoading}
                  >
                    {filter === 'all' ? 'All Jobs' : filter}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Stats summary */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <DashboardStatCard
                  title="Total Jobs"
                  value={totalJobs}
                  icon={<BarChart3 className="h-5 w-5" />}
                  bgClass="bg-blue-50 dark:bg-blue-900/30"
                  titleClass="text-blue-500 dark:text-blue-300"
                  valueClass="text-blue-700 dark:text-blue-300"
                />
                
                <DashboardStatCard
                  title="Active Sources"
                  value={totalSources}
                  icon={<PieChart className="h-5 w-5" />}
                  bgClass="bg-purple-50 dark:bg-purple-900/30"
                  titleClass="text-purple-500 dark:text-purple-300"
                  valueClass="text-purple-700 dark:text-purple-300"
                />
                
                <DashboardStatCard
                  title="Last Updated"
                  value={lastUpdated ? formatDateTime(lastUpdated) : 'N/A'}
                  icon={<Clock className="h-5 w-5" />}
                  bgClass="bg-green-50 dark:bg-green-900/30"
                  titleClass="text-green-500 dark:text-green-300"
                  valueClass="text-green-700 dark:text-green-300"
                />
              </div>
            )}
            
            {isLoading ? (
              <div className="h-96 w-full flex items-center justify-center">
                <Loader size="lg" text="Loading job market data..." />
              </div>
            ) : error ? (
              <EmptyState
                icon={<AlertCircle className="h-12 w-12" />}
                title="Error Loading Data"
                message={error || "Failed to load trend data. Please try again later."}
                actionLabel="Try Again"
                onAction={() => fetchData(activeFilter)}
              />
            ) : activeTab === 'sources' ? (
              <div>
                {sourceData.length === 0 ? (
                  <EmptyState
                    icon={<Info className="h-12 w-12" />}
                    title="No Source Data Available"
                    message="This could be because the 'source' column is missing in your database or there are no sources for the current filter."
                  />
                ) : (
                  <>
                    <div className="text-sm font-medium dark:text-gray-200 mb-4">Job Source Distribution</div>
                    <HorizontalBarChart 
                      data={formatSourceData()} 
                      colors={COLORS}
                      totalValue={totalSourceValue}
                      emptyMessage="No source data available for the selected filter."
                    />
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-center">
                        <Filter className="h-4 w-4 mr-2" />
                        <span>Data from {totalSources} sources as of {formatDateTime(lastUpdated)}</span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : activeTab === 'titles' ? (
              <div>
                <div className="text-sm font-medium dark:text-gray-200 mb-4">Top 15 Job Titles</div>
                {jobTitleData.length === 0 ? (
                  <EmptyState
                    icon={<List className="h-12 w-12" />}
                    title="No Job Title Data Available"
                    message="There are no job titles available for the selected filter."
                  />
                ) : (
                  <HorizontalBarChart 
                    data={formatJobTitleData()} 
                    colors={COLORS} 
                    showPercentages={false}
                    emptyMessage="No job title data available for the selected filter."
                  />
                )}
                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-center">
                    <List className="h-4 w-4 mr-2" />
                    <span>Based on {totalJobs.toLocaleString()} job listings</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <div className="text-sm font-medium dark:text-gray-200 mb-4">Top Job Categories (First Word of Title)</div>
                {jobCategoryData.length === 0 ? (
                  <EmptyState
                    icon={<Database className="h-12 w-12" />}
                    title="No Job Category Data Available"
                    message="There are no job categories available for the selected filter."
                  />
                ) : (
                  <HorizontalBarChart 
                    data={formatJobCategoryData()} 
                    colors={COLORS}
                    showPercentages={false}
                    emptyMessage="No job category data available for the selected filter."
                  />
                )}
                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-center">
                    <Database className="h-4 w-4 mr-2" />
                    <span>Categories extracted from {totalJobs.toLocaleString()} job listings</span>
                  </div>
                </div>
              </div>
            )}
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p>This visualization represents the current job market data from our latest scraping cycle. Data is refreshed completely with each new scrape using a truncate-and-load approach.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full shadow-lg dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold">Actionable Insights</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Use these insights to optimize your job search strategy right now:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-md font-medium text-blue-600 dark:text-blue-400">Target Active Sources</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Focus your job search efforts on the platforms currently hosting the most relevant listings. 
                  Create accounts and set up job alerts on these primary sources to ensure you don&apos;t miss new opportunities.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-medium text-purple-600 dark:text-purple-400">Use Common Job Title Formats</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  When searching for jobs, use the exact job title formats shown in the &quot;Top Job Titles&quot; section. 
                  Many job boards use keyword matching, so aligning your search terms with how employers post positions 
                  will yield better results.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-medium text-green-600 dark:text-green-400">Align with Job Categories</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  The &quot;Job Categories&quot; visualization shows the most common first words in job titles. 
                  Use these insights to understand which position levels (senior, junior, etc.) and types 
                  are most prevalent, and tailor your application materials accordingly.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-medium text-amber-600 dark:text-amber-400">Set Up BirJob Notifications</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Based on these insights, configure your BirJob notification preferences using the most common job titles 
                  and categories as keywords. This ensures you&apos;ll receive alerts for relevant positions as soon as they&apos;re 
                  aggregated in our system.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobTrendsVisualization;