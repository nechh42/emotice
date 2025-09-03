import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const Terms = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Agreement to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 prose prose-sm max-w-none">
            <p>
              By accessing and using Emotice ("the Service"), you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>

            <div>
              <h3 className="text-lg font-semibold mb-3">1. Description of Service</h3>
              <p>
                Emotice is a digital wellness platform that helps users track their emotional states, gain insights into their mental health patterns, and receive personalized recommendations for emotional well-being.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">2. User Accounts</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>You must provide accurate and complete information when creating an account</li>
                <li>You are responsible for maintaining the security of your account credentials</li>
                <li>You must be at least 13 years old to use this service</li>
                <li>Users under 18 should have parental consent</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">3. Privacy and Data</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your mood data and personal information are encrypted and securely stored</li>
                <li>We will never sell your personal data to third parties</li>
                <li>You can export or delete your data at any time</li>
                <li>Please review our Privacy Policy for detailed information</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">4. Medical Disclaimer</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Important:</strong> Emotice is not a medical device or diagnostic tool. It is designed for wellness tracking and should not replace professional medical advice, diagnosis, or treatment. If you are experiencing mental health crisis or suicidal thoughts, please contact emergency services or a mental health professional immediately.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">5. Subscription and Payments</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Premium subscriptions are billed monthly or annually</li>
                <li>You can cancel your subscription at any time</li>
                <li>Refunds are provided according to our refund policy</li>
                <li>Prices may change with 30 days notice</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">6. Prohibited Uses</h3>
              <p>You may not use our service to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violate any laws or regulations</li>
                <li>Share inappropriate or harmful content</li>
                <li>Attempt to hack or compromise our systems</li>
                <li>Use the service for commercial purposes without permission</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">7. Intellectual Property</h3>
              <p>
                All content, features, and functionality of Emotice are owned by us and are protected by copyright, trademark, and other intellectual property laws.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">8. Limitation of Liability</h3>
              <p>
                To the maximum extent permitted by law, Emotice shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">9. Changes to Terms</h3>
              <p>
                We reserve the right to modify these terms at any time. Users will be notified of significant changes via email or through the application.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">10. Contact Information</h3>
              <p>
                For questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mt-2">
                <p className="text-sm">
                  Email: legal@emotice.app<br/>
                  Address: [Your Business Address]
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <p className="text-sm text-muted-foreground">
                By using Emotice, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};