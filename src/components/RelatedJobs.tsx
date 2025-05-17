"use client"

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, Building } from 'lucide-react';
import Link from 'next/link';
import { useAnalytics } from '@/lib/hooks/useAnalytics';

interface Job {
  id: number;
  title: string;
  company: string;
  source: string | null;
  apply_link: string;
  created_at: string;
}

interface RelatedJobsProps {
  keyword?: string;
  company?: string;
  location?: string;
  currentJobId?: number;
  limit?: number;
}

export default function RelatedJobs({ 
  keyword, 
  company, 
  location,
  currentJobId,
  limit = 3 
}: RelatedJobsProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    const fetchRelatedJobs = async () => {
      setLoading(true);
      
      try {
        // Build query params based on what was provided
        const params = new URLSearchParams();
        
        if (keyword) {
          params.append('search', keyword);
        }
        
        if (company) {
          params.append('company', company);
        }
        
        if (location) {
          params.append('location', location);
        }
        
        params.append('limit', limit.toString());
        
        // If we have a current job ID, exclude it from results
        if (currentJobId) {
          params.append('exclude', currentJobId.toString());
        }
        
        // Fallback to regular /api/jobs if there's no dedicated endpoint yet
        const endpoint = '/api/jobs';
        
        const response = await fetch(`${endpoint}?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch related jobs');
        }
        
        const data = await response.json();
        setJobs(data.jobs || []);
        
        // Track impression
        trackEvent({
          category: 'RelatedJobs',
          action: 'Impression',
          label: keyword || company || location || 'General',
        });
      } catch (error) {
        console.error('Error fetching related jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (keyword || company || location) {
      fetchRelatedJobs();
    }
  }, [keyword, company, location, currentJobId, limit, trackEvent]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
        {[...Array(limit)].map((_, i) => (
          <div key={i} className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return null; // Don't show anything if no related jobs
  }

  return (
    <div className="space-y-3">
      <h3 className="text-md font-medium text-gray-800 dark:text-gray-200">
        {company ? `More jobs at ${company}` : 
         keyword ? `Similar jobs to "${keyword}"` : 
         location ? `More jobs in ${location}` :
         'You might also like'}
      </h3>
      
      <div className="space-y-3">
        {jobs.slice(0, limit).map(job => (
          <div key={job.id} className="border-b border-gray-100 dark:border-gray-700 pb-2 last:border-0 last:pb-0">
            <Link 
              href={job.apply_link} 
              target="_blank"
              onClick={() => {
                trackEvent({
                  category: 'RelatedJobs',
                  action: 'Click',
                  label: job.title,
                });
              }}
              className="block hover:bg-gray-50 dark:hover:bg-gray-800 -mx-1 p-1 rounded-md transition-colors"
            >
              <h4 className="text-sm font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 line-clamp-1">
                {job.title}
              </h4>
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-600 dark:text-gray-400 flex items-center">
                  <Building className="h-3 w-3 mr-1" />
                  {job.company}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-500 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
      
      <div className="text-center">
        <Button 
          variant="ghost" 
          size="sm"
          asChild
          className="text-blue-600 dark:text-blue-400 text-xs"
          onClick={() => {
            trackEvent({
              category: 'RelatedJobs',
              action: 'ViewMore',
              label: keyword || company || location || 'General',
            });
          }}
        >
          <Link href={
            company ? `/?company=${encodeURIComponent(company)}` : 
            keyword ? `/?search=${encodeURIComponent(keyword)}` : 
            location ? `/jobs/location/${encodeURIComponent(location)}` : 
            '/'
          }>
            View more jobs <ArrowRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}