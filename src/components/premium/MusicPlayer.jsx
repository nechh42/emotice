// src/components/premium/MusicPlayer.jsx
import React, { useState } from 'react'
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react'

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(0)

  const tracks = [
    { title: 'Relaxing Nature', duration: '3:45' },
    { title: 'Meditation Bells', duration: '5:12' },
    { title: 'Ocean Waves', duration: '4:32' }
  ]

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
      <h3 className="text-xl font-semibold text-center mb-6">Mood Music</h3>
      
      <div className="bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg p-6 text-white text-center mb-4">
        <h4 className="text-lg font-semibold">{tracks[currentTrack].title}</h4>
        <p className="text-sm opacity-75">{tracks[currentTrack].duration}</p>
      </div>

      <div className="flex items-center justify-center space-x-4 mb-4">
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <SkipBack className="w-5 h-5" />
        </button>
        
        <button 
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-3 rounded-full bg-purple-600 text-white hover:bg-purple-700"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200">
          <SkipForward className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <Volume2 className="w-4 h-4 text-gray-600" />
        <input type="range" className="flex-1" min="0" max="100" />
      </div>
    </div>
  )
}

export default MusicPlayer
