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
  percentage?: number;
}

interface CompanyData {
  company: string;
  count: number;
  percentage?: number;
}

interface TrendsResponse {
  sourceData: SourceData[];
  companyData: CompanyData[];
  filters: string[];
  totalJobs: number;
  totalSources: number;
  totalCompanies: number;
  lastUpdated: string;
  totalUniquePositions: number;
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
      await prisma.$queryRaw`SELECT source FROM jobs_jobpost LIMIT 1`;
    } catch (error) {
      hasSourceColumn = false;
      console.log('Source column does not exist in jobs_jobpost table');
    }
    
    // Get total jobs count (including duplicates across sources)
    let totalJobs = 0;
    try {
      totalJobs = await prisma.jobs_jobpost.count();
    } catch (error) {
      console.error('Error counting jobs:', error);
    }
    
    // Get total UNIQUE positions count (based on title + company only)
    let totalUniquePositions = 0;
    try {
      const uniquePositionsResult = await prisma.$queryRaw<Array<{count: bigint}>>`
        SELECT COUNT(DISTINCT (LOWER(title) || '::' || LOWER(company))) as count 
        FROM jobs_jobpost 
      `;
      
      if (uniquePositionsResult.length > 0) {
        totalUniquePositions = Number(uniquePositionsResult[0].count);
      }
    } catch (error) {
      console.error('Error counting unique positions:', error);
    }
    
    // Fetch data for source distribution
    let sourceData: SourceData[] = [];
    if (hasSourceColumn) {
      try {
        if (filter === 'all') {
          // Show total jobs per source (including duplicates)
          const sourcesResult = await prisma.$queryRaw<Array<{source: string, count: bigint}>>`
            SELECT COALESCE(source, 'Unknown') as source, COUNT(*) as count 
            FROM jobs_jobpost 
            GROUP BY source 
            ORDER BY count DESC
            LIMIT 25
          `;
          
          sourceData = sourcesResult.map(item => ({
            name: item.source,
            value: Number(item.count),
            percentage: totalJobs > 0 ? (Number(item.count) / totalJobs) * 100 : 0
          }));
        } else {
          // Filter by company name
          const sourcesResult = await prisma.$queryRaw<Array<{source: string, count: bigint}>>`
            SELECT COALESCE(source, 'Unknown') as source, COUNT(*) as count 
            FROM jobs_jobpost 
            WHERE LOWER(company) = ${filter.toLowerCase()}
            GROUP BY source 
            ORDER BY count DESC
            LIMIT 25
          `;
          
          const filteredTotal = sourcesResult.reduce((acc, item) => acc + Number(item.count), 0);
          
          sourceData = sourcesResult.map(item => ({
            name: item.source,
            value: Number(item.count),
            percentage: filteredTotal > 0 ? (Number(item.count) / filteredTotal) * 100 : 0
          }));
        }
      } catch (error) {
        console.error('Error fetching source data:', error);
      }
    }
    
    // Fetch top companies with UNIQUE job counts (not counting duplicates across sources)
    let companyData: CompanyData[] = [];
    try {
      if (filter === 'all') {
        // Count unique positions per company (title + company combination)
        const companiesResult = await prisma.$queryRaw<Array<{company: string, count: bigint}>>`
          SELECT 
            MAX(company) as company,
            COUNT(DISTINCT (LOWER(title) || '::' || LOWER(company))) as count 
          FROM jobs_jobpost 
          GROUP BY LOWER(company)
          ORDER BY count DESC 
          LIMIT 25
        `;
        
        companyData = companiesResult.map(item => ({
          company: item.company,
          count: Number(item.count),
          percentage: totalUniquePositions > 0 ? (Number(item.count) / totalUniquePositions) * 100 : 0
        }));
      } else {
        // When a company filter is selected, show only that company's unique positions
        const companiesResult = await prisma.$queryRaw<Array<{company: string, count: bigint}>>`
          SELECT 
            MAX(company) as company,
            COUNT(DISTINCT (LOWER(title) || '::' || LOWER(company))) as count 
          FROM jobs_jobpost 
          WHERE LOWER(company) = ${filter.toLowerCase()}
          GROUP BY LOWER(company)
        `;
        
        companyData = companiesResult.map(item => ({
          company: item.company,
          count: Number(item.count),
          percentage: totalUniquePositions > 0 ? (Number(item.count) / totalUniquePositions) * 100 : 0
        }));
      }
    } catch (error) {
      console.error('Error fetching company data:', error);
    }
    
    // Get filter options - companies with significant UNIQUE job counts
    let filters: string[] = ['all'];
    try {
      const topCompanies = await prisma.$queryRaw<Array<{company: string, normalized_company: string, count: bigint}>>`
        SELECT 
          LOWER(company) as normalized_company,
          MAX(company) as company,
          COUNT(DISTINCT (LOWER(title) || '::' || LOWER(company))) as count 
        FROM jobs_jobpost 
        GROUP BY LOWER(company)
        HAVING COUNT(DISTINCT (LOWER(title) || '::' || LOWER(company))) >= 5
        ORDER BY count DESC 
        LIMIT 10
      `;
      
      // Add top companies to filters (use lowercase for comparison)
      filters = ['all', ...topCompanies.map(item => item.normalized_company)];
      
    } catch (error) {
      console.error('Error getting filter categories:', error);
      filters = ['all'];
    }
    
    // Get total distinct companies count
    let totalCompanies = 0;
    try {
      const companiesCountResult = await prisma.$queryRaw<Array<{count: bigint}>>`
        SELECT COUNT(DISTINCT LOWER(company)) as count 
        FROM jobs_jobpost 
        WHERE company IS NOT NULL
      `;
      
      if (companiesCountResult.length > 0) {
        totalCompanies = Number(companiesCountResult[0].count);
      }
    } catch (error) {
      console.error('Error counting companies:', error);
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
      companyData,
      filters,
      totalJobs,
      totalSources,
      totalCompanies,
      totalUniquePositions,
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
        companyData: [],
        filters: ['all'],
        totalJobs: 0,
        totalSources: 0,
        totalCompanies: 0,
        totalUniquePositions: 0,
        lastUpdated: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}