"use client"

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export default function Navbar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => {
    return pathname === path ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-500';
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">BirJob</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="flex space-x-6">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/')}`}>
                <Search className="h-4 w-4 mr-1" />
                Job Search
              </Link>
              
              <Link 
                href="/notifications" 
                className={`inline-flex items-center px-1 pt-1 text-sm font-medium ${isActive('/notifications')}`}>
                <Bell className="h-4 w-4 mr-1" />
                Notifications
              </Link>
            </nav>
            
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}