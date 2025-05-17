"use client"

import React, { useState } from 'react';
import { ExternalLink, Bookmark, Share2, Clock, MapPin, Building } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import RelatedJobs from '@/components/RelatedJobs';

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  source: string | null;
  apply_link: string;
  created_at: string;
  location?: string;
}

export default function JobCard({ 
  id, 
  title, 
  company, 
  source, 
  apply_link, 
  created_at,
  location 
}: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { trackEvent } = useAnalytics();
  
  const handleApply = () => {
    trackEvent({
      category: 'Job',
      action: 'Apply Click',
      label: `${title} at ${company}`
    });
    window.open(apply_link, '_blank');
  };
  
  const handleSave = () => {
    setIsSaved(!isSaved);
    trackEvent({
      category: 'Job',
      action: isSaved ? 'Unsave' : 'Save',
      label: `${title} at ${company}`
    });
  };
  
  const handleShare = async () => {
    trackEvent({
      category: 'Job',
      action: 'Share',
      label: `${title} at ${company}`
    });
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${title} at ${company}`,
          text: `Check out this job: ${title} at ${company}`,
          url: apply_link
        });
      } catch (error) {
        console.error('Error sharing', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(apply_link);
      alert('Link copied to clipboard!');
    }
  };
  
  // Toggle expanded view for job details
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
    trackEvent({
      category: 'Job',
      action: isExpanded ? 'Collapse Details' : 'Expand Details',
      label: `${title} at ${company}`
    });
  };
  
  // Calculate how long ago the job was posted
  const postedDate = new Date(created_at);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });

  // Prepare structured job data for Schema.org
  const jobPostingSchema = {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    "title": title,
    "datePosted": postedDate.toISOString(),
    "validThrough": new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    "description": `${title} position at ${company}. Apply now for this exciting opportunity.`,
    "hiringOrganization": {
      "@type": "Organization",
      "name": company,
      "sameAs": apply_link.startsWith("http") ? apply_link.split("/").slice(0, 3).join("/") : null
    },
    "jobLocation": {
      "@type": "Place",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": location || "Various Locations",
        "addressCountry": "AZ"
      }
    },
    "applicantLocationRequirements": {
      "@type": "Country",
      "name": "Azerbaijan"
    },
    "employmentType": "FULL_TIME",
    "identifier": {
      "@type": "PropertyValue",
      "name": company,
      "value": id.toString()
    },
    "url": apply_link
  };
  
  return (
    <>
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingSchema) }}
      />
    
      <Card className="job-card hover:shadow-md transition-shadow duration-200 dark:bg-gray-800">
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold job-title dark:text-white">{title}</h3>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <div className="flex items-center">
                  <Building className="h-4 w-4 text-gray-500 dark:text-gray-400 mr-1" />
                  <p className="text-sm text-gray-500 dark:text-gray-400 job-company">{company}</p>
                </div>
                {location && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="capitalize">{location}</span>
                  </div>
                )}
                {source && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                    {source}
                  </span>
                )}
              </div>
            </div>
            <Button
              onClick={handleApply}
              className="w-full sm:w-auto sm:ml-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              aria-label={`Apply for ${title} at ${company}`}
            >
              Apply <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            <Clock className="h-4 w-4 mr-1" />
            <span>Posted {timeAgo}</span>
          </div>
          
          {/* Job description (optional) - shows when expanded */}
          {isExpanded && (
            <div className="my-4 text-gray-700 dark:text-gray-300 text-sm">
              <p>
                {/* This would be populated with actual job description if available */}
                {`${title} position at ${company}. This is a great opportunity for qualified candidates.`}
              </p>
              <Button
                onClick={handleApply}
                className="mt-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
              >
                Apply Now <ExternalLink className="ml-1 h-4 w-4" />
              </Button>
            </div>
          )}
          
          <div className="flex mt-4 space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleSave}
              className={isSaved ? 
                "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" : 
                "dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"}
              aria-label={isSaved ? "Remove from saved jobs" : "Save this job"}
            >
              <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? "fill-blue-700 dark:fill-blue-400" : ""}`} />
              {isSaved ? "Saved" : "Save"}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleShare}
              className="dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              aria-label={`Share ${title} job at ${company}`}
            >
              <Share2 className="h-4 w-4 mr-1" />
              Share
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleExpanded}
              className="dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              aria-expanded={isExpanded}
              aria-controls={`job-details-${id}`}
            >
              {isExpanded ? "Less Details" : "More Details"}
            </Button>
          </div>
          
          {/* Related Jobs section */}
          {!isExpanded && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <RelatedJobs 
                company={company}
                currentJobId={id}
                limit={3}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}