// src/pages/Legal/PrivacyPolicyPage.jsx
// EMOTICE Privacy Policy Display Page

import React, { useState } from 'react'
import { ArrowLeft, Shield, Eye, Download, Mail, Globe } from 'lucide-react'
import { privacyPolicyContent } from '../../data/legal/privacyPolicyContent'

const PrivacyPolicyPage = ({ onBack }) => {
  const [expandedSection, setExpandedSection] = useState(null)
  const content = privacyPolicyContent.languages.en

  const toggleSection = (sectionKey) => {
    setExpandedSection(expandedSection === sectionKey ? null : sectionKey)
  }

  const handlePrintPolicy = () => {
    window.print()
  }

  const handleDownloadPolicy = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' })
    element.href = URL.createObjectURL(file)
    element.download = `emotice-privacy-policy-${privacyPolicyContent.lastUpdated}.json`
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
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Privacy Policy</h1>
                <p className="text-sm text-gray-500">
                  Last updated: {privacyPolicyContent.lastUpdated} • Version {privacyPolicyContent.version}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrintPolicy}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Print Policy"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={handleDownloadPolicy}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                title="Download Policy"
              >
                <Download className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Quick Navigation */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2" />
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(content.sections).map(([key, section]) => (
              <button
                key={key}
                onClick={() => toggleSection(key)}
                className="text-left p-3 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow text-sm text-blue-800 hover:text-blue-900"
              >
                {section.title}
              </button>
            ))}
          </div>
        </div>

        {/* Important Highlights */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-green-900 mb-4">Key Privacy Highlights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-green-800 mb-2">Your Data Rights</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Access and download your data</li>
                <li>• Delete your account anytime</li>
                <li>• Control data sharing preferences</li>
                <li>• Withdraw consent at any time</li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-green-800 mb-2">Our Commitments</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• We never sell your personal data</li>
                <li>• End-to-end encryption for health data</li>
                <li>• GDPR, CCPA, LGPD compliant</li>
                <li>• Transparent data processing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-6">
          {Object.entries(content.sections).map(([key, section]) => (
            <div key={key} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <button
                onClick={() => toggleSection(key)}
                className="w-full px-6 py-4 text-left border-b border-gray-200 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">{section.title}</h2>
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
                      if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
                        return (
                          <h3 key={index} className="text-lg font-semibold text-gray-900 mt-6 mb-3">
                            {paragraph.replace(/\*\*/g, '')}
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
            Privacy Questions?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-2">General Privacy Inquiries</h3>
              <p className="text-gray-300 text-sm">
                Email: privacy@emotice.com
                <br />
                Response time: Within 48 hours
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Data Protection Officer</h3>
              <p className="text-gray-300 text-sm">
                Email: dpo@emotice.com
                <br />
                For GDPR-related inquiries
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-gray-400 text-sm flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              You have the right to lodge a complaint with your local data protection authority 
              if you believe we have not addressed your privacy concerns adequately.
            </p>
          </div>
        </div>

        {/* Legal Footer */}
        <div className="text-center mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            This Privacy Policy is compliant with GDPR, CCPA, LGPD, PIPEDA, and other applicable privacy laws.
            <br />
            EMOTICE is committed to protecting your privacy and maintaining transparency in our data practices.
          </p>
          <div className="mt-4 flex justify-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              GDPR Compliant
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              CCPA Compliant
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              LGPD Compliant
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage