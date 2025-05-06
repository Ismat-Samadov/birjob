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
    
    // Build where conditions properly for Prisma
    const baseWhereCondition: Prisma.jobs_jobpostWhereInput = {
      created_at: latestDate, // Use the non-null date
    };
    
    // Add search condition if present
    if (search) {
      baseWhereCondition.OR = [
        { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
        { company: { contains: search, mode: Prisma.QueryMode.insensitive } }
      ];
    }
    
    // Add source filter if present - make sure to check if source column exists in schema
    if (source) {
      // We need to use Prisma.sql for raw SQL filtering if the source column
      // isn't defined in the Prisma schema
      const jobsWithSource = await prisma.$queryRaw`
        SELECT * FROM jobs_jobpost 
        WHERE source = ${source}
        AND created_at = ${latestDate}
        ${search ? Prisma.sql`AND (
          LOWER(title) LIKE ${`%${search.toLowerCase()}%`} OR 
          LOWER(company) LIKE ${`%${search.toLowerCase()}%`}
        )` : Prisma.sql``}
        ORDER BY created_at DESC
        LIMIT ${pageSize}
        OFFSET ${(page - 1) * pageSize}
      `;
      
      // Count total matching jobs
      const totalCount = await prisma.$queryRaw<[{count: number}]>`
        SELECT COUNT(*) as count FROM jobs_jobpost 
        WHERE source = ${source}
        AND created_at = ${latestDate}
        ${search ? Prisma.sql`AND (
          LOWER(title) LIKE ${`%${search.toLowerCase()}%`} OR 
          LOWER(company) LIKE ${`%${search.toLowerCase()}%`}
        )` : Prisma.sql``}
      `;
      
      // Get all available job sources for filtering
      const sources = await prisma.$queryRaw<{source: string}[]>`
        SELECT DISTINCT source FROM jobs_jobpost
        WHERE source IS NOT NULL
        ORDER BY source ASC
      `;
      
      // Log search query if provided
      if (search) {
        await prisma.search_logs.create({
          data: {
            query: search,
            timestamp: new Date(),
          },
        });
      }

      // Process jobs to format bigints
      const processedJobs = processDbResult(jobsWithSource as any[]);

      return NextResponse.json({
        jobs: processedJobs,
        sources: sources.map(s => s.source), // Add sources for filtering
        metadata: {
          latestScrapeDate: latestDate,
          totalJobs: Number(totalCount[0]?.count || 0),
          currentPage: page,
          totalPages: Math.ceil(Number(totalCount[0]?.count || 0) / pageSize)
        }
      });
    }
    
    // If no source filter, use standard Prisma query
    const jobsQuery = await prisma.jobs_jobpost.findMany({
      where: baseWhereCondition,
      orderBy: { 
        created_at: 'desc' 
      },
      skip: (page - 1) * pageSize,
      take: pageSize
    });

    // Count total jobs with the same filters
    const totalUniqueJobs = await prisma.jobs_jobpost.count({
      where: baseWhereCondition
    });

    // Log search query if provided
    if (search) {
      await prisma.search_logs.create({
        data: {
          query: search,
          timestamp: new Date(),
        },
      });
    }

    // Get all available job sources via raw query since the column might not be in schema
    const sources = await prisma.$queryRaw<{source: string}[]>`
      SELECT DISTINCT source FROM jobs_jobpost
      WHERE source IS NOT NULL
      ORDER BY source ASC
    `;

    // Process jobs to format bigints
    const processedJobs = processDbResult(jobsQuery);

    return NextResponse.json({
      jobs: processedJobs,
      sources: sources.map(s => s.source), // Add sources for filtering
      metadata: {
        latestScrapeDate: latestDate,
        totalJobs: totalUniqueJobs,
        currentPage: page,
        totalPages: Math.ceil(totalUniqueJobs / pageSize)
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