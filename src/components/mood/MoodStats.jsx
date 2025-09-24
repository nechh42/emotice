// src/components/mood/MoodStats.jsx
import React from 'react'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

const MoodStats = ({ stats }) => {
  if (!stats) return null

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving':
        return <TrendingUp className="text-green-500" size={20} />
      case 'declining':
        return <TrendingDown className="text-red-500" size={20} />
      default:
        return <Minus className="text-blue-500" size={20} />
    }
  }

  const getTrendText = (trend) => {
    switch(trend) {
      case 'improving':
        return 'Improving'
      case 'declining':
        return 'Needs Attention'
      default:
        return 'Stable'
    }
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-purple-600">{stats.averageMood}</div>
        <div className="text-sm text-gray-600">Average</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-green-600">{stats.highestMood}</div>
        <div className="text-sm text-gray-600">Highest</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="text-2xl font-bold text-red-600">{stats.lowestMood}</div>
        <div className="text-sm text-gray-600">Lowest</div>
      </div>
      
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalEntries}</div>
            <div className="text-sm text-gray-600">Total Entries</div>
          </div>
          <div className="flex items-center">
            {getTrendIcon(stats.moodTrend)}
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {getTrendText(stats.moodTrend)}
        </div>
      </div>
    </div>
  )
}

export default MoodStats
