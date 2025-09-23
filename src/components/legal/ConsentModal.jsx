// src/components/legal/ConsentModal.jsx
// EMOTICE Legal Consent Modal - TALİMAT #13, #14, #15 uyumlu
// Hukuki metinler + Anket tamamlanmadan kayıt yapmaz

import React, { useState, useEffect } from 'react'
import { X, AlertTriangle, Heart, Shield, Scale, FileText, CheckCircle } from 'lucide-react'

const ConsentModal = ({ isOpen, onClose, onConsent, userAge = null }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [consents, setConsents] = useState({
    termsOfService: false,
    privacyPolicy: false,
    medicalDisclaimer: false,
    ageVerification: false,
    parentalConsent: false, // For 16-17 year olds
    dataProcessing: false,
    surveyCompletion: false
  })
  
  const [showFullText, setShowFullText] = useState('')
  const [readingProgress, setReadingProgress] = useState({})
  const [allRequirementsRead, setAllRequirementsRead] = useState(false)

  // Age categorization
  const isMinor = userAge && userAge >= 16 && userAge < 18
  const isUnderage = userAge && userAge < 16

  const consentSteps = [
    {
      id: 'age-verification',
      title: 'Age Verification',
      icon: Shield,
      required: true,
      content: {
        title: '🔞 Age Requirements',
        summary: 'You must be at least 16 years old to use EMOTICE.',
        points: [
          'Minimum age: 16 years old',
          'Users 16-17 require parental consent',
          'Age verification may be requested',
          'False age information will result in account termination'
        ],
        action: 'I confirm I am at least 16 years old'
      }
    },
    {
      id: 'medical-disclaimer',
      title: 'Medical Disclaimer',
      icon: Heart,
      required: true,
      critical: true,
      content: {
        title: '🏥 Critical Medical Notice',
        summary: 'EMOTICE is NOT medical advice and cannot replace professional healthcare.',
        points: [
          '⚠️ This app is NOT a medical device or healthcare service',
          '⚠️ Do NOT use for medical diagnosis or treatment decisions',
          '⚠️ Always consult healthcare professionals for mental health concerns',
          '⚠️ In crisis situations, contact emergency services immediately',
          '⚠️ We are NOT responsible for any health outcomes'
        ],
        emergencyInfo: {
          title: '🚨 Emergency Contacts',
          contacts: [
            'Emergency Services: 911 (US), 999 (UK), 112 (EU)',
            'Suicide Prevention: 988 (US), 116 123 (UK)',
            'Crisis Text Line: Text HOME to 741741'
          ]
        },
        action: 'I understand this is not medical advice and I will seek professional help when needed'
      }
    },
    {
      id: 'terms-privacy',
      title: 'Terms & Privacy',
      icon: FileText,
      required: true,
      content: {
        title: '📜 Legal Agreements',
        summary: 'Our Terms of Service and Privacy Policy govern your use of EMOTICE.',
        points: [
          'Terms of Service outline your rights and responsibilities',
          'Privacy Policy explains how we handle your data',
          'Both documents comply with GDPR, CCPA, and other privacy laws',
          'You can withdraw consent and delete your account anytime',
          'We use minimal data necessary for service provision'
        ],
        action: 'I agree to the Terms of Service and Privacy Policy'
      }
    },
    {
      id: 'data-processing',
      title: 'Data Processing',
      icon: Shield,
      required: true,
      content: {
        title: '🔐 Your Data Rights',
        summary: 'We need your consent to process your personal and health data.',
        points: [
          'We collect mood tracking and assessment data',
          'Your data is encrypted and securely stored',
          'We never sell your personal information',
          'You can access, edit, or delete your data anytime',
          'Data is processed according to privacy laws (GDPR, CCPA, etc.)'
        ],
        granularConsents: [
          {
            id: 'essential-data',
            label: 'Essential data processing (required for core features)',
            required: true,
            description: 'Account management, mood tracking, basic assessments'
          },
          {
            id: 'analytics-data',
            label: 'Anonymous analytics (helps improve the app)',
            required: false,
            description: 'Usage statistics, crash reports, performance metrics'
          },
          {
            id: 'marketing-data',
            label: 'Marketing communications',
            required: false,
            description: 'Product updates, wellness tips, promotional offers'
          }
        ],
        action: 'I consent to data processing as described above'
      }
    },
    {
      id: 'survey-requirement',
      title: 'Mental Health Assessment',
      icon: Heart,
      required: true,
      content: {
        title: '📋 Required Assessment',
        summary: 'You must complete our mental health assessment before using core features.',
        points: [
          'WHO-5 wellbeing assessment (5 questions)',
          'PHQ-4 depression/anxiety screening (4 questions)',
          'Additional wellness and preferences questions',
          'Assessment helps personalize your experience',
          'You can retake assessments anytime',
          'Results are private and not shared with third parties'
        ],
        warning: 'TALİMAT #14: Assessment completion is mandatory for account activation',
        action: 'I agree to complete the mental health assessment'
      }
    }
  ]

  // Add parental consent step for minors
  if (isMinor) {
    consentSteps.splice(1, 0, {
      id: 'parental-consent',
      title: 'Parental Consent',
      icon: Shield,
      required: true,
      content: {
        title: '👨‍👩‍👧‍👦 Parental Consent Required',
        summary: 'As a minor (16-17 years old), you need parental consent to use EMOTICE.',
        points: [
          'Parent or guardian must review and approve these terms',
          'Parent/guardian is responsible for monitoring app usage',
          'Parent/guardian can revoke consent and delete account anytime',
          'We may request verification of parental consent'
        ],
        parentalNotice: 'Parent/Guardian: By providing consent, you acknowledge that you have reviewed all terms and agree to your minor child using EMOTICE under these conditions.',
        action: 'My parent/guardian has given consent for me to use EMOTICE'
      }
    })
  }

  const currentStepData = consentSteps[currentStep]
  const totalSteps = consentSteps.length

  // Block underage users
  if (isUnderage) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Age Restriction</h2>
          <p className="text-gray-600 mb-6">
            We're sorry, but you must be at least 16 years old to use EMOTICE. 
            This is required by our Terms of Service and applicable laws.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            If you need mental health support, please speak with a parent, guardian, 
            school counselor, or contact appropriate youth mental health services.
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 px-6 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
          >
            I Understand
          </button>
        </div>
      </div>
    )
  }

  const handleConsentChange = (consentType, value) => {
    setConsents(prev => ({
      ...prev,
      [consentType]: value
    }))
  }

  const handleNextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepComplete = () => {
    const step = currentStepData
    switch (step.id) {
      case 'age-verification':
        return consents.ageVerification
      case 'parental-consent':
        return consents.parentalConsent
      case 'medical-disclaimer':
        return consents.medicalDisclaimer
      case 'terms-privacy':
        return consents.termsOfService && consents.privacyPolicy
      case 'data-processing':
        return consents.dataProcessing
      case 'survey-requirement':
        return consents.surveyCompletion
      default:
        return false
    }
  }

  const allRequiredConsentsGiven = () => {
    const required = [
      'termsOfService',
      'privacyPolicy', 
      'medicalDisclaimer',
      'ageVerification',
      'dataProcessing',
      'surveyCompletion'
    ]
    
    if (isMinor) {
      required.push('parentalConsent')
    }

    return required.every(consent => consents[consent])
  }

  const handleFinalConsent = () => {
    if (allRequiredConsentsGiven()) {
      onConsent(consents)
      onClose()
    }
  }

  const ConsentCheckbox = ({ id, label, required = false, checked, onChange, description }) => (
    <div className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg">
      <div className="flex items-center">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          required={required}
        />
      </div>
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium text-gray-900 cursor-pointer">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {description && (
          <p className="text-xs text-gray-600 mt-1">{description}</p>
        )}
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <currentStepData.icon className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">{currentStepData.title}</h2>
                <p className="text-blue-100">
                  Step {currentStep + 1} of {totalSteps}
                </p>
              </div>
            </div>
            {currentStepData.critical && (
              <AlertTriangle className="w-6 h-6 text-yellow-300" />
            )}
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 bg-blue-500 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentStepData.content.title}
            </h3>
            
            <p className="text-gray-600">
              {currentStepData.content.summary}
            </p>

            {/* Points */}
            <ul className="space-y-2">
              {currentStepData.content.points.map((point, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{point}</span>
                </li>
              ))}
            </ul>

            {/* Emergency info for medical disclaimer */}
            {currentStepData.content.emergencyInfo && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <h4 className="font-semibold text-red-900 mb-2">
                  {currentStepData.content.emergencyInfo.title}
                </h4>
                <ul className="space-y-1">
                  {currentStepData.content.emergencyInfo.contacts.map((contact, index) => (
                    <li key={index} className="text-sm text-red-800">• {contact}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Granular consents for data processing */}
            {currentStepData.content.granularConsents && (
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Consent Options:</h4>
                {currentStepData.content.granularConsents.map((consent) => (
                  <ConsentCheckbox
                    key={consent.id}
                    id={consent.id}
                    label={consent.label}
                    required={consent.required}
                    checked={consents[consent.id] || false}
                    onChange={(checked) => handleConsentChange(consent.id, checked)}
                    description={consent.description}
                  />
                ))}
              </div>
            )}

            {/* Warning messages */}
            {currentStepData.content.warning && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm font-medium">
                  ⚠️ {currentStepData.content.warning}
                </p>
              </div>
            )}

            {/* Parental notice */}
            {currentStepData.content.parentalNotice && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  <strong>Notice to Parent/Guardian:</strong> {currentStepData.content.parentalNotice}
                </p>
              </div>
            )}

            {/* Main consent checkbox */}
            <div className="mt-6">
              <ConsentCheckbox
                id={`consent-${currentStepData.id}`}
                label={currentStepData.content.action}
                required={currentStepData.required}
                checked={isStepComplete()}
                onChange={(checked) => {
                  switch (currentStepData.id) {
                    case 'age-verification':
                      handleConsentChange('ageVerification', checked)
                      break
                    case 'parental-consent':
                      handleConsentChange('parentalConsent', checked)
                      break
                    case 'medical-disclaimer':
                      handleConsentChange('medicalDisclaimer', checked)
                      break
                    case 'terms-privacy':
                      handleConsentChange('termsOfService', checked)
                      handleConsentChange('privacyPolicy', checked)
                      break
                    case 'data-processing':
                      handleConsentChange('dataProcessing', checked)
                      break
                    case 'survey-requirement':
                      handleConsentChange('surveyCompletion', checked)
                      break
                  }
                }}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 p-6">
          <div className="flex justify-between">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 0}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            
            <div className="flex space-x-3">
              {currentStep < totalSteps - 1 ? (
                <button
                  onClick={handleNextStep}
                  disabled={!isStepComplete()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={handleFinalConsent}
                  disabled={!allRequiredConsentsGiven()}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Complete Registration
                </button>
              )}