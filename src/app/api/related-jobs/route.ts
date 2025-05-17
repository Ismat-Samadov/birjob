// src/app/api/related-jobs/route.ts (New File)
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get('search') || '';
  const company = searchParams.get('company') || '';
  const exclude = searchParams.get('exclude') || '';
  const limit = parseInt(searchParams.get('limit') || '3');

  try {
    // Build the where condition based on params
    let whereCondition = {};
    
    // If company is provided, filter by company
    if (company) {
      whereCondition = {
        ...whereCondition,
        company: {
          contains: company,
          mode: 'insensitive'
        }
      };
    }
    
    // If search is provided, filter by title or company
    if (search) {
      whereCondition = {
        ...whereCondition,
        OR: [
          {
            title: {
              contains: search,
              mode: 'insensitive'
            }
          },
          {
            company: {
              contains: search,
              mode: 'insensitive'
            }
          }
        ]
      };
    }
    
    // Exclude current job if ID is provided
    if (exclude) {
      whereCondition = {
        ...whereCondition,
        id: {
          not: parseInt(exclude)
        }
      };
    }
    
    // Query the database for related jobs
    const jobs = await prisma.jobs_jobpost.findMany({
      where: whereCondition,
      take: limit,
      orderBy: {
        created_at: 'desc'
      }
    });
    
    // Process results to ensure they're serializable
    const processedJobs = jobs.map(job => ({
      ...job,
      id: Number(job.id),
      created_at: job.created_at.toISOString()
    }));
    
    return NextResponse.json({
      jobs: processedJobs
    });
  } catch (error) {
    console.error('Error fetching related jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related jobs' },
      { status: 500 }
    );
  }
}