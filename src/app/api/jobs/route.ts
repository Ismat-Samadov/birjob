// src/app/api/jobs/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

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

function processDbResult(result: DbResult[]): DbResult[] {
  return result.map(item => {
    const processed: DbResult = { ...item }
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
    // Build WHERE clause based on search and source parameters
    let whereClause = `
      (LOWER(title) LIKE ${`%${search.toLowerCase()}%`} OR 
      LOWER(company) LIKE ${`%${search.toLowerCase()}%`})
      AND created_at = (SELECT MAX(created_at) FROM jobs_jobpost)
    `;
    
    // Add source filter if provided
    if (source) {
      whereClause += ` AND LOWER(source) = ${source.toLowerCase()}`;
    }

    const uniqueJobs = await prisma.$queryRaw<DbResult[]>`
      WITH RankedJobs AS (
        SELECT 
          id,
          title,
          company,
          source,
          apply_link,
          created_at,
          ROW_NUMBER() OVER (
            PARTITION BY LOWER(title), LOWER(company)
            ORDER BY created_at DESC
          ) as rn
        FROM jobs_jobpost
        WHERE ${prisma.$raw(whereClause)}
      )
      SELECT *
      FROM RankedJobs
      WHERE rn = 1
      ORDER BY created_at DESC
      LIMIT ${pageSize}
      OFFSET ${(page - 1) * pageSize}
    `;

    // Get the latest scrape date
    const latestScrapeDate = await prisma.jobs_jobpost.aggregate({
      _max: {
        created_at: true
      }
    });

    // Count total jobs that match the search criteria
    let countQuery = `
      SELECT COUNT(DISTINCT (LOWER(title), LOWER(company)))::integer as count
      FROM jobs_jobpost
      WHERE ${prisma.$raw(whereClause)}
    `;
    
    const totalUniqueJobs = await prisma.$queryRaw<[{ count: number }]>`${prisma.$raw(countQuery)}`;

    // Log search query
    if (search) {
      await prisma.search_logs.create({
        data: {
          query: search,
          timestamp: new Date(),
        },
      });
    }

    // Get all available job sources for filtering
    const sources = await prisma.job_sources.findMany({
      orderBy: { source: 'asc' }
    });

    const processedJobs = processDbResult(uniqueJobs);
    const totalCount = totalUniqueJobs[0].count;

    return NextResponse.json({
      jobs: processedJobs,
      sources: sources.map(s => s.source), // Add sources for filtering
      metadata: {
        latestScrapeDate: latestScrapeDate._max.created_at,
        totalJobs: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / pageSize)
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