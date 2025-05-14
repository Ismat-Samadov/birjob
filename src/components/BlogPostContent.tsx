"use client"

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Bookmark, Clock, Copy, Share2, ThumbsUp, 
  MessageCircle, MessageSquare, Heart, Tag, TrendingUp
} from "lucide-react";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

// Enhanced blog post data with images, author info and related posts
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Job Hunting Strategies for 2025",
    excerpt: "Discover the most effective techniques to stand out in today's competitive job market and land your dream job.",
    content: `
      <h2>Introduction</h2>
      <p>The job market in 2025 is more dynamic and competitive than ever before. With the rise of AI-driven hiring processes, remote work opportunities, and changing employer expectations, job seekers need to adapt their strategies to stand out from the crowd.</p>
      
      <p>In this comprehensive guide, we&apos;ll explore the most effective job hunting techniques that are working in 2025, based on current industry trends and feedback from hiring managers across various sectors.</p>
      
      <h2>1. Optimize Your Online Presence</h2>
      <p>Your digital footprint matters more than ever. Employers typically research candidates online before making hiring decisions. Ensure your LinkedIn profile is complete and showcases your professional achievements with quantifiable results. Consider creating a personal website that serves as a portfolio of your work and skills.</p>
      
      <p>Pro tip: Regularly publish thoughtful content related to your industry to position yourself as a thought leader.</p>
      
      <h2>2. Leverage AI Tools for Your Job Search</h2>
      <p>AI-powered job platforms like BirJob can help you discover opportunities that match your skills and preferences. These tools can save you countless hours by filtering through thousands of listings to find the best matches for your profile.</p>
      
      <p>Additionally, use AI resume optimization tools to ensure your resume passes through Applicant Tracking Systems (ATS) while remaining appealing to human recruiters.</p>
      
      <h2>3. Develop In-Demand Skills</h2>
      <p>The skills marketplace evolves rapidly. Stay ahead by continuously developing skills that employers value. In 2025, some of the most in-demand skills include:</p>
      <ul>
        <li>Data analysis and interpretation</li>
        <li>AI and machine learning knowledge</li>
        <li>Digital collaboration tools expertise</li>
        <li>Adaptability and resilience</li>
        <li>Critical thinking and problem-solving</li>
      </ul>
      
      <h2>4. Network Strategically</h2>
      <p>Despite technological advances, networking remains one of the most effective job search strategies. Instead of focusing on quantity, build meaningful relationships with professionals in your target industry. Engage thoughtfully in online communities, professional groups, and industry events.</p>
      
      <p>Remember that networking is about giving value as much as it is about receiving opportunities. Share your expertise, offer help, and be genuinely interested in others.</p>
      
      <h2>5. Personalize Your Applications</h2>
      <p>Generic applications rarely make it past the initial screening. Take the time to tailor your resume and cover letter for each position, highlighting relevant skills and experiences that match the job description.</p>
      
      <p>Research the company thoroughly and reference specific aspects of their business or culture that appeal to you, showing that you&apos;ve done your homework.</p>
      
      <h2>6. Prepare for Modern Interview Formats</h2>
      <p>Interviews in 2025 often include a mix of traditional, behavioral, technical, and AI-driven assessments. Practice for various formats, including video interviews, asynchronous interviews (where you record responses to questions), and virtual reality assessments.</p>
      
      <p>Develop compelling stories that demonstrate your skills and impact, following the STAR method (Situation, Task, Action, Result).</p>
      
      <h2>7. Showcase Your Remote Work Capabilities</h2>
      <p>With hybrid and remote work models now the norm in many industries, employers look for candidates who can demonstrate effectiveness outside traditional office environments. Highlight your experience with digital collaboration tools, self-management, and communication skills essential for remote work.</p>
      
      <h2>8. Tap Into the Hidden Job Market</h2>
      <p>Many positions are filled without ever being publicly advertised. Gain access to this hidden job market by developing relationships with recruiters, joining industry-specific communities, and directly approaching companies you&apos;d like to work for, even if they haven&apos;t posted relevant openings.</p>
      
      <h2>9. Focus on Value and Results</h2>
      <p>Employers hire people who can solve problems and add value. Instead of merely listing your responsibilities, emphasize the concrete results you&apos;ve achieved in previous roles. Quantify your impact whenever possible with specific metrics and outcomes.</p>
      
      <h2>10. Maintain Resilience and Persistence</h2>
      <p>Job hunting can be challenging and sometimes disheartening. Develop a resilient mindset by setting realistic expectations, celebrating small wins, and learning from rejections. Maintain a consistent schedule for your job search activities, and don&apos;t hesitate to adjust your approach based on the feedback you receive.</p>
      
      <h2>Conclusion</h2>
      <p>The most successful job seekers in 2025 combine technological savvy with traditional relationship-building skills. By implementing these ten strategies, you&apos;ll position yourself effectively in a competitive market and increase your chances of landing not just any job, but the right job for your career goals and personal aspirations.</p>
      
      <p>Remember that job hunting is a skill in itself—one that improves with practice and persistence. Stay adaptable, keep learning, and approach the process with confidence in the value you bring to potential employers.</p>
    `,
    author: "Career Expert",
    authorImage: "/assets/authors/career-expert.jpg",
    authorBio: "Sarah Johnson is a career development specialist with over 15 years of experience helping professionals navigate the job market. She has coached executives at Fortune 500 companies and written for major career publications.",
    authorRole: "Senior Career Advisor",
    date: "May 10, 2025",
    readTime: "8 min read",
    category: "Job Search",
    slug: "top-job-hunting-strategies-2025",
    featured: true,
    coverImage: "/assets/blog/job-hunting-strategies.jpg",
    trendingScore: 92,
    viewCount: 1245,
    likeCount: 248,
    commentCount: 37,
    tags: ["Job Search", "Career Advice", "Networking", "Interviews"],
    relatedPosts: [2, 4, 6]
  },
  {
    id: 2,
    title: "How to Craft a Resume That Gets Noticed by ATS",
    excerpt: "Learn how to optimize your resume for Applicant Tracking Systems while still making it appealing to human recruiters.",
    content: "", // Full content would be here
    author: "HR Specialist",
    authorImage: "/assets/authors/hr-specialist.jpg",
    authorBio: "Michael Chen is a recruitment lead with expertise in AI-driven hiring systems. He has helped hundreds of candidates optimize their resumes for modern ATS platforms.",
    authorRole: "Recruitment Lead at TechCorp",
    date: "May 5, 2025",
    readTime: "6 min read",
    category: "Resumes",
    slug: "ats-friendly-resume-tips",
    featured: true,
    coverImage: "/assets/blog/ats-resume.jpg",
    trendingScore: 87,
    viewCount: 982,
    likeCount: 176,
    commentCount: 24,
    tags: ["Resumes", "Job Search", "ATS", "Career Advice"],
    relatedPosts: [1, 3, 4]
  },
  // More posts would be defined here
];

