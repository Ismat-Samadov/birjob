// src/app/api/jobs/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// Define types for database results
interface DbResult {
  id: number | bigint
  title: string
  company: string
  source: string | null
  apply_link: string
  created_at: Date
  [key: string]: unknown
}

function formatBigInt(value: unknown): unknown {
  if (typeof value === 'bigint') {
    return Number(value)
  }
  return value
}

function processDbResult(result: any[]): DbResult[] {
  return result.map(item => {
    const processed: DbResult = { 
      ...item,
      source: item.source || null // Ensure source exists even if null
    }
    for (const [key, value] of Object.entries(item)) {
      processed[key] = formatBigInt(value)
    }
    return processed
  })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const source = searchParams.get('source') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 10

  try {
    // Get the latest created_at date
    const latestScrapeDate = await prisma.jobs_jobpost.aggregate({
      _max: {
        created_at: true
      }
    });
    
    // Make sure we have a valid date (not null)
    const latestDate = latestScrapeDate._max.created_at || new Date();
    
    // Check if source column exists in the schema
    let hasSourceColumn = true;
    try {
      // Try a simple query to see if the source column exists
      await prisma.$queryRaw`SELECT source FROM jobs_jobpost LIMIT 1`;
    } catch (error) {
      hasSourceColumn = false;
      console.log('Source column does not exist in jobs_jobpost table');
    }
    
    // Build SQL query based on filters
    let sqlQuery = Prisma.sql`
      SELECT * FROM jobs_jobpost 
      WHERE created_at = ${latestDate}
    `;
    
    // Add search filter if provided
    if (search) {
      sqlQuery = Prisma.sql`
        ${sqlQuery} AND (
          LOWER(title) LIKE ${`%${search.toLowerCase()}%`} OR 
          LOWER(company) LIKE ${`%${search.toLowerCase()}%`}
        )
      `;
    }
    
    // Add source filter if provided and column exists
    if (source && hasSourceColumn) {
      sqlQuery = Prisma.sql`${sqlQuery} AND source = ${source}`;
    }
    
    // Add ordering and pagination
    sqlQuery = Prisma.sql`
      ${sqlQuery} 
      ORDER BY created_at DESC
      LIMIT ${pageSize}
      OFFSET ${(page - 1) * pageSize}
    `;
    
    // Execute query
    const jobsQuery = await prisma.$queryRaw(sqlQuery);
    
    // Build count query
    let countQuery = Prisma.sql`
      SELECT COUNT(*) as count FROM jobs_jobpost 
      WHERE created_at = ${latestDate}
    `;
    
    if (search) {
      countQuery = Prisma.sql`
        ${countQuery} AND (
          LOWER(title) LIKE ${`%${search.toLowerCase()}%`} OR 
          LOWER(company) LIKE ${`%${search.toLowerCase()}%`}
        )
      `;
    }
    
    if (source && hasSourceColumn) {
      countQuery = Prisma.sql`${countQuery} AND source = ${source}`;
    }
    
    // Get total count
    const totalCount = await prisma.$queryRaw<[{count: string | number}]>(countQuery);
    
    // Log search query if provided
    if (search) {
      await prisma.search_logs.create({
        data: {
          query: search,
          timestamp: new Date(),
        },
      });
    }
    
    // Get sources using raw SQL if column exists
    let sources: string[] = [];
    if (hasSourceColumn) {
      try {
        const sourcesResult = await prisma.$queryRaw<{source: string}[]>`
          SELECT DISTINCT source FROM jobs_jobpost
          WHERE source IS NOT NULL
          ORDER BY source ASC
        `;
        sources = sourcesResult.map(row => row.source);
      } catch (error) {
        console.error('Error fetching sources:', error);
      }
    }

    // Process jobs to format bigints
    const processedJobs = processDbResult(jobsQuery as any[]);
    
    // Convert count to number
    const totalJobs = typeof totalCount[0]?.count === 'string' 
      ? parseInt(totalCount[0].count) 
      : Number(totalCount[0]?.count || 0);

    return NextResponse.json({
      jobs: processedJobs,
      sources: sources, // Add sources for filtering
      metadata: {
        latestScrapeDate: latestDate,
        totalJobs: totalJobs,
        currentPage: page,
        totalPages: Math.ceil(totalJobs / pageSize)
      }
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}