// src/pages/Legal/TermsPage.jsx
import React, { useState } from 'react'
import { ArrowLeft, Scale, AlertTriangle, Download, Mail } from 'lucide-react'

const TermsPage = ({ onBack }) => {
  const [expandedSection, setExpandedSection] = useState(null)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center space-x-4 mb-8">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Terms of Service</h1>
            <p className="text-sm text-gray-500">EMOTICE Kullanım Şartları</p>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-700">
            Terms of Service içeriği burada gösterilecek...
          </p>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
