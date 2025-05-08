"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart2, PieChart } from 'lucide-react';

// Sample data - would be replaced with real data from your API
const sampleSourceData = [
  { name: 'LinkedIn', value: 45 },
  { name: 'Indeed', value: 32 },
  { name: 'Glassdoor', value: 18 },
  { name: 'Company Sites', value: 28 },
  { name: 'AngelList', value: 8 },
  { name: 'StackOverflow', value: 12 }
];

const sampleTrendData = [
  { month: 'Jan', count: 240 },
  { month: 'Feb', count: 260 },
  { month: 'Mar', count: 280 },
  { month: 'Apr', count: 310 },
  { month: 'May', count: 350 },
  { month: 'Jun', count: 390 }
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#4CAF50', '#e91e63', '#9c27b0'];

const JobTrendsVisualization = () => {
  const [activeTab, setActiveTab] = useState('sources');
  const [trendData, setTrendData] = useState(sampleTrendData);
  const [sourceData, setSourceData] = useState(sampleSourceData);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate fetching data from API
  const fetchData = async (filter = 'all') => {
    setIsLoading(true);
    
    // In a real implementation, this would be an API call
    setTimeout(() => {
      // Simulate filtering by modifying sample data
      if (filter === 'dev') {
        setSourceData([
          { name: 'LinkedIn', value: 40 },
          { name: 'GitHub Jobs', value: 35 },
          { name: 'StackOverflow', value: 25 },
          { name: 'Indeed', value: 20 },
          { name: 'AngelList', value: 15 }
        ]);
      } else if (filter === 'marketing') {
        setSourceData([
          { name: 'LinkedIn', value: 50 },
          { name: 'Indeed', value: 40 },
          { name: 'Glassdoor', value: 30 },
          { name: 'Company Sites', value: 25 },
          { name: 'MediaBistro', value: 20 }
        ]);
      } else {
        setSourceData(sampleSourceData);
      }
      
      setIsLoading(false);
    }, 800);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleFilterChange = (filter: string) => {
    fetchData(filter);
  };

  return (
    <Card className="w-full shadow-lg dark:bg-gray-800">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Job Market Trends</CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <Button 
                variant={activeTab === 'sources' ? "default" : "outline"} 
                onClick={() => setActiveTab('sources')}
                className="flex items-center"
                size="sm"
              >
                <PieChart className="h-4 w-4 mr-2" />
                Job Sources
              </Button>
              <Button 
                variant={activeTab === 'trends' ? "default" : "outline"} 
                onClick={() => setActiveTab('trends')}
                className="flex items-center"
                size="sm"
              >
                <BarChart2 className="h-4 w-4 mr-2" />
                Monthly Trends
              </Button>
            </div>
            
            {activeTab === 'sources' && (
              <div className="flex gap-2">
                <Button 
                  variant={isLoading ? "outline" : "default"} 
                  onClick={() => handleFilterChange('all')}
                  size="sm"
                >
                  All Jobs
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleFilterChange('dev')}
                  size="sm"
                >
                  Development
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleFilterChange('marketing')}
                  size="sm"
                >
                  Marketing
                </Button>
              </div>
            )}
          </div>
          
          {activeTab === 'sources' ? (
            <div className="h-80 w-full">
              {isLoading ? (
                <div className="h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
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
                          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {item.value} jobs ({Math.round((item.value / sourceData.reduce((acc, curr) => acc + curr.value, 0)) * 100)}%)
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-80 w-full">
              <div className="flex flex-col items-center justify-center h-full">
                <div className="w-full">
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm font-medium dark:text-gray-200">Monthly Job Listings</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Last 6 months</div>
                  </div>
                  <div className="w-full h-64 flex items-end space-x-1 lg:space-x-2">
                    {trendData.map((item, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="mb-2 text-xs">{Math.round((item.count / Math.max(...trendData.map(d => d.count))) * 100)}%</div>
                        <div 
                          className="w-full bg-blue-500 dark:bg-blue-600 rounded-t-lg transition-all duration-500 ease-in-out"
                          style={{ 
                            height: `${(item.count / Math.max(...trendData.map(d => d.count))) * 100}%`,
                            maxHeight: '100%'
                          }}
                        ></div>
                        <div className="mt-2 text-xs dark:text-gray-300">{item.month}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p>This visualization shows the distribution of job listings across different sources and monthly trends. Use the tabs to switch between views.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobTrendsVisualization;