// src/app/privacy/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">Introduction</h2>
              <p className="text-gray-700">
                At BirJob, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our service.
              </p>
              <p className="text-gray-700 mt-2">
                By accessing or using BirJob, you agree to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-medium">Personal Information</h3>
                  <p className="text-gray-700">We collect personal information that you voluntarily provide to us when you:</p>
                  <ul className="list-disc pl-5 mt-2 text-gray-700">
                    <li>Register for our notification service (your email address)</li>
                    <li>Set up job search keywords and preferences</li>
                    <li>Select job sources you want to monitor</li>
                    <li>Interact with our application</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-xl font-medium">Usage Information</h3>
                  <p className="text-gray-700">We may also collect information about how you use our service, including:</p>
                  <ul className="list-disc pl-5 mt-2 text-gray-700">
                    <li>Search terms you enter</li>
                    <li>Pages you visit</li>
                    <li>Time spent on each page</li>
                    <li>Links you click</li>
                    <li>Other actions you take while using our service</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">How We Use Your Information</h2>
              <p className="text-gray-700">We use the information we collect to:</p>
              <ul className="list-disc pl-5 mt-2 text-gray-700">
                <li>Provide and maintain our service</li>
                <li>Send you job notifications based on your preferences</li>
                <li>Improve and personalize your experience</li>
                <li>Respond to your requests or inquiries</li>
                <li>Monitor usage of our service</li>
                <li>Detect, prevent, and address technical issues</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Your Data Rights</h2>
              <p className="text-gray-700">
                You have the right to access, update, or delete your personal information at any time. You can do this through your account settings or by contacting us directly.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Changes to This Policy</h2>
              <p className="text-gray-700">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p className="text-gray-700 mt-2">
                <strong>Email:</strong> support@birjob.com
              </p>
            </section>

            <div className="border-t border-gray-200 pt-4 mt-6">
              <p className="text-sm text-gray-500">Last updated: May 6, 2025</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}