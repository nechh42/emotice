// src/components/meditation/MeditationTools.jsx
import React, { useState, useEffect, useRef } from 'react'
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Settings, 
  Volume2, 
  VolumeX,
  Clock,
  Flame,
  Wind,
  Heart,
  Zap,
  Moon,
  Sun,
  Waves,
  TreePine,
  Cloud
} from 'lucide-react'

const MeditationTools = () => {
  const [activeMode, setActiveMode] = useState('breathing')
  const [isPlaying, setIsPlaying] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 dakika default
  const [currentPhase, setCurrentPhase] = useState('inhale')
  const [phaseTime, setPhaseTime] = useState(4)
  const [breathCount, setBreathCount] = useState(0)
  const [selectedBreathPattern, setSelectedBreathPattern] = useState('box')
  const [backgroundSound, setBackgroundSound] = useState('none')
  const [volume, setVolume] = useState(0.5)
  const [sessionHistory, setSessionHistory] = useState([])
  const [showSettings, setShowSettings] = useState(false)
  
  const intervalRef = useRef(null)
  const phaseIntervalRef = useRef(null)
  const audioRef = useRef(null)

  // Nefes alma desenleri
  const breathPatterns = {
    box: {
      name: '4-4-4-4 Box Breathing',
      description: 'Eşit aralıklarla nefes alma tekniği',
      phases: [
        { name: 'inhale', duration: 4, instruction: 'Nefes Al' },
        { name: 'hold', duration: 4, instruction: 'Tut' },
        { name: 'exhale', duration: 4, instruction: 'Ver' },
        { name: 'hold', duration: 4, instruction: 'Tut' }
      ],
      icon: '🔷',
      difficulty: 'Başlangıç'
    },
    relaxing: {
      name: '4-7-8 Relaxing',
      description: 'Rahatlatıcı nefes alma tekniği',
      phases: [
        { name: 'inhale', duration: 4, instruction: 'Nefes Al' },
        { name: 'hold', duration: 7, instruction: 'Tut' },
        { name: 'exhale', duration: 8, instruction: 'Yavaşça Ver' }
      ],
      icon: '😌',
      difficulty: 'Orta'
    },
    energizing: {
      name: '6-2-6-2 Energizing',
      description: 'Enerji veren nefes alma tekniği',
      phases: [
        { name: 'inhale', duration: 6, instruction: 'Derin Nefes Al' },
        { name: 'hold', duration: 2, instruction: 'Kısa Tut' },
        { name: 'exhale', duration: 6, instruction: 'Güçlü Ver' },
        { name: 'hold', duration: 2, instruction: 'Kısa Tut' }
      ],
      icon: '⚡',
      difficulty: 'İleri'
    },
    calming: {
      name: '3-3-3-3 Calming',
      description: 'Sakinleştirici nefes alma',
      phases: [
        { name: 'inhale', duration: 3, instruction: 'Yumuşak Nefes Al' },
        { name: 'hold', duration: 3, instruction: 'Nazikçe Tut' },
        { name: 'exhale', duration: 3, instruction: 'Rahatla' },
        { name: 'hold', duration: 3, instruction: 'Dinlen' }
      ],
      icon: '🕊️',
      difficulty: 'Başlangıç'
    }
  }

  // Arka plan sesleri
  const backgroundSounds = {
    none: { name: 'Sessiz', icon: '🔇' },
    rain: { name: 'Yağmur', icon: '🌧️', file: '/sounds/rain.mp3' },
    ocean: { name: 'Okyanus', icon: '🌊', file: '/sounds/ocean.mp3' },
    forest: { name: 'Orman', icon: '🌲', file: '/sounds/forest.mp3' },
    fire: { name: 'Şömine', icon: '🔥', file: '/sounds/fireplace.mp3' },
    birds: { name: 'Kuş Sesleri', icon: '🐦', file: '/sounds/birds.mp3' },
    wind: { name: 'Rüzgar', icon: '💨', file: '/sounds/wind.mp3' }
  }

  // Guided meditation sesleri (premium)
  const guidedMeditations = [
    {
      id: 'body-scan',
      name: 'Vücut Taraması',
      duration: 10,
      description: '10 dakikalık vücut tarama meditasyonu',
      isPremium: true
    },
    {
      id: 'loving-kindness',
      name: 'Sevgi-Merhamet',
      duration: 15,
      description: 'Sevgi dolu farkındalık meditasyonu',
      isPremium: true
    },
    {
      id: 'mindfulness',
      name: 'Farkındalık',
      duration: 5,
      description: 'Temel farkındalık meditasyonu',
      isPremium: false
    },
    {
      id: 'sleep',
      name: 'Uyku Meditasyonu',
      duration: 20,
      description: 'Derin uyku için rahatlatıcı meditasyon',
      isPremium: true
    }
  ]

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current)
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    if (backgroundSound !== 'none' && backgroundSounds[backgroundSound]?.file) {
      playBackgroundSound()
    } else {
      stopBackgroundSound()
    }
  }, [backgroundSound, volume])

  const playBackgroundSound = () => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
    
    audioRef.current = new Audio(backgroundSounds[backgroundSound].file)
    audioRef.current.loop = true
    audioRef.current.volume = volume
    audioRef.current.play().catch(e => console.log('Audio play prevented'))
  }

  const stopBackgroundSound = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }
  }

  const startBreathingSession = () => {
    setIsPlaying(true)
    setBreathCount(0)
    setCurrentPhase('inhale')
    
    // Ana zamanlayıcı
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endSession()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    // Nefes fazı zamanlayıcısı
    startPhaseTimer()
  }

  const startPhaseTimer = () => {
    const pattern = breathPatterns[selectedBreathPattern]
    let currentPhaseIndex = 0
    let currentPhaseDuration = pattern.phases[0].duration

    setPhaseTime(currentPhaseDuration)
    setCurrentPhase(pattern.phases[0].name)

    phaseIntervalRef.current = setInterval(() => {
      setPhaseTime(prev => {
        if (prev <= 1) {
          // Sonraki faza geç
          currentPhaseIndex = (currentPhaseIndex + 1) % pattern.phases.length
          
          if (currentPhaseIndex === 0) {
            setBreathCount(prev => prev + 1)
          }

          const nextPhase = pattern.phases[currentPhaseIndex]
          setCurrentPhase(nextPhase.name)
          return nextPhase.duration
        }
        return prev - 1
      })
    }, 1000)
  }

  const pauseSession = () => {
    setIsPlaying(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current)
  }

  const endSession = () => {
    setIsPlaying(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current)
    
    // Sesi durdur
    if (backgroundSound !== 'none') {
      stopBackgroundSound()
    }

    // Session geçmişine ekle
    const sessionData = {
      date: new Date().toISOString(),
      type: 'breathing',
      pattern: selectedBreathPattern,
      duration: 300 - timeLeft,
      breathCount: breathCount,
      completed: timeLeft === 0
    }
    
    const history = JSON.parse(localStorage.getItem('meditation_history') || '[]')
    history.unshift(sessionData)
    localStorage.setItem('meditation_history', JSON.stringify(history.slice(0, 50)))
    setSessionHistory(history.slice(0, 10))

    // Reset
    setTimeLeft(300)
    setBreathCount(0)
    setCurrentPhase('inhale')
  }

  const resetSession = () => {
    endSession()
    setTimeLeft(300)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getPhaseColor = (phase) => {
    switch (phase) {
      case 'inhale': return 'from-blue-400 to-blue-600'
      case 'hold': return 'from-purple-400 to-purple-600'
      case 'exhale': return 'from-green-400 to-green-600'
      default: return 'from-gray-400 to-gray-600'
    }
  }

  const getPhaseIcon = (phase) => {
    switch (phase) {
      case 'inhale': return <Wind className="w-8 h-8" />
      case 'hold': return <Clock className="w-8 h-8" />
      case 'exhale': return <Waves className="w-8 h-8" />
      default: return <Heart className="w-8 h-8" />
    }
  }

  const BreathingVisualization = () => {
    const pattern = breathPatterns[selectedBreathPattern]
    const currentPhaseData = pattern.phases.find(p => p.name === currentPhase)
    
    return (
      <div className="relative w-80 h-80 mx-auto mb-8">
        {/* Ana breathing circle */}
        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${getPhaseColor(currentPhase)} opacity-20 transition-all duration-1000 ${
          isPlaying && currentPhase === 'inhale' ? 'scale-110' : 
          isPlaying && currentPhase === 'exhale' ? 'scale-75' : 'scale-100'
        }`} />
        
        {/* İç circle */}
        <div className={`absolute inset-8 rounded-full bg-gradient-to-br ${getPhaseColor(currentPhase)} opacity-40 flex items-center justify-center transition-all duration-1000 ${
          isPlaying && currentPhase === 'inhale' ? 'scale-105' : 
          isPlaying && currentPhase === 'exhale' ? 'scale-85' : 'scale-100'
        }`}>
          
          {/* Merkez icon ve text */}
          <div className="text-center text-white">
            <div className="mb-2">
              {getPhaseIcon(currentPhase)}
            </div>
            <div className="text-lg font-semibold">
              {currentPhaseData?.instruction || 'Hazır'}
            </div>
            <div className="text-3xl font-bold mt-2">
              {isPlaying ? phaseTime : ''}
            </div>
          </div>
        </div>

        {/* Progress ring */}
        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="283"
            strokeDashoffset={283 - (283 * (currentPhaseData?.duration - phaseTime) / (currentPhaseData?.duration || 1))}
            className="transition-all duration-1000"
          />
        </svg>
      </div>
    )
  }

  const renderBreathingMode = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Nefes Egzersizleri</h1>
        <p className="text-gray-600">
          Rehberli nefes teknikleri ile rahatla ve odaklan
        </p>
      </div>

      {/* Pattern Selection */}
      {!isPlaying && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.entries(breathPatterns).map(([key, pattern]) => (
            <button
              key={key}
              onClick={() => setSelectedBreathPattern(key)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedBreathPattern === key
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 bg-white hover:border-purple-300'
              }`}
            >
              <div className="text-2xl mb-2">{pattern.icon}</div>
              <div className="font-semibold text-sm">{pattern.name}</div>
              <div className="text-xs text-gray-600 mt-1">{pattern.difficulty}</div>
            </button>
          ))}
        </div>
      )}

      {/* Breathing Visualization */}
      <BreathingVisualization />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-2xl font-bold text-blue-600">{formatTime(timeLeft)}</div>
          <div className="text-sm text-blue-600">Kalan Süre</div>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-2xl font-bold text-green-600">{breathCount}</div>
          <div className="text-sm text-green-600">Nefes Sayısı</div>
        </div>
        <div className="text-center p-4 bg-purple-50 rounded-lg">
          <div className="text-2xl font-bold text-purple-600">
            {breathPatterns[selectedBreathPattern].name.split(' ')[0]}
          </div>
          <div className="text-sm text-purple-600">Desen</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center items-center gap-4">
        <button
          onClick={resetSession}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        
        <button
          onClick={isPlaying ? pauseSession : startBreathingSession}
          className="p-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full transition-all transform hover:scale-105"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-3 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
        >
          <Settings className="w-5 h-5" />
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
          <h3 className="font-bold text-lg">Ayarlar</h3>
          
          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Süre (dakika)
            </label>
            <input
              type="range"
              min="1"
              max="30"
              value={timeLeft / 60}
              onChange={(e) => setTimeLeft(parseInt(e.target.value) * 60)}
              className="w-full"
              disabled={isPlaying}
            />
            <div className="text-sm text-gray-600 mt-1">
              {Math.round(timeLeft / 60)} dakika
            </div>
          </div>

          {/* Background Sound */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Arka Plan Sesi
            </label>
            <div className="grid grid-cols-4 gap-2">
              {Object.entries(backgroundSounds).map(([key, sound]) => (
                <button
                  key={key}
                  onClick={() => setBackgroundSound(key)}
                  className={`p-3 rounded-lg border text-center transition-colors ${
                    backgroundSound === key
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 bg-white hover:border-purple-300'
                  }`}
                >
                  <div className="text-lg">{sound.icon}</div>
                  <div className="text-xs mt-1">{sound.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Volume */}
          {backgroundSound !== 'none' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ses Seviyesi
              </label>
              <div className="flex items-center gap-3">
                <VolumeX className="w-4 h-4 text-gray-400" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1"
                />
                <Volume2 className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )

  const renderGuidedMode = () => (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Rehberli Meditasyon</h1>
        <p className="text-gray-600">
          Profesyonel sesli meditasyon seansları
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {guidedMeditations.map((meditation) => (
          <div
            key={meditation.id}
            className={`bg-white rounded-xl shadow-lg p-6 border ${
              meditation.isPremium ? 'border-purple-200' : 'border-gray-200'
            }`}
          >
            {meditation.isPremium && (
              <div className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium mb-3">
                <Crown className="w-3 h-3" />
                Premium
              </div>
            )}
            
            <h3 className="font-bold text-lg mb-2">{meditation.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{meditation.description}</p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                {meditation.duration} dakika
              </div>
              
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  meditation.isPremium
                    ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
                disabled={meditation.isPremium}
              >
                {meditation.isPremium ? 'Premium Gerekli' : 'Başlat'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderHistoryMode = () => {
    const history = JSON.parse(localStorage.getItem('meditation_history') || '[]')
    
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">Meditasyon Geçmişi</h1>
          <p className="text-gray-600">
            Meditasyon ilerlemenizi takip edin
          </p>
        </div>

        {history.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🧘‍♀️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Henüz meditasyon yapmadınız
            </h3>
            <p className="text-gray-600">
              İlk seansınızı başlatmak için nefes egzersizleri bölümüne gidin
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.slice(0, 10).map((session, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <Wind className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {breathPatterns[session.pattern]?.name || 'Nefes Egzersizi'}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(session.date).toLocaleDateString('tr-TR')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-medium">
                      {formatTime(session.duration)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.breathCount} nefes
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-8 py-4 overflow-x-auto">
            <button
              onClick={() => setActiveMode('breathing')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeMode === 'breathing'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Wind className="w-4 h-4" />
              Nefes Egzersizleri
            </button>
            
            <button
              onClick={() => setActiveMode('guided')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeMode === 'guided'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Heart className="w-4 h-4" />
              Rehberli Meditasyon
            </button>
            
            <button
              onClick={() => setActiveMode('history')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeMode === 'history'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Flame className="w-4 h-4" />
              Geçmiş
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {activeMode === 'breathing' && renderBreathingMode()}
        {activeMode === 'guided' && renderGuidedMode()}
        {activeMode === 'history' && renderHistoryMode()}
      </div>
    </div>
  )
}

export default MeditationTools