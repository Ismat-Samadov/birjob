// src/app/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { useDebounce } from '@/lib/hooks/useDebounce'

interface Job {
  id: number
  title: string
  company: string
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
  metadata: JobsMetadata
}

export default function Home() {
  const [jobsData, setJobsData] = useState<JobsResponse | null>(null)
  const [search, setSearch] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const debouncedSearch = useDebounce<string>(search, 500)

  const fetchJobs = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(
        `/api/jobs?search=${debouncedSearch}&page=${page}`
      )
      const data: JobsResponse = await response.json()
      setJobsData(data)
    } catch (error) {
      console.error('Error fetching jobs:', error)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, page])

  useEffect(() => {
    fetchJobs()
  }, [fetchJobs])

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    setPage(1)
  }

  const handlePreviousPage = () => {
    setPage((p) => Math.max(1, p - 1))
  }

  const handleNextPage = () => {
    setPage((p) => p + 1)
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-center">BirJob</h1>
          <div className="w-full max-w-xl mx-auto">
            <Input
              type="search"
              placeholder="Search jobs or companies..."
              value={search}
              onChange={handleSearch}
              className="w-full"
            />
          </div>
          {jobsData?.metadata && (
            <div className="text-center text-sm text-gray-600">
              <p>Last Updated: {new Date(jobsData.metadata.latestScrapeDate).toLocaleString()}</p>
              <p>Found {jobsData.metadata.totalJobs} unique jobs</p>
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
                      <p className="text-sm text-gray-500">{job.company}</p>
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