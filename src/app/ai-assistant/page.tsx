// src/app/ai-assistant/page.tsx
import ClientWrapper from "@/components/ClientWrapper";
import AIJobAssistant from "@/components/AIJobAssistant";

export default function AIAssistantPage() {
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 sm:py-12">
        <div className="container mx-auto max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6 sm:mb-8">
            AI Job Search Assistant
          </h1>
          
          <div className="space-y-4 mb-6 text-center max-w-xl mx-auto">
            <p className="text-gray-600 dark:text-gray-400">
              Get personalized help with your job search, interview prep, and resume tips.
            </p>
          </div>
          
          <AIJobAssistant />
          
          <div className="mt-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
            <h2 className="font-medium text-gray-900 dark:text-white mb-2">How to use the AI Assistant:</h2>
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