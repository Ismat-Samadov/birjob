"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PieChart, Building, Filter, Info, BarChart3, Clock, AlertCircle, TrendingUp } from 'lucide-react';
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
  percentage?: number;
}

// Define interface for company data
interface CompanyData {
  company: string;
  count: number;
  percentage?: number;
}

// Interface for API response
interface TrendsResponse {
  sourceData: SourceData[];
  companyData: CompanyData[];
  filters: string[];
  totalJobs: number;
  totalSources: number;
  totalCompanies: number;
  lastUpdated: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4CAF50', '#e91e63', '#9c27b0', 
                '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39'];

const JobTrendsVisualization: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sources' | 'companies'>('sources');
  const [sourceData, setSourceData] = useState<SourceData[]>([]);
  const [companyData, setCompanyData] = useState<CompanyData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filters, setFilters] = useState<string[]>(['all']);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [totalSources, setTotalSources] = useState<number>(0);
  const [totalCompanies, setTotalCompanies] = useState<number>(0);
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
      setCompanyData(data.companyData || []);
      setFilters(['all', ...(data.filters || [])]);
      setTotalJobs(data.totalJobs || 0);
      setTotalSources(data.totalSources || 0);
      setTotalCompanies(data.totalCompanies || 0);
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

  const handleTabChange = (tab: 'sources' | 'companies'): void => {
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

  const formatCompanyData = () => {
    return companyData.map(item => ({
      label: item.company,
      value: item.count
    }));
  };

  // Calculate total values for percentages
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
              <div className="flex space-x-2 overflow-x-auto pb-2 w-full sm:w-auto">
                <Button 
                  variant={activeTab === 'sources' ? "default" : "outline"} 
                  onClick={() => handleTabChange('sources')}
                  className="flex items-center flex-shrink-0"
                  size="sm"
                >
                  <PieChart className="h-4 w-4 mr-2" />
                  Sources
                </Button>
                <Button 
                  variant={activeTab === 'companies' ? "default" : "outline"} 
                  onClick={() => handleTabChange('companies')}
                  className="flex items-center flex-shrink-0"
                  size="sm"
                >
                  <Building className="h-4 w-4 mr-2" />
                  Companies
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 w-full sm:w-auto">
                {filters.map((filter, index) => (
                  <Button 
                    key={index}
                    variant={activeFilter === filter ? "default" : "outline"} 
                    onClick={() => handleFilterChange(filter)}
                    size="sm"
                    disabled={isLoading}
                    className="flex-shrink-0"
                  >
                    {filter === 'all' ? 'All Jobs' : filter}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Stats summary */}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                  title="Total Companies"
                  value={totalCompanies}
                  icon={<Building className="h-5 w-5" />}
                  bgClass="bg-amber-50 dark:bg-amber-900/30"
                  titleClass="text-amber-500 dark:text-amber-300"
                  valueClass="text-amber-700 dark:text-amber-300"
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
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Top Sources</h4>
                        {sourceData.slice(0, 3).map((source, idx) => (
                          <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">{source.name}:</span> {source.percentage?.toFixed(1)}% of jobs
                          </div>
                        ))}
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">Source Insight</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          {sourceData[0]?.name} provides {sourceData[0]?.percentage?.toFixed(1)}% of all available positions, making it the primary job source.
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div>
                <div className="text-sm font-medium dark:text-gray-200 mb-4">Top 25 Hiring Companies</div>
                {companyData.length === 0 ? (
                  <EmptyState
                    icon={<Building className="h-12 w-12" />}
                    title="No Company Data Available"
                    message="There are no companies available for the selected filter."
                  />
                ) : (
                  <>
                    <HorizontalBarChart 
                      data={formatCompanyData()} 
                      colors={COLORS} 
                      showPercentages={false}
                      emptyMessage="No company data available for the selected filter."
                    />
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">Top Hiring Companies</h4>
                        {companyData.slice(0, 3).map((company, idx) => (
                          <div key={idx} className="text-sm text-gray-700 dark:text-gray-300">
                            <span className="font-medium">{company.company}:</span> {company.count.toLocaleString()} positions ({company.percentage?.toFixed(1)}%)
                          </div>
                        ))}
                      </div>
                      <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                        <h4 className="text-sm font-medium text-purple-800 dark:text-purple-300 mb-2">Company Insights</h4>
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          The top {Math.min(5, companyData.length)} companies represent {companyData.slice(0, 5).reduce((acc, curr) => acc + (curr.percentage || 0), 0).toFixed(1)}% of all job postings.
                        </p>
                      </div>
                    </div>
                  </>
                )}
                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-center">
                    <Building className="h-4 w-4 mr-2" />
                    <span>Data from {totalCompanies.toLocaleString()} unique companies</span>
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
          <CardTitle className="text-xl font-bold">Advanced Market Insights</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              Use these enhanced insights to guide your job search strategy:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-md font-medium text-blue-600 dark:text-blue-400 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Top Hiring Companies
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Focus your attention on companies actively hiring. The companies at the top of our list have the most open positions, 
                  increasing your chances of finding the right opportunity.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-medium text-purple-600 dark:text-purple-400 flex items-center">
                  <PieChart className="h-4 w-4 mr-2" />
                  Source Strategy
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Don't limit yourself to one job board. Our source distribution shows which platforms are most active for your field. 
                  Create accounts on the top 3-5 sources to maximize your visibility.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-medium text-amber-600 dark:text-amber-400 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter-Based Targeting
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Use our filters to identify which sources and companies are strongest for specific roles or industries. 
                  This helps you target your applications more effectively and avoid wasting time on less relevant opportunities.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-medium text-green-600 dark:text-green-400 flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  Company Research
                </h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Research the top hiring companies in your field. Understanding their culture, recent news, and growth can 
                  give you an advantage in applications and interviews.
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