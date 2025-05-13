"use client"

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAnalytics } from "@/lib/hooks/useAnalytics";

export default function Footer() {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const { trackEvent } = useAnalytics();

  // Update year when component mounts
  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-8">
          <div className="col-span-2 md:col-span-1 mb-6 md:mb-0">
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">BirJob</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Your Ultimate Job Aggregator</p>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">Navigate</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" onClick={() => trackEvent({category: 'Navigation', action: 'Footer Click', label: 'Home'})} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" onClick={() => trackEvent({category: 'Navigation', action: 'Footer Click', label: 'Blog'})} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  <span className="flex items-center">
                    Blog
                    <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 rounded-full">New</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/notifications" onClick={() => trackEvent({category: 'Navigation', action: 'Footer Click', label: 'Notifications'})} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Notifications
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog/top-job-hunting-strategies-2025" onClick={() => trackEvent({category: 'Navigation', action: 'Footer Click', label: 'Job Hunting Strategies'})} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Job Hunting Strategies
                </Link>
              </li>
              <li>
                <Link href="/blog/ats-friendly-resume-tips" onClick={() => trackEvent({category: 'Navigation', action: 'Footer Click', label: 'Resume Tips'})} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Resume Tips
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" onClick={() => trackEvent({category: 'Navigation', action: 'Footer Click', label: 'Privacy Policy'})} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" onClick={() => trackEvent({category: 'Navigation', action: 'Footer Click', label: 'Terms of Service'})} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">Contact</h3>
            <ul className="space-y-2">
              <li className="text-sm text-gray-500 dark:text-gray-400">
                <Link href="/contact" onClick={() => trackEvent({category: 'Navigation', action: 'Footer Click', label: 'Contact Us'})} className="hover:text-blue-600 dark:hover:text-blue-400">
                  Contact Us
                </Link>
              </li>
              <li className="text-sm text-gray-500 dark:text-gray-400">
                <Link href="/about" onClick={() => trackEvent({category: 'Navigation', action: 'Footer Click', label: 'About Us'})} className="hover:text-blue-600 dark:hover:text-blue-400">
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-800 flex justify-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            © {currentYear} BirJob. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}