// src/pages/Legal/TermsPage.jsx
// EMOTICE Terms of Service Display Page

import React, { useState } from 'react'
import { ArrowLeft, Scale, AlertTriangle, Download, Mail, Heart, Shield } from 'lucide-react'
import { termsOfServiceContent } from '../../data/legal/termsContent'

const TermsPage = ({ onBack }) => {
  const [expandedSection, setExpandedSection] = useState(null)
  const content = termsOfServiceContent.languages.en

  const toggleSection = (sectionKey) => {
    setExpandedSection(expandedSection === sectionKey ? null : sectionKey)
  }

  const handleDownloadTerms = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    element.href = URL.createObjectURL(file)
    element.download = `emotice-terms-of-service-${termsOfServiceContent.lastUpdated}.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.print()}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Print Terms"
              >
                <Scale className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownloadTerms}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Download Terms"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Critical Notices */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
            <AlertTriangle className="w-5 h-5 mr-2" />
            Important Legal Notice
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <Heart className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Medical Disclaimer</h3>
                <p className="text-sm text-red-700">
                  EMOTICE is NOT a medical device or healthcare service. Always consult healthcare professionals 
                  for mental health concerns. In crisis situations, contact emergency services immediately.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-red-800">Age Requirements</h3>
                <p className="text-sm text-red-700">
                  Minimum age: 16 years. Users aged 16-17 require parental consent. 
                  Mental health assessment completion is mandatory before accessing features.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contacts */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-orange-900 mb-4">🚨 Emergency Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h3 className="font-medium text-orange-800">Emergency Services</h3>
              <p className="text-orange-700">
                911 (US) • 999 (UK) • 112 (EU)
              </p>
            </div>
            <div>
              <h3 className="font-medium text-orange-800">Suicide Prevention</h3>
              <p className="text-orange-700">
                988 (US) • 116 123 (UK)
              </p>
            </div>
            <div>
              <h3 className="font-medium text-orange-800">Crisis Text</h3>
              <p className="text-orange-700">
                Text HOME to 741741
              </p>
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Scale className="w-5 h-5 mr-2" />
            Terms Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(content.sections).map(([key, section]) => (
              <button
                key={key}
                onClick={() => toggleSection(key)}
                className={`text-left p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm ${
                  key === 'mentalHealthCompliance' || key === 'disclaimersLimitations' 
                    ? 'border-l-4 border-red-400 text-red-800 hover:text-red-900' 
                    : 'text-blue-800 hover:text-blue-900'
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Your Rights Summary */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-900 mb-4">Your Rights & Protections</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-green-800 mb-2">User Rights</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Cancel subscription anytime</li>
                <li>• Access and export your data</li>
                <li>• Delete your account permanently</li>
                <li>• Control data sharing preferences</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-green-800 mb-2">Legal Protections</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• GDPR, CCPA, LGPD compliance</li>
                <li>• Consumer protection rights</li>
                <li>• Dispute resolution process</li>
                <li>• Transparent terms and pricing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          {Object.entries(content.sections).map(([key, section]) => (
            <div 
              key={key} 
              className={`bg-white rounded-lg shadow-sm overflow-hidden ${
                key === 'mentalHealthCompliance' || key === 'disclaimersLimitations' 
                  ? 'border-l-4 border-red-400' 
                  : ''
              }`}
            >
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
                    {(key === 'mentalHealthCompliance' || key === 'disclaimersLimitations') && (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      expandedSection === key ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              {expandedSection === key && (
                <div className="px-6 py-6">
                  <div className="prose max-w-none">
                    {section.content.split('\n\n').map((paragraph, index) => {
                      if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**:')) {
                        return (
                          <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                            {paragraph.replace(/\*\*/g, '').replace(':', '')}
                          </h3>
                        )
                      } else if (paragraph.trim().startsWith('•')) {
                        const items = paragraph.split('\n').filter(item => item.trim())
                        return (
                          <ul key={index} className="list-disc list-inside space-y-1 my-4">
                            {items.map((item, itemIndex) => (
                              <li key={itemIndex} className="text-gray-700">
                                {item.replace('• ', '')}
                              </li>
                            ))}
                          </ul>
                        )
                      } else if (paragraph.includes('THE SERVICE IS PROVIDED "AS IS"') || 
                                 paragraph.includes('TO THE FULLEST EXTENT PERMITTED BY LAW')) {
                        return (
                          <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 my-4">
                            <p className="text-yellow-900 font-medium text-sm">
                              <AlertTriangle className="w-4 h-4 inline mr-2" />
                              Legal Disclaimer:
                            </p>
                            <p className="text-yellow-800 text-sm mt-2 leading-relaxed">
                              {paragraph.trim()}
                            </p>
                          </div>
                        )
                      } else {
                        return (
                          <p key={index} className="text-gray-700 leading-relaxed mb-4">
                            {paragraph.trim()}
                          </p>
                        )
                      }
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Information */}
        <div className="bg-gray-800 text-white rounded-lg p-6 mt-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Legal Questions?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">Legal Inquiries</h3>
              <p className="text-gray-300 text-sm">
                Email: legal@emotice.com
                <br />
                Response time: Within 3 business days
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Customer Support</h3>
              <p className="text-gray-300 text-sm">
                Email: support@emotice.com
                <br />
                For general questions and support
              </p>
            </div>
          </div>
        </div>

        {/* Agreement Notice */}
        <div className="bg-blue-900 text-white rounded-lg p-6 mt-6">
          <h2 className="text-lg font-semibold mb-3">By Using EMOTICE, You Agree:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <ul className="space-y-2">
                <li>✓ You have read these Terms of Service</li>
                <li>✓ You meet the minimum age requirement (16+)</li>
                <li>✓ You understand this is not medical advice</li>
                <li>✓ You will use the service responsibly</li>
              </ul>
            </div>
            <div>
              <ul className="space-y-2">
                <li>✓ You consent to data processing per our Privacy Policy</li>
                <li>✓ You will complete required mental health assessments</li>
                <li>✓ You will seek professional help when needed</li>
                <li>✓ You accept the limitations and disclaimers</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            These Terms of Service are governed by applicable laws and include provisions for global compliance.
            <br />
            Dispute resolution available through mediation and arbitration procedures.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Global Compliance
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Consumer Protection
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Mental Health Focus
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
                <p className="text-sm text-gray-500">
                  Last updated: {termsOfServiceContent.lastUpdated} • Version {termsOfServiceContent.version}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick