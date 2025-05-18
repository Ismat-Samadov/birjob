// src/components/VisitorTracker.tsx
"use client"

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import UAParser from 'ua-parser-js';
import Fingerprint2 from 'fingerprintjs2';

export default function VisitorTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    const trackVisit = async () => {
      try {
        // Generate a unique session ID if not already set
        if (!sessionId) {
          // Try to get existing session ID from localStorage
          let existingSessionId = localStorage.getItem('birjob_session_id');
          
          if (!existingSessionId) {
            // Generate new session ID based on fingerprint
            const components = await Fingerprint2.getPromise();
            const values = components.map(component => component.value);
            const fingerprint = Fingerprint2.x64hash128(values.join(''), 31);
            
            existingSessionId = `${fingerprint}_${Date.now()}`;
            localStorage.setItem('birjob_session_id', existingSessionId);
          }
          
          setSessionId(existingSessionId);
        }

        // Parse user agent for detailed browser and device info
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
        
        // @ts-ignore - TypeScript doesn't know about the Navigator.connection property
        if (navigator.connection) {
          // @ts-ignore
          connectionType = navigator.connection.effectiveType || 'unknown';
          // @ts-ignore
          connectionSpeed = navigator.connection.downlink ? `${navigator.connection.downlink} Mbps` : 'unknown';
        }
        
        // Get battery level (if available and supported)
        let battery = null;
        // @ts-ignore - TypeScript doesn't know about the Navigator.getBattery method
        if (navigator.getBattery) {
          try {
            // @ts-ignore
            const batteryManager = await navigator.getBattery();
            battery = batteryManager.level;
          } catch (e) {
            console.log('Battery API not supported or error:', e);
          }
        }

        // Get geolocation data using a third-party service
        let geoData = { country: 'unknown', region: 'unknown', city: 'unknown' };
        try {
          const geoResponse = await fetch('https://ipapi.co/json/');
          if (geoResponse.ok) {
            geoData = await geoResponse.json();
          }
        } catch (error) {
          console.log('Error fetching geolocation:', error);
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
          query: searchParams.toString(),
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

        // Send the data to the API
        const response = await fetch('/api/analytics/visitor-log', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(visitorData),
        });

        const result = await response.json();
        
        if (result.success) {
          console.log('Visitor tracking logged successfully');
          
          // Store the visit ID for potential future reference
          localStorage.setItem('birjob_last_visit_id', result.id.toString());
        }
      } catch (error) {
        console.error('Error in visitor tracking:', error);
      }
    };

    // Execute tracking
    trackVisit();
  }, [pathname, searchParams, sessionId]);

  // This component doesn't render anything visible
  return null;
}