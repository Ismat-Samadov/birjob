'use client'
 
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { useAnalytics } from '@/lib/hooks/useAnalytics'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { trackEvent } = useAnalytics();
  
  useEffect(() => {
    // Log the error to analytics
    trackEvent({
      category: 'Error',
      action: 'Application Error',
      label: error.message || 'Unknown Error'
    });
    
    // You could also send to a real error monitoring service here
    console.error('Application error:', error);
  }, [error, trackEvent]);
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <AlertTriangle className="h-20 w-20 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Something went wrong
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-400">
          We encountered an unexpected error. Our team has been notified.
        </p>
        
        <div className="space-y-4 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={reset}
              className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            
            <Link href="/" passHref>
              <Button 
                className="w-full flex items-center justify-center bg-gray-600 hover:bg-gray-700"
              >
                <Home className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-md text-left text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium mb-1">Error Information:</p>
            <p className="font-mono break-all overflow-x-auto">
              {error.digest ? `Error ID: ${error.digest}` : 'Unknown Error'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}