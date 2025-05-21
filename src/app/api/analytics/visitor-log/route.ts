// src/app/api/analytics/visitor-log/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Get the client IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               request.ip || 
               'unknown';
    
    // Parse the request body
    const data = await request.json();
    
    // Record the visitor log with all the extended fields
    const visitorLog = await prisma.visitor_logs.create({
      data: {
        // Basic identification
        ip: ip,
        visitorId: data.visitorId || null,
        
        // Device and browser information
        userAgent: data.userAgent || request.headers.get('user-agent') || 'unknown',
        browser: data.browser || 'unknown',
        browserVersion: data.browserVersion || 'unknown',
        operatingSystem: data.operatingSystem || 'unknown',
        osVersion: data.osVersion || 'unknown',
        deviceType: data.deviceType || 'unknown',
        deviceVendor: data.deviceVendor || 'unknown',
        deviceModel: data.deviceModel || 'unknown',
        
        // Geolocation information
        country: data.country || 'unknown',
        city: data.city || 'unknown',
        region: data.region || 'unknown',
        timezone: data.timezone || 'unknown',
        
        // User preferences
        language: data.language || 'unknown',
        
        // Current page information
        path: data.path || 'unknown',
        query: data.query || null,
        
        // Screen and viewport information
        screenWidth: data.screenWidth || null,
        screenHeight: data.screenHeight || null,
        colorDepth: data.colorDepth || null,
        viewportWidth: data.viewportWidth || null,
        viewportHeight: data.viewportHeight || null,
        
        // Connection information
        connectionType: data.connectionType || 'unknown',
        connectionSpeed: data.connectionSpeed || 'unknown',
        battery: data.battery || null,
        
        // Session tracking
        sessionId: data.sessionId || null,
        previousVisitId: data.previousVisitId ? parseInt(data.previousVisitId) : null,
        
        // Referrer information (new fields)
        referrer: data.referrer || 'unknown',
        referrerDomain: data.referrerDomain || null,
        referrerPath: data.referrerPath || null,
        referrerQuery: data.referrerQuery || null,
        referrerProtocol: data.referrerProtocol || null,
        referrerSource: data.referrerSource || null,
        searchKeywords: data.searchKeywords || null,
        
        // UTM parameters (new fields)
        utmSource: data.utmSource || null,
        utmMedium: data.utmMedium || null,
        utmCampaign: data.utmCampaign || null,
        utmContent: data.utmContent || null,
        utmTerm: data.utmTerm || null,
        
        // Landing information (new fields)
        entryPage: data.entryPage || null,
        landingTime: data.landingTime ? new Date(data.landingTime) : null
      }
    });
    
    return NextResponse.json({
      success: true,
      id: visitorLog.id,
      message: 'Visitor log recorded successfully'
    });
  } catch (error) {
    console.error('Error recording visitor log:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to record visitor log',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

// Also support GET for simple ping/health check
export async function GET() {
  return NextResponse.json({ success: true, message: 'Visitor logging endpoint is active' });
}