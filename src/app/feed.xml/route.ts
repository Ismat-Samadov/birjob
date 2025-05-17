// src/app/feed.xml/route.ts (New File)
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  // Get all published blog posts
  const posts = await prisma.blogPost.findMany({
    orderBy: {
      date: 'desc',
    },
    take: 20, // Limit to most recent 20 posts
  });

  // Create the RSS XML content
  const rssXml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
  <title>BirJob Career Blog</title>
  <link>https://birjob.com/blog</link>
  <description>Expert career advice, job search tips and industry insights to advance your career</description>
  <language>en</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
  <atom:link href="https://birjob.com/feed.xml" rel="self" type="application/rss+xml" />
  ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>https://birjob.com/blog/${post.slug}</link>
      <guid>https://birjob.com/blog/${post.slug}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description><![CDATA[${post.excerpt}]]></description>
      <author>info@birjob.com (${post.author})</author>
      <category>${post.category}</category>
    </item>
  `).join('')}
</channel>
</rss>`;

  // Return the RSS feed with appropriate headers
  return new NextResponse(rssXml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}