import ClientWrapper from "@/components/ClientWrapper";
import BlogPostContent from "@/components/BlogPostContent";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export default function BlogPost({ params }: BlogPostPageProps) {
  return (
    <ClientWrapper>
      <BlogPostContent slug={params.slug} />
    </ClientWrapper>
  );
}