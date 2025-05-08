"use client"

import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import KeywordManager from '@/components/KeywordManager';
import SourceManager from '@/components/SourceManager';
import NotificationPreferences from '@/components/NotificationPreferences';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import { useEffect } from 'react';

export default function NotificationsContent() {
  const [email, setEmail] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'keywords' | 'sources' | 'schedule'>('keywords');
  const { trackPageView, trackEvent } = useAnalytics();

  useEffect(() => {
    trackPageView({
      url: '/notifications',
      title: 'Notifications - BirJob'
    });
  }, [trackPageView]);

  const handleEmailSubmit = async () => {
    setError('');
    
    // Validate email format
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoggedIn(true);
    
    trackEvent({
      category: 'Authentication',
      action: 'Email Submission',
      label: 'Notifications Page'
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailSubmit();
    }
  };

  const handleTabChange = (tab: 'keywords' | 'sources' | 'schedule') => {
    setActiveTab(tab);
    
    trackEvent({
      category: 'Navigation',
      action: 'Tab Change',
      label: `Notifications - ${tab}`
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">Daily Job Notifications</h1>
          <p className="text-center text-gray-600 dark:text-gray-400 mt-2">
            Get daily email alerts for jobs matching your keywords and preferred sources
          </p>
        </div>
      
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Enter your email</h2>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              />
              <Button 
                onClick={handleEmailSubmit} 
                className="w-full"
              >
                Continue
              </Button>
              {error && (
                <div className="p-2 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-md">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <nav className="-mb-px flex space-x-4 sm:space-x-8 px-1">
                  <button
                    onClick={() => handleTabChange('keywords')}
                    className={`${
                      activeTab === 'keywords'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-shrink-0`}
                  >
                    Keywords
                  </button>
                  <button
                    onClick={() => handleTabChange('sources')}
                    className={`${
                      activeTab === 'sources'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-shrink-0`}
                  >
                    Sources
                  </button>
                  <button
                    onClick={() => handleTabChange('schedule')}
                    className={`${
                      activeTab === 'schedule'
                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex-shrink-0`}
                  >
                    Schedule
                  </button>
                </nav>
              </div>
            </div>
            
            {activeTab === 'keywords' ? (
              <KeywordManager email={email} />
            ) : activeTab === 'sources' ? (
              <SourceManager email={email} />
            ) : (
              <NotificationPreferences email={email} />
            )}
          </div>
        )}
      
        <div className="mt-12 max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Enter your email address to access your notification settings</li>
            <li>Add keywords related to job positions you&apos;re interested in</li>
            <li>Select job sources you want to monitor (or leave all selected to check all sources)</li>
            <li>Receive one comprehensive email daily with all matching jobs</li>
            <li>Click on any job to apply directly on the company website</li>
          </ol>
          <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">Tips for Effective Notifications</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Use broad terms for your field (e.g., &ldquo;developer&rdquo;, &ldquo;marketing&rdquo;)</li>
              <li>Include specific skills (e.g., &ldquo;python&rdquo;, &ldquo;react&rdquo;, &ldquo;analytics&rdquo;)</li>
              <li>Select specific job sources if you have preferences for certain platforms</li>
              <li>If you don&apos;t select any sources, you&apos;ll receive matches from all available sources</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}