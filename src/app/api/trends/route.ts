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
}

interface JobTitleData {
  title: string;
  count: number;
}

interface SkillData {
  skill: string;
  count: number;
}

interface TrendsResponse {
  sourceData: SourceData[];
  jobTitleData: JobTitleData[];
  skillData: SkillData[];
  filters: string[];
  totalJobs: number;
  totalSources: number;
  lastUpdated: string;
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
    
    // Fetch data for source distribution
    let sourceData: SourceData[] = [];
    if (hasSourceColumn) {
      if (filter === 'all') {
        const sourcesResult = await prisma.$queryRaw<Array<{source: string, count: bigint}>>`
          SELECT source, COUNT(*) as count 
          FROM jobs_jobpost 
          WHERE source IS NOT NULL 
          GROUP BY source 
          ORDER BY count DESC
        `;
        
        sourceData = sourcesResult.map(item => ({
          name: item.source,
          value: Number(item.count)
        }));
      } else {
        // Filter by job title or company containing the filter keyword
        const sourcesResult = await prisma.$queryRaw<Array<{source: string, count: bigint}>>`
          SELECT source, COUNT(*) as count 
          FROM jobs_jobpost 
          WHERE source IS NOT NULL 
          AND (LOWER(title) LIKE ${`%${filter.toLowerCase()}%`} OR LOWER(company) LIKE ${`%${filter.toLowerCase()}%`})
          GROUP BY source 
          ORDER BY count DESC
        `;
        
        sourceData = sourcesResult.map(item => ({
          name: item.source,
          value: Number(item.count)
        }));
      }
    }
    
    // Fetch top 15 job titles
    let jobTitleData: JobTitleData[] = [];
    if (filter === 'all') {
      const jobTitlesResult = await prisma.$queryRaw<Array<{title: string, count: bigint}>>`
        SELECT title, COUNT(*) as count 
        FROM jobs_jobpost 
        GROUP BY title 
        ORDER BY count DESC 
        LIMIT 15
      `;
      
      jobTitleData = jobTitlesResult.map(item => ({
        title: item.title,
        count: Number(item.count)
      }));
    } else {
      const jobTitlesResult = await prisma.$queryRaw<Array<{title: string, count: bigint}>>`
        SELECT title, COUNT(*) as count 
        FROM jobs_jobpost 
        WHERE (LOWER(title) LIKE ${`%${filter.toLowerCase()}%`} OR LOWER(company) LIKE ${`%${filter.toLowerCase()}%`})
        GROUP BY title 
        ORDER BY count DESC 
        LIMIT 15
      `;
      
      jobTitleData = jobTitlesResult.map(item => ({
        title: item.title,
        count: Number(item.count)
      }));
    }
    
    // Extract and count skills from job titles and descriptions
    let skillData: SkillData[] = [];
    try {
      // Extract skills from job titles using common skill keywords
      const skillsResult = await prisma.$queryRaw<Array<{skill: string, count: bigint}>>`
        WITH common_skills AS (
          SELECT term, COUNT(*) as count
          FROM (
            SELECT 
              regexp_split_to_table(
                LOWER(CONCAT(title, ' ', company)), 
                E'[^a-zA-Z0-9\\+\\#]+'
              ) as term
            FROM jobs_jobpost
            WHERE 
              length(TRIM(regexp_split_to_table(
                LOWER(CONCAT(title, ' ', company)), 
                E'[^a-zA-Z0-9\\+\\#]+'
              ))) > 2
          ) as terms
          WHERE term IN (
            'javascript', 'python', 'java', 'react', 'node', 'sql', 'typescript',
            'html', 'css', 'php', 'angular', 'vue', 'aws', 'azure', 'gcp',
            'docker', 'kubernetes', 'devops', 'ci/cd', 'agile', 'scrum',
            'product', 'project', 'management', 'marketing', 'sales', 'finance',
            'hr', 'customer', 'support', 'design', 'ux', 'ui', 'graphic',
            'analytics', 'data', 'machine', 'learning', 'ai', 'frontend',
            'backend', 'fullstack', 'mobile', 'ios', 'android', 'swift',
            'kotlin', 'flutter', 'seo', 'content', 'social', 'accounting',
            'excel', 'powerpoint', 'word', 'office', 'leadership', 'team', 
            'collaboration', 'negotiation', 'qa', 'testing', 'automation',
            'c#', 'cpp', '.net', 'ruby', 'rails', 'django', 'laravel',
            'express', 'nosql', 'mongodb', 'mysql', 'postgresql', 'oracle',
            'api', 'rest', 'graphql', 'saas', 'crm', 'linux', 'unix',
            'windows', 'macos', 'git', 'github', 'jira', 'figma', 'sketch',
            'adobe', 'photoshop', 'illustrator', 'indesign', 'xd', 'analytics',
            'google', 'facebook', 'instagram', 'tiktok', 'youtube', 'wordpress',
            'shopify', 'magento', 'ecommerce', 'b2b', 'b2c'
          )
          GROUP BY term
          ORDER BY count DESC
          LIMIT 20
        )
        SELECT term as skill, count FROM common_skills
      `;
      
      skillData = skillsResult.map(item => ({
        skill: item.skill,
        count: Number(item.count)
      }));
    } catch (error) {
      console.error('Error extracting skills:', error);
      // Provide a fallback if the skill extraction fails
      skillData = [];
    }
    
    // Get common job categories for filters
    const commonCategories = await prisma.$queryRaw<Array<{keyword: string, count: bigint}>>`
      SELECT SPLIT_PART(LOWER(title), ' ', 1) as keyword, COUNT(*) as count
      FROM jobs_jobpost
      GROUP BY keyword
      HAVING COUNT(*) > 10
      ORDER BY count DESC
      LIMIT 5
    `;
    
    const filters: string[] = commonCategories.map(item => item.keyword);
    
    // Get total job count
    const totalJobs: number = await prisma.jobs_jobpost.count();
    
    // Get total distinct sources count
    let totalSources = 0;
    if (hasSourceColumn) {
      const sourcesCountResult = await prisma.$queryRaw<Array<{count: bigint}>>`
        SELECT COUNT(DISTINCT source) as count 
        FROM jobs_jobpost 
        WHERE source IS NOT NULL
      `;
      
      if (sourcesCountResult.length > 0) {
        totalSources = Number(sourcesCountResult[0].count);
      }
    }
    
    // Get last updated timestamp
    const lastUpdatedResult = await prisma.$queryRaw<Array<{max_date: Date | null}>>`
      SELECT MAX(created_at) as max_date FROM jobs_jobpost
    `;
    
    let lastUpdated = new Date().toISOString();
    if (lastUpdatedResult.length > 0 && lastUpdatedResult[0].max_date) {
      lastUpdated = lastUpdatedResult[0].max_date.toISOString();
    }
    
    const response: TrendsResponse = {
      sourceData,
      jobTitleData,
      skillData,
      filters,
      totalJobs,
      totalSources,
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
        jobTitleData: [],
        skillData: [],
        filters: [],
        totalJobs: 0,
        totalSources: 0,
        lastUpdated: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}