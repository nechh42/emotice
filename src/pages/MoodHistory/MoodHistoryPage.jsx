// src/pages/MoodHistory/MoodHistoryPage.jsx
import React from 'react'
import MoodHistory from '../../components/mood/MoodHistory'

const MoodHistoryPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto py-8">
        <MoodHistory />
      </div>
    </div>
  )
}

export default MoodHistoryPage
