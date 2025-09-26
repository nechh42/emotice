import React, { useState, useEffect } from 'react'
import { Calendar, AlertCircle, Shield, CheckCircle2, Eye, EyeOff, User } from 'lucide-react'

const AgeVerification = ({ onVerificationComplete, onBack }) => {
  const [step, setStep] = useState(1) // 1: Age & Gender, 2: Legal Consents, 3: Complete
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  
  // Age verification state
  const [birthDate, setBirthDate] = useState('')
  const [isAgeValid, setIsAgeValid] = useState(false)
  const [userAge, setUserAge] = useState(null)
  
  // Gender selection state
  const [gender, setGender] = useState('')
  
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

  // Gender options
  const genderOptions = [
    { value: 'male', label: 'Erkek' },
    { value: 'female', label: 'Kadın' },
    { value: 'prefer_not_to_say', label: 'Belirtmek İstemiyorum' }
  ]

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

  // Step 1: Age and Gender verification
  const handleAgeAndGenderVerification = async () => {
    const newErrors = {}
    
    if (!isAgeValid || !birthDate) {
      newErrors.birthDate = 'Lütfen geçerli bir doğum tarihi girin ve 16 yaş şartını sağladığınızdan emin olun.'
    }
    
    if (!gender) {
      newErrors.gender = 'Lütfen cinsiyet seçimi yapınız.'
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setLoading(true)
    try {
      // Simulate saving age and gender data
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStep(2) // Move to legal consents
    } catch (error) {
      console.error('Age verification error:', error)
      setErrors({ 
        general: 'Yaş doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.' 
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
      // Simulate saving consents
      await new Promise(resolve => setTimeout(resolve, 1000))
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
      gender,
      consents,
      completedAt: new Date().toISOString()
    })
  }

  // Render age and gender verification step
  const renderAgeAndGenderVerification = () => (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Kişisel Bilgiler</h2>
        <p className="text-gray-600">
          Size daha iyi hizmet verebilmek için yaş ve cinsiyet bilgileriniz gerekli.
        </p>
      </div>

      <div className="space-y-6">
        {/* Birth Date */}
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

        {/* Age Status */}
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

        {/* Gender Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Cinsiyet
          </label>
          <div className="space-y-2">
            {genderOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="gender"
                  value={option.value}
                  checked={gender === option.value}
                  onChange={(e) => setGender(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
          {errors.gender && (
            <div className="mt-2 flex items-center text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mr-1" />
              {errors.gender}
            </div>
          )}
        </div>

        {/* General Error */}
        {errors.general && (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.general}
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
            onClick={handleAgeAndGenderVerification}
            disabled={!isAgeValid || !gender || loading}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Doğrulanıyor...' : 'Devam Et'}
          </button>
        </div>
      </div>
    </div>
  )

  // Render legal consents step (simplified for space)
  const renderLegalConsents = () => (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <Shield className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hukuki Onaylar</h2>
        <p className="text-gray-600">
          Kişisel verilerinizin korunması için onaylarınız gerekmektedir.
        </p>
      </div>

      <div className="space-y-4">
        {/* Terms of Service */}
        <div className="border border-gray-200 rounded-lg p-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={consents.terms}
              onChange={(e) => handleConsentChange('terms', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-900">
              Kullanım Şartlarını kabul ediyorum <span className="text-red-500">*</span>
            </span>
          </label>
        </div>

        {/* Privacy Policy */}
        <div className="border border-gray-200 rounded-lg p-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={consents.privacy}
              onChange={(e) => handleConsentChange('privacy', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-900">
              Gizlilik Politikasını kabul ediyorum <span className="text-red-500">*</span>
            </span>
          </label>
        </div>

        {/* Data Processing */}
        <div className="border border-gray-200 rounded-lg p-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={consents.dataProcessing}
              onChange={(e) => handleConsentChange('dataProcessing', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-900">
              Kişisel verilerimin işlenmesine izin veriyorum <span className="text-red-500">*</span>
            </span>
          </label>
        </div>

        {/* Marketing (Optional) */}
        <div className="border border-gray-200 rounded-lg p-4">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={consents.marketing}
              onChange={(e) => handleConsentChange('marketing', e.target.checked)}
              className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm text-gray-900">
              Pazarlama amaçlı iletişim kurmaya izin veriyorum (opsiyonel)
            </span>
          </label>
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
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
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
        Kişisel bilgileriniz ve hukuki onaylarınız başarıyla kaydedildi. 
        Artık Emotice'nin tüm özelliklerini kullanabilirsiniz.
      </p>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-8">
        <h3 className="font-medium text-blue-900 mb-2">Özet:</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>✓ Yaş: {userAge} (16+ şartını sağlıyor)</li>
          <li>✓ Cinsiyet: {genderOptions.find(g => g.value === gender)?.label}</li>
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
          {step === 1 && renderAgeAndGenderVerification()}
          {step === 2 && renderLegalConsents()}
          {step === 3 && renderCompletion()}
        </div>
      </div>
    </div>
  )
}

export default AgeVerification