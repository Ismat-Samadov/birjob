"use client"

import { useState, useEffect, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDebounce } from '@/lib/hooks/useDebounce';
import { X, Search as SearchIcon, Bell, Search } from 'lucide-react';
import JobCard from '@/components/JobCard';
import LazyLoad from '@/components/LazyLoad';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import FeatureSpotlight from '@/components/FeatureSpotlight';
import Link from 'next/link';

interface Job {
  id: number;
  title: string;
  company: string;
  source: string | null;
  apply_link: string;
  created_at: string;
}

interface JobsMetadata {
  latestScrapeDate: string;
  totalJobs: number;
  currentPage: number;
  totalPages: number;
}

interface JobsResponse {
  jobs: Job[];
  sources: string[];
  companies: string[];
  metadata: JobsMetadata;
}

export default function HomeContent() {
  const [jobsData, setJobsData] = useState<JobsResponse | null>(null);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [selectedCompany, setSelectedCompany] = useState<string>('');
  // Remove state setters from destructuring
  const [popularSearches] = useState<string[]>([
    'remote', 'developer', 'marketing', 'data scientist', 'part-time'
  ]);
  const [popularLocations] = useState<string[]>([
    'baku', 'azerbaijan', 'ganja', 'sumgait'
  ]);
  const debouncedSearch = useDebounce<string>(search, 500);
  const { trackPageView, trackEvent } = useAnalytics();
  
  // Track page view
  useEffect(() => {
    trackPageView({
      url: '/',
      title: 'Job Search | BirJob - Your Ultimate Job Aggregator'
    });
  }, [trackPageView]);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    setIsSearching(true);
    
    try {
      const queryParams = new URLSearchParams();
      
      if (debouncedSearch) {
        queryParams.append('search', debouncedSearch);
        
        // Track search event
        trackEvent({
          category: 'Search',
          action: 'Job Search',
          label: debouncedSearch
        });
      }
      
      if (selectedSource) {
        queryParams.append('source', selectedSource);
      }
      
      if (selectedCompany) {
        queryParams.append('company', selectedCompany);
      }
      
      queryParams.append('page', page.toString());
      
      const response = await fetch(
        `/api/jobs?${queryParams.toString()}`
      );
      const data: JobsResponse = await response.json();
      setJobsData(data);
      
      // Track search results
      trackEvent({
        category: 'Search',
        action: 'Search Results',
        label: debouncedSearch || selectedSource || selectedCompany || 'All Jobs',
        value: data.metadata.totalJobs
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      
      // Track error
      trackEvent({
        category: 'Error',
        action: 'API Error',
        label: 'Job fetch failed'
      });
    } finally {
      setLoading(false);
      // Set a small delay before removing the searching state for better UX
      setTimeout(() => setIsSearching(false), 300);
    }
  }, [debouncedSearch, selectedSource, selectedCompany, page, trackEvent]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
    // Reset other filters when searching
    setSelectedSource('');
    setSelectedCompany('');
  };

  const handlePreviousPage = () => {
    setPage((p) => Math.max(1, p - 1));
    
    // Track pagination event
    trackEvent({
      category: 'Navigation',
      action: 'Pagination',
      label: 'Previous Page',
      value: page - 1
    });
    
    // Scroll to top when changing pages
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const handleNextPage = () => {
    setPage((p) => p + 1);
    
    // Track pagination event
    trackEvent({
      category: 'Navigation',
      action: 'Pagination',
      label: 'Next Page',
      value: page + 1
    });
    
    // Scroll to top when changing pages
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const clearFilters = () => {
    setSearch('');
    setPage(1);
    setSelectedSource('');
    setSelectedCompany('');
    
    // Track clear filters event
    trackEvent({
      category: 'Filter',
      action: 'Clear Filters'
    });
  };

  const handleSourceSelect = (source: string) => {
    setSelectedSource(source === selectedSource ? '' : source);
    setPage(1);
    
    trackEvent({
      category: 'Filter',
      action: 'Source Filter',
      label: source
    });
  };

  const handleCompanySelect = (company: string) => {
    setSelectedCompany(company === selectedCompany ? '' : company);
    setPage(1);
    
    trackEvent({
      category: 'Filter',
      action: 'Company Filter',
      label: company
    });
  };

  const handlePopularSearchClick = (term: string) => {
    setSearch(term);
    setPage(1);
    
    trackEvent({
      category: 'Search',
      action: 'Popular Search Click',
      label: term
    });
  };

  const handleLocationClick = (location: string) => {
    trackEvent({
      category: 'Navigation',
      action: 'Location Click',
      label: location
    });
  };

  // Schema.org structured data for job search
  const jobSearchSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://birjob.com/",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://birjob.com/?search={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
      {/* Add structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobSearchSchema) }}
      />
      
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
            BirJob
          </h1>
          <h2 className="text-xl text-center text-gray-700 dark:text-gray-300 max-w-2xl mx-auto">
            Your Ultimate Job Aggregator - Find Jobs from 50+ Sources
          </h2>
          <div className="w-full max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search jobs or companies..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-10 transition-all focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-700"
                  aria-label="Search for jobs"
                />
                {search && (
                  <button
                    onClick={clearFilters}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
                {isSearching && !search && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Popular searches */}
            <div className="flex flex-wrap gap-2 mt-3 justify-center">
              {popularSearches.map((term, index) => (
                <button
                  key={index}
                  onClick={() => handlePopularSearchClick(term)}
                  className="text-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-full px-3 py-1 text-gray-600 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
            
            {jobsData?.metadata && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                <p>Last Updated: {new Date(jobsData.metadata.latestScrapeDate).toLocaleString()}</p>
                <p className="font-medium">
                  Found {jobsData.metadata.totalJobs} jobs
                  {search ? ` matching "${search}"` : ''}
                  {selectedSource ? ` from ${selectedSource}` : ''}
                  {selectedCompany ? ` at ${selectedCompany}` : ''}
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Popular locations */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
            Popular Locations
          </h3>
          <div className="flex flex-wrap gap-3">
            {popularLocations.map((location, index) => (
              <Link 
                key={index}
                href={`/jobs/location/${location}`}
                onClick={() => handleLocationClick(location)}
                className="flex items-center gap-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full px-3 py-1 text-sm hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors"
              >
                <SearchIcon className="h-3 w-3" />
                <span className="capitalize">{location}</span>
              </Link>
            ))}
          </div>
        </div>

        {/* Filters - Source and Company */}
        {(jobsData && ((jobsData.sources?.length ?? 0) > 0 || (jobsData.companies?.length ?? 0) > 0)) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {jobsData && jobsData.sources && jobsData.sources.length > 0 && (
              <Card className="dark:bg-gray-800">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Filter by Source
                  </h3>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar">
                    {jobsData.sources.map((source, index) => (
                      <button
                        key={index}
                        onClick={() => handleSourceSelect(source)}
                        className={`text-xs rounded-full px-3 py-1 transition-colors ${
                          selectedSource === source 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        aria-pressed={selectedSource === source}
                      >
                        {source}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {jobsData && jobsData.companies && jobsData.companies.length > 0 && (
              <Card className="dark:bg-gray-800">
                <CardContent className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                    Filter by Company
                  </h3>
                  <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto custom-scrollbar">
                    {jobsData.companies.map((company, index) => (
                      <button
                        key={index}
                        onClick={() => handleCompanySelect(company)}
                        className={`text-xs rounded-full px-3 py-1 transition-colors ${
                          selectedCompany === company 
                            ? 'bg-purple-500 text-white' 
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        aria-pressed={selectedCompany === company}
                      >
                        {company}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <div className="space-y-4">
          {loading && !isSearching ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="animate-pulse dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="mt-4 flex space-x-2">
                      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : !jobsData?.jobs.length ? (
            <Card className="dark:bg-gray-800 p-8">
              <CardContent className="flex flex-col items-center justify-center text-center p-6">
                <SearchIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No jobs found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {search || selectedSource || selectedCompany ? 
                    `Try adjusting your search or filters to see more results.` : 
                    `There are currently no job listings available.`}
                </p>
                {(search || selectedSource || selectedCompany) && (
                  <Button 
                    onClick={clearFilters}
                    className="mt-4"
                    variant="outline"
                  >
                    Clear All Filters
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            jobsData.jobs.map((job: Job) => (
              <LazyLoad key={job.id} threshold={0.1}>
                <JobCard
                  id={job.id}
                  title={job.title}
                  company={job.company}
                  source={job.source}
                  apply_link={job.apply_link}
                  created_at={job.created_at}
                />
              </LazyLoad>
            ))
          )}
        </div>

        {jobsData?.metadata && jobsData.jobs.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center gap-4 items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Button
              onClick={handlePreviousPage}
              disabled={page === 1 || loading}
              className="w-full sm:w-auto font-medium px-6 py-2 transition-all"
              variant={page === 1 ? "outline" : "default"}
              aria-label="Go to previous page"
            >
              Previous
            </Button>
            
            <div className="flex items-center text-sm font-medium my-2 sm:my-0">
              <span className="hidden sm:block mr-2 dark:text-gray-300">Page</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md">
                {page}
              </span>
              <span className="mx-2 dark:text-gray-300">of</span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md">
                {jobsData.metadata.totalPages}
              </span>
            </div>
            
            <Button
              onClick={handleNextPage}
              disabled={page >= jobsData.metadata.totalPages || loading}
              className="w-full sm:w-auto font-medium px-6 py-2 transition-all"
              variant={page >= jobsData.metadata.totalPages ? "outline" : "default"}
              aria-label="Go to next page"
            >
              Next
            </Button>
          </div>
        )}
        
        {/* Feature spotlights */}
        <div className="space-y-4">
          <FeatureSpotlight 
            title="Never Miss an Opportunity"
            description="Get daily email notifications for jobs matching your keywords. Set up your preferences and stay ahead in your job search."
            buttonText="Set Up Notifications"
            buttonLink="/notifications"
            icon={<Bell className="h-8 w-8" />}
            variant="primary"
          />
          
          <FeatureSpotlight 
            title="Find Jobs from 50+ Sources"
            description="BirJob aggregates positions from over 50 different job boards, making your job search more efficient."
            buttonText="Learn More"
            buttonLink="/about"
            icon={<Search className="h-8 w-8" />}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
}