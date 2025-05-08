"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, PieChart, Loader2, Clock, BarChart, List } from 'lucide-react';
import { useToast } from "@/context/ToastContext";
import { useAnalytics } from '@/lib/hooks/useAnalytics';

// Define interface for source data
interface SourceData {
  name: string;
  value: number;
}

// Define interface for trend data
interface TrendData {
  date: string;
  count: number;
}

// Define interface for job title data
interface JobTitleData {
  title: string;
  count: number;
}

// Interface for API response
interface TrendsResponse {
  sourceData: SourceData[];
  trendData: TrendData[];
  jobTitleData: JobTitleData[];
  filters: string[];
  totalJobs: number;
  totalSources: number;
  lastUpdated: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4CAF50', '#e91e63', '#9c27b0', 
                '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39'];

const JobTrendsVisualization = () => {
  const [activeTab, setActiveTab] = useState('sources');
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [sourceData, setSourceData] = useState<SourceData[]>([]);
  const [jobTitleData, setJobTitleData] = useState<JobTitleData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filters, setFilters] = useState<string[]>(['all']);
  const [totalJobs, setTotalJobs] = useState(0);
  const [totalSources, setTotalSources] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { addToast } = useToast();
  const { trackEvent } = useAnalytics();

  // Function to fetch data from API
  const fetchData = async (filter = 'all') => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/trends?filter=${filter}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status}`);
      }
      
      const data: TrendsResponse = await response.json();
      
      setSourceData(data.sourceData);
      setTrendData(data.trendData);
      setJobTitleData(data.jobTitleData || []);
      setFilters(['all', ...data.filters]);
      setTotalJobs(data.totalJobs);
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
  }, []);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    fetchData(filter);
    
    // Track filter change
    trackEvent({
      category: 'Trends',
      action: 'Filter Change',
      label: filter
    });
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Track tab change
    trackEvent({
      category: 'Trends',
      action: 'Tab Change',
      label: tab
    });
  };

  // Format date for display
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Format datetime with hours and minutes
  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Calculate total value for source data
  const totalSourceValue = sourceData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="space-y-6">
      <Card className="w-full shadow-lg dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold">Job Market Trends</CardTitle>
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
                  variant={activeTab === 'trends' ? "default" : "outline"} 
                  onClick={() => handleTabChange('trends')}
                  className="flex items-center"
                  size="sm"
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Job Trends
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
                <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                  <div className="text-xs text-blue-500 dark:text-blue-300 uppercase font-semibold">Total Jobs</div>
                  <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">{totalJobs.toLocaleString()}</div>
                </div>
                
                <div className="bg-purple-50 dark:bg-purple-900/30 rounded-lg p-4">
                  <div className="text-xs text-purple-500 dark:text-purple-300 uppercase font-semibold">Active Sources</div>
                  <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">{totalSources.toLocaleString()}</div>
                </div>
                
                <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                  <div className="text-xs text-green-500 dark:text-green-300 uppercase font-semibold">Last Updated</div>
                  <div className="text-md font-bold text-green-700 dark:text-green-300">
                    {lastUpdated ? formatDateTime(lastUpdated) : 'N/A'}
                  </div>
                </div>
              </div>
            )}
            
            {isLoading ? (
              <div className="h-80 w-full flex items-center justify-center">
                <div className="flex flex-col items-center">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                  <p className="mt-4 text-gray-500 dark:text-gray-400">Loading job market data...</p>
                </div>
              </div>
            ) : error ? (
              <div className="h-80 w-full flex items-center justify-center">
                <div className="text-center p-6 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/30 rounded-lg">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                  <Button 
                    onClick={() => fetchData(activeFilter)} 
                    className="mt-4"
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            ) : activeTab === 'sources' ? (
              <div className="h-96 w-full">
                {sourceData.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No source data available for the selected filter.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      {sourceData.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                          ></div>
                          <div className="flex-1">
                            <div className="text-sm font-medium dark:text-gray-200">{item.name}</div>
                            <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div 
                                className="absolute top-0 left-0 h-full rounded-full" 
                                style={{ 
                                  width: `${(item.value / Math.max(...sourceData.map(d => d.value))) * 100}%`,
                                  backgroundColor: COLORS[index % COLORS.length] 
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-1 flex justify-between">
                              <span>{item.value.toLocaleString()} jobs</span>
                              <span className="font-semibold">
                                {totalSourceValue > 0 ? (item.value / totalSourceValue * 100).toFixed(1) : 0}%
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-center">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Data aggregated from {totalSources} sources as of {formatDateTime(lastUpdated)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : activeTab === 'trends' ? (
              <div className="h-96 w-full">
                {trendData.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No trend data available for the selected filter.</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    <div className="w-full">
                      <div className="flex justify-between items-center mb-4">
                        <div className="text-sm font-medium dark:text-gray-200">Job Listings Over Time</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {trendData.length > 0 ? 
                            `${formatDate(trendData[0].date)} - ${formatDate(trendData[trendData.length - 1].date)}` : 
                            'No data available'}
                        </div>
                      </div>
                      <div className="w-full h-64 flex items-end space-x-1">
                        {trendData.map((item, index) => (
                          <div key={index} className="flex-1 flex flex-col items-center group relative">
                            <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-gray-800 text-white text-xs rounded px-2 py-1 pointer-events-none transition-opacity z-10">
                              {item.count.toLocaleString()} jobs on {formatDate(item.date)}
                            </div>
                            <div 
                              className="w-full bg-blue-500 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 rounded-t-lg transition-all duration-300 ease-in-out cursor-pointer"
                              style={{ 
                                height: `${(item.count / Math.max(...trendData.map(d => d.count))) * 100}%`,
                                maxHeight: '100%',
                                minHeight: '4px'
                              }}
                            ></div>
                            <div className="mt-2 text-xs dark:text-gray-300 truncate w-full text-center">
                              {formatDate(item.date)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-center">
                        <BarChart className="h-4 w-4 mr-2" />
                        <span>Displaying job posting trends for the last 30 days ({trendData.length} data points)</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-96 w-full">
                {jobTitleData.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500 dark:text-gray-400">No job title data available for the selected filter.</p>
                  </div>
                ) : (
                  <div className="flex flex-col h-full">
                    <div className="text-sm font-medium dark:text-gray-200 mb-4">Top 15 Job Titles</div>
                    <div className="overflow-y-auto flex-grow">
                      {jobTitleData.map((item, index) => (
                        <div key={index} className="mb-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="text-sm dark:text-gray-200 truncate pr-4 font-medium">{index + 1}. {item.title}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">{item.count.toLocaleString()} jobs</div>
                          </div>
                          <div className="relative w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="absolute top-0 left-0 h-full rounded-full" 
                              style={{ 
                                width: `${(item.count / Math.max(...jobTitleData.map(d => d.count))) * 100}%`,
                                backgroundColor: COLORS[index % COLORS.length] 
                              }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center justify-center">
                        <List className="h-4 w-4 mr-2" />
                        <span>Based on {totalJobs.toLocaleString()} job listings from {totalSources} sources</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <p>This visualization shows real job market data aggregated from over {totalSources} sources. Use the filters to focus on specific job categories or sources.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="w-full shadow-lg dark:bg-gray-800">
        <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold">Insights & Analysis</CardTitle>
        </CardHeader>
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium dark:text-gray-200">What This Data Means For You</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-md font-medium text-blue-600 dark:text-blue-400">Source Distribution</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  Understanding which platforms host the most job listings helps you prioritize where to focus your job search efforts. The source distribution shows you exactly which job boards are most active in your field of interest.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-medium text-purple-600 dark:text-purple-400">Temporal Trends</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  The trends chart reveals hiring patterns over time. These patterns can help you time your job application for maximum effectiveness - apply when companies are actively posting new positions.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-medium text-green-600 dark:text-green-400">Popular Job Titles</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  By analyzing the most frequently posted job titles, you can identify which specific roles are in high demand. This helps you target your applications and skills development to match market needs.
                </p>
              </div>
              
              <div className="space-y-3">
                <h4 className="text-md font-medium text-amber-600 dark:text-amber-400">Strategic Advantage</h4>
                <p className="text-gray-700 dark:text-gray-300">
                  When you know which platforms have the most relevant listings for your skills, and which job titles are trending, you can create targeted alerts on those specific platforms, increasing your chances of finding the perfect opportunity.
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