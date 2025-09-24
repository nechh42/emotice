import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { supabase, dbHelpers } from '../../lib/supabase'
import AgeVerification from './AgeVerification'
import SurveyComponent from '../forms/SurveyComponent'
import RegisterForm from './RegisterForm'
import LoginForm from './LoginForm'
import { ErrorBoundary } from 'react-error-boundary'
import ErrorFallback from '../common/ErrorBoundary'

const AuthFlow = () => {
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const [currentStep, setCurrentStep] = useState('loading') // loading, login, register, age-verification, survey, complete
  const [userProfile, setUserProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check user status and determine which step to show
  useEffect(() => {
    const checkUserStatus = async () => {
      if (authLoading) return

      if (!user) {
        setCurrentStep('login')
        setLoading(false)
        return
      }

      try {
        // Get user profile from database
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Profile fetch error:', error)
          setCurrentStep('age-verification')
          setLoading(false)
          return
        }

        setUserProfile(profile)

        if (!profile) {
          // No profile exists, start with age verification
          setCurrentStep('age-verification')
        } else if (!profile.age_verified) {
          // Profile exists but age not verified
          setCurrentStep('age-verification')
        } else if (!profile.survey_completed) {
          // Age verified but survey not completed
          setCurrentStep('survey')
        } else {
          // Everything completed, redirect to dashboard
          setCurrentStep('complete')
          navigate('/dashboard')
        }
      } catch (error) {
        console.error('User status check error:', error)
        setCurrentStep('age-verification')
      } finally {
        setLoading(false)
      }
    }

    checkUserStatus()
  }, [user, authLoading, navigate])

  // Handle successful registration
  const handleRegistrationSuccess = (userData) => {
    console.log('Registration successful:', userData)
    setCurrentStep('age-verification')
  }

  // Handle successful login
  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData)
    // The useEffect will handle checking user status and redirecting
  }

  // Handle age verification completion
  const handleAgeVerificationComplete = (verificationData) => {
    console.log('Age verification completed:', verificationData)
    setCurrentStep('survey')
  }

  // Handle survey completion
  const handleSurveyComplete = (surveyData) => {
    console.log('Survey completed:', surveyData)
    setCurrentStep('complete')
    navigate('/dashboard')
  }

  // Handle going back from age verification to login
  const handleBackToLogin = () => {
    setCurrentStep('login')
  }

  // Handle going back from survey to age verification
  const handleBackToAgeVerification = () => {
    setCurrentStep('age-verification')
  }

  // Switch between login and register
  const switchToRegister = () => {
    setCurrentStep('register')
  }

  const switchToLogin = () => {
    setCurrentStep('login')
  }

  // Show loading spinner
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Render appropriate step
  switch (currentStep) {
    case 'login':
      return (
        <LoginForm 
          onLoginSuccess={handleLoginSuccess}
          onSwitchToRegister={switchToRegister}
        />
      )

    case 'register':
      return (
        <RegisterForm 
          onRegistrationSuccess={handleRegistrationSuccess}
          onSwitchToLogin={switchToLogin}
        />
      )

    case 'age-verification':
      return (
        <AgeVerification 
          onVerificationComplete={handleAgeVerificationComplete}
          onBack={handleBackToLogin}
        />
      )

    case 'survey':
      return (
        <SurveyComponent 
          onSurveyComplete={handleSurveyComplete}
          onBack={handleBackToAgeVerification}
        />
      )

    case 'complete':
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Dashboard'a yönlendiriliyorsunuz...</p>
          </div>
        </div>
      )

    default:
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Bilinmeyen durum: {currentStep}</p>
          </div>
        </div>
      )
  }
}

export default AuthFlow
