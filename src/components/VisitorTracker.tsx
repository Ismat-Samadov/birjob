// src/components/VisitorTracker.tsx
"use client"

import { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import UAParser from 'ua-parser-js';
import Fingerprint2 from 'fingerprintjs2';

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const hasTrackedRef = useRef<boolean>(false);
  const lastPathRef = useRef<string | null>(null);
  const trackerTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const entryPageRef = useRef<string | null>(null);
  const landingTimeRef = useRef<number | null>(null);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Generate session and visitor IDs
    const generateIds = async () => {
      // Try to get existing session ID from localStorage
      let existingSessionId = localStorage.getItem('birjob_session_id');
      let existingVisitorId = localStorage.getItem('birjob_visitor_id');
      
      try {
        // Generate fingerprint for consistent visitor identification
        const components = await Fingerprint2.getPromise();
        const values = components.map(component => component.value);
        const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
        
        // Create visitor ID if it doesn't exist (persists across sessions)
        if (!existingVisitorId) {
          existingVisitorId = fingerprint;
          localStorage.setItem('birjob_visitor_id', existingVisitorId);
        }
        
        // Create session ID if it doesn't exist (new for each session)
        if (!existingSessionId) {
          existingSessionId = `${fingerprint}_${Date.now()}`;
          localStorage.setItem('birjob_session_id', existingSessionId);
          
          // Record entry page and landing time for new sessions
          entryPageRef.current = pathname;
          landingTimeRef.current = Date.now();
          localStorage.setItem('birjob_entry_page', pathname || '/');
          localStorage.setItem('birjob_landing_time', Date.now().toString());
        } else {
          // Retrieve stored entry page and landing time
          entryPageRef.current = localStorage.getItem('birjob_entry_page');
          const storedTime = localStorage.getItem('birjob_landing_time');
          landingTimeRef.current = storedTime ? parseInt(storedTime) : null;
        }
        
      } catch (error) {
        // Fallback if fingerprinting fails
        if (!existingVisitorId) {
          existingVisitorId = `visitor_${Math.random().toString(36).substring(2, 15)}`;
          localStorage.setItem('birjob_visitor_id', existingVisitorId);
        }
        
        if (!existingSessionId) {
          existingSessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
          localStorage.setItem('birjob_session_id', existingSessionId);
          
          // Record entry page and landing time
          entryPageRef.current = pathname;
          landingTimeRef.current = Date.now();
          localStorage.setItem('birjob_entry_page', pathname || '/');
          localStorage.setItem('birjob_landing_time', Date.now().toString());
        } else {
          entryPageRef.current = localStorage.getItem('birjob_entry_page');
          const storedTime = localStorage.getItem('birjob_landing_time');
          landingTimeRef.current = storedTime ? parseInt(storedTime) : null;
        }
      }
      
      setSessionId(existingSessionId);
      setVisitorId(existingVisitorId);
    };
    
    generateIds();
    
    // Reset session when tab is closed and reopened
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && 
          sessionStorage.getItem('tab_closed') === 'true') {
        // Tab was closed and reopened - create new session
        localStorage.removeItem('birjob_session_id');
        sessionStorage.removeItem('tab_closed');
        generateIds();
      }
    };
    
    // Mark tab as closed when page is hidden
    const handleBeforeUnload = () => {
      sessionStorage.setItem('tab_closed', 'true');
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [pathname]);

  useEffect(() => {
    // Don't track if we don't have a session ID yet
    if (!sessionId || !visitorId) return;
    
    // Don't track the same path twice in a row
    if (pathname === lastPathRef.current) return;
    
    // Update the last path
    lastPathRef.current = pathname;
    
    // Debounce the tracking to reduce API calls
    // Clear any existing timeout
    if (trackerTimeoutRef.current) {
      clearTimeout(trackerTimeoutRef.current);
    }
    
    // Set a new timeout
    trackerTimeoutRef.current = setTimeout(() => {
      trackVisit();
    }, 1000); // 1 second debounce
    
    return () => {
      // Clean up the timeout on unmount
      if (trackerTimeoutRef.current) {
        clearTimeout(trackerTimeoutRef.current);
      }
    };
  }, [pathname, searchParams, sessionId, visitorId]);

  const parseReferrer = (referrerUrl: string) => {
    if (!referrerUrl) return {
      domain: '',
      path: '',
      query: '',
      protocol: '',
      source: 'direct'
    };
    
    try {
      const url = new URL(referrerUrl);
      
      // Determine referrer source based on domain
      let source = 'other';
      const domain = url.hostname;
      
      // Check for search engines
      if (domain.includes('google.')) source = 'google';
      else if (domain.includes('bing.')) source = 'bing';
      else if (domain.includes('yahoo.')) source = 'yahoo';
      else if (domain.includes('duckduckgo.')) source = 'duckduckgo';
      else if (domain.includes('yandex.')) source = 'yandex';
      // Check for social media
      else if (domain.includes('facebook.') || domain.includes('fb.')) source = 'facebook';
      else if (domain.includes('twitter.') || domain.includes('t.co') || domain.includes('x.com')) source = 'twitter';
      else if (domain.includes('linkedin.')) source = 'linkedin';
      else if (domain.includes('instagram.')) source = 'instagram';
      else if (domain.includes('youtube.')) source = 'youtube';
      else if (domain.includes('tiktok.')) source = 'tiktok';
      // Check for ads
      else if (domain.includes('doubleclick.') || url.searchParams.has('gclid')) source = 'google_ads';
      else if (domain.includes('birjob.')) source = 'internal';
      
      // Extract search keywords from search engines
      let searchKeywords = '';
      if (source === 'google') searchKeywords = url.searchParams.get('q') || '';
      else if (source === 'bing') searchKeywords = url.searchParams.get('q') || '';
      else if (source === 'yahoo') searchKeywords = url.searchParams.get('p') || '';
      else if (source === 'duckduckgo') searchKeywords = url.searchParams.get('q') || '';
      else if (source === 'yandex') searchKeywords = url.searchParams.get('text') || '';
      
      return {
        domain: url.hostname,
        path: url.pathname,
        query: url.search ? url.search.substring(1) : '',
        protocol: url.protocol.replace(':', ''),
        source,
        searchKeywords
      };
    } catch (error) {
      console.error('Error parsing referrer:', error);
      return {
        domain: '',
        path: '',
        query: '',
        protocol: '',
        source: 'invalid'
      };
    }
  };

  // Extract UTM parameters from URL search params
  const extractUtmParams = (params: URLSearchParams) => {
    return {
      utmSource: params.get('utm_source') || '',
      utmMedium: params.get('utm_medium') || '',
      utmCampaign: params.get('utm_campaign') || '',
      utmContent: params.get('utm_content') || '',
      utmTerm: params.get('utm_term') || ''
    };
  };

  const trackVisit = async () => {
    try {
      // Set tracking flag to avoid duplicate tracking
      if (hasTrackedRef.current) {
        // Only track on new pages or every 5 minutes
        const lastTrackTime = parseInt(sessionStorage.getItem('last_track_time') || '0');
        const now = Date.now();
        if (now - lastTrackTime < 5 * 60 * 1000) { // 5 minutes
          return;
        }
      }
      
      hasTrackedRef.current = true;
      sessionStorage.setItem('last_track_time', Date.now().toString());

      // Parse user agent once per session
      const parser = new UAParser();
      const uaResult = parser.getResult();
      
      // Get screen and viewport dimensions
      const screenWidth = window.screen.width;
      const screenHeight = window.screen.height;
      const colorDepth = window.screen.colorDepth;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Get timezone
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      
      // Get language
      const language = navigator.language || 'unknown';
      
      // Get referrer (if available)
      const referrerUrl = document.referrer || '';
      
      // Parse referrer details
      const referrerInfo = parseReferrer(referrerUrl);
      
      // Get UTM parameters
      const utmParams = extractUtmParams(
        typeof searchParams?.toString === 'function' 
          ? new URLSearchParams(searchParams.toString()) 
          : new URLSearchParams()
      );
      
      // Get connection information (if available)
      let connectionType = 'unknown';
      let connectionSpeed = 'unknown';
      
      // @ts-expect-error - TypeScript doesn't know about the Navigator.connection property
      if (navigator.connection) {
        // @ts-expect-error - TypeScript doesn't know about connection.effectiveType
        connectionType = navigator.connection.effectiveType || 'unknown';
        // @ts-expect-error - TypeScript doesn't know about connection.downlink
        connectionSpeed = navigator.connection.downlink ? `${navigator.connection.downlink} Mbps` : 'unknown';
      }
      
      // Get battery level (if available and supported)
      let battery = null;
      // @ts-expect-error - TypeScript doesn't know about the Navigator.getBattery method
      if (navigator.getBattery) {
        try {
          // @ts-expect-error - TypeScript doesn't know about getBattery()
          const batteryManager = await navigator.getBattery();
          battery = batteryManager.level;
        } catch (e) {
          console.log('Battery API not supported or error:', e);
        }
      }

      // Use a cache for geolocation data
      let geoData = { country: 'unknown', region: 'unknown', city: 'unknown' };
      const cachedGeoData = localStorage.getItem('geo_data');
      
      if (cachedGeoData) {
        try {
          geoData = JSON.parse(cachedGeoData);
        } catch (e) {
          // Ignore parse errors
        }
      } else {
        // Only fetch geo data if not cached
        try {
          const geoResponse = await fetch('https://ipapi.co/json/');
          if (geoResponse.ok) {
            geoData = await geoResponse.json();
            // Cache geo data for 24 hours
            localStorage.setItem('geo_data', JSON.stringify(geoData));
            localStorage.setItem('geo_timestamp', Date.now().toString());
          }
        } catch (error) {
          console.log('Error fetching geolocation:', error);
        }
      }

      // Find previous visit ID if available
      const previousVisitId = localStorage.getItem('last_visit_id') || null;

      // Prepare the data for the API
      const visitorData = {
        // Basic info
        visitorId,
        userAgent: navigator.userAgent,
        browser: uaResult.browser.name || 'unknown',
        browserVersion: uaResult.browser.version || 'unknown',
        operatingSystem: uaResult.os.name || 'unknown',
        osVersion: uaResult.os.version || 'unknown',
        deviceType: uaResult.device.type || (uaResult.device.model ? 'mobile' : 'desktop'),
        deviceVendor: uaResult.device.vendor || 'unknown',
        deviceModel: uaResult.device.model || 'unknown',
        country: geoData.country || 'unknown',
        city: geoData.city || 'unknown',
        region: geoData.region || 'unknown',
        timezone,
        language,
        
        // Page info
        path: pathname,
        query: searchParams?.toString() || '',
        
        // Device capabilities
        screenWidth,
        screenHeight,
        colorDepth,
        viewportWidth,
        viewportHeight,
        connectionType,
        connectionSpeed,
        battery,
        
        // Session tracking
        sessionId,
        previousVisitId,
        
        // Referrer info
        referrer: referrerUrl,
        referrerDomain: referrerInfo.domain,
        referrerPath: referrerInfo.path,
        referrerQuery: referrerInfo.query,
        referrerProtocol: referrerInfo.protocol,
        referrerSource: referrerInfo.source,
        searchKeywords: referrerInfo.searchKeywords || '',
        
        // UTM parameters
        utmSource: utmParams.utmSource,
        utmMedium: utmParams.utmMedium,
        utmCampaign: utmParams.utmCampaign,
        utmContent: utmParams.utmContent,
        utmTerm: utmParams.utmTerm,
        
        // Landing info
        entryPage: entryPageRef.current || pathname,
        landingTime: landingTimeRef.current ? new Date(landingTimeRef.current).toISOString() : new Date().toISOString()
      };

      // Use the sendBeacon API for better performance
      // This sends the data in the background without blocking
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(visitorData)], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/visitor-log', blob);
      } else {
        // Fallback to fetch
        const response = await fetch('/api/analytics/visitor-log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitorData),
          // Use keepalive to ensure the request completes even if the page is unloaded
          keepalive: true
        });
        
        // Store last visit ID for tracking journey
        if (response.ok) {
          const responseData = await response.json();
          if (responseData.id) {
            localStorage.setItem('last_visit_id', responseData.id.toString());
          }
        }
      }
    } catch (error) {
      console.error('Error in visitor tracking:', error);
    }
  };

  // This component doesn't render anything visible
  return null;
}