// src/app/jobs/location/[location]/page.tsx
import ClientWrapper from "@/components/ClientWrapper";
import { Metadata } from 'next';
import { PrismaClient } from '@prisma/client';
import LocationJobsContent from "@/components/LocationJobsContent";

// Initialize Prisma
const prisma = new PrismaClient();

// This generates dynamic metadata for each location page
export async function generateMetadata({ 
  params 
}: { 
  params: { location: string } 
}): Promise<Metadata> {
  const location = params.location.charAt(0).toUpperCase() + params.location.slice(1);
  
  // Get job count for this location to include in metadata
  let jobCount = 0;
  try {
    jobCount = await prisma.jobs_jobpost.count({
      where: {
        OR: [
          { title: { contains: params.location, mode: 'insensitive' } },
          { company: { contains: params.location, mode: 'insensitive' } }
        ]
      }
    });
  } catch (error) {
    console.error("Error fetching job count for metadata:", error);
  }
  
  const metaTitle = `${location} Jobs (${jobCount}+) - Local Career Opportunities | BirJob`;
  const metaDescription = `Find ${jobCount}+ job opportunities in ${location}. Browse local career openings, set up personalized job alerts, and apply directly to ${location} positions.`;
  
  return {
    title: metaTitle,
    description: metaDescription,
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: `https://birjob.com/jobs/location/${params.location}`,
      siteName: 'BirJob',
      locale: 'en_US',
      type: 'website',
      images: [
        {
          url: `https://birjob.com/api/og?title=${encodeURIComponent(`${location} Jobs`)}&subtitle=${encodeURIComponent(`${jobCount}+ opportunities in ${location}`)}`,
          width: 1200,
          height: 630,
          alt: `${location} Jobs - BirJob`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [`https://birjob.com/api/og?title=${encodeURIComponent(`${location} Jobs`)}&subtitle=${encodeURIComponent(`${jobCount}+ opportunities in ${location}`)}`],
    },
    alternates: {
      canonical: `https://birjob.com/jobs/location/${params.location}`,
    },
    keywords: [`${location} jobs`, `${location} careers`, `${location} employment`, `jobs in ${location}`, `work in ${location}`, `${location} job listings`, `${location} job opportunities`],
  }
}

// This generates static paths at build time for common locations
export async function generateStaticParams() {
  const locations = ['baku', 'azerbaijan', 'ganja', 'sumgait'];
  
  return locations.map(location => ({
    location,
  }));
}

export default function LocationPage({ params }: { params: { location: string } }) {
  return (
    <ClientWrapper>
      <LocationJobsContent location={params.location} />
    </ClientWrapper>
  );
}