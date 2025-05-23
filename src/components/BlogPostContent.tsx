// src/components/BlogPostContent.tsx
"use client"

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Bookmark, Clock, Copy, Share2, ThumbsUp, 
  MessageCircle, MessageSquare, Heart, Tag, TrendingUp
} from 'lucide-react';
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";
import Image from 'next/image';

// Define types for blog post
interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  authorBio: string;
  authorRole: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  coverImage: string;
  featured: boolean;
  trendingScore: number;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  tags: string[];
  relatedPosts: number[];
}

interface BlogPostProps {
  slug: string;
}

// Function to enhance typography in the blog content
function enhanceTypography(content: string): string {
  if (!content) return '';
  
  // Fix malformed headings like "Introduction id="2">2Introduction>"
  let enhancedContent = content.replace(
    /([^\n<]+)\s+id="2">2([^>]+)>/g,
    '<h2>$1</h2>'
  );
  
  // Fix numbered headings like "1. Title id="2">21. Title>"
  enhancedContent = enhancedContent.replace(
    /(\d+\.\s+[^\n<]+)\s+id="2">2\d+\.\s+[^>]+>/g,
    '<h2>$1</h2>'
  );
  
  // Enhance heading styles with proper spacing
  enhancedContent = enhancedContent
    // Add classes to h2 elements
    .replace(
      /<h2>([^<]+)<\/h2>/g,
      '<h2 class="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mt-10 mb-6 leading-tight">$1</h2>'
    )
    // Add classes to h3 elements
    .replace(
      /<h3>([^<]+)<\/h3>/g,
      '<h3 class="text-xl font-semibold text-gray-800 dark:text-gray-100 mt-8 mb-4 leading-tight">$1</h3>'
    );
  
  // Enhance paragraphs with better spacing and line height
  enhancedContent = enhancedContent.replace(
    /<p>([^<]+)<\/p>/g,
    '<p class="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">$1</p>'
  );
  
  // Add spacing and styling to lists
  enhancedContent = enhancedContent
    // Unordered lists
    .replace(
      /<ul>/g,
      '<ul class="list-disc pl-6 space-y-2 my-6">'
    )
    // Ordered lists
    .replace(
      /<ol>/g,
      '<ol class="list-decimal pl-6 space-y-2 my-6">'
    )
    // List items
    .replace(
      /<li>([^<]+)<\/li>/g,
      '<li class="text-gray-700 dark:text-gray-300 leading-relaxed">$1</li>'
    );
  
  // Add emphasis to key phrases (looking for sentences that might be important)
  enhancedContent = enhancedContent.replace(
    /(<p [^>]+>)([A-Z][^.!?:]+(?:[.!?:]))(\s[^<]+<\/p>)/g,
    '$1<em>$2</em>$3'
  );
  
  // Add styling to strong elements
  enhancedContent = enhancedContent.replace(
    /<strong>([^<]+)<\/strong>/g,
    '<strong class="font-semibold text-gray-900 dark:text-white">$1</strong>'
  );
  
  return enhancedContent;
}

