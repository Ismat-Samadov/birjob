"use client";

import React, { Suspense, ReactNode } from 'react';
import VisitorTracker from './VisitorTracker';

interface ClientWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

// Simple loading component
const DefaultLoading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default function ClientWrapper({
  children,
  fallback = <DefaultLoading />,
}: ClientWrapperProps) {
  return (
    <Suspense fallback={fallback}>
      <ErrorBoundary>
        {/* Add the VisitorTracker component to log user data */}
        <VisitorTracker />
        {children}
      </ErrorBoundary>
    </Suspense>
  );
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
}

// Simple error boundary to catch and handle client-side errors
class ErrorBoundary extends React.Component<{children: ReactNode}, ErrorBoundaryState> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render shows the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service
    console.error("Client component error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              We encountered an error rendering this page. Please try refreshing the browser.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}