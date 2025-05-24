// src/app/api/jobs/route.ts - Fixed Caching Implementation
import { NextResponse } from 'next/server'
import { PrismaClient, Prisma } from '@prisma/client'
import { Redis } from '@upstash/redis'

const prisma = new PrismaClient()
const redis = Redis.fromEnv()

// Hierarchical cache configuration
const CACHE_CONFIG = {
  // Core data that changes infrequently
  SOURCES: 60 * 60 * 24, // 24 hours
  COMPANIES: 60 * 60 * 12, // 12 hours
  LATEST_SCRAPE_DATE: 60 * 30, // 30 minutes
  
  // Job listings - shorter TTL for fresh data
  JOBS_BASE: 60 * 10, // 10 minutes for base job queries
  JOBS_SEARCH: 60 * 5, // 5 minutes for search results
  
  // Metadata
  METADATA: 60 * 15, // 15 minutes
  
  // Popular/frequent data - longer TTL
  POPULAR_QUERIES: 60 * 60, // 1 hour
}

// Cache key builder with normalization
class CacheKeyBuilder {
  private version = 'v3' // Increment to invalidate all cache
  
  buildJobsKey(search: string, source: string, company: string, page: number): string {
    const normalizedSearch = this.normalizeSearch(search)
    const normalizedSource = source || 'all'
    const normalizedCompany = company || 'all'
    
    return `jobs:${this.version}:${normalizedSearch}:${normalizedSource}:${normalizedCompany}:${page}`
  }
  
  buildBaseDataKey(type: 'sources' | 'companies' | 'latest-date' | 'metadata'): string {
    return `base:${this.version}:${type}`
  }
  
  buildPopularKey(search: string): string {
    return `popular:${this.version}:${this.normalizeSearch(search)}`
  }
  
  private normalizeSearch(search: string): string {
    if (!search || search.trim() === '') return 'all'
    return search.toLowerCase().trim().replace(/\s+/g, '-').substring(0, 50)
  }
}

const cacheKeys = new CacheKeyBuilder()

// Cache wrapper with error handling
class CacheManager {
  async get<T>(key: string): Promise<T | null> {
    try {
      console.log(`Cache GET: ${key}`)
      const result = await redis.get(key)
      if (result) {
        console.log(`Cache HIT: ${key}`)
        return result as T
      }
      console.log(`Cache MISS: ${key}`)
      return null
    } catch (error) {
      console.error(`Cache GET error for key ${key}:`, error)
      return null
    }
  }
  
  async set<T>(key: string, value: T, ttl: number): Promise<void> {
    try {
      console.log(`Cache SET: ${key} (TTL: ${ttl}s)`)
      await redis.set(key, value, { ex: ttl })
    } catch (error) {
      console.error(`Cache SET error for key ${key}:`, error)
    }
  }
  
  async mget(keys: string[]): Promise<(any | null)[]> {
    try {
      console.log(`Cache MGET: ${keys.join(', ')}`)
      const results = await redis.mget(...keys)
      console.log(`Cache MGET results: ${results.map((r, i) => `${keys[i]}:${r ? 'HIT' : 'MISS'}`).join(', ')}`)
      return results
    } catch (error) {
      console.error(`Cache MGET error for keys ${keys.join(', ')}:`, error)
      return keys.map(() => null)
    }
  }
  
  async pipeline() {
    return redis.pipeline()
  }
}

const cache = new CacheManager()

// Database query wrapper with caching
class JobsDataManager {
  async getLatestScrapeDate(): Promise<Date> {
    const cacheKey = cacheKeys.buildBaseDataKey('latest-date')
    let latestDate = await cache.get<string>(cacheKey)
    
    if (!latestDate) {
      const result = await prisma.jobs_jobpost.aggregate({
        _max: { created_at: true }
      })
      latestDate = (result._max.created_at || new Date()).toISOString()
      await cache.set(cacheKey, latestDate, CACHE_CONFIG.LATEST_SCRAPE_DATE)
    }
    
    return new Date(latestDate)
  }
  
  async getSources(): Promise<string[]> {
    const cacheKey = cacheKeys.buildBaseDataKey('sources')
    let sources = await cache.get<string[]>(cacheKey)
    
    if (!sources) {
      try {
        const sourcesResult = await prisma.$queryRaw<{source: string}[]>`
          SELECT DISTINCT source FROM jobs_jobpost
          WHERE source IS NOT NULL
          ORDER BY source ASC
        `
        sources = sourcesResult.map(row => row.source)
        await cache.set(cacheKey, sources, CACHE_CONFIG.SOURCES)
      } catch (error) {
        console.error('Error fetching sources:', error)
        sources = []
      }
    }
    
    return sources
  }
  
