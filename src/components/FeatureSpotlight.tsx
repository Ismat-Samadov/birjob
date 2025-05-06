"use client"

import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from '@/context/ToastContext';
import { useAnalytics } from '@/lib/hooks/useAnalytics';
import Link from 'next/link';

interface FeatureSpotlightProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary';
}

export default function FeatureSpotlight({
  title,
  description,
  buttonText,
  buttonLink,
  icon,
  variant = 'primary'
}: FeatureSpotlightProps) {
  const { addToast } = useToast();
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    // Track click event
    trackEvent({
      category: 'Conversion',
      action: 'CTA Click',
      label: buttonText
    });

    // Show success toast
    addToast({
      title: "Perfect!",
      description: "You're on your way to a better job search experience.",
      type: "success",
      duration: 3000
    });
  };

  // Determine background styles based on variant
  const bgStyles = variant === 'primary'
    ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-100 dark:border-blue-800"
    : "bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 border-green-100 dark:border-green-800";

  return (
    <div className={`p-6 rounded-lg border ${bgStyles} shadow-sm`}>
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        {icon && <div className="flex-shrink-0 text-blue-600 dark:text-blue-400">{icon}</div>}
        <div className="flex-grow">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {title}
          </h2>
          <p className="text-gray-700 dark:text-gray-300 mb-0 md:mb-0">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0 w-full md:w-auto mt-4 md:mt-0">
          <Link href={buttonLink} passHref>
            <Button
              onClick={handleClick}
              className={
                variant === 'primary'
                  ? "w-full md:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium px-6 py-2"
                  : "w-full md:w-auto bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white font-medium px-6 py-2"
              }
            >
              {buttonText}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}