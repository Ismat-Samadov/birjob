// src/app/api/users/sources/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// GET handler - retrieve available sources and user preferences
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Check if user exists - don't include sourcePreferences yet
    const user = await prisma.users.findUnique({
      where: { email }
    });
    
    if (!user) {
      return NextResponse.json({ 
        error: 'User not found. Create user first by adding keywords.' 
      }, { status: 404 });
    }

    // Get user's source preferences separately
    const userSourcePreferences = await prisma.sourcePreferences.findMany({
      where: { userId: user.id }
    });

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
      createdAt: new Date().toISOString()
    }));
    
    // Map user's selected source preferences
    const userSelectedSourceIds = userSourcePreferences.length
      ? allSources
          .filter(s => userSourcePreferences.some(p => p.source === s.source))
          .map(s => s.id)
      : [];
    
    return NextResponse.json({ 
      allSources,
      userSelectedSourceIds,
      message: 'Retrieved available sources and user preferences'
    });
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 });
  }
}

// POST handler - save source preferences to database
export async function POST(request: NextRequest) {
  try {
    const { email, sourceIds } = await request.json();

    if (!email) {
      return NextResponse.json({ 
        error: 'Email is required' 
      }, { status: 400 });
    }

    if (!Array.isArray(sourceIds)) {
      return NextResponse.json({ 
        error: 'sourceIds must be an array' 
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

    // Get all available sources
    const sourcesResult = await prisma.$queryRaw<{source: string}[]>`
      SELECT DISTINCT source FROM jobs_jobpost
      WHERE source IS NOT NULL
      ORDER BY source ASC
    `;
    
    // Format sources same way as in GET
    const allSources = sourcesResult.map((row, index) => ({
      id: index + 1,
      source: row.source
    }));

    // Delete all existing source preferences for this user
    await prisma.sourcePreferences.deleteMany({
      where: { userId: user.id }
    });

    // If sourceIds is empty, that means no filter (all sources)
    if (sourceIds.length > 0) {
      // Map selected IDs back to source names
      const selectedSources = sourceIds
        .map(id => allSources.find(s => s.id === id)?.source)
        .filter(Boolean) as string[];

      // Create new source preferences
      for (const source of selectedSources) {
        await prisma.sourcePreferences.create({
          data: {
            userId: user.id,
            source
          }
        });
      }
    }

    return NextResponse.json({ 
      message: 'Source preferences saved successfully',
      selectedCount: sourceIds.length
    });
  } catch (error) {
    console.error('Error handling source preferences:', error);
    return NextResponse.json({ error: 'Failed to process source preferences' }, { status: 500 });
  }
}