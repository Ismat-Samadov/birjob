// src/app/api/users/sources/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// GET handler - retrieve available sources and user selected sources
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Get all available sources
    const allSources = await prisma.job_sources.findMany({
      orderBy: { source: 'asc' }
    });

    // Check if user exists
    const user = await prisma.users.findUnique({
      where: { email },
      include: {
        userSources: {
          include: {
            source: true
          }
        }
      }
    });

    if (user) {
      // Return sources with user preferences
      const userSelectedSourceIds = user.userSources.map(us => us.sourceId);
      
      return NextResponse.json({ 
        allSources,
        userSelectedSourceIds
      });
    } else {
      // New user, no selected sources yet
      return NextResponse.json({ 
        allSources,
        userSelectedSourceIds: [],
        message: 'User not found. Create user first by adding keywords.'
      });
    }
  } catch (error) {
    console.error('Error fetching sources:', error);
    return NextResponse.json({ error: 'Failed to fetch sources' }, { status: 500 });
  }
}

// POST handler - add or update user source preferences
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

    // First remove all existing source preferences for this user
    await prisma.user_sources.deleteMany({
      where: { userId: user.id }
    });

    // If sourceIds is empty, the user wants no sources (which means all sources)
    if (sourceIds.length > 0) {
      // Then add the new source preferences
      const sourceCreations = sourceIds.map(sourceId => {
        return prisma.user_sources.create({
          data: {
            userId: user.id,
            sourceId: typeof sourceId === 'string' ? parseInt(sourceId) : sourceId
          }
        });
      });
      
      await prisma.$transaction(sourceCreations);
    }

    return NextResponse.json({ 
      message: 'Source preferences updated successfully' 
    });
  } catch (error) {
    console.error('Error updating source preferences:', error);
    return NextResponse.json({ error: 'Failed to update source preferences' }, { status: 500 });
  }
}