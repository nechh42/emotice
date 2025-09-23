import { useState, useEffect, useContext, createContext } from 'react'
import { supabase } from '../lib/supabase'

// Auth Context
const AuthContext = createContext({})

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Error getting session:', error)
        }
        
        setSession(session)
        setUser(session?.user ?? null)
      } catch (error) {
        console.error('Session fetch error:', error)
        setUser(null)
        setSession(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)

        // Handle different auth events
        switch (event) {
          case 'SIGNED_IN':
            console.log('User signed in:', session?.user?.email)
            break
          case 'SIGNED_OUT':
            console.log('User signed out')
            break
          case 'TOKEN_REFRESHED':
            console.log('Token refreshed for user:', session?.user?.email)
            break
          case 'USER_UPDATED':
            console.log('User updated:', session?.user?.email)
            break
          default:
            break
        }
      }
    )

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  // Sign up function
  const signUp = async (email, password, userData = {}) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  // Sign in function
  const signIn = async (email, password) => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { data: null, error }
    } finally {
      setLoading(false)
    }
  }

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true)
      
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error

      // Clear local state
      setUser(null)
      setSession(null)

      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error }
    } finally {
      setLoading(false)
    }
  }

  // Reset password function
  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Reset password error:', error)
      return { error }
    }
  }

  // Update user function
  const updateUser = async (updates) => {
    try {
      const { data, error } = await supabase.auth.updateUser(updates)

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Update user error:', error)
      return { data: null, error }
    }
  }

  // Get user profile
  const getUserProfile = async () => {
    if (!user) return { data: null, error: 'No user logged in' }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      return { data, error }
    } catch (error) {
      console.error('Get user profile error:', error)
      return { data: null, error }
    }
  }

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!session
  }

  // Check if user has completed onboarding
  const hasCompletedOnboarding = async () => {
    if (!user) return false

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('age_verified, survey_completed')
        .eq('id', user.id)
        .single()

      if (error) return false

      return data?.age_verified && data?.survey_completed
    } catch (error) {
      console.error('Onboarding check error:', error)
      return false
    }
  }

  const value = {
    // State
    user,
    session,
    loading,
    
    // Methods
    signUp,
    signIn,
    signOut,
    resetPassword,
    updateUser,
    getUserProfile,
    isAuthenticated,
    hasCompletedOnboarding
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// useAuth Hook
export const useAuth = () => {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export default AuthContext