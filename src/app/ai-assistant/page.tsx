// src/app/ai-assistant/page.tsx
import ClientWrapper from "@/components/ClientWrapper";
import AIJobAssistant from "@/components/AIJobAssistant";

export default function AIAssistantPage() {
  return (
    <ClientWrapper>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="container mx-auto px-4 max-w-2xl">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            AI Job Search Assistant
          </h1>
          <AIJobAssistant />
        </div>
      </div>
    </ClientWrapper>
  );
}