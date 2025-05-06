// src/app/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDebounce } from '@/lib/hooks/useDebounce'
import { FilterIcon, X } from 'lucide-react'

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

export default function Home() {
  const [jobsData, setJobsData] = useState<JobsResponse | null>(null)
  const [search, setSearch] = useState<string>('')
  const [selectedSource, setSelectedSource] = useState<string>('')
  const [showSourceFilter, setShowSourceFilter] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const debouncedSearch = useDebounce<string>(search, 500)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const queryParams = new URLSearchParams()
      
      if (debouncedSearch) {
        queryParams.append('search', debouncedSearch)
      }
      
      if (selectedSource) {
        queryParams.append('source', selectedSource)
      }
      
      queryParams.append('page', page.toString())
      
      const response = await fetch(
        `/api/jobs?${queryParams.toString()}`
      )
      const data: JobsResponse = await response.json()
      setJobsData(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, selectedSource, page])

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
  }

  const handleNextPage = () => {
    setPage((p) => p + 1)
  }

  const clearFilters = () => {
    setSearch('')
    setSelectedSource('')
    setPage(1)
  }

  const toggleSourceFilter = () => {
    setShowSourceFilter(!showSourceFilter)
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center">BirJob</h1>
          <div className="w-full max-w-xl mx-auto">
            <div className="flex gap-2">
              <Input
                type="search"
                placeholder="Search jobs or companies..."
                value={search}
                onChange={handleSearch}
                className="w-full"
              />
              <Button
                variant="outline"
                onClick={toggleSourceFilter}
                className="flex items-center gap-1"
                aria-expanded={showSourceFilter}
              >
                <FilterIcon className="h-4 w-4" />
                {selectedSource ? <span className="hidden sm:inline">Filter: {selectedSource}</span> : <span className="hidden sm:inline">Filter</span>}
              </Button>
              {(search || selectedSource) && (
                <Button
                  variant="ghost"
                  onClick={clearFilters}
                  className="flex items-center"
                >
                  <X className="h-4 w-4" />
                  <span className="hidden sm:inline ml-1">Clear</span>
                </Button>
              )}
            </div>
            
            {showSourceFilter && jobsData?.sources && (
              <div className="mt-2 p-4 bg-white border rounded-md shadow-sm">
                <Label className="block mb-2 font-medium">Filter by Source:</Label>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  <Button
                    variant={!selectedSource ? "default" : "outline"}
                    onClick={() => handleSourceChange('')}
                    className="text-xs py-1 h-8"
                  >
                    All
                  </Button>
                  {jobsData.sources.map((source) => (
                    <Button
                      key={source}
                      variant={selectedSource === source ? "default" : "outline"}
                      onClick={() => handleSourceChange(source)}
                      className="text-xs py-1 h-8"
                    >
                      {source}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
          {jobsData?.metadata && (
            <div className="text-center text-sm text-gray-600">
              <p>Last Updated: {new Date(jobsData.metadata.latestScrapeDate).toLocaleString()}</p>
              <p>Found {jobsData.metadata.totalJobs} {selectedSource ? `${selectedSource} ` : ''}jobs{search ? ` matching "${search}"` : ''}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {loading ? (
            <p className="text-center">Loading...</p>
          ) : !jobsData?.jobs.length ? (
            <p className="text-center">No jobs found</p>
          ) : (
            jobsData.jobs.map((job: Job) => (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{job.title}</CardTitle>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500">{job.company}</p>
                        {job.source && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {job.source}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => window.open(job.apply_link, '_blank')}
                      className="ml-4"
                    >
                      Apply
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Posted: {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {jobsData?.metadata && jobsData.jobs.length > 0 && (
          <div className="flex justify-center gap-4">
            <Button
              onClick={handlePreviousPage}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <span className="flex items-center">
              Page {page} of {jobsData.metadata.totalPages}
            </span>
            <Button
              onClick={handleNextPage}
              disabled={page >= jobsData.metadata.totalPages || loading}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </main>
  )
}