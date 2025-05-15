"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ChevronRight, Bookmark, TrendingUp } from "lucide-react";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

// Enhanced blog post data with Unsplash image URLs
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Job Hunting Strategies for 2025",
    excerpt: "Discover the most effective techniques to stand out in today's competitive job market and land your dream job.",
    author: "Career Expert",
    authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    authorRole: "Senior Career Advisor",
    date: "May 10, 2025",
    readTime: "8 min read",
    category: "Job Search",
    slug: "top-job-hunting-strategies-2025",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1528819622765-d6bcf132f793?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    trendingScore: 92,
    viewCount: 1245,
    tags: ["Job Search", "Career Advice", "Networking", "Interviews"]
  },
  {
    id: 2,
    title: "How to Craft a Resume That Gets Noticed by ATS",
    excerpt: "Learn how to optimize your resume for Applicant Tracking Systems while still making it appealing to human recruiters.",
    author: "HR Specialist",
    authorImage: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    authorRole: "Recruitment Lead at TechCorp",
    date: "May 5, 2025",
    readTime: "6 min read",
    category: "Resumes",
    slug: "ats-friendly-resume-tips",
    featured: true,
    coverImage: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    trendingScore: 87,
    viewCount: 982,
    likeCount: 176,
    commentCount: 24,
    tags: ["Resumes", "Job Search", "ATS", "Career Advice"],
    relatedPosts: [1, 3, 4]
  },
  {
    id: 3,
    title: "The Rise of Remote Work: New Opportunities in Tech",
    excerpt: "Explore how the remote work revolution is reshaping the tech industry and creating new job possibilities.",
    author: "Tech Analyst",
    authorImage: "https://images.unsplash.com/photo-1580518324671-c2f0833a3af3?w=400&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    authorRole: "Technology Trends Researcher",
    date: "April 28, 2025",
    readTime: "7 min read",
    category: "Remote Work",
    slug: "remote-work-tech-opportunities",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    trendingScore: 75,
    viewCount: 756,
    tags: ["Remote Work", "Tech Jobs", "Future of Work"]
  },
  {
    id: 4,
    title: "Mastering the Job Interview: From Preparation to Follow-up",
    excerpt: "A comprehensive guide to acing your job interviews, with expert tips for every stage of the process.",
    author: "Interview Coach",
    authorImage: "https://images.unsplash.com/photo-1565423529726-0c920b6b6f1c?w=400&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    authorRole: "Executive Interview Trainer",
    date: "April 22, 2025",
    readTime: "10 min read",
    category: "Interviews",
    slug: "mastering-job-interviews",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1529519654731-a0525bc4f835?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    trendingScore: 68,
    viewCount: 689,
    tags: ["Interviews", "Job Search", "Career Advice"]
  },
  {
    id: 5,
    title: "Networking in the Digital Age: Building Professional Relationships Online",
    excerpt: "Effective strategies for expanding your professional network and creating meaningful connections in virtual environments.",
    author: "Networking Strategist",
    authorImage: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?w=400&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    authorRole: "Professional Networking Consultant",
    date: "April 15, 2025",
    readTime: "5 min read",
    category: "Networking",
    slug: "digital-networking-strategies",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1605999006862-83d68439d6f3?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    trendingScore: 63,
    viewCount: 542,
    tags: ["Networking", "Professional Development", "Career Growth"]
  },
  {
    id: 6,
    title: "Salary Negotiation: How to Get the Compensation You Deserve",
    excerpt: "Practical advice for negotiating your salary and benefits package with confidence and professionalism.",
    author: "Compensation Expert",
    authorImage: "https://images.unsplash.com/photo-1589386417686-0d34b5903d23?w=400&auto=format&fit=crop&q=80&ixlib=rb-4.0.3",
    authorRole: "Salary Negotiation Specialist",
    date: "April 8, 2025",
    readTime: "9 min read",
    category: "Career Growth",
    slug: "salary-negotiation-guide",
    featured: false,
    coverImage: "https://images.unsplash.com/photo-1534951009808-766178b47a4f?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    trendingScore: 58,
    viewCount: 478,
    tags: ["Salary Negotiation", "Career Advice", "Career Growth"]
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
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [emailSubscription, setEmailSubscription] = useState("");
  const { trackPageView, trackEvent } = useAnalytics();
  const { addToast } = useToast();

  useEffect(() => {
    // Track page view
    trackPageView({
      url: '/blog',
      title: 'Blog - BirJob'
    });
    
    // Simulate loading saved posts from local storage
    const savedPostIds = localStorage.getItem('savedPosts');
    if (savedPostIds) {
      setSavedPosts(JSON.parse(savedPostIds));
    }
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
  
  const handleSavePost = (postId: number) => {
    const updatedSavedPosts = savedPosts.includes(postId)
      ? savedPosts.filter(id => id !== postId)
      : [...savedPosts, postId];
    
    setSavedPosts(updatedSavedPosts);
    localStorage.setItem('savedPosts', JSON.stringify(updatedSavedPosts));
    
    addToast({
      title: savedPosts.includes(postId) ? "Post Removed" : "Post Saved",
      description: savedPosts.includes(postId) 
        ? "The article has been removed from your saved list" 
        : "The article has been added to your saved list",
      type: "success",
      duration: 3000
    });
    
    trackEvent({
      category: 'Blog',
      action: savedPosts.includes(postId) ? 'Unsave Post' : 'Save Post',
      label: blogPosts.find(post => post.id === postId)?.title || `Post ID: ${postId}`
    });
  };
  
  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!emailSubscription || !/^\S+@\S+\.\S+$/.test(emailSubscription)) {
      addToast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        type: "destructive",
        duration: 3000
      });
      return;
    }
    
    // Simulate subscription process
    addToast({
      title: "Subscription Successful!",
      description: "Thank you for subscribing to our newsletter.",
      type: "success",
      duration: 5000
    });
    
    trackEvent({
      category: 'Blog',
      action: 'Newsletter Signup',
      label: 'Blog Page'
    });
    
    setEmailSubscription("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="relative rounded-2xl overflow-hidden mb-16">
          <img 
            src="https://images.unsplash.com/photo-1522071901873-411886a10004?w=1200&auto=format&fit=crop&q=80&ixlib=rb-4.0.3" 
            alt="Blog hero image" 
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute inset-0 bg-black/40 z-10"></div>
          <div className="relative z-20 py-16 px-6 sm:px-12 text-white">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                BirJob Career Insights
              </h1>
              <p className="text-xl text-white/90 mb-8">
                Expert advice, industry insights, and career tips to help you succeed in your job search
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => handleCategoryChange("Job Search")}
                  size="lg"
                  className="bg-white text-blue-700 hover:bg-blue-50"
                >
                  Explore Job Search Tips
                </Button>
                <Button
                  onClick={() => handleCategoryChange("Interviews")}
                  size="lg"
                  variant="outline"
                  className="text-white border-white hover:bg-white/20"
                >
                  Interview Guides
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Featured posts section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
            Featured Articles
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {blogPosts
              .filter(post => post.featured)
              .map(post => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group dark:bg-gray-800 border-0 shadow-md">
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                    />
                    <div className="absolute top-4 right-4 z-10">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
                        onClick={() => handleSavePost(post.id)}
                      >
                        <Bookmark className={`h-4 w-4 ${savedPosts.includes(post.id) ? "fill-white" : ""}`} />
                      </Button>
                    </div>
                    {post.trendingScore > 80 && (
                      <div className="absolute top-4 left-4 z-10 flex items-center gap-1 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        <TrendingUp className="h-3 w-3" />
                        Trending
                      </div>
                    )}
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                        {post.category}
                      </span>
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {post.readTime}
                      </span>
                    </div>
                    
                    <Link href={`/blog/${post.slug}`}>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title}
                      </h3>
                    </Link>
                    
                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex items-center">
                        <img 
                          src={post.authorImage}
                          alt={post.author}
                          className="h-10 w-10 rounded-full object-cover mr-3"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-sm">{post.author}</p>
                          <p className="text-gray-500 dark:text-gray-400 text-xs">{post.date}</p>
                        </div>
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
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              All Articles
            </h2>
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
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
        </div>

        {/* Main blog posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredPosts.map(post => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-all duration-300 group dark:bg-gray-800 h-full flex flex-col border border-gray-200 dark:border-gray-700">
              <div className="relative aspect-video overflow-hidden">
                <img 
                  src={post.coverImage} 
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent h-1/2"></div>
                <div className="absolute top-3 right-3 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full bg-black/30 text-white hover:bg-black/50 backdrop-blur-sm"
                    onClick={() => handleSavePost(post.id)}
                  >
                    <Bookmark className={`h-4 w-4 ${savedPosts.includes(post.id) ? "fill-white" : ""}`} />
                  </Button>
                </div>
                <div className="absolute bottom-3 left-3 flex items-center space-x-2 text-white text-xs z-10">
                  <span className="flex items-center bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
                    <Clock className="h-3 w-3 mr-1" />
                    {post.readTime}
                  </span>
                  <span className="flex items-center bg-blue-500/70 backdrop-blur-sm px-2 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              <CardContent className="p-5 flex-grow flex flex-col">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3 flex-grow">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center">
                    <img 
                      src={post.authorImage}
                      alt={post.author}
                      className="h-8 w-8 rounded-full object-cover mr-2"
                    />
                    <div className="text-xs">
                      <p className="font-medium text-gray-900 dark:text-white">{post.author}</p>
                      <p className="text-gray-500 dark:text-gray-400">{post.date}</p>
                    </div>
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

        {/* Trending topics section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Trending Topics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                title: "Resume Building",
                image: "https://images.unsplash.com/photo-1586281380117-5a60ae2050cc?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              },
              {
                title: "Remote Jobs",
                image: "https://images.unsplash.com/photo-1593642634367-d91a135587b5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              },
              {
                title: "Interview Techniques",
                image: "https://images.unsplash.com/photo-1529519654731-a0525bc4f835?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              },
              {
                title: "Networking Strategies",
                image: "https://images.unsplash.com/photo-1605999006862-83d68439d6f3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
              }
            ].map((topic, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-md transition-all duration-300 group dark:bg-gray-800 cursor-pointer"
                onClick={() => handleCategoryChange(topic.title === "Remote Jobs" ? "Remote Work" : (topic.title === "Resume Building" ? "Resumes" : (topic.title === "Interview Techniques" ? "Interviews" : "Networking")))}
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img 
                    src={topic.image} 
                    alt={topic.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-in-out"
                  />
                  <div className="absolute inset-0 bg-black/40"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-center">
                    <h3 className="text-xl font-bold text-white px-4 z-10">{topic.title}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Newsletter signup with improved design */}
        <div className="mb-16">
          <Card className="border-2 border-blue-100 dark:border-blue-900 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-3/5 p-8">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    Get Career Insights Delivered
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    Stay updated with the latest career advice, job search tips, and industry trends delivered straight to your inbox.
                  </p>
                  <form
                    className="flex flex-col sm:flex-row gap-3"
                    onSubmit={handleSubscribe}
                  >
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="flex-grow p-3 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      value={emailSubscription}
                      onChange={(e) => setEmailSubscription(e.target.value)}
                      required
                    />
                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
                      Subscribe
                    </Button>
                  </form>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                    By subscribing, you agree to our privacy policy and consent to receive updates from our company.
                  </p>
                </div>
                <div className="md:w-2/5 hidden md:block relative">
                  <img 
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3" 
                    alt="Newsletter signup"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-blue-600/50"></div>
                  <div className="absolute inset-0 flex items-center justify-center p-6">
                    <div className="text-white text-center">
                      <h4 className="text-xl font-bold mb-2">Weekly Digest</h4>
                      <p className="text-white/80">Curated career advice from industry experts</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}