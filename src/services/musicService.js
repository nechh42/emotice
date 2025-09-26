// src/services/musicService.js
import { supabase } from '../lib/supabase'

export const musicService = {
  // Çalınan şarkıyı kaydetme
  savePlayHistory: async (trackData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('music_play_history')
        .insert({
          user_id: user.id,
          track_id: trackData.id,
          track_title: trackData.title,
          track_artist: trackData.artist,
          mood_category: trackData.moodCategory,
          play_duration: trackData.playDuration || 0,
          completed: trackData.completed || false,
          created_at: new Date().toISOString()
        })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error saving play history:', error)
      return { success: false, error: error.message }
    }
  },

  // Favori şarkı ekleme/çıkarma
  toggleFavorite: async (trackData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Önce favori var mı kontrol et
      const { data: existing } = await supabase
        .from('music_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('track_id', trackData.id)
        .single()

      if (existing) {
        // Varsa sil
        const { error } = await supabase
          .from('music_favorites')
          .delete()
          .eq('id', existing.id)

        if (error) throw error
        return { success: true, action: 'removed' }
      } else {
        // Yoksa ekle
        const { data, error } = await supabase
          .from('music_favorites')
          .insert({
            user_id: user.id,
            track_id: trackData.id,
            track_title: trackData.title,
            track_artist: trackData.artist,
            track_cover: trackData.cover,
            track_duration: trackData.duration,
            mood_category: trackData.moodCategory,
            created_at: new Date().toISOString()
          })

        if (error) throw error
        return { success: true, action: 'added', data }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      return { success: false, error: error.message }
    }
  },

  // Kullanıcının favori şarkılarını getirme
  getFavorites: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('music_favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      
      // Frontend formatına dönüştür
      const favorites = data.map(fav => ({
        id: fav.track_id,
        title: fav.track_title,
        artist: fav.track_artist,
        cover: fav.track_cover,
        duration: fav.track_duration,
        moodCategory: fav.mood_category,
        favoriteId: fav.id
      }))

      return { success: true, data: favorites }
    } catch (error) {
      console.error('Error fetching favorites:', error)
      return { success: false, error: error.message }
    }
  },

  // Çalma geçmişini getirme
  getPlayHistory: async (limit = 50) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('music_play_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching play history:', error)
      return { success: false, error: error.message }
    }
  },

  // Müzik istatistikleri
  getMusicStats: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Temel istatistikler
      const [playHistoryResult, favoritesResult] = await Promise.all([
        supabase
          .from('music_play_history')
          .select('*')
          .eq('user_id', user.id),
        supabase
          .from('music_favorites')
          .select('*')
          .eq('user_id', user.id)
      ])

      const playHistory = playHistoryResult.data || []
      const favorites = favoritesResult.data || []

      // Bu hafta ve bu ay
      const now = new Date()
      const thisWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      const thisWeekPlays = playHistory.filter(play => 
        new Date(play.created_at) >= thisWeek
      )
      
      const thisMonthPlays = playHistory.filter(play => 
        new Date(play.created_at) >= thisMonth
      )

      // En çok çalınan mood kategorisi
      const moodCounts = {}
      playHistory.forEach(play => {
        const mood = play.mood_category
        moodCounts[mood] = (moodCounts[mood] || 0) + 1
      })

      const topMood = Object.keys(moodCounts).reduce((a, b) => 
        moodCounts[a] > moodCounts[b] ? a : b, 'happy'
      )

      // Toplam dinleme süresi (saniye)
      const totalListeningTime = playHistory.reduce((sum, play) => 
        sum + (play.play_duration || 0), 0
      )

      const stats = {
        totalPlays: playHistory.length,
        totalFavorites: favorites.length,
        thisWeekPlays: thisWeekPlays.length,
        thisMonthPlays: thisMonthPlays.length,
        topMoodCategory: topMood,
        totalListeningMinutes: Math.round(totalListeningTime / 60),
        averagePlayDuration: playHistory.length > 0 ? 
          Math.round(totalListeningTime / playHistory.length) : 0,
        completedPlays: playHistory.filter(play => play.completed).length,
        firstPlay: playHistory.length > 0 ? playHistory[playHistory.length - 1].created_at : null,
        lastPlay: playHistory.length > 0 ? playHistory[0].created_at : null,
        
        // Mood kategori dağılımı
        moodDistribution: moodCounts
      }

      return { success: true, data: stats }
    } catch (error) {
      console.error('Error fetching music stats:', error)
      return { success: false, error: error.message }
    }
  },

  // Günlük çalma limiti kontrolü (free users için)
  checkDailyPlayLimit: async () => {
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
      if (isPremium) {
        return { success: true, canPlay: true, remainingPlays: 'unlimited' }
      }

      // Free kullanıcı için günlük limit kontrolü
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const { data, error } = await supabase
        .from('music_play_history')
        .select('id')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString())

      if (error) throw error

      const dailyLimit = 10 // Free kullanıcı günde 10 şarkı
      const todayPlays = data.length
      const canPlay = todayPlays < dailyLimit
      const remainingPlays = Math.max(0, dailyLimit - todayPlays)

      return { 
        success: true, 
        canPlay, 
        remainingPlays,
        dailyLimit,
        todayPlays,
        isPremium: false
      }
    } catch (error) {
      console.error('Error checking daily play limit:', error)
      return { success: false, error: error.message }
    }
  },

  // Mood tabanlı öneri sistemi
  getMoodRecommendations: async (currentMood, limit = 10) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return { success: true, data: [] }

      // Kullanıcının geçmiş dinleme verilerini al
      const { data: history } = await supabase
        .from('music_play_history')
        .select('track_id, mood_category, play_duration')
        .eq('user_id', user.id)
        .eq('mood_category', currentMood)
        .order('created_at', { ascending: false })
        .limit(50)

      // En çok dinlenen şarkıları önce öner
      const trackCounts = {}
      history?.forEach(play => {
        trackCounts[play.track_id] = (trackCounts[play.track_id] || 0) + 1
      })

      const recommendations = Object.entries(trackCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, limit)
        .map(([trackId, count]) => ({ trackId, playCount: count }))

      return { success: true, data: recommendations }
    } catch (error) {
      console.error('Error getting mood recommendations:', error)
      return { success: false, error: error.message }
    }
  },

  // Playlist oluşturma (premium feature)
  createPlaylist: async (playlistData) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('music_playlists')
        .insert({
          user_id: user.id,
          name: playlistData.name,
          description: playlistData.description || '',
          mood_category: playlistData.moodCategory,
          track_ids: playlistData.trackIds || [],
          is_public: playlistData.isPublic || false,
          created_at: new Date().toISOString()
        })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error creating playlist:', error)
      return { success: false, error: error.message }
    }
  },

  // Kullanıcının playlist'lerini getirme
  getUserPlaylists: async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('music_playlists')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error fetching playlists:', error)
      return { success: false, error: error.message }
    }
  }
}