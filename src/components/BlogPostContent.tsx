"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Tag, ArrowLeft, Share2, Bookmark } from "lucide-react";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import Link from "next/link";
import { useToast } from "@/context/ToastContext";

// Sample blog post data - in a real application, this would come from an API or CMS
const blogPosts = [
  {
    id: 1,
    title: "Top 10 Job Hunting Strategies for 2025",
    excerpt: "Discover the most effective techniques to stand out in today's competitive job market and land your dream job.",
    content: `
      <h2>Introduction</h2>
      <p>The job market in 2025 is more dynamic and competitive than ever before. With the rise of AI-driven hiring processes, remote work opportunities, and changing employer expectations, job seekers need to adapt their strategies to stand out from the crowd.</p>
      
      <p>In this comprehensive guide, we'll explore the most effective job hunting techniques that are working in 2025, based on current industry trends and feedback from hiring managers across various sectors.</p>
      
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
      
      <p>Research the company thoroughly and reference specific aspects of their business or culture that appeal to you, showing that you've done your homework.</p>
      
      <h2>6. Prepare for Modern Interview Formats</h2>
      <p>Interviews in 2025 often include a mix of traditional, behavioral, technical, and AI-driven assessments. Practice for various formats, including video interviews, asynchronous interviews (where you record responses to questions), and virtual reality assessments.</p>
      
      <p>Develop compelling stories that demonstrate your skills and impact, following the STAR method (Situation, Task, Action, Result).</p>
      
      <h2>7. Showcase Your Remote Work Capabilities</h2>
      <p>With hybrid and remote work models now the norm in many industries, employers look for candidates who can demonstrate effectiveness outside traditional office environments. Highlight your experience with digital collaboration tools, self-management, and communication skills essential for remote work.</p>
      
      <h2>8. Tap Into the Hidden Job Market</h2>
      <p>Many positions are filled without ever being publicly advertised. Gain access to this hidden job market by developing relationships with recruiters, joining industry-specific communities, and directly approaching companies you'd like to work for, even if they haven't posted relevant openings.</p>
      
      <h2>9. Focus on Value and Results</h2>
      <p>Employers hire people who can solve problems and add value. Instead of merely listing your responsibilities, emphasize the concrete results you've achieved in previous roles. Quantify your impact whenever possible with specific metrics and outcomes.</p>
      
      <h2>10. Maintain Resilience and Persistence</h2>
      <p>Job hunting can be challenging and sometimes disheartening. Develop a resilient mindset by setting realistic expectations, celebrating small wins, and learning from rejections. Maintain a consistent schedule for your job search activities, and don't hesitate to adjust your approach based on the feedback you receive.</p>
      
      <h2>Conclusion</h2>
      <p>The most successful job seekers in 2025 combine technological savvy with traditional relationship-building skills. By implementing these ten strategies, you'll position yourself effectively in a competitive market and increase your chances of landing not just any job, but the right job for your career goals and personal aspirations.</p>
      
      <p>Remember that job hunting is a skill in itself—one that improves with practice and persistence. Stay adaptable, keep learning, and approach the process with confidence in the value you bring to potential employers.</p>
    `,
    author: "Career Expert",
    date: "May 10, 2025",
    readTime: "8 min read",
    category: "Job Search",
    slug: "top-job-hunting-strategies-2025",
    tags: ["Job Search", "Career Advice", "Networking", "Interviews"],
    relatedPosts: [2, 4, 6]
  },
  {
    id: 2,
    title: "How to Craft a Resume That Gets Noticed by ATS",
    excerpt: "Learn how to optimize your resume for Applicant Tracking Systems while still making it appealing to human recruiters.",
    content: `
      <h2>Introduction</h2>
      <p>In today's digital job market, your resume must impress both automated systems and human recruiters. Before your resume reaches a hiring manager's desk, it often needs to pass through an Applicant Tracking System (ATS). These sophisticated software programs scan, sort, and rank resumes based on specific criteria.</p>
      
      <p>This comprehensive guide will help you create a resume that successfully navigates ATS filters while still engaging human readers who make the final hiring decisions.</p>
      
      <h2>Understanding ATS: The Digital Gatekeeper</h2>
      <p>Applicant Tracking Systems help employers manage high volumes of applications efficiently. These systems analyze resumes for:</p>
      <ul>
        <li>Relevant keywords and phrases</li>
        <li>Years of experience</li>
        <li>Specific qualifications and skills</li>
        <li>Educational background</li>
        <li>Previous employers</li>
      </ul>
      
      <p>Resumes that closely match the job description receive higher rankings and are more likely to reach human reviewers.</p>
      
      <h2>Key Elements of an ATS-Friendly Resume</h2>
      
      <h3>1. Use a Clean, Standard Format</h3>
      <p>Complex designs may look impressive but can confuse ATS programs. Stick to these formatting guidelines:</p>
      <ul>
        <li>Choose standard resume sections (Summary, Experience, Skills, Education)</li>
        <li>Use conventional section headings that ATS will recognize</li>
        <li>Avoid tables, columns, headers/footers, and text boxes</li>
        <li>Stick to common fonts like Arial, Calibri, or Times New Roman</li>
        <li>Save your resume as a .docx or .pdf file (check which format the employer prefers)</li>
      </ul>
      
      <h3>2. Optimize with Strategic Keywords</h3>
      <p>Keywords are crucial for ATS success. Here's how to use them effectively:</p>
      <ul>
        <li>Carefully analyze the job description for important terms and phrases</li>
        <li>Include exact matches of technical skills, certifications, and software mentioned</li>
        <li>Incorporate industry-specific terminology</li>
        <li>Use both spelled-out terms and acronyms (e.g., "Search Engine Optimization (SEO)")</li>
        <li>Place keywords naturally throughout your resume, especially in your skills section and work experience</li>
      </ul>
      
      <h3>3. Craft a Powerful Professional Summary</h3>
      <p>The summary section at the top of your resume serves as a keyword-rich introduction. It should:</p>
      <ul>
        <li>Include your professional title and years of experience</li>
        <li>Highlight 3-4 of your most relevant skills and achievements</li>
        <li>Incorporate important keywords from the job description</li>
        <li>Be concise (3-5 lines maximum)</li>
      </ul>
      
      <h3>4. Detail Your Work Experience</h3>
      <p>When describing previous roles:</p>
      <ul>
        <li>List company names, titles, and dates in a consistent format</li>
        <li>Focus on achievements rather than just responsibilities</li>
        <li>Quantify results whenever possible (percentages, numbers, metrics)</li>
        <li>Incorporate relevant keywords naturally in your bullet points</li>
        <li>Use standard chronological order for your work history</li>
      </ul>
      
      <h3>5. Create a Comprehensive Skills Section</h3>
      <p>A dedicated skills section helps ATS identify your qualifications quickly:</p>
      <ul>
        <li>Include a mix of hard skills (technical abilities) and soft skills (interpersonal qualities)</li>
        <li>List skills using industry-standard terminology</li>
        <li>Organize skills by category for better readability</li>
        <li>Include proficiency levels if relevant</li>
      </ul>
      
      <h2>Balancing ATS Optimization with Human Appeal</h2>
      <p>While ATS optimization is essential, remember that humans make the final hiring decisions. To appeal to both:</p>
      
      <h3>1. Tell a Compelling Career Story</h3>
      <p>Create a consistent narrative that shows your career progression and highlights your unique value proposition. This story should be evident across your professional summary, work experience, and skills sections.</p>
      
      <h3>2. Make It Skimmable</h3>
      <p>Human recruiters often spend less than 10 seconds initially reviewing a resume. Use clean formatting, concise bullet points, and strategic white space to make your resume easy to skim.</p>
      
      <h3>3. Demonstrate Impact</h3>
      <p>Go beyond listing responsibilities by focusing on how you made a difference in previous roles. Use the formula: Action Verb + Task + Result to create powerful achievement statements.</p>
      
      <h3>4. Customize for Each Application</h3>
      <p>Tailor your resume for each position you apply for. Analyze the specific job description and company culture to highlight the most relevant skills and experiences.</p>
      
      <h2>Common ATS Mistakes to Avoid</h2>
      <ul>
        <li>Using creative file names (stick to YourName_Resume.pdf)</li>
        <li>Including information in headers or footers (ATS often can't read these areas)</li>
        <li>Using creative section headings (stick to standard terms like "Experience" rather than "Where I've Made an Impact")</li>
        <li>Submitting a resume with spelling or grammatical errors</li>
        <li>Keyword stuffing (unnaturally forcing keywords into your resume)</li>
        <li>Using graphics, logos, or photos</li>
      </ul>
      
      <h2>Test Your Resume Before Submitting</h2>
      <p>Before sending your resume to employers, consider these testing methods:</p>
      <ul>
        <li>Use an ATS resume checker tool to assess its compatibility</li>
        <li>Perform the "copy and paste test" by copying text from your PDF resume into a plain text document to check for formatting issues</li>
        <li>Ask a colleague to review your resume for readability and impact</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Creating an ATS-friendly resume doesn't mean sacrificing quality or personality. By understanding how these systems work and implementing these strategies, you can craft a resume that successfully passes through digital filters while still impressing human recruiters.</p>
      
      <p>Remember, the goal is not just to get past the ATS but to present yourself as the best candidate for the job. With a well-optimized, compelling resume, you'll significantly increase your chances of landing interviews for positions that align with your career goals.</p>
    `,
    author: "HR Specialist",
    date: "May 5, 2025",
    readTime: "6 min read",
    category: "Resumes",
    slug: "ats-friendly-resume-tips",
    tags: ["Resume", "Job Search", "ATS", "Career Advice"],
    relatedPosts: [1, 3, 4]
  },
  {
    id: 3,
    title: "The Rise of Remote Work: New Opportunities in Tech",
    excerpt: "Explore how the remote work revolution is reshaping the tech industry and creating new job possibilities.",
    content: "Detailed blog post content would be here...",
    author: "Tech Analyst",
    date: "April 28, 2025",
    readTime: "7 min read",
    category: "Remote Work",
    slug: "remote-work-tech-opportunities",
    tags: ["Remote Work", "Tech Jobs", "Future of Work"],
    relatedPosts: [2, 5, 6]
  },
  {
    id: 4,
    title: "Mastering the Job Interview: From Preparation to Follow-up",
    excerpt: "A comprehensive guide to acing your job interviews, with expert tips for every stage of the process.",
    content: "Detailed blog post content would be here...",
    author: "Interview Coach",
    date: "April 22, 2025",
    readTime: "10 min read",
    category: "Interviews",
    slug: "mastering-job-interviews",
    tags: ["Interviews", "Job Search", "Career Advice"],
    relatedPosts: [1, 2, 6]
  },
  {
    id: 5,
    title: "Networking in the Digital Age: Building Professional Relationships Online",
    excerpt: "Effective strategies for expanding your professional network and creating meaningful connections in virtual environments.",
    content: "Detailed blog post content would be here...",
    author: "Networking Strategist",
    date: "April 15, 2025",
    readTime: "5 min read",
    category: "Networking",
    slug: "digital-networking-strategies",
    tags: ["Networking", "Professional Development", "Career Growth"],
    relatedPosts: [1, 3, 6]
  },
  {
    id: 6,
    title: "Salary Negotiation: How to Get the Compensation You Deserve",
    excerpt: "Practical advice for negotiating your salary and benefits package with confidence and professionalism.",
    content: "Detailed blog post content would be here...",
    author: "Compensation Expert",
    date: "April 8, 2025",
    readTime: "9 min read",
    category: "Career Growth",
    slug: "salary-negotiation-guide",
    tags: ["Salary Negotiation", "Career Advice", "Career Growth"],
    relatedPosts: [1, 4, 5]
  }
];

