// src/app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// Important: This requires Node.js runtime, not Edge
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

// Define a proper type for the where condition
interface BlogWhereCondition {
  category?: string;
  tags?: {
    some: {
      name: string;
    }
  };
  featured?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') || undefined;
    const tag = searchParams.get('tag') || undefined;
    const featured = searchParams.get('featured') === 'true' ? true : undefined;
    
    // Build where condition based on filters
    const where: BlogWhereCondition = {};
    
    if (category && category !== 'All') {
      where.category = category;
    }
    
    if (tag) {
      where.tags = {
        some: {
          name: tag
        }
      };
    }
    
    if (featured !== undefined) {
      where.featured = featured;
    }
    
    // Get blog posts
    const blogPosts = await prisma.blogPost.findMany({
      where,
      include: {
        tags: {
          select: {
            name: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      }
    });
    
    // Format for response
    const formattedPosts = blogPosts.map(post => ({
      ...post,
      date: post.date.toISOString().split('T')[0],
      tags: post.tags.map(tag => tag.name)
    }));
    
    return NextResponse.json({ posts: formattedPosts });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}