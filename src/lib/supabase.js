// EMOTICE - Supabase Client Configuration
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Supabase client with optimal configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // More secure auth flow
  },
  db: {
    schema: 'public'
  },
  global: {
    headers: {
      'x-application-name': 'emotice'
    }
  }
})

// Auth helper functions
export const auth = {
  // Sign up with email and password + age verification
  signUp: async (email, password, userData) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          ...userData,
          age_verified: userData.birthDate ? calculateAge(userData.birthDate) >= 16 : false
        }
      }
    })
    return { data, error }
  },

  // Sign in
  signIn: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  // Sign out
  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  // Get current user
  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Get current session
  getSession: async () => {
    const { data: { session }, error } = await supabase.auth.getSession()
    return { session, error }
  }
}

// Database helper functions
export const db = {
  // Profiles
  profiles: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()
      return { data, error }
    },

    update: async (userId, updates) => {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
      return { data, error }
    },

    delete: async (userId) => {
      const { data, error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId)
      return { data, error }
    }
  },

  // Mood entries
  moods: {
    create: async (moodData) => {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert(moodData)
        .select()
      return { data, error }
    },

    getByUser: async (userId, limit = 30) => {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      return { data, error }
    },

    getByDateRange: async (userId, startDate, endDate) => {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .order('created_at', { ascending: false })
      return { data, error }
    },

    update: async (moodId, updates) => {
      const { data, error } = await supabase
        .from('mood_entries')
        .update(updates)
        .eq('id', moodId)
        .select()
      return { data, error }
    },

    delete: async (moodId) => {
      const { data, error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', moodId)
      return { data, error }
    }
  },

  // Subscriptions
  subscriptions: {
    get: async (userId) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', userId)
        .single()
      return { data, error }
    },

    create: async (subscriptionData) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert(subscriptionData)
        .select()
      return { data, error }
    },

    update: async (userId, updates) => {
      const { data, error } = await supabase
        .from('subscriptions')
        .update(updates)
        .eq('user_id', userId)
        .select()
      return { data, error }
    }
  },

  // Survey responses
  surveys: {
    create: async (surveyData) => {
      const { data, error } = await supabase
        .from('survey_responses')
        .insert(surveyData)
        .select()
      return { data, error }
    },

    get: async (userId) => {
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*')
        .eq('user_id', userId)
        .single()
      return { data, error }
    }
  }
}

// Utility functions
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

// Real-time subscriptions
export const realtime = {
  // Subscribe to mood updates
  subscribeMoodUpdates: (userId, callback) => {
    return supabase
      .channel(`mood-updates-${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'mood_entries',
        filter: `user_id=eq.${userId}`
      }, callback)
      .subscribe()
  },

  // Unsubscribe from channel
  unsubscribe: (subscription) => {
    return supabase.removeChannel(subscription)
  }
}

export default supabase