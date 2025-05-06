// src/app/loading.tsx
export default function Loading() {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 text-center">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
          
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Loading BirJob...
          </h1>
          
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-5/6 mx-auto"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/6 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }