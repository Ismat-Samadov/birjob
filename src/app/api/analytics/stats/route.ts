// src/app/api/analytics/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Note: This endpoint should be secured with proper authentication in production
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period') || 'today';
    
    // Calculate date range based on period
    const startDate = new Date(); // Change to const
    
    switch (period) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'yesterday':
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setHours(0, 0, 0, 0); // Default to today
    }

    // Get total visitors count for the period
    const totalVisitors = await prisma.visitor_logs.count({
      where: {
        timestamp: {
          gte: startDate
        }
      }
    });

    // Get unique visitors (by sessionId) for the period
    const uniqueVisitors = await prisma.$queryRaw`
      SELECT COUNT(DISTINCT "sessionId") 
      FROM visitor_logs 
      WHERE "timestamp" >= ${startDate}
    `;

    // Get top browsers
    const topBrowsers = await prisma.visitor_logs.groupBy({
      by: ['browser'],
      where: {
        timestamp: {
          gte: startDate
        },
        browser: {
          not: 'unknown'
        }
      },
      _count: {
        browser: true
      },
      orderBy: {
        _count: {
          browser: 'desc'
        }
      },
      take: 5
    });

    // Get top operating systems
    const topOS = await prisma.visitor_logs.groupBy({
      by: ['operatingSystem'],
      where: {
        timestamp: {
          gte: startDate
        },
        operatingSystem: {
          not: 'unknown'
        }
      },
      _count: {
        operatingSystem: true
      },
      orderBy: {
        _count: {
          operatingSystem: 'desc'
        }
      },
      take: 5
    });

    // Get top countries
    const topCountries = await prisma.visitor_logs.groupBy({
      by: ['country'],
      where: {
        timestamp: {
          gte: startDate
        },
        country: {
          not: 'unknown'
        }
      },
      _count: {
        country: true
      },
      orderBy: {
        _count: {
          country: 'desc'
        }
      },
      take: 5
    });

    // Get top cities
    const topCities = await prisma.visitor_logs.groupBy({
      by: ['city'],
      where: {
        timestamp: {
          gte: startDate
        },
        city: {
          not: 'unknown'
        }
      },
      _count: {
        city: true
      },
      orderBy: {
        _count: {
          city: 'desc'
        }
      },
      take: 5
    });

    // Get top pages/paths
    const topPaths = await prisma.visitor_logs.groupBy({
      by: ['path'],
      where: {
        timestamp: {
          gte: startDate
        }
      },
      _count: {
        path: true
      },
      orderBy: {
        _count: {
          path: 'desc'
        }
      },
      take: 10
    });

    // Get device breakdown
    const deviceBreakdown = await prisma.visitor_logs.groupBy({
      by: ['deviceType'],
      where: {
        timestamp: {
          gte: startDate
        }
      },
      _count: {
        deviceType: true
      },
      orderBy: {
        _count: {
          deviceType: 'desc'
        }
      }
    });

    // Return the analytics data
    return NextResponse.json({
      success: true,
      period,
      stats: {
        totalVisitors,
        uniqueVisitors: Number(uniqueVisitors[0].count), // Convert BigInt to Number
        topBrowsers: topBrowsers.map(b => ({
          browser: b.browser,
          count: b._count.browser
        })),
        topOS: topOS.map(os => ({
          os: os.operatingSystem,
          count: os._count.operatingSystem
        })),
        topCountries: topCountries.map(c => ({
          country: c.country,
          count: c._count.country
        })),
        topCities: topCities.map(c => ({
          city: c.city,
          count: c._count.city
        })),
        topPaths: topPaths.map(p => ({
          path: p.path,
          count: p._count.path
        })),
        deviceBreakdown: deviceBreakdown.map(d => ({
          deviceType: d.deviceType || 'unknown',
          count: d._count.deviceType
        }))
      }
    });
  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch analytics data',
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}