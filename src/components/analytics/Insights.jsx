// src/components/analytics/Insights.jsx
import React, { useState, useEffect } from 'react'
import { Brain, TrendingUp, Calendar, Target, Lightbulb } from 'lucide-react'
import { moodService } from '../../services/mood.js'
import { useAuth } from '../../hooks/useAuth'

const Insights = () => {
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      generateInsights()
    }
  }, [user])

  const generateInsights = async () => {
    setLoading(true)
    try {
      const { data: stats } = await moodService.getMoodStats(user.id, '30days')
      const generatedInsights = analyzeData(stats)
      setInsights(generatedInsights)
    } catch (error) {
      console.error('Error generating insights:', error)
    } finally {
      setLoading(false)
    }
  }

  const analyzeData = (stats) => {
    const insights = []
    
    if (!stats || stats.totalEntries === 0) {
      return [{
        type: 'info',
        icon: Calendar,
        title: 'Start Tracking',
        description: 'Begin tracking your mood daily to unlock personalized insights.',
        recommendation: 'Log your mood at least once daily for the next week.'
      }]
    }

    // Trend analysis
    if (stats.moodTrend === 'improving') {
      insights.push({
        type: 'positive',
        icon: TrendingUp,
        title: 'Positive Trend',
        description: 'Your mood has been improving over the last 30 days.',
        recommendation: 'Keep doing what you\'re doing! Consider what changes you\'ve made recently.'
      })
    } else if (stats.moodTrend === 'declining') {
      insights.push({
        type: 'warning',
        icon: TrendingUp,
        title: 'Declining Trend',
        description: 'Your mood has been declining recently.',
        recommendation: 'Consider speaking with a mental health professional or trusted friend.'
      })
    }

    // Average mood analysis
    if (stats.averageMood >= 7) {
      insights.push({
        type: 'positive',
        icon: Target,
        title: 'Excellent Mood',
        description: \Your average mood is \/10 - that's fantastic!\,
        recommendation: 'Share your positive strategies with others who might benefit.'
      })
    } else if (stats.averageMood < 5) {
      insights.push({
        type: 'warning',
        icon: Target,
        title: 'Low Average Mood',
        description: \Your average mood is \/10.\,
        recommendation: 'Focus on self-care activities and consider professional support.'
      })
    }

    // Consistency analysis
    const consistency = stats.totalEntries / 30 * 100
    if (consistency >= 80) {
      insights.push({
        type: 'positive',
        icon: Calendar,
        title: 'Consistent Tracking',
        description: \You've logged your mood \% of days this month.\,
        recommendation: 'Great consistency! This data will help you identify patterns.'
      })
    } else if (consistency < 50) {
      insights.push({
        type: 'info',
        icon: Calendar,
        title: 'Increase Consistency',
        description: \You've logged your mood \% of days this month.\,
        recommendation: 'Try setting daily reminders to track your mood more consistently.'
      })
    }

    // Common tags analysis
    if (stats.commonTags && stats.commonTags.length > 0) {
      const topTag = stats.commonTags[0]
      insights.push({
        type: 'info',
        icon: Brain,
        title: 'Common Pattern',
        description: \Your most common mood tag is "\" (\ times).\,
        recommendation: 'Reflect on how this factor influences your mood and consider strategies to optimize it.'
      })
    }

    return insights
  }

  const getInsightColor = (type) => {
    switch (type) {
      case 'positive':
        return 'border-green-200 bg-green-50 text-green-800'
      case 'warning':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800'
      case 'info':
        return 'border-blue-200 bg-blue-50 text-blue-800'
      default:
        return 'border-gray-200 bg-gray-50 text-gray-800'
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case 'positive':
        return 'text-green-600'
      case 'warning':
        return 'text-yellow-600'
      case 'info':
        return 'text-blue-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Personal Insights</h1>
        <p className="text-gray-600">AI-powered insights based on your mood tracking data</p>
      </div>

      <div className="space-y-4">
        {insights.map((insight, index) => (
          <div key={index} className={\order rounded-lg p-6 \\}>
            <div className="flex items-start space-x-4">
              <insight.icon className={\w-6 h-6 \ flex-shrink-0 mt-1\} />
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">{insight.title}</h3>
                <p className="mb-3">{insight.description}</p>
                <div className="flex items-start space-x-2">
                  <Lightbulb className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <p className="text-sm font-medium">Recommendation: {insight.recommendation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Important Note</h3>
        <p className="text-gray-600 text-sm">
          These insights are generated based on patterns in your mood data and are for informational purposes only. 
          They should not be considered medical advice. If you're experiencing persistent mental health concerns, 
          please consult with a qualified healthcare professional.
        </p>
      </div>
    </div>
  )
}

export default Insights
