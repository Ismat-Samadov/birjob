// src/app/api/trends/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';
  
  try {
    // Check if source column exists
    let hasSourceColumn = true;
    try {
      await prisma.$queryRaw`SELECT source FROM jobs_jobpost LIMIT 1`;
    } catch (error) {
      hasSourceColumn = false;
      console.log('Source column does not exist in jobs_jobpost table');
    }
    
    // Fetch data for source distribution
    let sourceData: { name: string; value: number }[] = [];
    if (hasSourceColumn) {
      if (filter === 'all') {
        const sourcesResult = await prisma.$queryRaw<{source: string, count: bigint}[]>`
          SELECT source, COUNT(*) as count 
          FROM jobs_jobpost 
          WHERE source IS NOT NULL 
          GROUP BY source 
          ORDER BY count DESC 
          LIMIT 10
        `;
        
        sourceData = sourcesResult.map(item => ({
          name: item.source,
          value: Number(item.count)
        }));
      } else {
        // Filter by job title or company containing the filter keyword
        const sourcesResult = await prisma.$queryRaw<{source: string, count: bigint}[]>`
          SELECT source, COUNT(*) as count 
          FROM jobs_jobpost 
          WHERE source IS NOT NULL 
          AND (LOWER(title) LIKE ${`%${filter.toLowerCase()}%`} OR LOWER(company) LIKE ${`%${filter.toLowerCase()}%`})
          GROUP BY source 
          ORDER BY count DESC 
          LIMIT 10
        `;
        
        sourceData = sourcesResult.map(item => ({
          name: item.source,
          value: Number(item.count)
        }));
      }
    }
    
    // Fetch data for trend over time (last 30 days)
    let trendData = [];
    if (filter === 'all') {
      const trendsResult = await prisma.$queryRaw<{date: Date, count: bigint}[]>`
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM jobs_jobpost 
        WHERE created_at >= NOW() - INTERVAL '30 days'
        GROUP BY DATE(created_at) 
        ORDER BY date ASC
      `;
      
      trendData = trendsResult.map(item => ({
        date: item.date.toISOString(),
        count: Number(item.count)
      }));
    } else {
      const trendsResult = await prisma.$queryRaw<{date: Date, count: bigint}[]>`
        SELECT DATE(created_at) as date, COUNT(*) as count 
        FROM jobs_jobpost 
        WHERE created_at >= NOW() - INTERVAL '30 days'
        AND (LOWER(title) LIKE ${`%${filter.toLowerCase()}%`} OR LOWER(company) LIKE ${`%${filter.toLowerCase()}%`})
        GROUP BY DATE(created_at) 
        ORDER BY date ASC
      `;
      
      trendData = trendsResult.map(item => ({
        date: item.date.toISOString(),
        count: Number(item.count)
      }));
    }
    
    // Get common job categories for filters
    const commonCategories = await prisma.$queryRaw<{keyword: string, count: bigint}[]>`
      SELECT SPLIT_PART(LOWER(title), ' ', 1) as keyword, COUNT(*) as count
      FROM jobs_jobpost
      GROUP BY keyword
      HAVING COUNT(*) > 50
      ORDER BY count DESC
      LIMIT 5
    `;
    
    const filters = commonCategories.map(item => item.keyword);
    
    // Get total job count
    const totalJobs = await prisma.jobs_jobpost.count();
    
    return NextResponse.json({
      sourceData,
      trendData,
      filters,
      totalJobs
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trend data' },
      { status: 500 }
    );
  }
}