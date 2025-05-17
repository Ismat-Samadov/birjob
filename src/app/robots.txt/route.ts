// src/app/robots.txt/route.ts (New File)
import { NextResponse } from 'next/server';

export function GET() {
  const robotsTxt = `
User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /api/*
Disallow: /admin/*

# Sitemap
Sitemap: https://birjob.com/sitemap.xml
`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}