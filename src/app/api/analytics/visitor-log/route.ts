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
    
    // Record the visitor log
    const visitorLog = await prisma.visitor_logs.create({
      data: {
        ip: ip,
        userAgent: data.userAgent || request.headers.get('user-agent') || 'unknown',
        browser: data.browser || 'unknown',
        browserVersion: data.browserVersion || 'unknown',
        operatingSystem: data.operatingSystem || 'unknown',
        osVersion: data.osVersion || 'unknown',
        deviceType: data.deviceType || 'unknown',
        deviceVendor: data.deviceVendor || 'unknown',
        deviceModel: data.deviceModel || 'unknown',
        country: data.country || 'unknown',
        city: data.city || 'unknown',
        region: data.region || 'unknown',
        timezone: data.timezone || 'unknown',
        language: data.language || 'unknown',
        referrer: data.referrer || 'unknown',
        path: data.path || 'unknown',
        query: data.query || null,
        screenWidth: data.screenWidth || null,
        screenHeight: data.screenHeight || null,
        colorDepth: data.colorDepth || null,
        viewportWidth: data.viewportWidth || null,
        viewportHeight: data.viewportHeight || null,
        connectionType: data.connectionType || 'unknown',
        connectionSpeed: data.connectionSpeed || 'unknown',
        battery: data.battery || null,
        sessionId: data.sessionId || null,
        previousVisitId: data.previousVisitId || null
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