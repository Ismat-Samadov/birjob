// src/app/notifications/page.tsx (Complete File)
import ClientWrapper from "@/components/ClientWrapper";
import NotificationsContent from "@/components/NotificationsContent";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Job Alerts & Notifications - Personalized Job Updates | BirJob',
  description: 'Set up personalized job alerts and notifications to receive daily updates about new job opportunities matching your preferences',
  openGraph: {
    title: 'Job Alerts & Notifications - Personalized Job Updates | BirJob',
    description: 'Set up personalized job alerts and notifications for job opportunities',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?q=80&w=3174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
        width: 1200,
        height: 630,
        alt: 'BirJob Job Alerts',
      },
    ],
    url: 'https://birjob.com/notifications',
  },
  alternates: {
    canonical: 'https://birjob.com/notifications',
  },
};

export default function Notifications() {
  return (
    <ClientWrapper>
      <NotificationsContent />
    </ClientWrapper>
  );
}