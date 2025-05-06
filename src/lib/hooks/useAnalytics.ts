// src/lib/hooks/useAnalytics.ts
import { useCallback, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface TrackPageViewProps {
  url: string;
  referrer?: string;
  title?: string;
}

interface TrackEventProps {
  category: string;
  action: string;
  label?: string;
  value?: number;
}

export function useAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Track page views
  const trackPageView = useCallback(({ url, referrer, title }: TrackPageViewProps) => {
    if (typeof window === 'undefined') return;
    
    // This is where you would integrate with your analytics service
    console.log('Page View:', {
      url,
      referrer: referrer || document.referrer,
      title: title || document.title,
      timestamp: new Date().toISOString()
    });
    
    // Example for Google Analytics (if you were to add it)
    // if (window.gtag) {
    //   window.gtag('config', 'G-XXXXXXXXXX', {
    //     page_path: url,
    //     page_title: title,
    //   });
    // }
  }, []);

  // Track custom events
  const trackEvent = useCallback(({ category, action, label, value }: TrackEventProps) => {
    if (typeof window === 'undefined') return;
    
    // Log event data
    console.log('Event:', {
      category,
      action,
      label,
      value,
      timestamp: new Date().toISOString()
    });
    
    // Example for Google Analytics
    // if (window.gtag) {
    //   window.gtag('event', action, {
    //     event_category: category,
    //     event_label: label,
    //     value: value
    //   });
    // }
  }, []);

  // Track page views automatically when path changes
  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      trackPageView({ url });
    }
  }, [pathname, searchParams, trackPageView]);

  // Add browser event listeners for more complete tracking
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Track time spent on page
    const startTime = Date.now();
    
    const handleBeforeUnload = () => {
      const timeSpent = Math.round((Date.now() - startTime) / 1000);
      trackEvent({
        category: 'Engagement',
        action: 'Time on Page',
        label: pathname,
        value: timeSpent
      });
    };
    
    // Track click events on key elements (like apply buttons)
    const handleApplyButtonClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' && target.textContent?.includes('Apply')) {
        const jobTitle = target.closest('.job-card')?.querySelector('.job-title')?.textContent;
        const company = target.closest('.job-card')?.querySelector('.job-company')?.textContent;
        
        trackEvent({
          category: 'Jobs',
          action: 'Apply Click',
          label: jobTitle ? `${jobTitle} at ${company}` : 'Unknown Job'
        });
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleApplyButtonClick);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleApplyButtonClick);
    };
  }, [pathname, trackEvent]);

  return {
    trackPageView,
    trackEvent
  };
}