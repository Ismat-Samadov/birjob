// src/components/LocationJobsContent.tsx
"use client"

import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useDebounce } from '@/lib/hooks/useDebounce';
import { Search as SearchIcon, Bell, MapPin } from 'lucide-react';
import JobCard from '@/components/JobCard';
import LazyLoad from '@/components/LazyLoad';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import FeatureSpotlight from '@/components/FeatureSpotlight';
import Head from 'next/head';

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
  sources?: string[];
  companies?: string[];
  metadata: JobsMetadata;
}

interface LocationJobsContentProps {
  location: string;
}

export default function LocationJobsContent({ location }: LocationJobsContentProps) {
  const [jobsData, setJobsData] = useState<JobsResponse | null>(null);
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const debouncedSearch = useDebounce<string>(search, 500);
  const { trackEvent } = useAnalytics();
  
  // Format location name for display
  const formattedLocation = location.charAt(0).toUpperCase() + location.slice(1);

  // Fetch jobs for this location
  useEffect(() => {
    const fetchLocationJobs = async () => {
      setLoading(true);
      
      try {
        const queryParams = new URLSearchParams();
        
        if (debouncedSearch) {
          queryParams.append('search', debouncedSearch);
        }
        
        // Add location as a search parameter
        queryParams.append('location', location);
        queryParams.append('page', page.toString());
        
        const response = await fetch(`/api/jobs?${queryParams.toString()}`);
        const data = await response.json();
        
        setJobsData(data);
        
        // Track page view with location data
        trackEvent({
          category: 'Location',
          action: 'View Location Jobs',
          label: formattedLocation
        });
      } catch (error) {
        console.error('Error fetching location jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLocationJobs();
  }, [debouncedSearch, location, page, formattedLocation, trackEvent]);

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
      <Head>
        <title>{formattedLocation} Jobs | BirJob</title>
        <meta name="description" content={`Find the latest job opportunities in ${formattedLocation}. Browse local career openings and set up personalized job alerts.`} />
        <meta property="og:title" content={`${formattedLocation} Jobs | BirJob`} />
        <meta property="og:description" content={`Find the latest job opportunities in ${formattedLocation}. Browse local career openings.`} />
        <meta property="og:url" content={`https://birjob.com/jobs/location/${location}`} />
        <link rel="canonical" href={`https://birjob.com/jobs/location/${location}`} />
      </Head>
      
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="text-blue-500 mr-2 h-6 w-6" />
            <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-900 dark:text-white">
              Jobs in {formattedLocation}
            </h1>
          </div>
          
          <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Browse the latest job opportunities in {formattedLocation}. We aggregate positions from over 50 different sources to bring you the most comprehensive job listings.
          </p>
          
          <div className="w-full max-w-xl mx-auto">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-grow">
                <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={`Search ${formattedLocation} jobs...`}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 transition-all focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:border-gray-700"
                  aria-label={`Search for jobs in ${formattedLocation}`}
                />
              </div>
            </div>
            
            {jobsData?.metadata && (
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4 p-2 bg-white dark:bg-gray-800 rounded-md shadow-sm border border-gray-200 dark:border-gray-700">
                <p>Found {jobsData.metadata.totalJobs} jobs in {formattedLocation}</p>
              </div>
            )}
          </div>
        </div>

        {/* Job listings */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index} className="animate-pulse dark:bg-gray-800 p-6">
                  <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </Card>
              ))}
            </div>
          ) : !jobsData?.jobs || jobsData.jobs.length === 0 ? (
            <Card className="dark:bg-gray-800 p-8">
              <div className="text-center p-6">
                <SearchIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No jobs found in {formattedLocation}</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {search ? 
                    `Try adjusting your search to see more results in ${formattedLocation}.` : 
                    `There are currently no job listings available in ${formattedLocation}.`}
                </p>
              </div>
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

        {/* Pagination */}
        {jobsData?.metadata && jobsData.jobs && jobsData.jobs.length > 0 && (
          <div className="flex justify-center gap-4 items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || loading}
              className="font-medium px-6 py-2 transition-all"
              variant={page === 1 ? "outline" : "default"}
            >
              Previous
            </Button>
            
            <div className="flex items-center text-sm font-medium">
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
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= jobsData.metadata.totalPages || loading}
              className="font-medium px-6 py-2 transition-all"
              variant={page >= jobsData.metadata.totalPages ? "outline" : "default"}
            >
              Next
            </Button>
          </div>
        )}
        
        {/* Feature spotlights */}
        <div className="space-y-4 mt-8">
          <FeatureSpotlight 
            title={`Get ${formattedLocation} Job Alerts`}
            description={`Never miss a job opportunity in ${formattedLocation}. Set up daily email notifications for new positions in your area.`}
            buttonText="Set Up Notifications"
            buttonLink="/notifications"
            icon={<Bell className="h-8 w-8" />}
            variant="primary"
          />
        </div>
      </div>
      
      {/* Location-specific schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": `${formattedLocation} Jobs | BirJob`,
            "description": `Find the latest job opportunities in ${formattedLocation}. Browse local career openings and set up personalized job alerts.`,
            "url": `https://birjob.com/jobs/location/${location}`,
            "mainEntity": {
              "@type": "ItemList",
              "itemListElement": jobsData?.jobs?.map((job: Job, index: number) => ({
                "@type": "ListItem",
                "position": index + 1,
                "item": {
                  "@type": "JobPosting",
                  "title": job.title,
                  "hiringOrganization": {
                    "@type": "Organization",
                    "name": job.company
                  },
                  "datePosted": job.created_at,
                  "jobLocation": {
                    "@type": "Place",
                    "address": {
                      "@type": "PostalAddress",
                      "addressLocality": formattedLocation,
                      "addressCountry": "AZ"
                    }
                  }
                }
              })) || []
            }
          })
        }}
      />
    </div>
  );
}