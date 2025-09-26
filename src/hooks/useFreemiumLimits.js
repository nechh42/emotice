// src/hooks/useFreemiumLimits.js
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'

export const useFreemiumLimits = () => {
  const { user, userProfile } = useAuth()
  const [limits, setLimits] = useState({})
  const [usage, setUsage] = useState({})

  const isPremium = userProfile?.subscription_status === 'active'
  const isTrialActive = checkTrialStatus()

  // Free kullanıcı limitleri
  const FREE_LIMITS = {
    // Fal limitleri (günlük)
    tarot_daily: 2,
    astrology_daily: 1,
    numerology_monthly: 1,
    
    // Meditasyon limitleri (günlük)
    meditation_sessions_daily: 3,
    meditation_patterns: ['box', 'calming'], // Sadece 2 temel pattern
    
    // Motivasyon limitleri (günlük)
    motivation_messages_daily: 5,
    
    // Müzik limitleri
    music_categories: ['happy', 'sad', 'calm'], // Sadece 3 temel kategori
    music_plays_daily: 10,
    
    // Genel özellikler
    mood_entries_daily: 5,
    data_export: false, // Free kullanıcı export edemez
    ads_free: false // Free kullanıcı reklam görür
  }

  // Premium kullanıcı özellikleri (sınırsız)
  const PREMIUM_FEATURES = {
    // Sınırsız erişim
    unlimited_access: true,
    
    // Premium-only özellikler
    advanced_analytics: true,
    custom_meditation_sounds: true,
    partner_compatibility: true,
    priority_support: true,
    ad_free: true,
    data_export: true,
    
    // Premium müzik kategorileri
    premium_music_categories: ['energetic', 'romantic', 'focus', 'sleep', 'meditation'],
    
    // Premium meditasyon desenleri
    premium_meditation_patterns: ['relaxing', 'energizing'],
    
    // Premium fal özellikleri
    detailed_interpretations: true,
    compatibility_analysis: true,
    yearly_predictions: true
  }

  // 3 günlük trial kontrolü
  function checkTrialStatus() {
    if (isPremium) return false
    if (!user) return false

    const registrationDate = new Date(user.created_at)
    const now = new Date()
    const daysSinceRegistration = Math.floor((now - registrationDate) / (1000 * 60 * 60 * 24))
    
    return daysSinceRegistration <= 3
  }

  // Günlük kullanım verilerini localStorage'dan al
  const getTodayUsage = (feature) => {
    const today = new Date().toDateString()
    const storageKey = `emotice_usage_${feature}_${today}`
    return parseInt(localStorage.getItem(storageKey) || '0')
  }

  // Aylık kullanım kontrolü
  const getMonthlyUsage = (feature) => {
    const thisMonth = new Date().toISOString().slice(0, 7) // YYYY-MM
    const storageKey = `emotice_usage_${feature}_${thisMonth}`
    return parseInt(localStorage.getItem(storageKey) || '0')
  }

  // Kullanım artırma
  const incrementUsage = (feature, isMonthly = false) => {
    const today = new Date().toDateString()
    const period = isMonthly ? new Date().toISOString().slice(0, 7) : today
    const storageKey = `emotice_usage_${feature}_${period}`
    
    const currentUsage = parseInt(localStorage.getItem(storageKey) || '0')
    localStorage.setItem(storageKey, (currentUsage + 1).toString())
    
    // State güncelle
    setUsage(prev => ({
      ...prev,
      [feature]: currentUsage + 1
    }))
  }

  // Özellik erişim kontrolü
  const canUseFeature = (feature, isMonthly = false) => {
    // Premium veya trial kullanıcıları her şeyi kullanabilir
    if (isPremium || isTrialActive) return { allowed: true, remaining: 'unlimited' }

    // Free kullanıcı kontrolleri
    const limit = FREE_LIMITS[`${feature}_${isMonthly ? 'monthly' : 'daily'}`]
    if (!limit) return { allowed: true, remaining: 'unlimited' } // Limit tanımlı değilse serbest

    const currentUsage = isMonthly ? getMonthlyUsage(feature) : getTodayUsage(feature)
    const remaining = Math.max(0, limit - currentUsage)
    
    return {
      allowed: currentUsage < limit,
      remaining,
      limit,
      used: currentUsage
    }
  }

  // Premium özellik kontrolü
  const canUsePremiumFeature = (feature) => {
    if (isPremium || isTrialActive) return true
    return false
  }

  // Müzik kategorisi erişim kontrolü
  const canUseMusicCategory = (category) => {
    if (isPremium || isTrialActive) return true
    return FREE_LIMITS.music_categories.includes(category)
  }

  // Meditasyon pattern erişim kontrolü
  const canUseMeditationPattern = (pattern) => {
    if (isPremium || isTrialActive) return true
    return FREE_LIMITS.meditation_patterns.includes(pattern)
  }

  // Limit aşıldığında gösterilecek mesaj
  const getLimitMessage = (feature) => {
    const limit = FREE_LIMITS[`${feature}_daily`] || FREE_LIMITS[`${feature}_monthly`]
    
    return {
      title: 'Günlük Limit Aşıldı',
      message: `Bugün ${limit} ${feature} hakkınızı kullandınız. Premium'a geçerek sınırsız erişim sağlayın!`,
      action: 'Premium\'a Geç',
      actionUrl: '/premium'
    }
  }

  // Trial bitiş uyarısı
  const getTrialWarning = () => {
    if (!isTrialActive) return null

    const registrationDate = new Date(user.created_at)
    const trialEndDate = new Date(registrationDate.getTime() + 3 * 24 * 60 * 60 * 1000)
    const remainingDays = Math.ceil((trialEndDate - new Date()) / (1000 * 60 * 60 * 24))

    return {
      message: `Premium deneme süreniz ${remainingDays} gün sonra sona erecek!`,
      remainingDays,
      action: 'Premium Satın Al'
    }
  }

  // Usage state'ini güncelle
  useEffect(() => {
    if (!user) return

    const currentUsage = {
      tarot: getTodayUsage('tarot'),
      astrology: getTodayUsage('astrology'),
      numerology: getMonthlyUsage('numerology'),
      meditation: getTodayUsage('meditation_sessions'),
      motivation: getTodayUsage('motivation_messages'),
      music: getTodayUsage('music_plays'),
      mood: getTodayUsage('mood_entries')
    }

    setUsage(currentUsage)
  }, [user])

  // Limit durumu state'ini güncelle
  useEffect(() => {
    const limitStatus = {
      tarot: canUseFeature('tarot'),
      astrology: canUseFeature('astrology'),
      numerology: canUseFeature('numerology', true),
      meditation: canUseFeature('meditation_sessions'),
      motivation: canUseFeature('motivation_messages'),
      music: canUseFeature('music_plays'),
      mood: canUseFeature('mood_entries')
    }

    setLimits(limitStatus)
  }, [usage, isPremium, isTrialActive])

  return {
    // Status
    isPremium,
    isTrialActive,
    
    // Limits and usage
    limits,
    usage,
    
    // Functions
    canUseFeature,
    canUsePremiumFeature,
    canUseMusicCategory,
    canUseMeditationPattern,
    incrementUsage,
    getLimitMessage,
    getTrialWarning,
    
    // Constants
    FREE_LIMITS,
    PREMIUM_FEATURES
  }
}