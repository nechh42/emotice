// src/components/mood/MoodChart.jsx
import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const MoodChart = ({ data, height = 300 }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available for chart
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[1, 10]} />
        <Tooltip 
          formatter={(value) => [value, 'Mood Score']}
          labelStyle={{ color: '#666' }}
        />
        <Line 
          type="monotone" 
          dataKey="average" 
          stroke="#8b5cf6"
          strokeWidth={3}
          dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 4 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default MoodChart
