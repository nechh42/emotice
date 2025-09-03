import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Download } from 'lucide-react';

export const Privacy = () => {
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-muted-foreground">
            Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="flex justify-center space-x-6 mt-6">
            <div className="flex items-center space-x-2 text-sm">
              <Shield className="h-4 w-4 text-green-500" />
              <span>GDPR Compliant</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Lock className="h-4 w-4 text-blue-500" />
              <span>End-to-end Encrypted</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Eye className="h-4 w-4 text-purple-500" />
              <span>No Data Selling</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-green-500" />
                <span>Our Privacy Commitment</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                At Emotice, your privacy is our highest priority. We understand that mood and emotional data is deeply personal, and we are committed to protecting it with the highest standards of security and transparency.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>1. Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Email address (for account creation and communication)</li>
                  <li>Name (optional, for personalization)</li>
                  <li>Profile information you choose to provide</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Mood and Wellness Data</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Mood entries and emotional state tracking</li>
                  <li>Notes and reflections you add to mood entries</li>
                  <li>Activities and triggers you associate with moods</li>
                  <li>Usage patterns and app interaction data</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Technical Information</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>Device information and browser type</li>
                  <li>IP address and general location (country/city level)</li>
                  <li>App performance and error logs</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>2. How We Use Your Information</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-sm">
                <li>Provide and improve our mood tracking services</li>
                <li>Generate personalized insights and recommendations</li>
                <li>Send you service updates and important notifications</li>
                <li>Provide customer support when requested</li>
                <li>Improve our AI algorithms (using anonymized data only)</li>
                <li>Ensure the security and proper functioning of our services</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5 text-blue-500" />
                <span>3. Data Security</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Encryption</h4>
                <p className="text-sm">All your mood data is encrypted both in transit and at rest using industry-standard AES-256 encryption.</p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Access Control</h4>
                <p className="text-sm">Only authorized personnel have access to systems, and all access is logged and monitored.</p>
              </div>

              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Regular Audits</h4>
                <p className="text-sm">We conduct regular security audits and vulnerability assessments to ensure your data stays protected.</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>4. Data Sharing and Third Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold mb-2 text-red-700">❌ What We DON'T Do</h4>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>We never sell your personal data to anyone</li>
                  <li>We don't share your mood data with third parties for marketing</li>
                  <li>We don't use your data for advertising purposes</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Limited Sharing</h4>
                <p className="text-sm mb-2">We only share data in these specific circumstances:</p>
                <ul className="list-disc pl-6 space-y-1 text-sm">
                  <li>With your explicit consent</li>
                  <li>When required by law or legal process</li>
                  <li>To trusted service providers who help us operate the service (under strict confidentiality agreements)</li>
                  <li>Anonymized, aggregated data for research purposes</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5 text-purple-500" />
                <span>5. Your Rights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Access Your Data</h4>
                      <p className="text-xs text-muted-foreground">Download all your data anytime</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Correct Information</h4>
                      <p className="text-xs text-muted-foreground">Update or correct any data</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-wellness rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Delete Account</h4>
                      <p className="text-xs text-muted-foreground">Permanently delete all data</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-calm rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Control Processing</h4>
                      <p className="text-xs text-muted-foreground">Opt out of certain data uses</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>6. International Data Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Your data is stored securely on servers located in the United States and European Union. We ensure appropriate safeguards are in place for any international data transfers in compliance with GDPR and other applicable data protection laws.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>7. Children's Privacy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                Our service is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle>8. Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">
                We may update this privacy policy from time to time. We will notify you of any material changes by email or through the application. Your continued use of the service after such modifications constitutes your acceptance of the updated policy.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-soft bg-gradient-primary text-white">
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm opacity-90 mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-white/10 rounded-lg p-4">
                <p className="text-sm">
                  <strong>Email:</strong> privacy@emotice.app<br/>
                  <strong>Data Protection Officer:</strong> dpo@emotice.app<br/>
                  <strong>Address:</strong> [Your Business Address]
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};