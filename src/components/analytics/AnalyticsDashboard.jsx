// src/components/analytics/AnalyticsDashboard.jsx
import React, { useState, useEffect } from 'react'
import { TrendingUp, BarChart3, PieChart, Target, Calendar, Filter } from 'lucide-react'
import AdvancedCharts from './AdvancedCharts'
import { moodService } from '../../services/mood.js'
import { useAuth } from '../../hooks/useAuth'

const AnalyticsDashboard = () => {
  const [data, setData] = useState([])
  const [stats, setStats] = useState({})
  const [timeframe, setTimeframe] = useState('30days')
  const [chartType, setChartType] = useState('line')
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user, timeframe])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const { data: statsData } = await moodService.getMoodStats(user.id, timeframe)
      setStats(statsData || {})
      setData(statsData?.dailyAverages || [])
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon: Icon, color, trend }) => (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className={\	ext-3xl font-bold \\}>{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">{trend}</span>
            </div>
          )}
        </div>
        <Icon className={\w-8 h-8 \\} />
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        
        <div className="flex gap-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="line">Line Chart</option>
            <option value="area">Area Chart</option>
            <option value="bar">Bar Chart</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Mood"
          value={stats.averageMood?.toFixed(1) || '0'}
          icon={BarChart3}
          color="text-blue-600"
        />
        <StatCard
          title="Total Entries"
          value={stats.totalEntries || 0}
          icon={Calendar}
          color="text-green-600"
        />
        <StatCard
          title="Best Day"
          value={stats.highestMood || 0}
          icon={TrendingUp}
          color="text-emerald-600"
        />
        <StatCard
          title="Trend"
          value={stats.moodTrend || 'stable'}
          icon={Target}
          color={
            stats.moodTrend === 'improving' ? 'text-green-600' :
            stats.moodTrend === 'declining' ? 'text-red-600' : 'text-gray-600'
          }
        />
      </div>

      {/* Main Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Mood Trends</h2>
        {data.length > 0 ? (
          <AdvancedCharts data={data} type={chartType} />
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-500">
            No data available for the selected period
          </div>
        )}
      </div>

      {/* Tags Analysis */}
      {stats.commonTags && stats.commonTags.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Most Common Tags</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {stats.commonTags.map((tag, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="font-semibold text-gray-900">{tag.tag}</p>
                <p className="text-sm text-gray-600">{tag.count} times</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
        <h2 className="text-lg font-semibold mb-4 text-blue-900">Insights & Recommendations</h2>
        <div className="space-y-3 text-blue-800">
          {stats.moodTrend === 'improving' && (
            <p> Great job! Your mood has been improving over time.</p>
          )}
          {stats.moodTrend === 'declining' && (
            <p> Your mood has been declining recently. Consider speaking with a professional.</p>
          )}
          {stats.averageMood >= 7 && (
            <p> You maintain a consistently positive mood. Keep up the good work!</p>
          )}
          {stats.averageMood < 5 && (
            <p> Your average mood is below 5. Focus on self-care and consider professional support.</p>
          )}
          <p> Track your mood daily for better insights into your emotional patterns.</p>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
