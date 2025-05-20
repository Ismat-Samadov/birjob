// src/app/api/jobs/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'
import { Redis } from '@upstash/redis'

const prisma = new PrismaClient()

// Initialize Redis client
const redis = Redis.fromEnv()
const CACHE_TTL = 60 * 15 // 15 minutes cache

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

function processDbResult(result: DbResult[]): DbResult[] {
  return result.map(item => {
    const processed: DbResult = { 
      ...item,
      source: item.source || null
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
  const company = searchParams.get('company') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 10

  // Create a cache key based on the request parameters
  const cacheKey = `jobs:${search}:${source}:${company}:${page}:${pageSize}`

  try {
    // Try to get data from cache first
    const cachedData = await redis.get(cacheKey)
    
    if (cachedData) {
      console.log('Cache hit for jobs query:', cacheKey)
      return NextResponse.json(cachedData)
    }
    
    console.log('Cache miss for jobs query:', cacheKey)

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
    
    // Add company filter if provided
    if (company) {
      sqlQuery = Prisma.sql`${sqlQuery} AND LOWER(company) = ${company.toLowerCase()}`;
    }
    
    // Add ordering and pagination
    sqlQuery = Prisma.sql`
      ${sqlQuery} 
      ORDER BY created_at DESC
      LIMIT ${pageSize}
      OFFSET ${(page - 1) * pageSize}
    `;
    
    // Execute query
    const jobsQuery: DbResult[] = await prisma.$queryRaw(sqlQuery);
    
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
    
    if (company) {
      countQuery = Prisma.sql`${countQuery} AND LOWER(company) = ${company.toLowerCase()}`;
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
      // Use cache for sources
      const cachedSources = await redis.get('job_sources');
      if (cachedSources) {
        sources = cachedSources as string[];
      } else {
        try {
          const sourcesResult = await prisma.$queryRaw<{source: string}[]>`
            SELECT DISTINCT source FROM jobs_jobpost
            WHERE source IS NOT NULL
            ORDER BY source ASC
          `;
          sources = sourcesResult.map(row => row.source);
          // Cache sources for 1 day
          await redis.set('job_sources', sources, { ex: 86400 });
        } catch (error) {
          console.error('Error fetching sources:', error);
        }
      }
    }
    
    // Get top companies for filtering - with caching
    let companies: string[] = [];
    const cachedCompanies = await redis.get('top_companies');
    if (cachedCompanies) {
      companies = cachedCompanies as string[];
    } else {
      try {
        const companiesResult = await prisma.$queryRaw<{company: string, count: bigint}[]>`
          SELECT company, COUNT(*) as count
          FROM jobs_jobpost
          WHERE company IS NOT NULL
          GROUP BY company
          ORDER BY count DESC
          LIMIT 20
        `;
        companies = companiesResult.map(row => row.company);
        // Cache companies for 1 day
        await redis.set('top_companies', companies, { ex: 86400 });
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    }

    // Process jobs to format bigints
    const processedJobs = processDbResult(jobsQuery);
    
    // Convert count to number
    const totalJobs = typeof totalCount[0]?.count === 'string' 
      ? parseInt(totalCount[0].count) 
      : Number(totalCount[0]?.count || 0);

    const responseData = {
      jobs: processedJobs,
      sources: sources,
      companies: companies,
      metadata: {
        latestScrapeDate: latestDate,
        totalJobs: totalJobs,
        currentPage: page,
        totalPages: Math.ceil(totalJobs / pageSize)
      }
    };

    // Cache the response
    await redis.set(cacheKey, responseData, { ex: CACHE_TTL });

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}