  async getTopCompanies(): Promise<string[]> {
    const cacheKey = cacheKeys.buildBaseDataKey('companies')
    let companies = await cache.get<string[]>(cacheKey)
    
    if (!companies) {
      try {
        const companiesResult = await prisma.$queryRaw<{company: string, count: bigint}[]>`
          SELECT company, COUNT(*) as count
          FROM jobs_jobpost
          WHERE company IS NOT NULL
          GROUP BY company
          ORDER BY count DESC
          LIMIT 20
        `
        companies = companiesResult.map(row => row.company)
        await cache.set(cacheKey, companies, CACHE_CONFIG.COMPANIES)
      } catch (error) {
        console.error('Error fetching companies:', error)
        companies = []
      }
    }
    
    return companies
  }
}

const dataManager = new JobsDataManager()

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

export async function GET(this: any, request: Request) {
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const source = searchParams.get('source') || ''
  const company = searchParams.get('company') || ''
  const page = parseInt(searchParams.get('page') || '1')
  const pageSize = 10

  try {
    // Step 1: Check for complete cached response first
    const jobsCacheKey = cacheKeys.buildJobsKey(search, source, company, page)
    const cachedResponse = await cache.get(jobsCacheKey)
    
    if (cachedResponse) {
      console.log('Complete cache hit for:', jobsCacheKey)
      return NextResponse.json(cachedResponse)
    }

    console.log('Cache miss - building response for:', jobsCacheKey)

    // Step 2: Get base data (these have longer TTLs and are shared across requests)
    const [latestDate, sources, companies] = await Promise.all([
      dataManager.getLatestScrapeDate(),
      dataManager.getSources(),
      dataManager.getTopCompanies()
    ])

    // Step 3: Check if source column exists
    let hasSourceColumn = sources.length > 0
    if (hasSourceColumn && sources.includes('Unknown')) {
      // We have sources but need to verify the column exists
      try {
        await prisma.$queryRaw`SELECT source FROM jobs_jobpost LIMIT 1`
      } catch (error) {
        hasSourceColumn = false
        console.log('Source column does not exist in jobs_jobpost table')
      }
    }

    // Step 4: Build and execute job query
    let sqlQuery = Prisma.sql`
      SELECT * FROM jobs_jobpost 
      WHERE created_at = ${latestDate}
    `
    
    // Add search filter
    if (search) {
      sqlQuery = Prisma.sql`
        ${sqlQuery} AND (
          LOWER(title) LIKE ${`%${search.toLowerCase()}%`} OR 
          LOWER(company) LIKE ${`%${search.toLowerCase()}%`}
        )
      `
    }
    
    // Add source filter
    if (source && hasSourceColumn) {
      sqlQuery = Prisma.sql`${sqlQuery} AND source = ${source}`
    }
    
    // Add company filter
    if (company) {
      sqlQuery = Prisma.sql`${sqlQuery} AND LOWER(company) = ${company.toLowerCase()}`
    }
    
    // Add pagination
    sqlQuery = Prisma.sql`
      ${sqlQuery} 
      ORDER BY created_at DESC
      LIMIT ${pageSize}
      OFFSET ${(page - 1) * pageSize}
    `
    
    // Step 5: Execute queries in parallel
    const [jobsQuery, totalCountQuery] = await Promise.all([
      prisma.$queryRaw<DbResult[]>(sqlQuery),
      this.getTotalCount(latestDate, search, source, company, hasSourceColumn)
    ])

    // Step 6: Process results
    const processedJobs = processDbResult(jobsQuery)
    const totalJobs = Number(totalCountQuery[0]?.count || 0)

    // Step 7: Build response
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
    }

    // Step 8: Cache the response with appropriate TTL
    const isSearchQuery = search || source || company
    const cacheTTL = isSearchQuery ? CACHE_CONFIG.JOBS_SEARCH : CACHE_CONFIG.JOBS_BASE
    
    await cache.set(jobsCacheKey, responseData, cacheTTL)

    // Step 9: Log search query if provided
    if (search) {
      // Don't await this - let it run in background
      prisma.search_logs.create({
        data: {
          query: search,
          timestamp: new Date(),
        },
      }).catch(error => {
        console.error('Error logging search:', error)
      })
    }

    // Step 10: Cache popular searches for longer
    if (search && processedJobs.length > 0) {
      const popularKey = cacheKeys.buildPopularKey(search)
      await cache.set(popularKey, responseData, CACHE_CONFIG.POPULAR_QUERIES)
    }

    return NextResponse.json(responseData)

  } catch (error) {
    console.error('Error in jobs API:', error)
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    )
  }
}

// Helper method for total count query
