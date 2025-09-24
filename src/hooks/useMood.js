// src/hooks/useMood.js
import { useState, useEffect } from 'react'
import { moodService } from '../services/mood.js'
import { useAuth } from './useAuth'

export const useMood = () => {
  const [moods, setMoods] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { user } = useAuth()

  const fetchMoods = async (options = {}) => {
    if (!user) return
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await moodService.getUserMoodEntries(user.id, options)
      if (error) throw error
      setMoods(data || [])
    } catch (err) {
      setError(err.message)
      console.error('Error fetching moods:', err)
    } finally {
      setLoading(false)
    }
  }

  const addMood = async (moodData) => {
    if (!user) return { error: 'Not authenticated' }
    
    try {
      const { data, error } = await moodService.createMoodEntry(moodData)
      if (error) throw error
      
      // Update local state
      setMoods(prev => [data, ...prev])
      return { data, error: null }
    } catch (err) {
      console.error('Error adding mood:', err)
      return { data: null, error: err.message }
    }
  }

  const updateMood = async (entryId, updates) => {
    try {
      const { data, error } = await moodService.updateMoodEntry(entryId, updates)
      if (error) throw error
      
      // Update local state
      setMoods(prev => prev.map(mood => 
        mood.id === entryId ? { ...mood, ...data } : mood
      ))
      return { data, error: null }
    } catch (err) {
      console.error('Error updating mood:', err)
      return { data: null, error: err.message }
    }
  }

  const deleteMood = async (entryId) => {
    try {
      const { error } = await moodService.deleteMoodEntry(entryId)
      if (error) throw error
      
      // Update local state
      setMoods(prev => prev.filter(mood => mood.id !== entryId))
      return { error: null }
    } catch (err) {
      console.error('Error deleting mood:', err)
      return { error: err.message }
    }
  }

  useEffect(() => {
    fetchMoods()
  }, [user])

  return { 
    moods, 
    loading, 
    error,
    refetch: fetchMoods,
    addMood,
    updateMood,
    deleteMood
  }
}