interface BlogPostContentProps {
  slug: string;
}

export default function BlogPostContent({ slug }: BlogPostContentProps) {
  const [post, setPost] = useState<any>(null);
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { trackPageView, trackEvent } = useAnalytics();
  const { addToast } = useToast();
  const [isSaved, setIsSaved] = useState(false);

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
          const related = blogPosts.filter(p => foundPost.relatedPosts.includes(p.id));
          setRelatedPosts(related);
        }
        
        // Track page view
        trackPageView({
          url: `/blog/${slug}`,
          title: `${foundPost.title} - BirJob Blog`
        });
      }
      
      setIsLoading(false);
    };
    
    fetchPost();
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

  const handleSaveClick = () => {
    setIsSaved(!isSaved);
    
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
              Sorry, the blog post you're looking for doesn't exist or has been moved.
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 md:py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Back to blog link */}
        <div className="mb-6">
          <Link href="/blog" passHref>
            <Button variant="ghost" className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
        
        <Card className="overflow-hidden mb-8 dark:bg-gray-800">
          <CardContent className="p-6 md:p-8">
            {/* Post header */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-medium">
                  {post.category}
                </span>
                <span>•</span>
                <span className="flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {post.readTime}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <User className="h-4 w-4 mr-2" />
                  <span>{post.author}</span>
                  <span className="mx-2">•</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{post.date}</span>
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSaveClick}
                    className={isSaved ? 
                      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800" : 
                      "dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"}
                  >
                    <Bookmark className={`h-4 w-4 mr-1 ${isSaved ? "fill-blue-700 dark:fill-blue-400" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleShareClick}
                    className="dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Post content */}
            <div 
              className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-li:text-gray-700 dark:prose-li:text-gray-300 mt-8"
              dangerouslySetInnerHTML={{ __html: post.content }}
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
          </CardContent>
        </Card>
        
        {/* Related posts */}
        {relatedPosts.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
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
        )}
      </div>
    </div>
  );
}