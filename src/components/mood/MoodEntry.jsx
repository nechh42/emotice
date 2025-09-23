// EMOTICE - Mood Entry Component
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { 
  Save, 
  Tag, 
  MessageCircle, 
  MapPin, 
  Sun, 
  Activity, 
  Battery, 
  Moon, 
  Zap,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle 
} from 'lucide-react'
import { moodService, moodUtils } from '../../services/mood'
import { useAuth } from '../../hooks/useAuth'

// Validation schema
const moodSchema = z.object({
  moodScore: z.number()
    .min(1, 'Please select a mood score')
    .max(10, 'Mood score must be between 1-10'),
  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
  tags: z.array(z.string()).optional(),
  location: z.string().optional(),
  weather: z.string().optional(),
  activities: z.array(z.string()).optional(),
  energyLevel: z.number().min(1).max(10).optional(),
  sleepQuality: z.number().min(1).max(10).optional(),
  stressLevel: z.number().min(1).max(10).optional()
})

const MoodEntry = ({ onSuccess, existingEntry = null }) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState('')
  const [selectedTags, setSelectedTags] = useState(existingEntry?.tags || [])
  const [selectedActivities, setSelectedActivities] = useState(existingEntry?.context?.activities || [])
  const [showAdvanced, setShowAdvanced] = useState(false)

  const { user } = useAuth()

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(moodSchema),
    defaultValues: {
      moodScore: existingEntry?.mood_score || 5,
      notes: existingEntry?.notes || '',
      tags: existingEntry?.tags || [],
      location: existingEntry?.context?.location || '',
      weather: existingEntry?.context?.weather || '',
      activities: existingEntry?.context?.activities || [],
      energyLevel: existingEntry?.context?.energy_level || 5,
      sleepQuality: existingEntry?.context?.sleep_quality || 5,
      stressLevel: existingEntry?.context?.stress_level || 5
    }
  })

  const watchedMoodScore = watch('moodScore')
  const watchedNotes = watch('notes')

  // Common activities
  const commonActivities = [
    'Work', 'Exercise', 'Reading', 'Socializing', 'Cooking', 'Shopping',
    'Movies', 'Music', 'Gaming', 'Walking', 'Meditation', 'Art',
    'Cleaning', 'Travel', 'Learning', 'Rest'
  ]

  // Weather options
  const weatherOptions = [
    'Sunny', 'Cloudy', 'Rainy', 'Stormy', 'Snowy', 'Windy', 'Foggy', 'Hot', 'Cold'
  ]

  const handleTagToggle = (tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag]
    
    setSelectedTags(newTags)
    setValue('tags', newTags)
  }

  const handleActivityToggle = (activity) => {
    const newActivities = selectedActivities.includes(activity)
      ? selectedActivities.filter(a => a !== activity)
      : [...selectedActivities, activity]
    
    setSelectedActivities(newActivities)
    setValue('activities', newActivities)
  }

  const onSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      setSubmitError('')
      setSubmitSuccess('')

      const moodData = {
        moodScore: data.moodScore,
        moodEmoji: moodUtils.getMoodEmoji(data.moodScore),
        notes: data.notes,
        tags: selectedTags,
        location: data.location,
        weather: data.weather,
        activities: selectedActivities,
        energyLevel: data.energyLevel,
        sleepQuality: data.sleepQuality,
        stressLevel: data.stressLevel
      }

      let result
      if (existingEntry) {
        result = await moodService.updateMoodEntry(existingEntry.id, moodData)
      } else {
        result = await moodService.createMoodEntry(moodData)
      }

      if (result.error) {
        setSubmitError(result.error.message)
        return
      }

      setSubmitSuccess(existingEntry ? 'Mood entry updated successfully!' : 'Mood entry saved successfully!')
      
      if (onSuccess) {
        setTimeout(() => onSuccess(result.data), 1500)
      }

    } catch (error) {
      setSubmitError('An unexpected error occurred. Please try again.')
      console.error('Mood entry error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {existingEntry ? 'Update Mood Entry' : 'How are you feeling?'}
        </h2>
        <div className="flex items-center justify-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
          <Clock className="w-4 h-4 ml-2" />
          <span>{new Date().toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Mood Score Selector */}
        <div>
          <label className="block text-lg font-semibold text-gray-900 mb-4 text-center">
            Rate your mood (1-10)
          </label>
          
          <div className="flex justify-center mb-4">
            <div className="text-6xl">
              {moodUtils.getMoodEmoji(watchedMoodScore)}
            </div>
          </div>

          <Controller
            name="moodScore"
            control={control}
            render={({ field }) => (
              <div className="space-y-4">
                {/* Slider */}
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={field.value}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                  className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer mood-slider"
                />
                
                {/* Score Display */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Very Low</span>
                  <div className="text-center">
                    <div className={`text-3xl font-bold ${moodUtils.getMoodColor(field.value)}`}>
                      {field.value}
                    </div>
                    <div className={`text-sm font-medium ${moodUtils.getMoodColor(field.value)}`}>
                      {moodUtils.getMoodLabel(field.value)}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">Excellent</span>
                </div>

                {/* Number buttons */}
                <div className="grid grid-cols-10 gap-1">
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => field.onChange(num)}
                      className={`h-10 w-full rounded text-sm font-medium transition-colors ${
                        field.value === num
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            )}
          />

          {errors.moodScore && (
            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="w-4 h-4" />
              {errors.moodScore.message}
            </p>
          )}
        </div>

        {/* Quick Tags */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Tag className="w-4 h-4" />
            Quick Tags (optional)
          </label>
          
          <div className="flex flex-wrap gap-2">
            {moodUtils.commonTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleTagToggle(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <MessageCircle className="w-4 h-4" />
            Notes (optional)
          </label>
          
          <textarea
            {...register('notes')}
            rows="3"
            maxLength="500"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            placeholder="What's on your mind? Any specific thoughts or events..."
          />
          
          <div className="flex justify-between mt-1">
            <div>
              {errors.notes && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.notes.message}
                </p>
              )}
            </div>
            <span className="text-sm text-gray-500">
              {(watchedNotes || '').length}/500
            </span>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-center gap-2 py-2 text-primary-600 hover:text-primary-700 font-medium"
        >
          <Activity className="w-4 h-4" />
          {showAdvanced ? 'Hide' : 'Show'} Advanced Options
        </button>

        {/* Advanced Options */}
        {showAdvanced && (
          <div className="space-y-6 border-t pt-6">
            {/* Energy, Sleep, Stress Levels */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Energy Level */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Battery className="w-4 h-4" />
                  Energy Level
                </label>
                <Controller
                  name="energyLevel"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={field.value || 5}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-center text-sm text-gray-600">
                        {field.value || 5}/10
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Sleep Quality */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Moon className="w-4 h-4" />
                  Sleep Quality
                </label>
                <Controller
                  name="sleepQuality"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={field.value || 5}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-center text-sm text-gray-600">
                        {field.value || 5}/10
                      </div>
                    </div>
                  )}
                />
              </div>

              {/* Stress Level */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Zap className="w-4 h-4" />
                  Stress Level
                </label>
                <Controller
                  name="stressLevel"
                  control={control}
                  render={({ field }) => (
                    <div className="space-y-2">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={field.value || 5}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="text-center text-sm text-gray-600">
                        {field.value || 5}/10
                      </div>
                    </div>
                  )}
                />
              </div>
            </div>

            {/* Activities */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Activity className="w-4 h-4" />
                Activities
              </label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {commonActivities.map((activity) => (
                  <button
                    key={activity}
                    type="button"
                    onClick={() => handleActivityToggle(activity)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedActivities.includes(activity)
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {activity}
                  </button>
                ))}
              </div>
            </div>

            {/* Location & Weather */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4" />
                  Location
                </label>
                <input
                  {...register('location')}
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Home, Office, Park..."
                />
              </div>

              {/* Weather */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Sun className="w-4 h-4" />
                  Weather
                </label>
                <select
                  {...register('weather')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select weather...</option>
                  {weatherOptions.map((weather) => (
                    <option key={weather} value={weather}>
                      {weather}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

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
          disabled={isSubmitting}
          className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-semibold text-white transition-colors ${
            isSubmitting
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2'
          }`}
        >
          <Save className="w-5 h-5" />
          {isSubmitting 
            ? (existingEntry ? 'Updating...' : 'Saving...') 
            : (existingEntry ? 'Update Entry' : 'Save Entry')
          }
        </button>
      </form>

      {/* Custom CSS for mood slider */}
      <style jsx>{`
        .mood-slider::-webkit-slider-thumb {
          appearance: none;
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
        
        .mood-slider::-moz-range-thumb {
          height: 24px;
          width: 24px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }
      `}</style>
    </div>
  )
}

export default MoodEntry