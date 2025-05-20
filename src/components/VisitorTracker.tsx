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
  const hasTrackedRef = useRef<boolean>(false);
  const lastPathRef = useRef<string | null>(null);
  const trackerTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Only generate session ID once
    const generateSessionId = async () => {
      // Try to get existing session ID from localStorage
      let existingSessionId = localStorage.getItem('birjob_session_id');
      
      if (!existingSessionId) {
        try {
          // Generate new session ID based on fingerprint
          const components = await Fingerprint2.getPromise();
          const values = components.map(component => component.value);
          const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
          
          existingSessionId = `${fingerprint}_${Date.now()}`;
          localStorage.setItem('birjob_session_id', existingSessionId);
        } catch (error) {
          // Fallback if fingerprinting fails
          existingSessionId = `fallback_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
          localStorage.setItem('birjob_session_id', existingSessionId);
        }
      }
      
      setSessionId(existingSessionId);
    };
    
    generateSessionId();
  }, []);

  useEffect(() => {
    // Don't track if we don't have a session ID yet
    if (!sessionId) return;
    
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
  }, [pathname, searchParams, sessionId]);

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
      const referrer = document.referrer || 'direct';
      
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

      // Prepare the data for the API
      const visitorData = {
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
        referrer,
        path: pathname,
        query: searchParams?.toString() || '',
        screenWidth,
        screenHeight,
        colorDepth,
        viewportWidth,
        viewportHeight,
        connectionType,
        connectionSpeed,
        battery,
        sessionId
      };

      // Use the sendBeacon API for better performance
      // This sends the data in the background without blocking
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(visitorData)], { type: 'application/json' });
        navigator.sendBeacon('/api/analytics/visitor-log', blob);
      } else {
        // Fallback to fetch
        await fetch('/api/analytics/visitor-log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitorData),
          // Use keepalive to ensure the request completes even if the page is unloaded
          keepalive: true
        });
      }
      
      // No need to handle response with sendBeacon
    } catch (error) {
      console.error('Error in visitor tracking:', error);
    }
  };

  // This component doesn't render anything visible
  return null;
}