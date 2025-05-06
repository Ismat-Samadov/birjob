"use client"

import { useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { useDebounce } from '@/lib/hooks/useDebounce'
import { FilterIcon, X, Search as SearchIcon, Bell } from 'lucide-react'
import JobCard from '@/components/JobCard'
import LazyLoad from '@/components/LazyLoad'
import { useAnalytics } from '@/lib/hooks/useAnalytics'
import FeatureSpotlight from '@/components/FeatureSpotlight'

interface Job {
  id: number
  title: string
  company: string
  source: string | null
  apply_link: string
  created_at: string
}

interface JobsMetadata {
  latestScrapeDate: string
  totalJobs: number
  currentPage: number
  totalPages: number
}

interface JobsResponse {
  jobs: Job[]
  sources: string[]
  metadata: JobsMetadata
}

export default function HomeContent() {
  const [jobsData, setJobsData] = useState<JobsResponse | null>(null)
  const [search, setSearch] = useState<string>('')
  const [selectedSource, setSelectedSource] = useState<string>('')
  const [showSourceFilter, setShowSourceFilter] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [isSearching, setIsSearching] = useState<boolean>(false)
  const debouncedSearch = useDebounce<string>(search, 500)
  const { trackEvent } = useAnalytics();

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    setIsSearching(true)
    
    try {
      const queryParams = new URLSearchParams()
      
      if (debouncedSearch) {
        queryParams.append('search', debouncedSearch)
        
        // Track search event
        trackEvent({
          category: 'Search',
          action: 'Job Search',
          label: debouncedSearch
        });
      }
      
      if (selectedSource) {
        queryParams.append('source', selectedSource)
        
        // Track source filter use
        trackEvent({
          category: 'Filter',
          action: 'Source Filter',
          label: selectedSource
        });
      }
      
      queryParams.append('page', page.toString())
      
      const response = await fetch(
        `/api/jobs?${queryParams.toString()}`
      )
      const data: JobsResponse = await response.json()
      setJobsData(data)
      
      // Track search results
      trackEvent({
        category: 'Search',
        action: 'Search Results',
        label: debouncedSearch || 'All Jobs',
        value: data.metadata.totalJobs
      });
    } catch (error) {
      console.error('Error fetching jobs:', error)
      
      // Track error
      trackEvent({
        category: 'Error',
        action: 'API Error',
        label: 'Job fetch failed'
      });
    } finally {
      setLoading(false)
      // Set a small delay before removing the searching state for better UX
      setTimeout(() => setIsSearching(false), 300)
    }
  }, [debouncedSearch, selectedSource, page, trackEvent])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setPage(1)
  }

  const handleSourceChange = (source: string) => {
    setSelectedSource(source)
    setPage(1)
  }

  const handlePreviousPage = () => {
    setPage((p) => Math.max(1, p - 1))
    
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
  }

  const handleNextPage = () => {
    setPage((p) => p + 1)
    
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
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedSource('')
    setPage(1)
    
    // Track clear filters event
    trackEvent({
      category: 'Filter',
      action: 'Clear Filters'
    });
  }

  const toggleSourceFilter = () => {
    setShowSourceFilter(!showSourceFilter)
    
    // Track filter toggle
    trackEvent({
      category: 'UI',
      action: 'Toggle Source Filter',
      label: showSourceFilter ? 'Hide' : 'Show'
    });
  }

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">
            BirJob
          </h1>
          <div className="w-full max-w-xl mx-auto">
            <div className="relative flex gap-2">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="search"
                  placeholder="Search jobs or companies..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 transition-all focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-700"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                onClick={toggleSourceFilter}
                className="flex items-center gap-1 dark:bg-gray-800 dark:text-white dark:border-gray-700"
                aria-expanded={showSourceFilter}
              >
                <FilterIcon className="h-4 w-4" />
                {selectedSource ? <span className="hidden sm:inline">Filter: {selectedSource}</span> : <span className="hidden sm:inline">Filter</span>}
              </Button>
              {(search || selectedSource) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="flex items-center dark:text-gray-300"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Clear</span>
                </Button>
              )}
            </div>
            
            {showSourceFilter && jobsData?.sources && (
              <div className="mt-2 p-4 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-md shadow-sm animate-in slide-in-from-top duration-300 ease-in-out">
                <Label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Filter by Source:</Label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto custom-scrollbar">
                  <Button
                    variant={!selectedSource ? "default" : "outline"}
                    onClick={() => handleSourceChange('')}
                    className="text-xs py-1 h-8 dark:border-gray-700"
                  >
                    All
                  </Button>
                  {jobsData.sources.map((source) => (
                    <Button
                      key={source}
                      variant={selectedSource === source ? "default" : "outline"}
                      onClick={() => handleSourceChange(source)}
                      className="text-xs py-1 h-8 dark:border-gray-700"
                    >
                      {source}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            {jobsData?.metadata && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                <p>Last Updated: {new Date(jobsData.metadata.latestScrapeDate).toLocaleString()}</p>
                <p className="font-medium">
                  Found {jobsData.metadata.totalJobs} {selectedSource ? `${selectedSource} ` : ''}jobs
                  {search ? ` matching "${search}"` : ''}
                </p>
              </div>
            )}
          </div>
        </div>

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
                  {search || selectedSource ? 
                    `Try adjusting your search or filters to see more results.` : 
                    `There are currently no job listings available.`}
                </p>
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
          <div className="flex justify-center gap-4 items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Button
              onClick={handlePreviousPage}
              disabled={page === 1 || loading}
              className="font-medium px-6 py-2 transition-all"
              variant={page === 1 ? "outline" : "default"}
            >
              Previous
            </Button>
            
            <div className="flex items-center text-sm font-medium">
              <span className="hidden sm:block mr-2">Page</span>
              <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-md">
                {page}
              </span>
              <span className="mx-2">of</span>
              <span className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-md">
                {jobsData.metadata.totalPages}
              </span>
            </div>
            
            <Button
              onClick={handleNextPage}
              disabled={page >= jobsData.metadata.totalPages || loading}
              className="font-medium px-6 py-2 transition-all"
              variant={page >= jobsData.metadata.totalPages ? "outline" : "default"}
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
            icon={<search className="h-8 w-8" />}
            variant="secondary"
          />
        </div>
      </div>
    </div>
  );
}