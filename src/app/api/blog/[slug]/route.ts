// src/app/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Get the blog post
    const post = await prisma.blogPost.findUnique({
      where: { slug },
      include: {
        tags: {
          select: {
            name: true
          }
        },
        relatedPosts: {
          select: {
            relatedPostId: true
          }
        }
      }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Blog post not found' },
        { status: 404 }
      );
    }

    // Format tags
    const formattedPost = {
      ...post,
      date: post.date.toISOString().split('T')[0],
      tags: post.tags.map(tag => tag.name),
      relatedPosts: post.relatedPosts.map(rel => rel.relatedPostId)
    };

    // Get related posts if any
    let relatedPostsData = [];
    if (formattedPost.relatedPosts.length > 0) {
      const relatedPosts = await prisma.blogPost.findMany({
        where: {
          id: { in: formattedPost.relatedPosts }
        },
        include: {
          tags: {
            select: { name: true }
          }
        }
      });

      relatedPostsData = relatedPosts.map(post => ({
        ...post,
        date: post.date.toISOString().split('T')[0],
        tags: post.tags.map(tag => tag.name)
      }));
    }

    // Track view count (increment)
    await prisma.blogPost.update({
      where: { id: post.id },
      data: { viewCount: { increment: 1 } }
    });

    return NextResponse.json({ 
      post: formattedPost,
      relatedPosts: relatedPostsData
    });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog post' },
      { status: 500 }
    );
  }
}