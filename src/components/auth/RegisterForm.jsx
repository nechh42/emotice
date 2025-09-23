// EMOTICE - Register Form with Age Verification
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, User, Mail, Calendar, Lock, AlertCircle, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'

// Validation schema
const registerSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z.string()
    .email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase and number'),
  confirmPassword: z.string(),
  birthDate: z.string()
    .min(1, 'Birth date is required'),
  termsAccepted: z.boolean()
    .refine(val => val === true, 'You must accept the terms and conditions'),
  privacyAccepted: z.boolean()
    .refine(val => val === true, 'You must accept the privacy policy'),
  medicalDisclaimer: z.boolean()
    .refine(val => val === true, 'You must acknowledge the medical disclaimer'),
  ageConfirmation: z.boolean()
    .refine(val => val === true, 'You must confirm you are 16 or older')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')

  const { signUp, recordConsent } = useAuth()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid }
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange'
  })

  // Watch birth date for age calculation
  const watchedBirthDate = watch('birthDate')

  // Calculate age
  const calculateAge = (birthDate) => {
    if (!birthDate) return 0
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  }

  const currentAge = calculateAge(watchedBirthDate)
  const isUnderAge = watchedBirthDate && currentAge < 16

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setSubmitError('')
      setSubmitSuccess('')

      // Final age check
      if (currentAge < 16) {
        setSubmitError('You must be at least 16 years old to register.')
        return
      }

      // Sign up user
      const { data: authData, error } = await signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        birthDate: data.birthDate
      })

      if (error) {
        setSubmitError(error.message)
        return
      }

      // Record legal consents
      if (authData?.user) {
        await Promise.all([
          recordConsent('terms_of_service', '1.0'),
          recordConsent('privacy_policy', '1.0'),
          recordConsent('age_verification', '1.0'),
          recordConsent('medical_disclaimer', '1.0')
        ])
      }

      setSubmitSuccess('Registration successful! Please check your email for verification.')
      
      // Call success callback
      if (onSuccess) {
        setTimeout(() => onSuccess(authData), 2000)
      }

    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.')
      console.error('Registration error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Emotice</h1>
          <p className="text-gray-600">Create your account to start your emotional wellness journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('fullName')}
                type="text"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.fullName ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your full name"
              />
            </div>
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.fullName.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('email')}
                type="email"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Birth Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Birth Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('birthDate')}
                type="date"
                max={new Date().toISOString().split('T')[0]}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.birthDate || isUnderAge ? 'border-red-300' : 'border-gray-300'
                }`}
              />
            </div>
            {watchedBirthDate && (
              <p className={`mt-1 text-sm flex items-center gap-1 ${
                isUnderAge ? 'text-red-600' : 'text-green-600'
              }`}>
                {isUnderAge ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Age {currentAge}: You must be at least 16 years old
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Age {currentAge}: Eligible for registration
                  </>
                )}
              </p>
            )}
            {errors.birthDate && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.birthDate.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.password ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors ${
                  errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Legal Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <input
                {...register('ageConfirmation')}
                type="checkbox"
                className="mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="text-sm text-gray-700">
                <span className="font-medium">I confirm that I am 16 years of age or older.</span>
              </label>
            </div>
            {errors.ageConfirmation && (
              <p className="text-sm text-red-600 ml-6">{errors.ageConfirmation.message}</p>
            )}

            <div className="flex items-start gap-3">
              <input
                {...register('termsAccepted')}
                type="checkbox"
                className="mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="text-sm text-gray-700">
                I agree to the{' '}
                <a href="/terms" className="text-primary-600 hover:text-primary-700 underline">
                  Terms of Service
                </a>
              </label>
            </div>
            {errors.termsAccepted && (
              <p className="text-sm text-red-600 ml-6">{errors.termsAccepted.message}</p>
            )}

            <div className="flex items-start gap-3">
              <input
                {...register('privacyAccepted')}
                type="checkbox"
                className="mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="text-sm text-gray-700">
                I agree to the{' '}
                <a href="/privacy" className="text-primary-600 hover:text-primary-700 underline">
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.privacyAccepted && (
              <p className="text-sm text-red-600 ml-6">{errors.privacyAccepted.message}</p>
            )}

            <div className="flex items-start gap-3">
              <input
                {...register('medicalDisclaimer')}
                type="checkbox"
                className="mt-1 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <label className="text-sm text-gray-700">
                <span className="font-medium">I understand that Emotice does not provide medical advice</span> and is for wellness tracking purposes only. For mental health concerns, I will consult qualified professionals.
              </label>
            </div>
            {errors.medicalDisclaimer && (
              <p className="text-sm text-red-600 ml-6">{errors.medicalDisclaimer.message}</p>
            )}
          </div>

          {/* Error/Success Messages */}
          {submitError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                {submitError}
              </p>
            </div>
          )}

          {submitSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-600 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {submitSuccess}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !isValid || isUnderAge}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
              isSubmitting || !isValid || isUnderAge
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Switch to Login */}
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Sign in here
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}

export default RegisterForm