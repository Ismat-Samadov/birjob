// src/app/terms/page.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing or using the BirJob service, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
              <p className="text-gray-700">
                BirJob is a job aggregation service that collects job listings from various sources and provides notification services to users based on their preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Use of Service</h2>
              <div className="space-y-4">
                <p className="text-gray-700">
                  You agree to use BirJob only for lawful purposes and in a way that does not infringe upon the rights of others or inhibit their use of the service.
                </p>
                <p className="text-gray-700">
                  Prohibited uses include, but are not limited to:
                </p>
                <ul className="list-disc pl-5 mt-2 text-gray-700">
                  <li>Using the service to transmit any material that is unlawful, harmful, threatening, or otherwise objectionable</li>
                  <li>Attempting to gain unauthorized access to any part of the service</li>
                  <li>Using automated methods to access the service without our express permission</li>
                  <li>Collecting user information without their consent</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. User Account</h2>
              <p className="text-gray-700">
                To use certain features of the service, you may need to provide a valid email address. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Intellectual Property</h2>
              <p className="text-gray-700">
                The content, organization, graphics, design, compilation, and other matters related to BirJob are protected under applicable copyrights, trademarks, and other proprietary rights. Copying, redistributing, or publication of any part of the service without prior written consent from BirJob is prohibited.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Third-Party Websites and Content</h2>
              <p className="text-gray-700">
                BirJob may contain links to third-party websites that are not owned or controlled by us. We assume no responsibility for the content, privacy policies, or practices of any third-party websites. You acknowledge and agree that we shall not be responsible or liable for any damage or loss caused by the use of such third-party websites.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Limitation of Liability</h2>
              <p className="text-gray-700">
                In no event shall BirJob, its officers, directors, employees, or agents, be liable for any indirect, incidental, special, consequential or punitive damages, arising out of or in connection with your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Modifications to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these Terms of Service at any time. We will notify users of any significant changes by posting the new Terms of Service on this page. Your continued use of the service after any changes constitutes your acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Governing Law</h2>
              <p className="text-gray-700">
                These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which BirJob is based, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Contact</h2>
              <p className="text-gray-700">
                If you have any questions about these Terms, please contact us at support@birjob.com.
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