"use client"

import React, { useState } from 'react';
import { ExternalLink, Bookmark, Share2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAnalytics } from '@/lib/hooks/useAnalytics';

interface JobCardProps {
  id: number;
  title: string;
  company: string;
  source: string | null;
  apply_link: string;
  created_at: string;
}

export default function JobCard({ id, title, company, source, apply_link, created_at }: JobCardProps) {
  const [isSaved, setIsSaved] = useState(false);
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
  
  // Calculate how long ago the job was posted
  const postedDate = new Date(created_at);
  const timeAgo = formatDistanceToNow(postedDate, { addSuffix: true });
  
  return (
    <Card className="job-card hover:shadow-md transition-shadow duration-200 dark:bg-gray-800">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold job-title">{title}</h3>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-sm text-gray-500 dark:text-gray-400 job-company">{company}</p>
              {source && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                  {source}
                </span>
              )}
            </div>
          </div>
          <Button
            onClick={handleApply}
            className="ml-4 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
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
        
        <div className="flex mt-4 space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSave}
            className={isSaved ? "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" : ""}
          >
            <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? "fill-blue-700 dark:fill-blue-400" : ""}`} />
            {isSaved ? "Saved" : "Save"}
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-1" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}