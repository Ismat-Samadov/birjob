// src/app/about/page.tsx
import ClientWrapper from "@/components/ClientWrapper";
import dynamic from 'next/dynamic';

// Use dynamic import with ssr disabled to prevent hydration issues
const AboutContent = dynamic(() => import('@/components/AboutContent'), { ssr: false });

export default function About() {
  return (
    <ClientWrapper>
      <AboutContent />
    </ClientWrapper>
  );
}