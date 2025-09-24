// src/components/analytics/Reports.jsx
import React, { useState } from 'react'
import { Download, FileText, Calendar, TrendingUp, BarChart3 } from 'lucide-react'
import { moodService } from '../../services/mood.js'
import { useAuth } from '../../hooks/useAuth'

const Reports = () => {
  const [generating, setGenerating] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const { user } = useAuth()

  const generateReport = async (format = 'csv') => {
    setGenerating(true)
    try {
      const startDate = getStartDate(selectedPeriod)
      const { data } = await moodService.exportMoodData(user.id, format, startDate.toISOString())
      
      if (format === 'csv') {
        downloadCSV(data, \mood-report-\.csv\)
      } else {
        downloadJSON(data, \mood-report-\.json\)
      }
    } catch (error) {
      console.error('Error generating report:', error)
      alert('Error generating report')
    } finally {
      setGenerating(false)
    }
  }

  const getStartDate = (period) => {
    const now = new Date()
    switch (period) {
      case 'week':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case 'month':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      case 'quarter':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
      case 'year':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }
  }

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const downloadJSON = (jsonData, filename) => {
    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const reportTypes = [
    {
      title: 'Mood Summary Report',
      description: 'Overview of your mood patterns and statistics',
      icon: BarChart3,
      format: 'csv'
    },
    {
      title: 'Detailed Mood Data',
      description: 'Complete mood entries with notes and tags',
      icon: FileText,
      format: 'json'
    },
    {
      title: 'Trend Analysis',
      description: 'Mood trends and patterns over time',
      icon: TrendingUp,
      format: 'csv'
    }
  ]

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Data Reports</h1>
        <p className="text-gray-600">Export and analyze your mood tracking data</p>
      </div>

      {/* Period Selection */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h2 className="text-lg font-semibold mb-4">Select Time Period</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['week', 'month', 'quarter', 'year'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={\p-4 border rounded-lg text-center capitalize \\}
            >
              <Calendar className="w-5 h-5 mx-auto mb-2" />
              {period === 'quarter' ? '3 Months' : \Last \\}
            </button>
          ))}
        </div>
      </div>

      {/* Report Types */}
      <div className="grid md:grid-cols-3 gap-6">
        {reportTypes.map((report, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
            <div className="text-center mb-4">
              <report.icon className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-900">{report.title}</h3>
              <p className="text-sm text-gray-600 mt-2">{report.description}</p>
            </div>
            
            <button
              onClick={() => generateReport(report.format)}
              disabled={generating}
              className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Download className="w-4 h-4 mr-2" />
              {generating ? 'Generating...' : \Download \\}
            </button>
          </div>
        ))}
      </div>

      {/* Usage Guidelines */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-amber-800 mb-3">Data Usage Guidelines</h3>
        <ul className="text-amber-700 space-y-2 text-sm">
          <li> CSV files can be opened in Excel or Google Sheets for analysis</li>
          <li> JSON files contain complete data including metadata</li>
          <li> All exported data is in your local timezone</li>
          <li> Reports include only your personal mood tracking data</li>
          <li> Data export is available for premium users</li>
        </ul>
      </div>
    </div>
  )
}

export default Reports
