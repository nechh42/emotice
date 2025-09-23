import { createClient } from '@supabase/supabase-js'

// Environment variables kontrolü
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL veya Anon Key eksik! .env dosyasını kontrol edin.')
}

// Supabase client oluştur
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Auth helper functions
export const authHelpers = {
  // Kullanıcı kayıt
  async signUp(email, password, userData = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData
        }
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Kullanıcı giriş
  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Çıkış yap
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (error) {
      return { error }
    }
  },

  // Mevcut kullanıcı bilgisi al
  getCurrentUser() {
    return supabase.auth.getUser()
  },

  // Session dinle
  onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Database helper functions
export const dbHelpers = {
  // Profile oluştur/güncelle
  async upsertProfile(userId, profileData) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .select()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Mood entry kaydet
  async insertMoodEntry(userId, moodData) {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: userId,
          ...moodData,
          created_at: new Date().toISOString()
        })
        .select()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Kullanıcının mood geçmişi al
  async getMoodHistory(userId, limit = 30) {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Survey sonuçları kaydet
  async saveSurveyResults(userId, surveyData) {
    try {
      const { data, error } = await supabase
        .from('survey_results')
        .insert({
          user_id: userId,
          ...surveyData,
          created_at: new Date().toISOString()
        })
        .select()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  },

  // Premium subscription kaydet
  async updateSubscription(userId, subscriptionData) {
    try {
      const { data, error } = await supabase
        .from('subscriptions')
        .upsert({
          user_id: userId,
          ...subscriptionData,
          updated_at: new Date().toISOString()
        })
        .select()
      return { data, error }
    } catch (error) {
      return { data: null, error }
    }
  }
}

// Real-time subscriptions
export const realtimeHelpers = {
  // Mood entries'i real-time dinle
  subscribeMoodEntries(userId, callback) {
    return supabase
      .channel(`mood_entries_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'mood_entries',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  // Subscription değişikliklerini dinle
  subscribeUserSubscription(userId, callback) {
    return supabase
      .channel(`subscription_${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  }
}

// Utility functions
export const utils = {
  // Supabase bağlantı durumunu test et
  async testConnection() {
    try {
      const { data, error } = await supabase.from('profiles').select('count').limit(1)
      return { connected: !error, error }
    } catch (error) {
      return { connected: false, error }
    }
  },

  // Storage'a dosya yükle (profil resmi için)
  async uploadAvatar(userId, file) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}/avatar.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        })
      
      if (error) throw error
      
      // Public URL al
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
        
      return { data: { path: fileName, url: publicUrl }, error: null }
    } catch (error) {
      return { data: null, error }
    }
  }
}

export default supabase