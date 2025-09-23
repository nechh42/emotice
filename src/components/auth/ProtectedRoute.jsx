// EMOTICE - Protected Route Component
import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

// Loading spinner component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-primary-200 border-t-primary-600 mb-4"></div>
      <p className="text-gray-600 font-medium">Loading your account...</p>
    </div>
  </div>
)

// Survey required component
const SurveyRequired = () => (
  <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
        <p className="text-gray-600">
          To provide you with personalized recommendations and ensure your safety, 
          please complete our brief wellness assessment.
        </p>
      </div>
      
      <button
        onClick={() => window.location.href = '/survey'}
        className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
      >
        Complete Assessment
      </button>
      
      <p className="text-xs text-gray-500 mt-4">
        This assessment helps us provide better support and ensures compliance with safety guidelines.
      </p>
    </div>
  </div>
)

// Age verification required component
const AgeVerificationRequired = () => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 19c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Age Verification Required</h2>
        <p className="text-gray-600">
          Your account requires age verification to continue. Please contact support 
          or update your profile with valid age verification.
        </p>
      </div>
      
      <div className="space-y-3">
        <button
          onClick={() => window.location.href = '/profile/settings'}
          className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Update Profile
        </button>
        
        <button
          onClick={() => window.location.href = '/support'}
          className="w-full border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          Contact Support
        </button>
      </div>
    </div>
  </div>
)

const ProtectedRoute = ({ 
  children, 
  requireAuth = true,
  requireAgeVerification = true,
  requireSurvey = false,
  requirePremium = false,
  fallbackPath = '/auth'
}) => {
  const { 
    user, 
    profile, 
    loading, 
    isAuthenticated, 
    isAgeVerified, 
    isSurveyCompleted, 
    isPremium 
  } = useAuth()
  
  const location = useLocation()
  const [redirecting, setRedirecting] = useState(false)

  // Show loading spinner while auth state is being determined
  if (loading || redirecting) {
    return <LoadingSpinner />
  }

  // Check authentication requirement
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />
  }

  // Skip additional checks if user is not authenticated
  if (!isAuthenticated) {
    return children
  }

  // Check age verification requirement
  if (requireAgeVerification && !isAgeVerified) {
    return <AgeVerificationRequired />
  }

  // Check survey completion requirement
  if (requireSurvey && !isSurveyCompleted) {
    return <SurveyRequired />
  }

  // Check premium requirement
  if (requirePremium && !isPremium) {
    return <Navigate to="/upgrade" state={{ from: location }} replace />
  }

  // All requirements met, render children
  return children
}

// Higher-order component for easy route protection
export const withAuth = (Component, options = {}) => {
  return function AuthenticatedComponent(props) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Predefined route protectors
export const PublicRoute = ({ children }) => (
  <ProtectedRoute requireAuth={false}>
    {children}
  </ProtectedRoute>
)

export const AuthenticatedRoute = ({ children }) => (
  <ProtectedRoute 
    requireAuth={true} 
    requireAgeVerification={true}
  >
    {children}
  </ProtectedRoute>
)

export const CompleteProfileRoute = ({ children }) => (
  <ProtectedRoute 
    requireAuth={true} 
    requireAgeVerification={true}
    requireSurvey={true}
  >
    {children}
  </ProtectedRoute>
)

export const PremiumRoute = ({ children }) => (
  <ProtectedRoute 
    requireAuth={true} 
    requireAgeVerification={true}
    requireSurvey={true}
    requirePremium={true}
  >
    {children}
  </ProtectedRoute>
)

export default ProtectedRoute