// EMOTICE - Mood History Component
import { useState, useEffect } from 'react'
import { 
  Calendar, 
  Filter, 
  Download, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronDown, 
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { moodService, moodUtils } from '../../services/mood'
import { useAuth } from '../../hooks/useAuth'

const MoodHistory = ({ onEditEntry }) => {
  const [entries, setEntries] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expandedEntry, setExpandedEntry] = useState(null)
  
  // Filter states
  const [filters, setFilters] = useState({
    timeframe: '30days',
    minScore: '',
    maxScore: '',
    tags: [],
    showFilters: false
  })

  const { user } = useAuth()

  // Load mood entries and stats
  useEffect(() => {
    if (user) {
      loadMoodData()
    }
  }, [user, filters.timeframe, filters.minScore, filters.maxScore, filters.tags])

  const loadMoodData = async () => {
    try {
      setLoading(true)
      setError('')

      // Calculate date range based on timeframe
      let startDate = null
      if (filters.timeframe !== 'all') {
        startDate = new Date()
        switch (filters.timeframe) {
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
        }
      }

      // Load entries
      const entriesResult = await moodService.getUserMoodEntries(user.id, {
        startDate: startDate?.toISOString(),
        minScore: filters.minScore ? parseInt(filters.minScore) : null,
        maxScore: filters.maxScore ? parseInt(filters.maxScore) : null,
        tags: filters.tags.length > 0 ? filters.tags : null,
        limit: 100
      })

      if (entriesResult.error) {
        throw new Error(entriesResult.error.message)
      }

      setEntries(entriesResult.data || [])

      // Load stats
      const statsResult = await moodService.getMoodStats(user.id, filters.timeframe)
      if (statsResult.error) {
        console.error('Error loading stats:', statsResult.error)
      } else {
        setStats(statsResult.data)
      }

    } catch (error) {
      setError(error.message)
      console.error('Error loading mood data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteEntry = async (entryId) => {
    if (!confirm('Are you sure you want to delete this mood entry?')) {
      return
    }

    try {
      const result = await moodService.deleteMoodEntry(entryId)
      if (result.error) {
        throw new Error(result.error.message)
      }

      // Remove from local state
      setEntries(entries.filter(entry => entry.id !== entryId))
      
      // Reload stats
      loadMoodData()
    } catch (error) {
      alert('Error deleting entry: ' + error.message)
    }
  }

  const handleExportData = async () => {
    try {
      const result = await moodService.exportMoodData(user.id, 'csv')
      if (result.error) {
        throw new Error(result.error.message)
      }

      // Create and download CSV file
      const blob = new Blob([result.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `mood-data-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      alert('Error exporting data: ' + error.message)
    }
  }

  const handleTagFilter = (tag) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag]
    
    setFilters(prev => ({ ...prev, tags: newTags }))
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-200 border-t-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading mood history: {error}</p>
        <button 
          onClick={loadMoodData}
          className="mt-2 text-red-700 underline hover:text-red-800"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mood History</h2>
          <p className="text-gray-600">Track your emotional patterns over time</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setFilters(prev => ({ ...prev, showFilters: !prev.showFilters }))}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <Filter className="w-4 h-4" />
            Filters
            {filters.showFilters ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            onClick={handleExportData}
            className="flex items-center gap-2 px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {filters.showFilters && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {/* Timeframe */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Timeframe</label>
              <select
                value={filters.timeframe}
                onChange={(e) => setFilters(prev => ({ ...prev, timeframe: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="7days">Last 7 days</option>
                <option value="30days">Last 30 days</option>
                <option value="90days">Last 3 months</option>
                <option value="1year">Last year</option>
                <option value="all">All time</option>
              </select>
            </div>

            {/* Min Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Score</label>
              <select
                value={filters.minScore}
                onChange={(e) => setFilters(prev => ({ ...prev, minScore: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Any</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(score => (
                  <option key={score} value={score}>{score}</option>
                ))}
              </select>
            </div>

            {/* Max Score */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Score</label>
              <select
                value={filters.maxScore}
                onChange={(e) => setFilters(prev => ({ ...prev, maxScore: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Any</option>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(score => (
                  <option key={score} value={score}>{score}</option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => setFilters(prev => ({ 
                  ...prev, 
                  timeframe: '30days',
                  minScore: '',
                  maxScore: '',
                  tags: []
                }))}
                className="w-full px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Tag filters */}
          {stats?.commonTags && stats.commonTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by tags</label>
              <div className="flex flex-wrap gap-2">
                {stats.commonTags.map(({ tag, count }) => (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      filters.tags.includes(tag)
                        ? 'bg-primary-600 text-white'
                        : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {tag} ({count})
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Statistics Dashboard */}
      {stats && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Statistics
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{stats.totalEntries}</div>
              <div className="text-sm text-gray-600">Total Entries</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">{stats.averageMood}</div>
              <div className="text-sm text-gray-600">Average Mood</div>
            </div>
            
            <div className="text-center">
              <div className={`text-2xl font-bold flex items-center justify-center gap-1 ${
                stats.moodTrend === 'improving' ? 'text-green-600' : 
                stats.moodTrend === 'declining' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {stats.moodTrend === 'improving' && <TrendingUp className="w-5 h-5" />}
                {stats.moodTrend === 'declining' && <TrendingDown className="w-5 h-5" />}
                {stats.moodTrend === 'stable' && <Minus className="w-5 h-5" />}
                {stats.moodTrend === 'improving' ? 'Up' : stats.moodTrend === 'declining' ? 'Down' : 'Stable'}
              </div>
              <div className="text-sm text-gray-600">Trend</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {stats.highestMood}/{stats.lowestMood}
              </div>
              <div className="text-sm text-gray-600">High/Low</div>
            </div>
          </div>

          {/* Mood Trend Chart */}
          {stats.dailyAverages && stats.dailyAverages.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Mood Trend</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stats.dailyAverages}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    />
                    <YAxis domain={[1, 10]} tick={{ fontSize: 12 }} />
                    <Tooltip 
                      labelFormatter={(date) => new Date(date).toLocaleDateString()}
                      formatter={(value) => [value, 'Mood Score']}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="average" 
                      stroke="#2563eb" 
                      strokeWidth={2}
                      dot={{ fill: '#2563eb', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mood Entries List */}
      <div className="space-y-4">
        {entries.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mood entries found</h3>
            <p className="text-gray-600">
              {filters.timeframe !== '30days' || filters.minScore || filters.maxScore || filters.tags.length > 0
                ? 'Try adjusting your filters to see more entries.'
                : 'Start tracking your mood to see your history here.'
              }
            </p>
          </div>
        ) : (
          entries.map((entry) => (
            <div key={entry.id} className="bg-white rounded-lg shadow p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  {/* Mood Score & Emoji */}
                  <div className="text-center">
                    <div className="text-3xl">{entry.mood_emoji}</div>
                    <div className={`text-lg font-bold ${moodUtils.getMoodColor(entry.mood_score)}`}>
                      {entry.mood_score}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
                      <Calendar className="w-4 h-4" />
                      <span>{moodUtils.formatDate(entry.created_at)}</span>
                      <span>•</span>
                      <span>{new Date(entry.created_at).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}</span>
                    </div>

                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Notes Preview */}
                    {entry.notes && (
                      <p className={`text-gray-700 ${
                        expandedEntry === entry.id ? '' : 'line-clamp-2'
                      }`}>
                        {entry.notes}
                      </p>
                    )}

                    {/* Expanded Details */}
                    {expandedEntry === entry.id && entry.context && (
                      <div className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
                        {entry.context.energy_level && (
                          <div>
                            <span className="text-gray-500">Energy:</span>
                            <span className="ml-1 font-medium">{entry.context.energy_level}/10</span>
                          </div>
                        )}
                        {entry.context.sleep_quality && (
                          <div>
                            <span className="text-gray-500">Sleep:</span>
                            <span className="ml-1 font-medium">{entry.context.sleep_quality}/10</span>
                          </div>
                        )}
                        {entry.context.stress_level && (
                          <div>
                            <span className="text-gray-500">Stress:</span>
                            <span className="ml-1 font-medium">{entry.context.stress_level}/10</span>
                          </div>
                        )}
                        {entry.context.weather && (
                          <div>
                            <span className="text-gray-500">Weather:</span>
                            <span className="ml-1 font-medium">{entry.context.weather}</span>
                          </div>
                        )}
                        {entry.context.location && (
                          <div className="col-span-2">
                            <span className="text-gray-500">Location:</span>
                            <span className="ml-1 font-medium">{entry.context.location}</span>
                          </div>
                        )}
                        {entry.context.activities && entry.context.activities.length > 0 && (
                          <div className="col-span-2">
                            <span className="text-gray-500">Activities:</span>
                            <span className="ml-1 font-medium">{entry.context.activities.join(', ')}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  {(entry.notes || entry.context) && (
                    <button
                      onClick={() => setExpandedEntry(
                        expandedEntry === entry.id ? null : entry.id
                      )}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg"
                      title={expandedEntry === entry.id ? "Show less" : "Show more"}
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  
                  <button
                    onClick={() => onEditEntry && onEditEntry(entry)}
                    className="p-2 text-gray-400 hover:text-primary-600 rounded-lg"
                    title="Edit entry"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => handleDeleteEntry(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-600 rounded-lg"
                    title="Delete entry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MoodHistory