// src/app/not-found.tsx
"use client"

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileQuestion, Search, Bell, ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useAnalytics } from "@/lib/hooks/useAnalytics";

export default function NotFound() {
  const { trackEvent } = useAnalytics();

  useEffect(() => {
    // Track 404 error
    trackEvent({
      category: 'Error',
      action: '404 Not Found',
      label: window.location.pathname
    });
  }, [trackEvent]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <FileQuestion className="h-20 w-20 text-blue-500 dark:text-blue-400" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Here are some helpful links:
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/" passHref>
              <Button 
                className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  trackEvent({
                    category: 'Navigation',
                    action: '404 Redirect',
                    label: 'Home'
                  });
                }}
              >
                <Search className="mr-2 h-4 w-4" />
                Search Jobs
              </Button>
            </Link>
            
            <Link href="/notifications" passHref>
              <Button 
                className="w-full flex items-center justify-center bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  trackEvent({
                    category: 'Navigation',
                    action: '404 Redirect',
                    label: 'Notifications'
                  });
                }}
              >
                <Bell className="mr-2 h-4 w-4" />
                Job Alerts
              </Button>
            </Link>
          </div>
          
          <Button
            variant="ghost"
            className="mt-6 text-gray-600 dark:text-gray-400"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}