interface BlogPostProps {
  slug: string;
}

export default function BlogPostContent({ slug }: BlogPostProps) {
  const [post, setPost] = useState<Record<string, any> | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<Record<string, any>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copyLinkText, setCopyLinkText] = useState("Copy Link");
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const articleRef = useRef<HTMLDivElement>(null);
  const { trackPageView, trackEvent } = useAnalytics();
  const { addToast } = useToast();

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchPost = () => {
      setIsLoading(true);
      
      // Find the post that matches the slug
      const foundPost = blogPosts.find(p => p.slug === slug);
      
      if (foundPost) {
        setPost(foundPost);
        
        // Get related posts
        if (foundPost.relatedPosts && foundPost.relatedPosts.length > 0) {
          const related = blogPosts.filter(p => foundPost.relatedPosts?.includes(p.id));
          setRelatedPosts(related);
        }
        
        // Track page view
        trackPageView({
          url: `/blog/${slug}`,
          title: `${foundPost.title} - BirJob Blog`
        });

        // Check if post was previously liked or saved
        const likedPosts = localStorage.getItem('likedPosts');
        if (likedPosts) {
          const likedPostIds = JSON.parse(likedPosts);
          setIsLiked(likedPostIds.includes(foundPost.id));
        }

        const savedPosts = localStorage.getItem('savedPosts');
        if (savedPosts) {
          const savedPostIds = JSON.parse(savedPosts);
          setIsSaved(savedPostIds.includes(foundPost.id));
        }
      }
      
      setIsLoading(false);
    };
    
    fetchPost();

    // Set up scroll event listener for reading progress
    const handleScroll = () => {
      if (articleRef.current) {
        const element = articleRef.current;
        const totalHeight = element.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollTop = window.scrollY;
        
        // Adjust the scroll position to account for the article's position
        const elementTop = element.getBoundingClientRect().top + scrollTop;
        const scrollPosition = scrollTop - elementTop;
        
        // Calculate reading progress as a percentage
        const scrollPercentage = Math.min(
          100,
          Math.max(
            0,
            Math.round((scrollPosition / (totalHeight - windowHeight)) * 100)
          )
        );
        
        setReadingProgress(scrollPercentage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [slug, trackPageView]);

  const handleShareClick = async () => {
    if (navigator.share && post) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: window.location.href
        });
        
        trackEvent({
          category: 'Blog',
          action: 'Share Post',
          label: post.title
        });
      } catch (error) {
        console.error('Error sharing', error);
      }
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href);
      
      addToast({
        title: "Link Copied!",
        description: "The article link has been copied to your clipboard.",
        type: "success",
        duration: 3000
      });
      
      trackEvent({
        category: 'Blog',
        action: 'Copy Link',
        label: post?.title || slug
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopyLinkText("Copied!");
    
    setTimeout(() => {
      setCopyLinkText("Copy Link");
    }, 2000);
    
    trackEvent({
      category: 'Blog',
      action: 'Copy Link',
      label: post?.title || slug
    });
  };

  const handleLikeClick = () => {
    setIsLiked(!isLiked);
    
    // Save liked status to localStorage
    const likedPosts = localStorage.getItem('likedPosts');
    let likedPostIds = likedPosts ? JSON.parse(likedPosts) : [];
    
    if (isLiked) {
      likedPostIds = likedPostIds.filter((id: number) => id !== post?.id);
    } else {
      likedPostIds.push(post?.id);
    }
    
    localStorage.setItem('likedPosts', JSON.stringify(likedPostIds));
    
    trackEvent({
      category: 'Blog',
      action: isLiked ? 'Unlike Post' : 'Like Post',
      label: post?.title || slug
    });
  };

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
    
    // Save bookmark status to localStorage
    const savedPosts = localStorage.getItem('savedPosts');
    let savedPostIds = savedPosts ? JSON.parse(savedPosts) : [];
    
    if (isSaved) {
      savedPostIds = savedPostIds.filter((id: number) => id !== post?.id);
    } else {
      savedPostIds.push(post?.id);
    }
    
    localStorage.setItem('savedPosts', JSON.stringify(savedPostIds));
    
    addToast({
      title: isSaved ? "Removed from Saved" : "Saved Successfully",
      description: isSaved 
        ? "The article has been removed from your saved items."
        : "This article has been saved to your reading list.",
      type: "info",
      duration: 3000
    });
    
    trackEvent({
      category: 'Blog',
      action: isSaved ? 'Remove Bookmark' : 'Add Bookmark',
      label: post?.title || slug
    });
  };

  // Extract headings from content to build table of contents
  const extractHeadings = (content: string) => {
    const headingRegex = /<h([2-3])>([^<]+)<\/h\1>/g;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      headings.push({
        level: parseInt(match[1]),
        text: match[2],
        id: match[2].toLowerCase().replace(/[^\w]+/g, '-')
      });
    }
    
    return headings;
  };
  
  // Format content with IDs for headings
  const formatContentWithIds = (content: string) => {
    return content.replace(
      /<h([2-3])>([^<]+)<\/h\1>/g,
      (match, level, text) => {
        const id = text.toLowerCase().replace(/[^\w]+/g, '-');
        return `<h${level} id="${id}">${text}</h${level}>`;
      }
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/5"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Post Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Sorry, the blog post you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link href="/blog" passHref>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract headings for table of contents
  const headings = extractHeadings(post.content);
  const formattedContent = formatContentWithIds(post.content);

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-gray-200 dark:bg-gray-700">
        <div 
          className="h-1 bg-blue-600 dark:bg-blue-500 transition-all duration-300 ease-out"
          style={{ width: `${readingProgress}%` }}
        ></div>
      </div>
      
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Back to blog link */}
          <div className="mb-6 max-w-4xl mx-auto">
            <Link href="/blog" passHref>
              <Button variant="ghost" className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Blog
              </Button>
            </Link>
          </div>

          {/* Hero Section with Cover Image */}
          <div className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden mb-8 aspect-[21/9]">
            {/* This would be an actual cover image in production */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600">
              <div className="w-full h-full flex items-center justify-center text-white/20 text-9xl font-bold">
                {post.id}
              </div>
            </div>
            <div className="absolute inset-0 bg-black/40"></div>
            {post.trendingScore > 80 && (
              <div className="absolute top-6 left-6 z-10 flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                Trending
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
              <div className="flex items-center space-x-2 text-sm text-white mb-3">
                <span className="bg-blue-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.readTime}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl">
                {post.title}
              </h1>
              <div className="flex items-center">
                {/* This would be an actual author image in production */}
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 flex items-center justify-center text-white font-bold text-xl mr-4 border-2 border-white">
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-white">{post.author}</p>
                  <div className="flex items-center text-sm text-white/70">
                    <span>{post.date}</span>
                    <span className="mx-2">·</span>
                    <span>{post.readTime}</span>
                    <span className="mx-2">·</span>
                    <span>{post.viewCount.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
            {/* Left sidebar - Table of Contents (visible on large screens) */}
            <aside className="hidden lg:block lg:w-64 sticky top-24 self-start">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Contents</h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-gray-600 dark:text-gray-400 p-0 h-6"
                    onClick={() => setShowTableOfContents(!showTableOfContents)}
                  >
                    {showTableOfContents ? "Hide" : "Show"}
                  </Button>
                </div>
                
                {showTableOfContents && (
                  <nav className="toc text-gray-700 dark:text-gray-300">
                    <ul className="space-y-2">
                      {headings.map((heading, index) => (
                        <li key={index} className={`${heading.level === 3 ? 'ml-4' : ''}`}>
                          <a 
                            href={`#${heading.id}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 text-sm transition-colors line-clamp-1"
                            onClick={() => {
                              trackEvent({
                                category: 'Blog',
                                action: 'TOC Click',
                                label: heading.text
                              });
                            }}
                          >
                            {heading.text}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </nav>
                )}
              </div>
            </aside>

            {/* Main content */}
            <main className="lg:flex-1 max-w-3xl mx-auto lg:mx-0">
              <Card className="overflow-hidden mb-8 dark:bg-gray-800">
                <CardContent className="p-6 md:p-8" ref={articleRef}>
                  {/* Article content */}
                  <div 
                    className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-img:rounded-lg"
                    dangerouslySetInnerHTML={{ __html: formattedContent }}
                  />
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.map((tag: string, index: number) => (
                          <Link 
                            key={index} 
                            href={`/blog?tag=${encodeURIComponent(tag)}`}
                            className="inline-flex items-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full px-3 py-1 text-sm text-gray-800 dark:text-gray-200"
                            onClick={() => {
                              trackEvent({
                                category: 'Blog',
                                action: 'Tag Click',
                                label: tag
                              });
                            }}
                          >
                            <Tag className="h-3 w-3 mr-1" />
                            {tag}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Engagement buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleLikeClick}
                        className={isLiked ? 
                          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" : 
                          "dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"}
                      >
                        <Heart className={`h-4 w-4 mr-2 ${isLiked ? "fill-blue-700 dark:fill-blue-400" : ""}`} />
                        {isLiked ? "Liked" : "Like"} ({post.likeCount + (isLiked ? 1 : 0)})
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSaveClick}
                        className={isSaved ? 
                          "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" : 
                          "dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"}
                      >
                        <Bookmark className={`h-4 w-4 mr-2 ${isSaved ? "fill-blue-700 dark:fill-blue-400" : ""}`} />
                        {isSaved ? "Saved" : "Save"}
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleShareClick}
                        className="dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyLink}
                        className="dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        {copyLinkText}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Social share buttons */}
                  <div className="mt-4 flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Share on:</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20"
                      onClick={() => {
                        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank');
                        trackEvent({
                          category: 'Blog',
                          action: 'Share Twitter',
                          label: post.title
                        });
                      }}
                      aria-label="Share on Twitter"
                    >
                      <span className="sr-only">Twitter</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-[#4267B2]/10 text-[#4267B2] hover:bg-[#4267B2]/20"
                      onClick={() => {
                        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                        trackEvent({
                          category: 'Blog',
                          action: 'Share Facebook',
                          label: post.title
                        });
                      }}
                      aria-label="Share on Facebook"
                    >
                      <span className="sr-only">Facebook</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-[#0077B5]/10 text-[#0077B5] hover:bg-[#0077B5]/20"
                      onClick={() => {
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                        trackEvent({
                          category: 'Blog',
                          action: 'Share LinkedIn',
                          label: post.title
                        });
                      }}
                      aria-label="Share on LinkedIn"
                    >
                      <span className="sr-only">LinkedIn</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              {/* Author information */}
              <Card className="mb-8 dark:bg-gray-800 border-blue-100 dark:border-blue-900/50">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    {/* This would be an actual author image in production */}
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold border-4 border-white dark:border-gray-800">
                      {post.author.charAt(0)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{post.author}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{post.authorRole}</p>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{post.authorBio}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50"
                        onClick={() => {
                          trackEvent({
                            category: 'Blog',
                            action: 'Follow Author',
                            label: post.author
                          });
                          addToast({
                            title: "Author Followed",
                            description: `You are now following ${post.author}`,
                            type: "success",
                            duration: 3000
                          });
                        }}
                      >
                        Follow Author
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              {/* Comments section */}
              <Card className="mb-8 dark:bg-gray-800">
                <CardContent className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">Comments ({post.commentCount})</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-600 dark:text-gray-300"
                      onClick={() => {
                        trackEvent({
                          category: 'Blog',
                          action: 'Comment Button Click',
                          label: post.title
                        });
                        addToast({
                          title: "Sign in Required",
                          description: "Please sign in to leave a comment",
                          type: "info",
                          duration: 3000
                        });
                      }}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Add Comment
                    </Button>
                  </div>
                  
                  {/* Sample comments - In production, these would come from a database */}
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
                        J
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white">John Doe</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">3 days ago</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          Great article! I particularly found the section on networking strategically to be very helpful. I&apos;ve been trying to expand my professional network and these tips are exactly what I needed.
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="text-gray-500 dark:text-gray-400 text-xs flex items-center hover:text-blue-600 dark:hover:text-blue-400">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            8 Likes
                          </button>
                          <button className="text-gray-500 dark:text-gray-400 text-xs flex items-center hover:text-blue-600 dark:hover:text-blue-400">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-red-500 flex-shrink-0 flex items-center justify-center text-white font-bold">
                        S
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">1 week ago</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm">
                          I&apos;ve been struggling with my job search for months. These strategies are exactly what I needed to revamp my approach. Thank you for the detailed explanations and practical tips!
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <button className="text-gray-500 dark:text-gray-400 text-xs flex items-center hover:text-blue-600 dark:hover:text-blue-400">
                            <ThumbsUp className="h-3 w-3 mr-1" />
                            12 Likes
                          </button>
                          <button className="text-gray-500 dark:text-gray-400 text-xs flex items-center hover:text-blue-600 dark:hover:text-blue-400">
                            <MessageCircle className="h-3 w-3 mr-1" />
                            Reply
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <button 
                      className="text-blue-600 dark:text-blue-400 text-sm font-medium"
                      onClick={() => {
                        trackEvent({
                          category: 'Blog',
                          action: 'View All Comments',
                          label: post.title
                        });
                        addToast({
                          title: "Sign in Required",
                          description: "Please sign in to view all comments",
                          type: "info",
                          duration: 3000
                        });
                      }}
                    >
                      View all {post.commentCount} comments
                    </button>
                  </div>
                </CardContent>
              </Card>
            </main>
            
            {/* Right sidebar - Related articles and sticky share buttons */}
            <aside className="lg:w-64 sticky top-24 self-start hidden lg:block">
              {/* Related articles */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.slice(0, 3).map(relatedPost => (
                    <div key={relatedPost.id} className="group">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2 mb-1">
                          {relatedPost.title}
                        </h4>
                      </Link>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{relatedPost.readTime}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating share buttons */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">Share This Article</h3>
                <div className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-[#1DA1F2]/10 text-[#1DA1F2] border-[#1DA1F2]/20 hover:bg-[#1DA1F2]/20"
                    onClick={() => {
                      window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(post.title)}`, '_blank');
                      trackEvent({
                        category: 'Blog',
                        action: 'Share Twitter',
                        label: post.title
                      });
                    }}
                    aria-label="Share on Twitter"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Twitter
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-[#4267B2]/10 text-[#4267B2] border-[#4267B2]/20 hover:bg-[#4267B2]/20"
                    onClick={() => {
                      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank');
                      trackEvent({
                        category: 'Blog',
                        action: 'Share Facebook',
                        label: post.title
                      });
                    }}
                    aria-label="Share on Facebook"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Facebook
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-[#0077B5]/10 text-[#0077B5] border-[#0077B5]/20 hover:bg-[#0077B5]/20"
                    onClick={() => {
                      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, '_blank');
                      trackEvent({
                        category: 'Blog',
                        action: 'Share LinkedIn',
                        label: post.title
                      });
                    }}
                    aria-label="Share on LinkedIn"
                  >
                    <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <circle cx="4" cy="4" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    LinkedIn
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={handleCopyLink}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copyLinkText}
                  </Button>
                </div>
              </div>
            </aside>
          </div>
          
          {/* Related articles (Mobile and tablet view) */}
          <div className="lg:hidden max-w-3xl mx-auto mt-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.slice(0, 4).map(relatedPost => (
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300 dark:bg-gray-800">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                      <span className="flex items-center">
                        <Tag className="h-3 w-3 mr-1" />
                        {relatedPost.category}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {relatedPost.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                    <Link href={`/blog/${relatedPost.slug}`} passHref>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-0"
                        onClick={() => {
                          trackEvent({
                            category: 'Blog',
                            action: 'Related Article Click',
                            label: relatedPost.title
                          });
                        }}
                      >
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}