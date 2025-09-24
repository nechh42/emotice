import React, { useState, useEffect } from 'react'
import { Calendar, AlertCircle, Shield, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { supabase, authHelpers, dbHelpers } from '../../lib/supabase'
import { legalTexts } from '../../data/legalTexts'
import { useAuth } from '../../hooks/useAuth'

const AgeVerification = ({ onVerificationComplete, onBack }) => {
  const { user } = useAuth()
  const [step, setStep] = useState(1) // 1: Age Check, 2: Legal Consents, 3: Complete
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  // Age verification state
  const [birthDate, setBirthDate] = useState('')
  const [isAgeValid, setIsAgeValid] = useState(false)
  const [userAge, setUserAge] = useState(null)
  
  // Legal consent state
  const [consents, setConsents] = useState({
    terms: false,
    privacy: false,
    dataProcessing: false,
    marketing: false
  })
  const [showLegalTexts, setShowLegalTexts] = useState({
    terms: false,
    privacy: false,
    dataProcessing: false
  })
  
  // Browser info for consent tracking
  const [browserInfo, setBrowserInfo] = useState({
    userAgent: '',
    ipAddress: null
  })

  useEffect(() => {
    // Capture browser info for GDPR compliance
    setBrowserInfo({
      userAgent: navigator.userAgent,
      ipAddress: null // We'll get this from server if needed
    })
  }, [])

  // Calculate age from birth date
  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  // Handle birth date change
  const handleBirthDateChange = (e) => {
    const date = e.target.value
    setBirthDate(date)
    
    if (date) {
      const age = calculateAge(date)
      setUserAge(age)
      setIsAgeValid(age >= 16)
      
      if (age < 16) {
        setErrors({ 
          birthDate: 'Emotice\'yi kullanabilmek için en az 16 yaşında olmanız gerekmektedir.' 
        })
      } else {
        setErrors({})
      }
    } else {
      setIsAgeValid(false)
      setUserAge(null)
      setErrors({})
    }
  }

  // Handle consent change
  const handleConsentChange = (consentType, value) => {
    setConsents(prev => ({
      ...prev,
      [consentType]: value
    }))
  }

  // Toggle legal text visibility
  const toggleLegalText = (textType) => {
    setShowLegalTexts(prev => ({
      ...prev,
      [textType]: !prev[textType]
    }))
  }

  // Validate required consents
  const validateConsents = () => {
    const required = ['terms', 'privacy', 'dataProcessing']
    const missing = required.filter(consent => !consents[consent])
    
    if (missing.length > 0) {
      setErrors({
        consents: 'Zorunlu onayları vermeniz gerekmektedir.'
      })
      return false
    }
    
    setErrors({})
    return true
  }

  // Step 1: Age verification
  const handleAgeVerification = async () => {
    if (!isAgeValid || !birthDate) {
      setErrors({ 
        birthDate: 'Lütfen geçerli bir doğum tarihi girin ve 16 yaş şartını sağladığınızdan emin olun.' 
      })
      return
    }

    setLoading(true)
    try {
      // Update user profile with birth date
      const { data, error } = await dbHelpers.upsertProfile(user.id, {
        birth_date: birthDate,
        age_verified: true
      })

      if (error) throw error

      setStep(2) // Move to legal consents
    } catch (error) {
      console.error('Age verification error:', error)
      setErrors({ 
        birthDate: 'Yaş doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Legal consents
  const handleLegalConsents = async () => {
    if (!validateConsents()) return

    setLoading(true)
    try {
      // Save each consent separately for GDPR compliance
      const consentPromises = Object.entries(consents)
        .filter(([_, given]) => given) // Only save given consents
        .map(([consentType, _]) => 
          supabase
            .from('legal_consents')
            .insert({
              user_id: user.id,
              consent_type: consentType,
              consent_given: true,
              consent_version: 'v1.0.0',
              ip_address: browserInfo.ipData?.hashedIP || 'not-collected', // We can add IP detection later
              user_agent: browserInfo.userAgent
            })
        )

      await Promise.all(consentPromises)

      // Update profile timestamps
      const updateData = {
        terms_accepted_at: consents.terms ? new Date().toISOString() : null,
        privacy_accepted_at: consents.privacy ? new Date().toISOString() : null,
        marketing_consent: consents.marketing,
        data_processing_consent: consents.dataProcessing
      }

      await dbHelpers.upsertProfile(user.id, updateData)

      setStep(3) // Move to completion
    } catch (error) {
      console.error('Legal consent error:', error)
      setErrors({ 
        consents: 'Onaylar kaydedilirken bir hata oluştu. Lütfen tekrar deneyin.' 
      })
    } finally {
      setLoading(false)
    }
  }

  // Complete verification
  const handleComplete = () => {
    onVerificationComplete?.({
      ageVerified: true,
      birthDate,
      userAge,
      consents,
      completedAt: new Date().toISOString()
    })
  }

  // Render age verification step
  const renderAgeVerification = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Calendar className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Yaş Doğrulama</h2>
        <p className="text-gray-600">
          Emotice'yi kullanabilmek için en az 16 yaşında olmanız gerekmektedir.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">
            Doğum Tarihiniz
          </label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={handleBirthDateChange}
            max={new Date().toISOString().split('T')[0]}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          {errors.birthDate && (
            <div className="mt-2 flex items-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.birthDate}
            </div>
          )}
        </div>

        {userAge !== null && (
          <div className={`p-4 rounded-lg ${isAgeValid ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            <div className="flex items-center">
              {isAgeValid ? (
                <CheckCircle2 className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              <span className="font-medium">
                {isAgeValid 
                  ? `Yaşınız: ${userAge} - Devam edebilirsiniz!` 
                  : `Yaşınız: ${userAge} - Maalesef 16 yaş şartını sağlamıyorsunuz.`
                }
              </span>
            </div>
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Geri Dön
          </button>
          <button
            type="button"
            onClick={handleAgeVerification}
            disabled={!isAgeValid || loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Doğrulanıyor...' : 'Devam Et'}
          </button>
        </div>
      </div>
    </div>
  )

  // Render legal consents step
  const renderLegalConsents = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hukuki Onaylar</h2>
        <p className="text-gray-600">
          Kişisel verilerinizin korunması ve hizmetlerimizi sunabilmek için onaylarınız gerekmektedir.
        </p>
      </div>

      <div className="space-y-6">
        {/* Terms of Service */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="consent-terms"
              checked={consents.terms}
              onChange={(e) => handleConsentChange('terms', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex-1">
              <label htmlFor="consent-terms" className="text-sm font-medium text-gray-900 cursor-pointer">
                Kullanım Şartlarını kabul ediyorum <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => toggleLegalText('terms')}
                className="ml-2 text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
              >
                {showLegalTexts.terms ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showLegalTexts.terms ? 'Gizle' : 'Oku'}
              </button>
              
              {showLegalTexts.terms && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700 max-h-40 overflow-y-auto">
                  {legalTexts.termsOfService.content}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Privacy Policy */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="consent-privacy"
              checked={consents.privacy}
              onChange={(e) => handleConsentChange('privacy', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex-1">
              <label htmlFor="consent-privacy" className="text-sm font-medium text-gray-900 cursor-pointer">
                Gizlilik Politikasını kabul ediyorum <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => toggleLegalText('privacy')}
                className="ml-2 text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
              >
                {showLegalTexts.privacy ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showLegalTexts.privacy ? 'Gizle' : 'Oku'}
              </button>
              
              {showLegalTexts.privacy && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700 max-h-40 overflow-y-auto">
                  {legalTexts.privacyPolicy.content}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Processing */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="consent-data"
              checked={consents.dataProcessing}
              onChange={(e) => handleConsentChange('dataProcessing', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex-1">
              <label htmlFor="consent-data" className="text-sm font-medium text-gray-900 cursor-pointer">
                Kişisel verilerimin işlenmesine izin veriyorum <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => toggleLegalText('dataProcessing')}
                className="ml-2 text-blue-600 hover:text-blue-800 text-sm inline-flex items-center"
              >
                {showLegalTexts.dataProcessing ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showLegalTexts.dataProcessing ? 'Gizle' : 'Oku'}
              </button>
              
              {showLegalTexts.dataProcessing && (
                <div className="mt-3 p-3 bg-gray-50 rounded text-sm text-gray-700 max-h-40 overflow-y-auto">
                  {legalTexts.dataProcessingConsent.content}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Marketing Consent (Optional) */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="consent-marketing"
              checked={consents.marketing}
              onChange={(e) => handleConsentChange('marketing', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="flex-1">
              <label htmlFor="consent-marketing" className="text-sm font-medium text-gray-900 cursor-pointer">
                Pazarlama amaçlı iletişim kurmaya izin veriyorum (opsiyonel)
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Bu onayı istediğiniz zaman geri çekebilirsiniz.
              </p>
            </div>
          </div>
        </div>

        {errors.consents && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.consents}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Geri Dön
          </button>
          <button
            type="button"
            onClick={handleLegalConsents}
            disabled={loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Kaydediliyor...' : 'Onayları Kaydet'}
          </button>
        </div>
      </div>
    </div>
  )

  // Render completion step
  const renderCompletion = () => (
    <div className="max-w-md mx-auto text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
        <CheckCircle2 className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Doğrulama Tamamlandı!</h2>
      <p className="text-gray-600 mb-8">
        Yaş doğrulamanız ve hukuki onaylarınız başarıyla kaydedildi. 
        Artık Emotice'nin tüm özelliklerini kullanabilirsiniz.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <h3 className="font-medium text-blue-900 mb-2">Özet:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Yaş: {userAge} (16+ şartını sağlıyor)</li>
          <li>✓ Kullanım şartları kabul edildi</li>
          <li>✓ Gizlilik politikası kabul edildi</li>
          <li>✓ Veri işleme izni verildi</li>
          {consents.marketing && <li>✓ Pazarlama iletişimi izin verildi</li>}
        </ul>
      </div>

      <button
        type="button"
        onClick={handleComplete}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Emotice'yi Keşfet
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNumber < step 
                    ? 'bg-green-600 text-white' 
                    : stepNumber === step 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNumber < step ? <CheckCircle2 className="w-4 h-4" /> : stepNumber}
                </div>
                {stepNumber < 3 && <div className={`w-12 h-0.5 ml-4 ${stepNumber < step ? 'bg-green-600' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <span className="text-sm text-gray-500">
              Adım {step}/3
            </span>
          </div>
        </div>

        {/* Step content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {step === 1 && renderAgeVerification()}
          {step === 2 && renderLegalConsents()}
          {step === 3 && renderCompletion()}
        </div>
      </div>
    </div>
  )
}

export default AgeVerification
