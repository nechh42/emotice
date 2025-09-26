// src/services/fortuneService.js
import { supabase } from '../lib/supabase'
import { generateNumerologyReport } from '../data/fortune/numerologyData'

export const fortuneService = {
  // Tarot fal kaydetme
  saveTarotReading: async (reading) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('fortune_readings')
        .insert({
          user_id: user.id,
          type: 'tarot',
          reading_data: reading,
          created_at: new Date().toISOString()
        })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error saving tarot reading:', error)
      return { success: false, error: error.message }
    }
  },

  // Astroloji fal kaydetme
  saveAstrologyReading: async (reading) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('fortune_readings')
        .insert({
          user_id: user.id,
          type: 'astrology',
          reading_data: reading,
          created_at: new Date().toISOString()
        })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error saving astrology reading:', error)
      return { success: false, error: error.message }
    }
  },

  // Numeroloji fal kaydetme
  saveNumerologyReading: async (birthDate, fullName) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Numeroloji hesaplaması
      const numerologyReport = generateNumerologyReport(birthDate, fullName)

      const reading = {
        birthDate,
        fullName,
        report: numerologyReport,
        timestamp: new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('fortune_readings')
        .insert({
          user_id: user.id,
          type: 'numerology',
          reading_data: reading,
          created_at: new Date().toISOString()
        })

      if (error) throw error
      return { success: true, data: reading }
    } catch (error) {
      console.error('Error saving numerology reading:', error)
      return { success: false, error: error.message }
    }
  },

  // Kullanıcının fal geçmişini getirme
  getUserReadings: async (type = null, limit = 10) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      let query = supabase
        .from('fortune_readings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (type) {
        query = query.eq('type', type)
      }

      const { data, error } = await query

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching user readings:', error)
      return { success: false, error: error.message }
    }
  },

  // Günlük fal limiti kontrolü
  checkDailyLimit: async (type) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Premium kullanıcı kontrolü
      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

      const isPremium = profile?.subscription_status === 'active'

      // Premium kullanıcılar için limit yok
      if (isPremium) {
        return { success: true, canRead: true, remainingReads: 'unlimited' }
      }

      // Free kullanıcılar için günlük limit kontrolü
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const { data, error } = await supabase
        .from('fortune_readings')
        .select('id')
        .eq('user_id', user.id)
        .eq('type', type)
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString())

      if (error) throw error

      const dailyLimits = {
        tarot: 3,
        astrology: 2,
        numerology: 1
      }

      const currentCount = data.length
      const limit = dailyLimits[type] || 1
      const canRead = currentCount < limit
      const remainingReads = Math.max(0, limit - currentCount)

      return { 
        success: true, 
        canRead, 
        remainingReads,
        dailyLimit: limit,
        currentCount
      }
    } catch (error) {
      console.error('Error checking daily limit:', error)
      return { success: false, error: error.message }
    }
  },

  // Numeroloji uyumluluk analizi
  checkNumerologyCompatibility: async (partnerBirthDate, partnerName) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Kullanıcının mevcut numeroloji verisini al
      const { data: userReadings } = await supabase
        .from('fortune_readings')
        .select('reading_data')
        .eq('user_id', user.id)
        .eq('type', 'numerology')
        .order('created_at', { ascending: false })
        .limit(1)

      if (!userReadings || userReadings.length === 0) {
        throw new Error('Önce kendi numeroloji analizinizi yaptırmalısınız')
      }

      const userNumerology = userReadings[0].reading_data.report
      const partnerNumerology = generateNumerologyReport(partnerBirthDate, partnerName)

      // Uyumluluk hesaplaması
      const { calculateCompatibility } = await import('../data/fortune/numerologyData')
      
      const compatibilityResult = calculateCompatibility(
        userNumerology.lifePath.number,
        partnerNumerology.lifePath.number
      )

      const compatibilityReport = {
        user: userNumerology,
        partner: partnerNumerology,
        compatibility: compatibilityResult,
        analysis: {
          lifePathCompatibility: calculateCompatibility(
            userNumerology.lifePath.number,
            partnerNumerology.lifePath.number
          ),
          destinyCompatibility: calculateCompatibility(
            userNumerology.destiny.number,
            partnerNumerology.destiny.number
          ),
          soulCompatibility: calculateCompatibility(
            userNumerology.soul.number,
            partnerNumerology.soul.number
          )
        }
      }

      // Uyumluluk raporunu kaydet
      const { data, error } = await supabase
        .from('fortune_readings')
        .insert({
          user_id: user.id,
          type: 'numerology_compatibility',
          reading_data: {
            partnerBirthDate,
            partnerName,
            report: compatibilityReport,
            timestamp: new Date().toISOString()
          },
          created_at: new Date().toISOString()
        })

      if (error) throw error
      return { success: true, data: compatibilityReport }
    } catch (error) {
      console.error('Error checking numerology compatibility:', error)
      return { success: false, error: error.message }
    }
  },

  // Fal istatistikleri
  getFortuneStats: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('fortune_readings')
        .select('type, created_at')
        .eq('user_id', user.id)

      if (error) throw error

      const stats = {
        total: data.length,
        tarot: data.filter(r => r.type === 'tarot').length,
        astrology: data.filter(r => r.type === 'astrology').length,
        numerology: data.filter(r => r.type === 'numerology').length,
        compatibility: data.filter(r => r.type === 'numerology_compatibility').length,
        thisMonth: data.filter(r => {
          const readingDate = new Date(r.created_at)
          const thisMonth = new Date()
          return readingDate.getMonth() === thisMonth.getMonth() && 
                 readingDate.getFullYear() === thisMonth.getFullYear()
        }).length,
        firstReading: data.length > 0 ? new Date(data[data.length - 1].created_at) : null,
        lastReading: data.length > 0 ? new Date(data[0].created_at) : null
      }

      return { success: true, data: stats }
    } catch (error) {
      console.error('Error fetching fortune stats:', error)
      return { success: false, error: error.message }
    }
  }
}