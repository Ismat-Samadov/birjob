// src/app/ai-assistant/page.tsx
import ClientWrapper from "@/components/ClientWrapper";
import dynamic from 'next/dynamic';
import { Info } from "lucide-react";

// Use dynamic import to prevent hydration issues
const AIJobAssistant = dynamic(() => import('@/components/AIJobAssistant'), { ssr: false });

export default function AIAssistantPage() {
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6 px-3 sm:px-4 sm:py-8 responsive-container">
        <div className="container-center max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-4 sm:mb-6">
            AI Job Search Assistant
          </h1>
          
          <div className="space-y-3 mb-6 text-center max-w-xl mx-auto">
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized help with your job search, interview prep, and resume tips.
            </p>
          </div>
          
          <div className="no-horizontal-scroll w-full">
            <AIJobAssistant />
          </div>
          
          <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400 no-horizontal-scroll">
            <div className="flex items-center mb-2">
              <Info className="w-4 h-4 mr-2 text-blue-500" />
              <h2 className="font-medium text-gray-900 dark:text-white">How to use the AI Assistant:</h2>
            </div>
            <ul className="space-y-2 list-disc pl-5">
              <li>Ask for resume improvement tips</li>
              <li>Get interview preparation advice</li>
              <li>Learn job search strategies</li>
              <li>Request sample response templates</li>
            </ul>
          </div>
        </div>
      </div>
    </ClientWrapper>
  );
}