// src/hooks/useConsent.js
// EMOTICE Consent Management Hook
// TALİMAT compliance integration with React components

import { useState, useEffect, useCallback } from 'react'
import { consentService } from '../services/consent/consentService'
import { useAuth } from './useAuth'

export const useConsent = () => {
  const { user } = useAuth()
  const [consents, setConsents] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [needsConsent, setNeedsConsent] = useState(false)
  const [consentReason, setConsentReason] = useState('')

  // Check user consent status
  const checkConsentStatus = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Check if user needs to (re)consent
      const needsConsentResult = await consentService.needsReConsent(user.id)
      
      setNeedsConsent(needsConsentResult.needsConsent)
      setConsentReason(needsConsentResult.reason || '')

      // Get current consents if they exist
      const consentsResult = await consentService.getUserConsents(user.id)
      if (consentsResult.success) {
        setConsents(consentsResult.data)
      }

    } catch (err) {
      setError(err.message)
      setNeedsConsent(true)
      setConsentReason('Error checking consent status')
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Save user consents
  const saveConsents = useCallback(async (consentData, userAge = null) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    try {
      setLoading(true)
      setError(null)

      // Add user age to consent data
      const consentDataWithAge = {
        ...consentData,
        userAge
      }

      // Validate required consents
      if (!consentService.validateRequiredConsents(consentDataWithAge)) {
        throw new Error('All required consents must be granted')
      }

      // Save to database
      const result = await consentService.saveUserConsents(
        user.id, 
        consentDataWithAge,
        navigator?.userAgent
      )

      if (!result.success) {
        throw new Error(result.error)
      }

      // Update local state
      setConsents(result.data[0])
      setNeedsConsent(false)
      setConsentReason('')

      return { success: true, data: result.data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Mark survey as completed (TALİMAT #14 compliance)
  const completeSurvey = useCallback(async (surveyData) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    try {
      setLoading(true)
      setError(null)

      const result = await consentService.markSurveyCompleted(user.id, surveyData)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      // Refresh consent status
      await checkConsentStatus()

      return { success: true, data: result.data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [user?.id, checkConsentStatus])

  // Withdraw consent (GDPR compliance)
  const withdrawConsent = useCallback(async (consentType) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    try {
      setLoading(true)
      setError(null)

      const result = await consentService.withdrawConsent(user.id, consentType)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      // Refresh consent status
      await checkConsentStatus()

      return { success: true, data: result.data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [user?.id, checkConsentStatus])

  // Get consent history
  const getConsentHistory = useCallback(async () => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    try {
      setLoading(true)
      setError(null)

      const result = await consentService.getConsentHistory(user.id)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      return { success: true, data: result.data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Generate data portability report (GDPR)
  const generateDataReport = useCallback(async () => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    try {
      setLoading(true)
      setError(null)

      const result = await consentService.generateConsentReport(user.id)
      
      if (!result.success) {
        throw new Error(result.error)
      }

      return { success: true, data: result.data }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  // Validate age (TALİMAT #15)
  const validateAge = useCallback((birthDate) => {
    return consentService.validateAge(birthDate)
  }, [])

  // Check if user has specific consent
  const hasConsent = useCallback((consentType) => {
    if (!consents?.consents) return false
    
    const consent = consents.consents[consentType]
    return consent?.granted === true && !consent?.withdrawn
  }, [consents])

  // Check if survey is completed (TALİMAT #14)
  const isSurveyCompleted = useCallback(() => {
    return hasConsent('survey_completion_agreement') && 
           consents?.consents?.survey_completion_agreement?.completed === true
  }, [consents, hasConsent])

  // Check if user can access core features
  const canAccessCoreFeatures = useCallback(() => {
    if (!consents) return false
    
    const requiredConsents = [
      'terms_of_service',
      'privacy_policy',
      'medical_disclaimer',
      'age_verification',
      'data_processing'
    ]

    const hasAllRequired = requiredConsents.every(consent => hasConsent(consent))
    const surveyCompleted = isSurveyCompleted()

    return hasAllRequired && surveyCompleted && !needsConsent
  }, [consents, hasConsent, isSurveyCompleted, needsConsent])

  // Get granular data processing consents
  const getDataProcessingConsents = useCallback(() => {
    const dataConsent = consents?.consents?.data_processing
    if (!dataConsent) return null

    return {
      essential: true, // Always required
      analytics: dataConsent.granular_consents?.analytics_data || false,
      marketing: dataConsent.granular_consents?.marketing_data || false
    }
  }, [consents])

  // Check if user is a minor requiring parental consent
  const requiresParentalConsent = useCallback(() => {
    const ageConsent = consents?.consents?.age_verification
    if (!ageConsent) return false

    const age = ageConsent.user_claimed_age
    return age >= 16 && age < 18
  }, [consents])

  // Initialize consent check on mount and user change
  useEffect(() => {
    checkConsentStatus()
  }, [checkConsentStatus])

  // Consent status helpers for UI
  const consentStatus = {
    loading,
    error,
    needsConsent,
    consentReason,
    hasValidConsents: !needsConsent && consents !== null,
    canAccessApp: canAccessCoreFeatures(),
    surveyCompleted: isSurveyCompleted(),
    requiresParentalConsent: requiresParentalConsent()
  }

  // Consent permissions for features
  const permissions = {
    coreFeatures: canAccessCoreFeatures(),
    analytics: hasConsent('data_processing') && getDataProcessingConsents()?.analytics,
    marketing: hasConsent('data_processing') && getDataProcessingConsents()?.marketing,
    dataExport: hasConsent('privacy_policy'),
    accountDeletion: hasConsent('privacy_policy')
  }

  return {
    // Status
    ...consentStatus,
    consents,
    permissions,
    
    // Actions
    saveConsents,
    completeSurvey,
    withdrawConsent,
    checkConsentStatus,
    
    // Data access
    getConsentHistory,
    generateDataReport,
    
    // Utilities
    validateAge,
    hasConsent,
    getDataProcessingConsents,
    
    // Computed properties
    canAccessCoreFeatures,
    isSurveyCompleted,
    requiresParentalConsent
  }
}

// Higher-order component for consent-protected routes
export const withConsentProtection = (WrappedComponent) => {
  return function ConsentProtectedComponent(props) {
    const { canAccessApp, needsConsent, loading } = useConsent()

    if (loading) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Checking permissions...</p>
          </div>
        </div>
      )
    }

    if (needsConsent || !canAccessApp) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Consent Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to complete the consent process and mental health assessment 
              to access EMOTICE features.
            </p>
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Complete Setup
            </button>
          </div>
        </div>
      )
    }

    return <WrappedComponent {...props} />
  }
}

export default useConsent