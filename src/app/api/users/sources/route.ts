// src/app/api/users/sources/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// GET handler - retrieve available sources from jobs_jobpost
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found. Create user first by adding keywords.' 
      }, { status: 404 });
    }

    // Get distinct sources directly from jobs_jobpost table
    const sourcesResult = await prisma.$queryRaw<{source: string}[]>`
      SELECT DISTINCT source FROM jobs_jobpost
      WHERE source IS NOT NULL
      ORDER BY source ASC
    `;
    
    // Format the sources to match the expected interface
    const allSources = sourcesResult.map((row, index) => ({
      id: index + 1,
      source: row.source,
      createdAt: new Date()
    }));
    
    // Get user source preferences from localStorage instead of database
    // This approach simulates source preferences without needing new tables
    return NextResponse.json({ 
      allSources,
      userSelectedSourceIds: [], // Empty array - preferences will be managed client-side
      message: 'Retrieved available sources from jobs table'
    });
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 });
  }
}

// POST handler - simulate adding source preferences (client-side only)
export async function POST(request: NextRequest) {
  try {
    const { email, sourceIds } = await request.json();

    if (!email || !Array.isArray(sourceIds)) {
      return NextResponse.json({ 
        error: 'Email and sourceIds array are required' 
      }, { status: 400 });
    }

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json({ 
        error: 'User not found. Create user first by adding keywords.' 
      }, { status: 404 });
    }

    // Simply acknowledge the request - actual preferences will be stored client-side
    return NextResponse.json({ 
      message: 'Source preferences received. Using client-side storage for preferences.',
      sourceIds: sourceIds
    });
  } catch (error) {
    console.error('Error handling source preferences:', error);
    return NextResponse.json({ error: 'Failed to process source preferences' }, { status: 500 });
  }
}