import ClientWrapper from "@/components/ClientWrapper";
import BlogContent from "@/components/BlogContent";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - BirJob',
  description: 'Expert advice, industry insights, and career tips to help you succeed in your job search',
};

export default function Blog() {
  return (
    <ClientWrapper>
      <BlogContent />
    </ClientWrapper>
  );
}