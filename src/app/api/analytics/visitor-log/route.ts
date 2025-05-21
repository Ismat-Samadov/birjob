// src/app/api/analytics/visitor-log/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Interface for validation
interface VisitorLogData {
  visitorId?: string;
  userAgent?: string;
  browser?: string;
  browserVersion?: string;
  operatingSystem?: string;
  osVersion?: string;
  deviceType?: string;
  deviceVendor?: string;
  deviceModel?: string;
  country?: string;
  city?: string;
  region?: string;
  timezone?: string;
  language?: string;
  referrer?: string;
  path?: string;
  query?: string;
  screenWidth?: number;
  screenHeight?: number;
  colorDepth?: number;
  viewportWidth?: number;
  viewportHeight?: number;
  connectionType?: string;
  connectionSpeed?: string;
  battery?: number;
  sessionId?: string;
  previousVisitId?: string | number;
  referrerDomain?: string;
  referrerPath?: string;
  referrerQuery?: string;
  referrerProtocol?: string;
  referrerSource?: string;
  searchKeywords?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  entryPage?: string;
  landingTime?: string;
}

export async function POST(request: NextRequest) {
  // Create an object to track field-by-field validation issues
  const fieldValidation: Record<string, string> = {};
  
  try {
    // Get the client IP address
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               request.ip || 
               'unknown';
    
    // Parse the request body
    let data: VisitorLogData;
    try {
      data = await request.json();
      console.log('Received visitor data:', JSON.stringify(data));
    } catch (error) {
      console.error('Failed to parse request body:', error);
      return NextResponse.json(
        { success: false, error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Validate numeric fields
    const numericFields = ['screenWidth', 'screenHeight', 'colorDepth', 'viewportWidth', 'viewportHeight'];
    for (const field of numericFields) {
      const fieldKey = field as keyof VisitorLogData;
      if (data[fieldKey] !== undefined) {
        const value = data[fieldKey];
        if (typeof value === 'string') {
          try {
            data[fieldKey] = parseInt(value as string) as any;
          } catch (error) {
            fieldValidation[field] = `Failed to parse ${field} as number: ${value}`;
            data[fieldKey] = null as any;
          }
        }
      }
    }
    
    // Validate the battery level (should be 0-1)
    if (data.battery !== undefined) {
      if (typeof data.battery === 'string') {
        try {
          data.battery = parseFloat(data.battery);
        } catch (error) {
          fieldValidation['battery'] = `Failed to parse battery as float: ${data.battery}`;
          data.battery = null as any;
        }
      }
      
      // If battery is outside valid range, log and reset to null
      // First check if battery is not undefined and not null
      if (data.battery !== undefined && data.battery !== null) {
        if (data.battery < 0 || data.battery > 1) {
          fieldValidation['battery'] = `Battery value outside valid range (0-1): ${data.battery}`;
          data.battery = null as any;
        }
      }
    }
    
    // Validate previousVisitId
    if (data.previousVisitId !== undefined && data.previousVisitId !== null) {
      if (typeof data.previousVisitId === 'string') {
        try {
          data.previousVisitId = parseInt(data.previousVisitId);
        } catch (error) {
          fieldValidation['previousVisitId'] = `Failed to parse previousVisitId as integer: ${data.previousVisitId}`;
          data.previousVisitId = null as any;
        }
      }
    }
    
    // Validate landingTime
    let parsedLandingTime: Date | null = null;
    if (data.landingTime) {
      try {
        parsedLandingTime = new Date(data.landingTime);
        if (isNaN(parsedLandingTime.getTime())) {
          fieldValidation['landingTime'] = `Invalid date format for landingTime: ${data.landingTime}`;
          parsedLandingTime = null;
        }
      } catch (error) {
        fieldValidation['landingTime'] = `Failed to parse landingTime: ${data.landingTime}`;
        parsedLandingTime = null;
      }
    }
    
    // Truncate string fields that might be too long
    const stringFields = [
      'visitorId', 'userAgent', 'browser', 'browserVersion', 'operatingSystem', 
      'osVersion', 'deviceType', 'deviceVendor', 'deviceModel', 'country', 
      'city', 'region', 'timezone', 'language', 'referrer', 'path', 'query',
      'connectionType', 'connectionSpeed', 'sessionId', 
      'referrerDomain', 'referrerPath', 'referrerQuery', 'referrerProtocol',
      'referrerSource', 'searchKeywords', 'utmSource', 'utmMedium',
      'utmCampaign', 'utmContent', 'utmTerm', 'entryPage'
    ];
    
    for (const field of stringFields) {
      if (data[field as keyof VisitorLogData] && typeof data[field as keyof VisitorLogData] === 'string') {
        const value = data[field as keyof VisitorLogData] as string;
        if (value.length > 500) {
          fieldValidation[field] = `Truncated ${field} from ${value.length} to 500 chars`;
          data[field as keyof VisitorLogData] = value.substring(0, 500) as any;
        }
      }
    }
    
    // Prepare data for insertion
    const visitorLogData = {
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
      previousVisitId: typeof data.previousVisitId === 'number' ? data.previousVisitId : null,
      
      // Referrer information
      referrer: data.referrer || 'unknown',
      referrerDomain: data.referrerDomain || null,
      referrerPath: data.referrerPath || null,
      referrerQuery: data.referrerQuery || null,
      referrerProtocol: data.referrerProtocol || null,
      referrerSource: data.referrerSource || null,
      searchKeywords: data.searchKeywords || null,
      
      // UTM parameters
      utmSource: data.utmSource || null,
      utmMedium: data.utmMedium || null,
      utmCampaign: data.utmCampaign || null,
      utmContent: data.utmContent || null,
      utmTerm: data.utmTerm || null,
      
      // Landing information
      entryPage: data.entryPage || null,
      landingTime: parsedLandingTime
    };
    
    console.log('Processed data for insertion:', JSON.stringify(visitorLogData));
    
    // Record the visitor log with field-by-field error handling
    const visitorLog = await prisma.visitor_logs.create({
      data: visitorLogData
    }).catch(error => {
      console.error('Database insert error:', error);
      throw new Error(`Database insert failed: ${error.message}`);
    });
    
    console.log('Successfully logged visitor data with ID:', visitorLog.id);
    
    // Return validation issues and success status
    return NextResponse.json({
      success: true,
      id: visitorLog.id,
      message: 'Visitor log recorded successfully',
      validationIssues: Object.keys(fieldValidation).length > 0 ? fieldValidation : undefined
    });
  } catch (error) {
    console.error('Error recording visitor log:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to record visitor log',
        details: errorMessage,
        validationIssues: fieldValidation
      },
      { status: 500 }
    );
  }
}

// Also support GET for debugging and health check
export async function GET() {
  try {
    // Check database connectivity by counting records
    const count = await prisma.visitor_logs.count();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Visitor logging endpoint is active',
      recordCount: count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database connectivity error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Database connectivity issue',
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}