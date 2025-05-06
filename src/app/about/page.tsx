// src/app/about/page.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/context/ToastContext";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { 
  Globe, 
  Bell, 
  Search, 
  Filter, 
  Mail, 
  Zap, 
  Shield, 
  Clock 
} from "lucide-react";

export default function AboutPage() {
  const { addToast } = useToast();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    // Track page view
    trackPageView({
      url: '/about',
      title: 'About - BirJob'
    });

    // Show welcome toast
    addToast({
      title: "Welcome to BirJob",
      description: "Learn about our mission to simplify your job search",
      type: "info",
      duration: 5000
    });
  }, [addToast, trackPageView]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            About BirJob
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your ultimate job aggregator, bringing together opportunities from over 50 sources in one sleek interface.
          </p>
        </div>

        <Card className="mb-12 shadow-lg dark:bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Our Mission</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              At BirJob, we believe job hunting should be simpler and more efficient. We&apos;ve built a platform that aggregates job listings from dozens of sources, eliminates duplicates, and lets you set up personalized alerts so you never miss an opportunity.
            </p>
            <p className="text-gray-700 dark:text-gray-300">
              Our continuous scraping system ensures you&apos;re always seeing the freshest content, while our intelligent deduplication algorithms make sure you don&apos;t waste time reviewing the same position multiple times.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <FeatureCard
            icon={<Globe className="h-8 w-8 text-blue-500" />}
            title="Multi-source Aggregation"
            description="Data from 50+ job boards and company websites in one place"
          />
          <FeatureCard
            icon={<Bell className="h-8 w-8 text-purple-500" />}
            title="Smart Notifications"
            description="Daily alerts customized to your keywords and preferences"
          />
          <FeatureCard
            icon={<Zap className="h-8 w-8 text-yellow-500" />}
            title="Real-time Updates"
            description="Continuous scraping ensures fresh content"
          />
          <FeatureCard
            icon={<Filter className="h-8 w-8 text-green-500" />}
            title="Smart Deduplication"
            description="Intelligent algorithms to avoid duplicate listings"
          />
        </div>

        <Card className="mb-12 shadow-lg dark:bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Our Technology</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Frontend</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-1 rounded mr-2">▪</span>
                    Next.js 14 for server-side rendering
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-1 rounded mr-2">▪</span>
                    TypeScript for type safety
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-1 rounded mr-2">▪</span>
                    Tailwind CSS with shadcn/ui components
                  </li>
                  <li className="flex items-center">
                    <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 p-1 rounded mr-2">▪</span>
                    React Context for state management
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Backend</h3>
                <ul className="space-y-2 text-gray-700 dark:text-gray-300">
                  <li className="flex items-center">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-1 rounded mr-2">▪</span>
                    Next.js API Routes for serverless functions
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-1 rounded mr-2">▪</span>
                    PostgreSQL with Prisma ORM
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-1 rounded mr-2">▪</span>
                    Custom Node.js scraping engine
                  </li>
                  <li className="flex items-center">
                    <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-1 rounded mr-2">▪</span>
                    GitHub Actions for scheduled tasks
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <TechCard
            title="Performance"
            icon={<Zap className="h-6 w-6 text-yellow-500" />}
            features={[
              "Server-side rendering",
              "Static generation",
              "Edge caching",
              "Optimized images"
            ]}
          />
          <TechCard
            title="Security"
            icon={<Shield className="h-6 w-6 text-red-500" />}
            features={[
              "HTTPS encryption",
              "API rate limiting",
              "Input validation",
              "Regular security audits"
            ]}
          />
          <TechCard
            title="Reliability"
            icon={<Clock className="h-6 w-6 text-blue-500" />}
            features={[
              "Continuous integration",
              "Automated testing",
              "Error logging",
              "Regular backups"
            ]}
          />
        </div>

        <div className="flex justify-center mb-12">
          <Link href="/" passHref>
            <Button 
              className="mr-4 bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                addToast({
                  title: "Great choice!",
                  description: "Let's find your next opportunity",
                  type: "success",
                  duration: 3000
                });
              }}
            >
              <Search className="mr-2 h-4 w-4" />
              Start Searching
            </Button>
          </Link>
          <Link href="/notifications" passHref>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => {
                addToast({
                  title: "Stay in the loop!",
                  description: "Set up job alerts tailored to your needs",
                  type: "info",
                  duration: 3000
                });
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Set Up Alerts
            </Button>
          </Link>
        </div>

        <Card className="mb-12 shadow-lg dark:bg-gray-800">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Have questions or feedback about BirJob? We&apos;d love to hear from you!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <Mail className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">support@birjob.com</span>
              </div>
              <div className="flex items-center">
                <Globe className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-gray-700 dark:text-gray-300">www.birjob.com</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Component for feature cards
function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col items-center text-center">
        <div className="mb-4">{icon}</div>
        <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </div>
  );
}

// Component for technology cards
function TechCard({ title, icon, features }: { title: string, icon: React.ReactNode, features: string[] }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-lg font-semibold ml-2 text-gray-900 dark:text-white">{title}</h3>
      </div>
      <ul className="space-y-2">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-600 dark:text-gray-400 flex items-start">
            <span className="text-green-500 mr-2">✓</span>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}