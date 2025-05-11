// src/components/NotificationPreferences.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface NotificationPreferencesProps {
  email: string;
}

export default function NotificationPreferences({ email }: NotificationPreferencesProps) {
  return (
    <Card className="w-full shadow-lg dark:bg-gray-800">
      <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
        <CardTitle className="text-xl font-bold">Daily Notification Schedule</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4 dark:text-gray-200">Your Daily Job Digest</h3>
            <p className="text-gray-700 dark:text-gray-300">
              You will receive one email each day at 09:00 AM UTC with all new job matches found in the last 24 hours.
            </p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Each daily email includes:
            </p>
            <ul className="list-disc pl-5 mt-2 text-gray-600 dark:text-gray-400">
              <li>All jobs matching your keywords from the previous 24 hours</li>
              <li>Direct links to apply for each position</li>
              <li>The specific keyword that matched each job</li>
              <li>Company information and job titles</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-md">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Note:</strong> We check for new jobs every 5 hours. To ensure you receive relevant notifications, keep your keywords list updated with the terms you&apos;re most interested in.
            </p>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            <p>Notification email: {email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}