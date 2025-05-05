"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X } from "lucide-react";

interface KeywordManagerProps {
  email?: string;
}

export default function KeywordManager({ email: propEmail }: KeywordManagerProps) {
  const [email, setEmail] = useState(propEmail || '');
  const [keywords, setKeywords] = useState<string[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(!!propEmail);

  // Use useCallback to memoize the function
  const handleEmailSubmit = useCallback(async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Validate email format
      if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        throw new Error('Please enter a valid email address');
      }
      
      // API call to fetch user keywords
      const response = await fetch(`/api/users/keywords?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (response.ok) {
        setKeywords(data.keywords || []);
        setIsLoggedIn(true);
        setMessage(data.keywords.length ? `Found ${data.keywords.length} keywords for ${email}` : `Welcome! Add keywords to receive job notifications at ${email}`);
      } else {
        throw new Error(data.error || 'Failed to retrieve keywords');
      }
    } catch (err) {
      // Fix TypeScript error by checking if err is an Error object
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  }, [email]); // Add email as a dependency

  const addKeyword = async () => {
    if (!newKeyword.trim()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/users/keywords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, keyword: newKeyword })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setKeywords([...keywords, newKeyword]);
        setNewKeyword('');
        setMessage(`Keyword "${newKeyword}" added successfully!`);
      } else {
        throw new Error(data.error || 'Failed to add keyword');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const removeKeyword = async (keywordToRemove: string) => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/users/keywords', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, keyword: keywordToRemove })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setKeywords(keywords.filter(k => k !== keywordToRemove));
        setMessage(`Keyword "${keywordToRemove}" removed successfully!`);
      } else {
        throw new Error(data.error || 'Failed to remove keyword');
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (!isLoggedIn) {
        handleEmailSubmit();
      } else if (newKeyword.trim()) {
        addKeyword();
      }
    }
  };

  // If email is provided as a prop, trigger the API call to fetch keywords on mount
  useEffect(() => {
    if (propEmail) {
      setEmail(propEmail);
      handleEmailSubmit();
    }
  }, [propEmail, handleEmailSubmit]); // Add handleEmailSubmit as a dependency

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-2xl font-bold text-center">BirJob Notification Manager</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {!isLoggedIn ? (
          <div className="space-y-6">
            <p className="text-gray-600 text-center">
              Enter your email to manage job notification keywords
            </p>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className="flex-1"
                />
                <Button 
                  onClick={handleEmailSubmit} 
                  disabled={isLoading}
                >
                  {isLoading ? 'Loading...' : 'Continue'}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Manage Keywords for: {email}</h3>
              {!propEmail && (
                <Button 
                  className="text-sm bg-transparent text-gray-700 border border-gray-300 hover:bg-gray-100"
                  onClick={() => setIsLoggedIn(false)}
                >
                  Change Email
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add new keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-1"
              />
              <Button 
                onClick={addKeyword} 
                disabled={isLoading || !newKeyword.trim()}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Your Keywords:</h4>
              {keywords.length === 0 ? (
                <p className="text-gray-500 italic">No keywords yet. Add keywords to receive daily job notifications at 1:00 PM UTC.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {keywords.map((keyword, index) => (
                    <div 
                      key={index} 
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                    >
                      <span className="mr-2">{keyword}</span>
                      <button 
                        onClick={() => removeKeyword(keyword)}
                        className="text-gray-500 hover:text-red-500 transition-colors"
                        disabled={isLoading}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
        
        {error && (
          <div className="mt-4 p-2 bg-red-50 text-red-800 rounded-md">
            {error}
          </div>
        )}
        
        {message && (
          <div className="mt-4 p-2 bg-green-50 text-green-800 rounded-md">
            {message}
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
          <p>You&apos;ll receive one email notification daily at 1:00 PM UTC for jobs matching your keywords.</p>
        </div>
      </CardContent>
    </Card>
  );
}