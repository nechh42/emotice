// EMOTICE - Mood Tracking Service
import { supabase } from './supabase'

export const moodService = {
  // Create new mood entry
  createMoodEntry: async (moodData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const moodEntry = {
        user_id: user.id,
        mood_score: moodData.moodScore,
        mood_emoji: moodData.moodEmoji,
        notes: moodData.notes || null,
        tags: moodData.tags || [],
        context: {
          location: moodData.location || null,
          weather: moodData.weather || null,
          activities: moodData.activities || [],
          energy_level: moodData.energyLevel || null,
          sleep_quality: moodData.sleepQuality || null,
          stress_level: moodData.stressLevel || null
        }
      }

      const { data, error } = await supabase
        .from('mood_entries')
        .insert(moodEntry)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error creating mood entry:', error)
      return { data: null, error }
    }
  },

  // Get mood entries for user with pagination
  getUserMoodEntries: async (userId, options = {}) => {
    try {
      const {
        limit = 30,
        offset = 0,
        startDate = null,
        endDate = null,
        minScore = null,
        maxScore = null,
        tags = null
      } = options

      let query = supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      // Date filtering
      if (startDate) {
        query = query.gte('created_at', startDate)
      }
      if (endDate) {
        query = query.lte('created_at', endDate)
      }

      // Score filtering
      if (minScore !== null) {
        query = query.gte('mood_score', minScore)
      }
      if (maxScore !== null) {
        query = query.lte('mood_score', maxScore)
      }

      // Tags filtering
      if (tags && tags.length > 0) {
        query = query.contains('tags', tags)
      }

      // Pagination
      if (limit) {
        query = query.limit(limit)
      }
      if (offset) {
        query = query.range(offset, offset + limit - 1)
      }

      const { data, error } = await query

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching mood entries:', error)
      return { data: null, error }
    }
  },

  // Update mood entry
  updateMoodEntry: async (entryId, updates) => {
    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', entryId)
        .select()
        .single()

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error updating mood entry:', error)
      return { data: null, error }
    }
  },

  // Delete mood entry
  deleteMoodEntry: async (entryId) => {
    try {
      const { error } = await supabase
        .from('mood_entries')
        .delete()
        .eq('id', entryId)

      if (error) throw error

      return { error: null }
    } catch (error) {
      console.error('Error deleting mood entry:', error)
      return { error }
    }
  },

  // Get mood statistics
  getMoodStats: async (userId, timeframe = '30days') => {
    try {
      let startDate = new Date()
      
      switch (timeframe) {
        case '7days':
          startDate.setDate(startDate.getDate() - 7)
          break
        case '30days':
          startDate.setDate(startDate.getDate() - 30)
          break
        case '90days':
          startDate.setDate(startDate.getDate() - 90)
          break
        case '1year':
          startDate.setFullYear(startDate.getFullYear() - 1)
          break
        default:
          startDate.setDate(startDate.getDate() - 30)
      }

      const { data, error } = await supabase
        .from('mood_entries')
        .select('mood_score, created_at, tags')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      if (!data || data.length === 0) {
        return {
          data: {
            totalEntries: 0,
            averageMood: 0,
            highestMood: 0,
            lowestMood: 0,
            moodTrend: 'stable',
            commonTags: [],
            dailyAverages: []
          },
          error: null
        }
      }

      // Calculate statistics
      const scores = data.map(entry => entry.mood_score)
      const totalEntries = data.length
      const averageMood = scores.reduce((sum, score) => sum + score, 0) / totalEntries
      const highestMood = Math.max(...scores)
      const lowestMood = Math.min(...scores)

      // Calculate mood trend (simple: compare first half vs second half)
      const midpoint = Math.floor(totalEntries / 2)
      const firstHalfAvg = scores.slice(0, midpoint).reduce((sum, score) => sum + score, 0) / midpoint
      const secondHalfAvg = scores.slice(midpoint).reduce((sum, score) => sum + score, 0) / (totalEntries - midpoint)
      
      let moodTrend = 'stable'
      if (secondHalfAvg > firstHalfAvg + 0.5) moodTrend = 'improving'
      else if (secondHalfAvg < firstHalfAvg - 0.5) moodTrend = 'declining'

      // Get common tags
      const allTags = data.flatMap(entry => entry.tags || [])
      const tagCounts = allTags.reduce((counts, tag) => {
        counts[tag] = (counts[tag] || 0) + 1
        return counts
      }, {})
      
      const commonTags = Object.entries(tagCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5)
        .map(([tag, count]) => ({ tag, count }))

      // Calculate daily averages for chart
      const dailyAverages = {}
      data.forEach(entry => {
        const date = new Date(entry.created_at).toISOString().split('T')[0]
        if (!dailyAverages[date]) {
          dailyAverages[date] = { total: 0, count: 0 }
        }
        dailyAverages[date].total += entry.mood_score
        dailyAverages[date].count += 1
      })

      const chartData = Object.entries(dailyAverages)
        .map(([date, { total, count }]) => ({
          date,
          average: Math.round((total / count) * 10) / 10
        }))
        .sort((a, b) => a.date.localeCompare(b.date))

      const stats = {
        totalEntries,
        averageMood: Math.round(averageMood * 10) / 10,
        highestMood,
        lowestMood,
        moodTrend,
        commonTags,
        dailyAverages: chartData
      }

      return { data: stats, error: null }
    } catch (error) {
      console.error('Error calculating mood stats:', error)
      return { data: null, error }
    }
  },

  // Get mood entries for specific date
  getMoodEntriesForDate: async (userId, date) => {
    try {
      const startDate = new Date(date)
      startDate.setHours(0, 0, 0, 0)
      
      const endDate = new Date(date)
      endDate.setHours(23, 59, 59, 999)

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false })

      if (error) throw error

      return { data, error: null }
    } catch (error) {
      console.error('Error fetching mood entries for date:', error)
      return { data: null, error }
    }
  },

  // Export mood data
  exportMoodData: async (userId, format = 'json', startDate = null, endDate = null) => {
    try {
      let query = supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (startDate) {
        query = query.gte('created_at', startDate)
      }
      if (endDate) {
        query = query.lte('created_at', endDate)
      }

      const { data, error } = await supabase.from('mood_entries')
        .select('mood_score, mood_emoji, notes, tags, context, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })

      if (error) throw error

      if (format === 'csv') {
        const headers = ['Date', 'Time', 'Mood Score', 'Emoji', 'Notes', 'Tags', 'Energy Level', 'Sleep Quality', 'Stress Level']
        const csvData = data.map(entry => {
          const date = new Date(entry.created_at)
          return [
            date.toISOString().split('T')[0],
            date.toTimeString().split(' ')[0],
            entry.mood_score,
            entry.mood_emoji || '',
            (entry.notes || '').replace(/"/g, '""'),
            (entry.tags || []).join('; '),
            entry.context?.energy_level || '',
            entry.context?.sleep_quality || '',
            entry.context?.stress_level || ''
          ]
        })

        const csvContent = [headers, ...csvData]
          .map(row => row.map(field => `"${field}"`).join(','))
          .join('\n')

        return { data: csvContent, error: null }
      }

      return { data, error: null }
    } catch (error) {
      console.error('Error exporting mood data:', error)
      return { data: null, error }
    }
  }
}

// Mood utility functions
export const moodUtils = {
  // Get mood emoji by score
  getMoodEmoji: (score) => {
    if (score <= 2) return '😢'
    if (score <= 4) return '😔'
    if (score <= 6) return '😐'
    if (score <= 8) return '🙂'
    return '😄'
  },

  // Get mood color by score
  getMoodColor: (score) => {
    if (score <= 2) return 'text-red-500'
    if (score <= 4) return 'text-orange-500'
    if (score <= 6) return 'text-yellow-500'
    if (score <= 8) return 'text-green-500'
    return 'text-emerald-500'
  },

  // Get mood label by score
  getMoodLabel: (score) => {
    if (score <= 2) return 'Very Low'
    if (score <= 4) return 'Low'
    if (score <= 6) return 'Neutral'
    if (score <= 8) return 'Good'
    return 'Excellent'
  },

  // Format date for display
  formatDate: (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = now - date
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    })
  },

  // Common mood tags
  commonTags: [
    'work', 'family', 'friends', 'exercise', 'sleep', 'stress', 'anxiety',
    'happy', 'tired', 'energetic', 'calm', 'excited', 'frustrated',
    'grateful', 'lonely', 'confident', 'overwhelmed', 'peaceful', 'motivated'
  ]
}