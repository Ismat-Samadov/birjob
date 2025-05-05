// src/app/notifications/page.tsx
"use client"

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Use dynamic import to load client components
const KeywordManager = dynamic(() => import('@/components/KeywordManager'), { ssr: false });
const NotificationPreferences = dynamic(() => import('@/components/NotificationPreferences'), { ssr: false });

export default function NotificationsPage() {
  const [email, setEmail] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'keywords' | 'schedule'>('keywords');

  const handleEmailSubmit = async () => {
    setError('');
    
    // Validate email format
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoggedIn(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEmailSubmit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center">Daily Job Notifications</h1>
          <p className="text-center text-gray-600 mt-2">
            Get daily email alerts for jobs matching your keywords
          </p>
        </div>
      
        {!isLoggedIn ? (
          <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Enter your email</h2>
            <div className="space-y-4">
              <Input
                type="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full"
              />
              <Button 
                onClick={handleEmailSubmit} 
                className="w-full"
              >
                Continue
              </Button>
              {error && (
                <div className="p-2 bg-red-50 text-red-800 rounded-md">
                  {error}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  <button
                    onClick={() => setActiveTab('keywords')}
                    className={`${
                      activeTab === 'keywords'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Keywords
                  </button>
                  <button
                    onClick={() => setActiveTab('schedule')}
                    className={`${
                      activeTab === 'schedule'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Schedule
                  </button>
                </nav>
              </div>
            </div>
            
            {activeTab === 'keywords' ? (
              <KeywordManager email={email} />
            ) : (
              <NotificationPreferences email={email} />
            )}
          </div>
        )}
      
        <div className="mt-12 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold mb-4">How It Works</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Enter your email address to access your notification settings</li>
            <li>Add keywords related to job positions you&apos;re interested in</li>
            <li>Receive one comprehensive email daily with all matching jobs</li>
            <li>Click on any job to apply directly on the company website</li>
            <li>Manage your keywords anytime to adjust your job alerts</li>
          </ol>
          <div className="mt-6 pt-4 border-t border-gray-100">
            <h3 className="text-lg font-medium mb-2">Tips for Effective Keywords</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Use broad terms for your field (e.g., &ldquo;developer&rdquo;, &ldquo;marketing&rdquo;)</li>
              <li>Include specific skills (e.g., &ldquo;python&rdquo;, &ldquo;react&rdquo;, &ldquo;analytics&rdquo;)</li>
              <li>Add job titles you&apos;re interested in (e.g., &ldquo;project manager&rdquo;)</li>
              <li>Consider including seniority levels (e.g., &ldquo;senior&rdquo;, &ldquo;lead&rdquo;)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}