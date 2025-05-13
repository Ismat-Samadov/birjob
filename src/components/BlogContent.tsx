"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Tag, ChevronRight } from "lucide-react";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import Link from "next/link";

// Sample blog post data - this would normally come from a database or API
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Job Hunting Strategies for 2025",
    excerpt: "Discover the most effective techniques to stand out in today's competitive job market and land your dream job.",
    author: "Career Expert",
    date: "May 10, 2025",
    readTime: "8 min read",
    category: "Job Search",
    slug: "top-job-hunting-strategies-2025",
    featured: true
  },
  {
    id: 2,
    title: "How to Craft a Resume That Gets Noticed by ATS",
    excerpt: "Learn how to optimize your resume for Applicant Tracking Systems while still making it appealing to human recruiters.",
    author: "HR Specialist",
    date: "May 5, 2025",
    readTime: "6 min read",
    category: "Resumes",
    slug: "ats-friendly-resume-tips",
    featured: true
  },
  {
    id: 3,
    title: "The Rise of Remote Work: New Opportunities in Tech",
    excerpt: "Explore how the remote work revolution is reshaping the tech industry and creating new job possibilities.",
    author: "Tech Analyst",
    date: "April 28, 2025",
    readTime: "7 min read",
    category: "Remote Work",
    slug: "remote-work-tech-opportunities",
    featured: false
  },
  {
    id: 4,
    title: "Mastering the Job Interview: From Preparation to Follow-up",
    excerpt: "A comprehensive guide to acing your job interviews, with expert tips for every stage of the process.",
    author: "Interview Coach",
    date: "April 22, 2025",
    readTime: "10 min read",
    category: "Interviews",
    slug: "mastering-job-interviews",
    featured: false
  },
  {
    id: 5,
    title: "Networking in the Digital Age: Building Professional Relationships Online",
    excerpt: "Effective strategies for expanding your professional network and creating meaningful connections in virtual environments.",
    author: "Networking Strategist",
    date: "April 15, 2025",
    readTime: "5 min read",
    category: "Networking",
    slug: "digital-networking-strategies",
    featured: false
  },
  {
    id: 6,
    title: "Salary Negotiation: How to Get the Compensation You Deserve",
    excerpt: "Practical advice for negotiating your salary and benefits package with confidence and professionalism.",
    author: "Compensation Expert",
    date: "April 8, 2025",
    readTime: "9 min read",
    category: "Career Growth",
    slug: "salary-negotiation-guide",
    featured: false
  }
];

// Category filter options
const categories = [
  "All",
  "Job Search",
  "Resumes",
  "Interviews",
  "Remote Work",
  "Networking",
  "Career Growth"
];

export default function BlogContent() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredPosts, setFilteredPosts] = useState(blogPosts);
  const { trackPageView, trackEvent } = useAnalytics();

  useEffect(() => {
    // Track page view
    trackPageView({
      url: '/blog',
      title: 'Blog - BirJob'
    });
  }, [trackPageView]);

  useEffect(() => {
    // Filter posts when category changes
    if (selectedCategory === "All") {
      setFilteredPosts(blogPosts);
    } else {
      setFilteredPosts(
        blogPosts.filter(post => post.category === selectedCategory)
      );
    }

    // Track category filter usage
    if (selectedCategory !== "All") {
      trackEvent({
        category: 'Blog',
        action: 'Filter Category',
        label: selectedCategory
      });
    }
  }, [selectedCategory, trackEvent]);

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            BirJob Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Expert advice, industry insights, and career tips to help you succeed in your job search
          </p>
        </div>

        {/* Featured posts section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-gray-700 pb-2">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {blogPosts
              .filter(post => post.featured)
              .map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 dark:bg-gray-800">
                  <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                    <div className="flex items-center justify-between text-white mb-1">
                      <span className="text-sm flex items-center">
                        <Tag className="h-4 w-4 mr-1" />
                        {post.category}
                      </span>
                      <span className="text-sm flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    <CardTitle className="text-xl md:text-2xl font-bold text-white">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                        <User className="h-4 w-4 mr-1" />
                        <span>{post.author}</span>
                        <span className="mx-2">•</span>
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{post.date}</span>
                      </div>
                      <Link href={`/blog/${post.slug}`} passHref>
                        <Button
                          variant="ghost"
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-0"
                          onClick={() => {
                            trackEvent({
                              category: 'Blog',
                              action: 'Article Click',
                              label: post.title
                            });
                          }}
                        >
                          Read More <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Category filters */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            All Articles
          </h2>
          <div className="flex flex-wrap gap-2 mb-6 overflow-x-auto pb-2">
            {categories.map(category => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className="flex-shrink-0"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* All blog posts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredPosts.map(post => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow duration-300 dark:bg-gray-800">
              <CardContent className="p-6">
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                  <span className="flex items-center">
                    <Tag className="h-3 w-3 mr-1" />
                    {post.category}
                  </span>
                  <span className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <User className="h-3 w-3 mr-1" />
                    <span>{post.author}</span>
                    <span className="mx-1">•</span>
                    <span>{post.date}</span>
                  </div>
                  <Link href={`/blog/${post.slug}`} passHref>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-0"
                      onClick={() => {
                        trackEvent({
                          category: 'Blog',
                          action: 'Article Click',
                          label: post.title
                        });
                      }}
                    >
                      Read <ChevronRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter signup */}
        <div className="mt-16">
          <Card className="border-2 border-blue-100 dark:border-blue-900 bg-blue-50 dark:bg-blue-900/30">
            <CardContent className="p-8">
              <div className="text-center max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  Subscribe to Our Newsletter
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Stay updated with the latest career advice, job search tips, and industry trends delivered straight to your inbox.
                </p>
                <form
                  className="flex flex-col sm:flex-row gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                    trackEvent({
                      category: 'Blog',
                      action: 'Newsletter Signup',
                      label: 'Blog Page'
                    });
                    // Newsletter form submission logic would go here
                    alert('Newsletter subscription feature coming soon!');
                  }}
                >
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-grow p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                  <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Subscribe
                  </Button>
                </form>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}