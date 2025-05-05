// src/app/api/users/keywords/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// GET handler - retrieve user keywords
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  try {
    // Check if user exists in our system
    const user = await prisma.users.findUnique({
      where: { email },
      include: { keywords: true },
    });

    if (user) {
      // Return existing keywords for user
      return NextResponse.json({ 
        keywords: user.keywords.map(k => k.keyword),
        lastNotifiedAt: user.lastNotifiedAt
      });
    } else {
      // New user, create an entry but with no keywords yet
      await prisma.users.create({
        data: { email }
      });
      
      return NextResponse.json({ 
        keywords: [],
        message: 'User created. Add keywords to receive notifications.'
      });
    }
  } catch (error) {
    console.error('Error fetching user keywords:', error);
    return NextResponse.json({ error: 'Failed to fetch keywords' }, { status: 500 });
  }
}

// POST handler - add new keyword
export async function POST(request: NextRequest) {
  try {
    const { email, keyword } = await request.json();

    if (!email || !keyword) {
      return NextResponse.json({ error: 'Email and keyword are required' }, { status: 400 });
    }

    const normalizedKeyword = keyword.trim().toLowerCase();
    
    if (normalizedKeyword.length < 2) {
      return NextResponse.json({ error: 'Keyword must be at least 2 characters' }, { status: 400 });
    }

    // Check if user exists
    let user = await prisma.users.findUnique({
      where: { email },
      include: { keywords: true },
    });

    if (!user) {
      // Create new user if not exists
      user = await prisma.users.create({
        data: { 
          email,
          keywords: {
            create: [{ keyword: normalizedKeyword }]
          }
        },
        include: { keywords: true },
      });
    } else {
      // Check if keyword already exists for this user
      const keywordExists = user.keywords.some(k => 
        k.keyword.toLowerCase() === normalizedKeyword
      );

      if (keywordExists) {
        return NextResponse.json({ 
          error: 'Keyword already exists for this user' 
        }, { status: 400 });
      }

      // Add new keyword
      await prisma.keywords.create({
        data: {
          keyword: normalizedKeyword,
          userId: user.id
        }
      });
    }

    return NextResponse.json({ 
      message: 'Keyword added successfully' 
    });
  } catch (error) {
    console.error('Error adding keyword:', error);
    return NextResponse.json({ error: 'Failed to add keyword' }, { status: 500 });
  }
}

// DELETE handler - remove keyword
export async function DELETE(request: NextRequest) {
  try {
    const { email, keyword } = await request.json();

    if (!email || !keyword) {
      return NextResponse.json({ error: 'Email and keyword are required' }, { status: 400 });
    }

    // Find user
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete keyword
    await prisma.keywords.deleteMany({
      where: {
        userId: user.id,
        keyword: { equals: keyword, mode: 'insensitive' }
      }
    });

    return NextResponse.json({ 
      message: 'Keyword removed successfully' 
    });
  } catch (error) {
    console.error('Error removing keyword:', error);
    return NextResponse.json({ error: 'Failed to remove keyword' }, { status: 500 });
  }
}