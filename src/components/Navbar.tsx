"use client"

import Link from 'next/link';
import { Bell, Bot, Search, BarChart2, Menu, X, BookOpen } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [currentPath, setCurrentPath] = useState('/');
  
  // Handle mounting to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
    // Set current path on initial load
    setCurrentPath(window.location.pathname);
  }, []);
  
  // Use a safer alternative to usePathname which requires Suspense
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentPath(window.location.pathname);
      setIsMenuOpen(false);
    };

    // Listen for client-side navigation
    window.addEventListener('popstate', handleRouteChange);

    // Clean up the event listener
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Track click navigation to update current path
  const handleLinkClick = useCallback((path: string) => {
    setCurrentPath(path);
    setIsMenuOpen(false);
  }, []);
  
  const isActive = (path: string) => {
    return currentPath === path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500';
  };

  if (!isMounted) {
    return null;
  }

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" onClick={() => handleLinkClick('/')} className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">BirJob</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-6">
              <Link 
                href="/" 
                onClick={() => handleLinkClick('/')}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/')}`}>
                <Search className="h-4 w-4 mr-1" />
                Job Search
              </Link>
              <Link 
                href="/trends"
                onClick={() => handleLinkClick('/trends')}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/trends')}`}>
                <BarChart2 className="h-4 w-4 mr-1" />
                Trends
              </Link>
              <Link 
                href="/ai-assistant"
                onClick={() => handleLinkClick('/ai-assistant')}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/ai-assistant')}`}>
                <Bot className="h-4 w-4 mr-1" />
                AI Assistant
              </Link>
              <Link 
                href="/blog"
                onClick={() => handleLinkClick('/blog')}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/blog')}`}>
                <BookOpen className="h-4 w-4 mr-1" />
                Blog
              </Link>
              <Link 
                href="/notifications"
                onClick={() => handleLinkClick('/notifications')}
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/notifications')}`}>
                <Bell className="h-4 w-4 mr-1" />
                Notifications
              </Link>
            </nav>
            
            <ThemeToggle />
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex items-center md:hidden">
            <ThemeToggle />
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
              className="ml-2"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white dark:bg-gray-900 shadow-lg">
            <Link 
              href="/" 
              onClick={() => handleLinkClick('/')}
              className={`${currentPath === '/' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} block px-3 py-2 rounded-md text-base font-medium flex items-center`}
            >
              <Search className="h-5 w-5 mr-2" />
              Job Search
            </Link>
            <Link 
              href="/trends"
              onClick={() => handleLinkClick('/trends')}
              className={`${currentPath === '/trends' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} block px-3 py-2 rounded-md text-base font-medium flex items-center`}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Trends
            </Link>
            <Link 
              href="/ai-assistant"
              onClick={() => handleLinkClick('/ai-assistant')}
              className={`${currentPath === '/ai-assistant' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} block px-3 py-2 rounded-md text-base font-medium flex items-center`}
            >
              <Bot className="h-5 w-5 mr-2" />
              AI Assistant
            </Link>
            <Link 
              href="/blog"
              onClick={() => handleLinkClick('/blog')}
              className={`${currentPath === '/blog' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} block px-3 py-2 rounded-md text-base font-medium flex items-center`}
            >
              <BookOpen className="h-5 w-5 mr-2" />
              Blog
            </Link>
            <Link 
              href="/notifications"
              onClick={() => handleLinkClick('/notifications')}
              className={`${currentPath === '/notifications' ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300'} block px-3 py-2 rounded-md text-base font-medium flex items-center`}
            >
              <Bell className="h-5 w-5 mr-2" />
              Notifications
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}