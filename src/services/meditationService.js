// src/services/meditationService.js
import { supabase } from '../lib/supabase'

export const meditationService = {
  // Meditasyon seansını kaydetme
  saveMeditationSession: async (sessionData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('meditation_sessions')
        .insert({
          user_id: user.id,
          session_type: sessionData.type, // 'breathing', 'guided', 'custom'
          pattern: sessionData.pattern, // 'box', 'relaxing', etc.
          duration: sessionData.duration, // saniye cinsinden
          completed: sessionData.completed,
          breath_count: sessionData.breathCount || 0,
          background_sound: sessionData.backgroundSound || 'none',
          session_data: sessionData.additionalData || {},
          created_at: new Date().toISOString()
        })

      if (error) throw error

      // Streak hesaplama
      await this.updateMeditationStreak(user.id)
      
      return { success: true, data }
    } catch (error) {
      console.error('Error saving meditation session:', error)
      return { success: false, error: error.message }
    }
  },

  // Kullanıcının meditasyon geçmişini getirme
  getMeditationHistory: async (limit = 30) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching meditation history:', error)
      return { success: false, error: error.message }
    }
  },

  // Meditasyon istatistikleri
  getMeditationStats: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)

      if (error) throw error

      const now = new Date()
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const stats = {
        totalSessions: data.length,
        totalMinutes: Math.round(data.reduce((sum, session) => sum + session.duration, 0) / 60),
        completedSessions: data.filter(session => session.completed).length,
        currentStreak: await this.getCurrentStreak(user.id),
        thisWeekSessions: data.filter(session => 
          new Date(session.created_at) >= thisWeek
        ).length,
        thisMonthSessions: data.filter(session => 
          new Date(session.created_at) >= thisMonth
        ).length,
        favoritePattern: this.getMostUsedPattern(data),
        averageSessionLength: data.length > 0 ? 
          Math.round(data.reduce((sum, session) => sum + session.duration, 0) / data.length / 60) : 0,
        longestSession: data.length > 0 ? 
          Math.max(...data.map(session => session.duration)) : 0,
        firstSession: data.length > 0 ? data[data.length - 1].created_at : null
      }

      return { success: true, data: stats }
    } catch (error) {
      console.error('Error fetching meditation stats:', error)
      return { success: false, error: error.message }
    }
  },

  // En çok kullanılan pattern
  getMostUsedPattern: (sessions) => {
    const patternCounts = {}
    sessions.forEach(session => {
      const pattern = session.pattern || 'unknown'
      patternCounts[pattern] = (patternCounts[pattern] || 0) + 1
    })

    const patterns = {
      'box': '4-4-4-4 Box Breathing',
      'relaxing': '4-7-8 Relaxing',
      'energizing': '6-2-6-2 Energizing',
      'calming': '3-3-3-3 Calming'
    }

    const mostUsed = Object.keys(patternCounts).reduce((a, b) => 
      patternCounts[a] > patternCounts[b] ? a : b, 'box'
    )

    return patterns[mostUsed] || 'Bilinmeyen'
  },

  // Streak güncelleme
  updateMeditationStreak: async (userId) => {
    try {
      // Son 2 günün verilerini al
      const twoDaysAgo = new Date()
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('created_at')
        .eq('user_id', userId)
        .gte('created_at', twoDaysAgo.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error

      // Günlük streak hesaplama
      const dailySessions = {}
      data.forEach(session => {
        const date = new Date(session.created_at).toDateString()
        dailySessions[date] = true
      })

      const streak = this.calculateStreak(Object.keys(dailySessions))
      
      // Streak'i kullanıcı profilinde güncelle
      await supabase
        .from('profiles')
        .update({ meditation_streak: streak })
        .eq('id', userId)

      return streak
    } catch (error) {
      console.error('Error updating meditation streak:', error)
      return 0
    }
  },

  // Streak hesaplama
  calculateStreak: (sessionDates) => {
    if (sessionDates.length === 0) return 0

    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()

    // Bugün veya dün session var mı?
    if (!sessionDates.includes(today) && !sessionDates.includes(yesterday)) {
      return 0
    }

    let streak = 0
    let currentDate = new Date()

    while (true) {
      const dateString = currentDate.toDateString()
      if (sessionDates.includes(dateString)) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }

    return streak
  },

  // Güncel streak'i getirme
  getCurrentStreak: async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('meditation_streak')
        .eq('id', userId)
        .single()

      if (error) throw error
      return data?.meditation_streak || 0
    } catch (error) {
      console.error('Error getting current streak:', error)
      return 0
    }
  },

  // Haftalık ilerleme raporu
  getWeeklyProgress: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)

      const { data, error } = await supabase
        .from('meditation_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', weekAgo.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Günlük breakdown
      const dailyData = Array.from({ length: 7 }, (_, i) => {
        const date = new Date()
        date.setDate(date.getDate() - 6 + i)
        return {
          date: date.toDateString(),
          day: date.toLocaleDateString('tr-TR', { weekday: 'short' }),
          sessions: 0,
          minutes: 0
        }
      })

      data.forEach(session => {
        const sessionDate = new Date(session.created_at).toDateString()
        const dayData = dailyData.find(day => day.date === sessionDate)
        if (dayData) {
          dayData.sessions++
          dayData.minutes += Math.round(session.duration / 60)
        }
      })

      return { success: true, data: dailyData }
    } catch (error) {
      console.error('Error fetching weekly progress:', error)
      return { success: false, error: error.message }
    }
  },

  // Achievement kontrolü
  checkAchievements: async (sessionData) => {
    try {
      const stats = await this.getMeditationStats()
      if (!stats.success) return { achievements: [] }

      const achievements = []
      const { data } = stats

      // İlk kez achievement
      if (data.totalSessions === 1) {
        achievements.push({
          id: 'first_meditation',
          title: 'İlk Adım',
          description: 'İlk meditasyon seansınızı tamamladınız!',
          icon: '🌱',
          type: 'milestone'
        })
      }

      // 7 günlük streak
      if (data.currentStreak === 7) {
        achievements.push({
          id: 'week_streak',
          title: '7 Gün Seri',
          description: '7 gün üst üste meditasyon yaptınız!',
          icon: '🔥',
          type: 'streak'
        })
      }

      // 30 gün streak
      if (data.currentStreak === 30) {
        achievements.push({
          id: 'month_streak',
          title: 'Bir Ay Seri',
          description: '30 gün üst üste meditasyon yaptınız!',
          icon: '💎',
          type: 'streak'
        })
      }

      // 10 saat toplam
      if (data.totalMinutes >= 600 && data.totalMinutes < 610) {
        achievements.push({
          id: 'ten_hours',
          title: '10 Saat Tamamlandı',
          description: 'Toplam 10 saat meditasyon yaptınız!',
          icon: '⏰',
          type: 'duration'
        })
      }

      // Uzun session (20+ dakika)
      if (sessionData.duration >= 1200) {
        achievements.push({
          id: 'long_session',
          title: 'Derin Dalış',
          description: '20+ dakikalık uzun session tamamladınız!',
          icon: '🧘‍♀️',
          type: 'session'
        })
      }

      return { achievements }
    } catch (error) {
      console.error('Error checking achievements:', error)
      return { achievements: [] }
    }
  }
}