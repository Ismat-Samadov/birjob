"use client"

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FilterIcon, CheckIcon, XCircleIcon } from "lucide-react";

interface SourceManagerProps {
  email: string;
}

interface Source {
  id: number;
  source: string;
  createdAt: string;
}

export default function SourceManager({ email }: SourceManagerProps) {
  const [sources, setSources] = useState<Source[]>([]);
  const [selectedSourceIds, setSelectedSourceIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  // Fetch sources and user preferences
  const fetchSources = useCallback(async () => {
    if (!email) return;

    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(`/api/users/sources?email=${encodeURIComponent(email)}`);
      const data = await response.json();
      
      if (response.ok) {
        setSources(data.allSources || []);
        setSelectedSourceIds(data.userSelectedSourceIds || []);
        
        if (data.message && initialLoad) {
          setMessage(data.message);
          setInitialLoad(false);
        }
      } else {
        throw new Error(data.error || 'Failed to fetch sources');
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
  }, [email, initialLoad]);

  // Save user source preferences
  const saveSourcePreferences = async () => {
    setIsLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await fetch('/api/users/sources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email, 
          sourceIds: selectedSourceIds 
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Source preferences saved successfully!');
      } else {
        throw new Error(data.error || 'Failed to save source preferences');
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

  // Handle source selection
  const toggleSource = (sourceId: number) => {
    setSelectedSourceIds(prev => {
      if (prev.includes(sourceId)) {
        return prev.filter(id => id !== sourceId);
      } else {
        return [...prev, sourceId];
      }
    });
  };

  // Select all sources
  const selectAll = () => {
    setSelectedSourceIds(sources.map(source => source.id));
  };

  // Deselect all sources
  const deselectAll = () => {
    setSelectedSourceIds([]);
  };

  // Load sources on component mount
  useEffect(() => {
    fetchSources();
  }, [fetchSources]);

  return (
    <Card className="w-full shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Job Source Preferences</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Select job sources to monitor</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={selectAll}
                disabled={isLoading || sources.length === 0}
                className="flex items-center"
              >
                <CheckIcon className="w-4 h-4 mr-2" />
                Select All
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={deselectAll}
                disabled={isLoading || selectedSourceIds.length === 0}
                className="flex items-center"
              >
                <XCircleIcon className="w-4 h-4 mr-2" />
                Deselect All
              </Button>
            </div>
          </div>
          
          {sources.length === 0 ? (
            <p className="text-gray-500 italic">No job sources available</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {sources.map((source) => (
                <div key={source.id} className="flex items-center space-x-2 bg-gray-50 p-3 rounded-md">
                  <Checkbox 
                    id={`source-${source.id}`} 
                    checked={selectedSourceIds.includes(source.id)}
                    onCheckedChange={() => toggleSource(source.id)}
                    disabled={isLoading}
                  />
                  <Label 
                    htmlFor={`source-${source.id}`}
                    className="cursor-pointer flex-1"
                  >
                    {source.source}
                  </Label>
                </div>
              ))}
            </div>
          )}
          
          <div className="pt-4">
            <Button 
              onClick={saveSourcePreferences}
              disabled={isLoading}
              className="w-full md:w-auto"
            >
              <FilterIcon className="w-4 h-4 mr-2" />
              Save Source Preferences
            </Button>
          </div>
          
          <div className="text-sm text-gray-500 italic">
            {selectedSourceIds.length === 0 ? (
              <p>No sources selected: You will receive notifications from ALL job sources</p>
            ) : (
              <p>You will only receive notifications from the {selectedSourceIds.length} selected job sources</p>
            )}
          </div>

          {error && (
            <div className="p-2 bg-red-50 text-red-800 rounded-md">
              {error}
            </div>
          )}
          
          {message && (
            <div className="p-2 bg-green-50 text-green-800 rounded-md">
              {message}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}