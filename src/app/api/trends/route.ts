// src/app/api/trends/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Define response interface types
interface SourceData {
  name: string;
  value: number;
}

interface JobTitleData {
  title: string;
  count: number;
}

interface TrendsResponse {
  sourceData: SourceData[];
  jobTitleData: JobTitleData[];
  filters: string[];
  totalJobs: number;
  totalSources: number;
  lastUpdated: string;
}

// Initialize Prisma client
const prisma = new PrismaClient();

export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter') || 'all';
  
  try {
    // Check if source column exists
    let hasSourceColumn = true;
    try {
      // Try a simple query to see if the source column exists
      await prisma.$queryRaw`SELECT source FROM jobs_jobpost LIMIT 1`;
    } catch (error) {
      hasSourceColumn = false;
      console.log('Source column does not exist in jobs_jobpost table');
    }
    
    // Fetch data for source distribution
    let sourceData: SourceData[] = [];
    if (hasSourceColumn) {
      try {
        if (filter === 'all') {
          const sourcesResult = await prisma.$queryRaw<Array<{source: string, count: bigint}>>`
            SELECT COALESCE(source, 'Unknown') as source, COUNT(*) as count 
            FROM jobs_jobpost 
            GROUP BY source 
            ORDER BY count DESC
            LIMIT 20
          `;
          
          sourceData = sourcesResult.map(item => ({
            name: item.source,
            value: Number(item.count)
          }));
        } else {
          // Filter by job title or company containing the filter keyword
          const sourcesResult = await prisma.$queryRaw<Array<{source: string, count: bigint}>>`
            SELECT COALESCE(source, 'Unknown') as source, COUNT(*) as count 
            FROM jobs_jobpost 
            WHERE (LOWER(title) LIKE ${`%${filter.toLowerCase()}%`} OR LOWER(company) LIKE ${`%${filter.toLowerCase()}%`})
            GROUP BY source 
            ORDER BY count DESC
            LIMIT 20
          `;
          
          sourceData = sourcesResult.map(item => ({
            name: item.source,
            value: Number(item.count)
          }));
        }
      } catch (error) {
        console.error('Error fetching source data:', error);
        // Empty array will be returned if there's an error
      }
    }
    
    // Fetch top 15 job titles
    let jobTitleData: JobTitleData[] = [];
    try {
      if (filter === 'all') {
        const jobTitlesResult = await prisma.$queryRaw<Array<{title: string, count: bigint}>>`
          SELECT LOWER(title) as title, COUNT(*) as count 
          FROM jobs_jobpost 
          GROUP BY LOWER(title) 
          ORDER BY count DESC 
          LIMIT 15
        `;
        
        jobTitleData = jobTitlesResult.map(item => ({
          title: item.title,
          count: Number(item.count)
        }));
      } else {
        const jobTitlesResult = await prisma.$queryRaw<Array<{title: string, count: bigint}>>`
          SELECT LOWER(title) as title, COUNT(*) as count 
          FROM jobs_jobpost 
          WHERE (LOWER(title) LIKE ${`%${filter.toLowerCase()}%`} OR LOWER(company) LIKE ${`%${filter.toLowerCase()}%`})
          GROUP BY LOWER(title) 
          ORDER BY count DESC 
          LIMIT 15
        `;
        
        jobTitleData = jobTitlesResult.map(item => ({
          title: item.title,
          count: Number(item.count)
        }));
      }
    } catch (error) {
      console.error('Error fetching job titles:', error);
      // Empty array will be returned if there's an error
    }
    
    // Get common job categories for filters - FIXED THIS SECTION
    let filters: string[] = ['all'];
    try {
      // Fix the query to use the first word of the title, not a non-existent "keyword" column
      const commonCategories = await prisma.$queryRaw<Array<{word: string, count: bigint}>>`
        SELECT 
          SUBSTRING(LOWER(title) FROM 1 FOR POSITION(' ' IN LOWER(title) + ' ') - 1) as word, 
          COUNT(*) as count
        FROM jobs_jobpost
        GROUP BY word
        HAVING COUNT(*) > 5 AND LENGTH(word) > 1
        ORDER BY count DESC
        LIMIT 5
      `;
      
      const validKeywords = commonCategories
        .map(item => item.word)
        .filter(word => word && word.trim() !== '');
      
      filters = ['all', ...validKeywords];
    } catch (error) {
      console.error('Error getting filter categories:', error);
      // If we can't get filter categories, just use 'all'
      filters = ['all'];
    }
    
    // Get total job count
    let totalJobs = 0;
    try {
      totalJobs = await prisma.jobs_jobpost.count();
    } catch (error) {
      console.error('Error counting jobs:', error);
    }
    
    // Get total distinct sources count
    let totalSources = 0;
    if (hasSourceColumn) {
      try {
        const sourcesCountResult = await prisma.$queryRaw<Array<{count: bigint}>>`
          SELECT COUNT(DISTINCT source) as count 
          FROM jobs_jobpost 
          WHERE source IS NOT NULL
        `;
        
        if (sourcesCountResult.length > 0) {
          totalSources = Number(sourcesCountResult[0].count);
        }
      } catch (error) {
        console.error('Error counting sources:', error);
      }
    }
    
    // Get last updated timestamp
    let lastUpdated = new Date().toISOString();
    try {
      const lastUpdatedResult = await prisma.$queryRaw<Array<{max_date: Date | null}>>`
        SELECT MAX(created_at) as max_date FROM jobs_jobpost
      `;
      
      if (lastUpdatedResult.length > 0 && lastUpdatedResult[0].max_date) {
        lastUpdated = lastUpdatedResult[0].max_date.toISOString();
      }
    } catch (error) {
      console.error('Error getting last updated timestamp:', error);
    }
    
    const response: TrendsResponse = {
      sourceData,
      jobTitleData,
      filters,
      totalJobs,
      totalSources,
      lastUpdated
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch trend data', 
        details: error instanceof Error ? error.message : 'Unknown error',
        sourceData: [],
        jobTitleData: [],
        filters: ['all'],
        totalJobs: 0,
        totalSources: 0,
        lastUpdated: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}