export default function BlogPostContent({ slug }: BlogPostProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const [copyLinkText, setCopyLinkText] = useState("Copy Link");
  const [showTableOfContents, setShowTableOfContents] = useState(true);
  const [enhancedContent, setEnhancedContent] = useState<string>("");
  const articleRef = useRef<HTMLDivElement>(null);
  const { trackPageView, trackEvent } = useAnalytics();
  const { addToast } = useToast();

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      
      try {
        const response = await fetch(`/api/blog/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Blog post not found');
          }
          throw new Error('Failed to fetch blog post');
        }
        
        const data = await response.json();
        
        setPost(data.post);
        setRelatedPosts(data.relatedPosts || []);
        
        // Apply typography enhancements to the content
        if (data.post?.content) {
          setEnhancedContent(enhanceTypography(data.post.content));
        }
        
        // Track page view
        trackPageView({
          url: `/blog/${slug}`,
          title: `${data.post.title} - BirJob Blog`
        });

        // Check if post was previously liked or saved
        const likedPosts = localStorage.getItem('likedPosts');
        if (likedPosts) {
          const likedPostIds = JSON.parse(likedPosts);
          setIsLiked(likedPostIds.includes(data.post.id));
        }

        const savedPosts = localStorage.getItem('savedPosts');
        if (savedPosts) {
          const savedPostIds = JSON.parse(savedPosts);
          setIsSaved(savedPostIds.includes(data.post.id));
        }
        
      } catch (error) {
        console.error('Error fetching blog post:', error);
        addToast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to load blog post",
          type: "destructive",
          duration: 5000
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (slug) {
      fetchPost();
    }
    
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
  }, [slug, trackPageView, trackEvent, addToast]);

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
    if (!post) return;
    
    setIsLiked(!isLiked);
    
    // Save liked status to localStorage
    const likedPosts = localStorage.getItem('likedPosts');
    let likedPostIds = likedPosts ? JSON.parse(likedPosts) : [];
    
    if (isLiked) {
      likedPostIds = likedPostIds.filter((id: number) => id !== post.id);
    } else {
      likedPostIds.push(post.id);
    }
    
    localStorage.setItem('likedPosts', JSON.stringify(likedPostIds));
    
    trackEvent({
      category: 'Blog',
      action: isLiked ? 'Unlike Post' : 'Like Post',
      label: post.title
    });
  };

  const handleSaveClick = () => {
    if (!post) return;
    
    setIsSaved(!isSaved);
    
    // Save bookmark status to localStorage
    const savedPosts = localStorage.getItem('savedPosts');
    let savedPostIds = savedPosts ? JSON.parse(savedPosts) : [];
    
    if (isSaved) {
      savedPostIds = savedPostIds.filter((id: number) => id !== post.id);
    } else {
      savedPostIds.push(post.id);
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
      label: post.title
    });
  };

  // Extract headings from content to build table of contents
  const extractHeadings = (content: string) => {
    const headingRegex = /<h([2-3])[^>]*>([^<]+)<\/h\1>/g;
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

  // Extract headings for table of contents using the enhanced content
  const headings = extractHeadings(enhancedContent);

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
          <div className="relative w-full max-w-6xl mx-auto rounded-xl overflow-hidden mb-12 aspect-[21/9]">
            <div className="absolute inset-0">
              <Image 
                src={post.coverImage} 
                alt={post.title}
                fill
                className="object-cover"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-black/40"></div>
            {post.trendingScore > 80 && (
              <div className="absolute top-6 left-6 z-10 flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                <TrendingUp className="h-4 w-4 mr-1" />
                Trending
              </div>
            )}
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
              <div className="flex items-center space-x-2 text-sm text-white mb-4">
                <span className="bg-blue-600/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-medium">
                  {post.category}
                </span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.readTime}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 max-w-4xl leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center">
                <div className="relative h-12 w-12 mr-4">
                  <Image 
                    src={post.authorImage}
                    alt={post.author}
                    width={48}
                    height={48}
                    className="rounded-full object-cover border-2 border-white"
                  />
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
                  <nav className="toc">
                    <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                      {headings.map((heading, index) => (
                        <li 
                          key={index} 
                          className={`${heading.level === 3 ? 'ml-4 text-sm' : 'font-medium'}`}
                        >
                          <a 
                            href={`#${heading.id}`}
                            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2"
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
              <Card className="overflow-hidden mb-8 dark:bg-gray-800 shadow-lg">
                <CardContent className="p-6 md:p-8" ref={articleRef}>
                  {/* Article excerpt */}
                  <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 font-medium italic border-l-4 border-blue-500 pl-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded">
                    {post.excerpt}
                  </p>
                  
                  {/* Article content - Using the enhanced content */}
                  <div 
                    className="typography-enhanced"
                    dangerouslySetInnerHTML={{ __html: enhancedContent }}
                  />
                  
                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="mt-12 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Tags</h3>
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
                  <div className="mt-10 flex flex-col sm:flex-row gap-4 sm:gap-8 items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
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
              <Card className="mb-8 dark:bg-gray-800 border-blue-100 dark:border-blue-900/50 shadow-md">
                <CardContent className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">
                    <div className="relative w-24 h-24">
                      <Image 
                        src={post.authorImage}
                        alt={post.author}
                        width={96}
                        height={96}
                        className="rounded-full object-cover border-4 border-white dark:border-gray-800"
                      />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{post.author}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{post.authorRole}</p>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">{post.authorBio}</p>
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
              <Card className="mb-8 dark:bg-gray-800 shadow-md">
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
                      <div className="relative h-10 w-10 flex-shrink-0">
                        <Image 
                          src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                          alt="John Doe"
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white">John Doe</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">3 days ago</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
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
                      <div className="relative h-10 w-10 flex-shrink-0">
                        <Image 
                          src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                          alt="Sarah Johnson"
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-gray-900 dark:text-white">Sarah Johnson</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs">1 week ago</span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
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
            <aside className="hidden lg:block lg:w-64 sticky top-24 self-start">
              {/* Related articles */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-4">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Related Articles</h3>
                <div className="space-y-4">
                  {relatedPosts.slice(0, 3).map(relatedPost => (
                    <div key={relatedPost.id} className="group">
                      <Link href={`/blog/${relatedPost.slug}`}>
                        <div className="mb-2 aspect-[16/9] overflow-hidden rounded relative">
                          <Image 
                            src={relatedPost.coverImage}
                            alt={relatedPost.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-all duration-300"
                            sizes="(max-width: 768px) 100vw, 300px"
                          />
                        </div>
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
                <Card key={relatedPost.id} className="overflow-hidden hover:shadow-md transition-all duration-300 group dark:bg-gray-800">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image 
                      src={relatedPost.coverImage}
                      alt={relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
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
                    <Link href={`/blog/${relatedPost.slug}`}>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                        {relatedPost.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-2 leading-relaxed">
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
      
      {/* Add global styles for enhanced typography */}
      <style jsx global>{`
        /* Typography Enhancements */
        .typography-enhanced h2 {
          margin-top: 2.5rem;
          margin-bottom: 1.5rem;
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
          line-height: 1.3;
        }
        
        .dark .typography-enhanced h2 {
          color: #f3f4f6;
        }
        
        .typography-enhanced h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-weight: 600;
          color: #1f2937;
          line-height: 1.3;
        }
        
        .dark .typography-enhanced h3 {
          color: #f3f4f6;
        }
        
        .typography-enhanced p {
          margin-bottom: 1.5rem;
          line-height: 1.7;
          color: #374151;
        }
        
        .dark .typography-enhanced p {
          color: #d1d5db;
        }
        
        .typography-enhanced em {
          font-style: italic;
          color: #111827;
        }
        
        .dark .typography-enhanced em {
          color: #f9fafb;
        }
        
        .typography-enhanced strong {
          font-weight: 600;
          color: #111827;
        }
        
        .dark .typography-enhanced strong {
          color: #f9fafb;
        }
        
        .typography-enhanced ul, .typography-enhanced ol {
          margin: 1.5rem 0;
          padding-left: 1.5rem;
        }
        
        .typography-enhanced ul {
          list-style-type: disc;
        }
        
        .typography-enhanced ol {
          list-style-type: decimal;
        }
        
        .typography-enhanced li {
          margin: 0.5rem 0;
          padding-left: 0.5rem;
          line-height: 1.7;
        }
        
        .typography-enhanced a {
          color: #2563eb;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s;
        }
        
        .typography-enhanced a:hover {
          text-decoration: underline;
        }
        
        .dark .typography-enhanced a {
          color: #60a5fa;
        }
        
        /* Add spacing between major sections */
        .typography-enhanced h2 + p {
          margin-top: -0.5rem;
        }
      `}</style>
    </>
  );
}