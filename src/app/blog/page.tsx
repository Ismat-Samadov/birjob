// src/app/blog/page.tsx (Complete File)
import ClientWrapper from "@/components/ClientWrapper";
import BlogContent from "@/components/BlogContent";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Career Blog - Expert Job Search Advice | BirJob',
  description: 'Expert advice, industry insights, and career tips to help you succeed in your job search and professional development',
  openGraph: {
    title: 'Career Blog - Expert Job Search Advice | BirJob',
    description: 'Expert advice, industry insights, and career tips to help you succeed in your job search',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1453928582365-b6ad33cbcf64?q=80&w=2946&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        width: 1200,
        height: 630,
        alt: 'BirJob Career Blog',
      },
    ],
    url: 'https://birjob.com/blog',
  },
  alternates: {
    canonical: 'https://birjob.com/blog',
  },
};

export default function Blog() {
  return (
    <ClientWrapper>
      <BlogContent />
    </ClientWrapper>
  );
}