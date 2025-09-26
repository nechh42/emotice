// src/components/music/MusicPlayer.jsx
import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Heart,
  Plus,
  Music,
  Clock,
  Crown,
  Lock,
  Headphones,
  Radio,
  List
} from 'lucide-react'

const MusicPlayer = () => {
  const { userProfile } = useAuth()
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(null)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)
  const [selectedMood, setSelectedMood] = useState('happy')
  const [activeView, setActiveView] = useState('moods')
  const [favorites, setFavorites] = useState([])
  const [currentPlaylist, setCurrentPlaylist] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)

  const audioRef = useRef(null)
  const progressRef = useRef(null)

  const isPremium = userProfile?.subscription_status === 'active'

  // Mood kategorileri ve şarkılar
  const moodCategories = {
    happy: {
      name: 'Mutlu',
      emoji: '😊',
      color: 'from-yellow-400 to-orange-500',
      description: 'Neşeli ve enerjik şarkılar',
      isPremium: false
    },
    sad: {
      name: 'Üzgün',
      emoji: '😢',
      color: 'from-blue-400 to-indigo-600',
      description: 'Hüzünlü ve melankolik müzikler',
      isPremium: false
    },
    calm: {
      name: 'Sakin',
      emoji: '😌',
      color: 'from-green-400 to-teal-500',
      description: 'Rahatlatıcı ve huzur verici',
      isPremium: false
    },
    energetic: {
      name: 'Enerjik',
      emoji: '🔥',
      color: 'from-red-400 to-pink-500',
      description: 'Motivasyonlu ve dinamik',
      isPremium: true
    },
    romantic: {
      name: 'Romantik',
      emoji: '💕',
      color: 'from-pink-400 to-rose-500',
      description: 'Aşk dolu ve duygusal',
      isPremium: true
    },
    focus: {
      name: 'Odaklanma',
      emoji: '🎯',
      color: 'from-purple-400 to-violet-500',
      description: 'Konsantrasyon için instrumental',
      isPremium: true
    },
    sleep: {
      name: 'Uyku',
      emoji: '😴',
      color: 'from-indigo-400 to-purple-600',
      description: 'Uyku için sakinleştirici sesler',
      isPremium: true
    },
    meditation: {
      name: 'Meditasyon',
      emoji: '🧘',
      color: 'from-teal-400 to-cyan-500',
      description: 'Derin meditasyon müzikleri',
      isPremium: true
    }
  }

  // Demo şarkı listesi (gerçek uygulamada API'den gelecek)
  const musicLibrary = {
    happy: [
      {
        id: 1,
        title: 'Sunshine Day',
        artist: 'Happy Vibes',
        duration: '3:24',
        cover: '/images/covers/sunshine.jpg',
        audioUrl: '/music/happy/sunshine-day.mp3',
        isPremium: false
      },
      {
        id: 2,
        title: 'Good Morning',
        artist: 'Positive Energy',
        duration: '2:48',
        cover: '/images/covers/morning.jpg',
        audioUrl: '/music/happy/good-morning.mp3',
        isPremium: false
      },
      {
        id: 3,
        title: 'Dancing Clouds',
        artist: 'Joy Makers',
        duration: '4:12',
        cover: '/images/covers/clouds.jpg',
        audioUrl: '/music/happy/dancing-clouds.mp3',
        isPremium: true
      }
    ],
    sad: [
      {
        id: 4,
        title: 'Rainy Evening',
        artist: 'Melancholy Souls',
        duration: '4:35',
        cover: '/images/covers/rain.jpg',
        audioUrl: '/music/sad/rainy-evening.mp3',
        isPremium: false
      },
      {
        id: 5,
        title: 'Empty Room',
        artist: 'Silent Hearts',
        duration: '3:52',
        cover: '/images/covers/empty.jpg',
        audioUrl: '/music/sad/empty-room.mp3',
        isPremium: false
      }
    ],
    calm: [
      {
        id: 6,
        title: 'Ocean Waves',
        artist: 'Nature Sounds',
        duration: '8:00',
        cover: '/images/covers/ocean.jpg',
        audioUrl: '/music/calm/ocean-waves.mp3',
        isPremium: false
      },
      {
        id: 7,
        title: 'Forest Path',
        artist: 'Peaceful Mind',
        duration: '6:24',
        cover: '/images/covers/forest.jpg',
        audioUrl: '/music/calm/forest-path.mp3',
        isPremium: false
      }
    ],
    energetic: [
      {
        id: 8,
        title: 'Power Up',
        artist: 'Energy Boost',
        duration: '3:18',
        cover: '/images/covers/power.jpg',
        audioUrl: '/music/energetic/power-up.mp3',
        isPremium: true
      },
      {
        id: 9,
        title: 'Lightning Strike',
        artist: 'Thunder Force',
        duration: '4:02',
        cover: '/images/covers/lightning.jpg',
        audioUrl: '/music/energetic/lightning-strike.mp3',
        isPremium: true
      }
    ],
    romantic: [
      {
        id: 10,
        title: 'Moonlight Serenade',
        artist: 'Love Songs',
        duration: '4:45',
        cover: '/images/covers/moonlight.jpg',
        audioUrl: '/music/romantic/moonlight-serenade.mp3',
        isPremium: true
      }
    ],
    focus: [
      {
        id: 11,
        title: 'Deep Concentration',
        artist: 'Focus Music',
        duration: '10:00',
        cover: '/images/covers/focus.jpg',
        audioUrl: '/music/focus/deep-concentration.mp3',
        isPremium: true
      }
    ],
    sleep: [
      {
        id: 12,
        title: 'Gentle Dreams',
        artist: 'Sleep Sounds',
        duration: '30:00',
        cover: '/images/covers/dreams.jpg',
        audioUrl: '/music/sleep/gentle-dreams.mp3',
        isPremium: true
      }
    ],
    meditation: [
      {
        id: 13,
        title: 'Tibetan Bowls',
        artist: 'Meditation Masters',
        duration: '15:00',
        cover: '/images/covers/tibetan.jpg',
        audioUrl: '/music/meditation/tibetan-bowls.mp3',
        isPremium: true
      }
    ]
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    
    audio.addEventListener('timeupdate', updateTime)
    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('ended', handleTrackEnd)

    return () => {
      audio.removeEventListener('timeupdate', updateTime)
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('ended', handleTrackEnd)
    }
  }, [currentTrack])

  useEffect(() => {
    // Favorites'ı localStorage'dan yükle
    const savedFavorites = JSON.parse(localStorage.getItem('music_favorites') || '[]')
    setFavorites(savedFavorites)
  }, [])

  const handleTrackEnd = () => {
    if (isRepeat) {
      playTrack(currentTrack)
    } else {
      playNext()
    }
  }

  const playTrack = (track) => {
    if (!track) return
    
    if (track.isPremium && !isPremium) {
      // Premium gerekli uyarısı
      alert('Bu şarkı premium üyelik gerektirir!')
      return
    }

    setCurrentTrack(track)
    setIsPlaying(true)

    if (audioRef.current) {
      audioRef.current.src = track.audioUrl
      audioRef.current.play().catch(e => {
        console.log('Ses dosyası çalınamadı:', e)
        setIsPlaying(false)
      })
    }
  }

  const togglePlayPause = () => {
    if (!currentTrack) return

    if (isPlaying) {
      audioRef.current?.pause()
      setIsPlaying(false)
    } else {
      audioRef.current?.play()
      setIsPlaying(true)
    }
  }

  const playNext = () => {
    if (currentPlaylist.length === 0) return

    let nextIndex
    if (isShuffle) {
      nextIndex = Math.floor(Math.random() * currentPlaylist.length)
    } else {
      nextIndex = (currentIndex + 1) % currentPlaylist.length
    }
    
    setCurrentIndex(nextIndex)
    playTrack(currentPlaylist[nextIndex])
  }

  const playPrevious = () => {
    if (currentPlaylist.length === 0) return

    let prevIndex
    if (isShuffle) {
      prevIndex = Math.floor(Math.random() * currentPlaylist.length)
    } else {
      prevIndex = currentIndex === 0 ? currentPlaylist.length - 1 : currentIndex - 1
    }
    
    setCurrentIndex(prevIndex)
    playTrack(currentPlaylist[prevIndex])
  }

  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressRef.current) return

    const rect = progressRef.current.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    if (audioRef.current) {
      audioRef.current.volume = newVolume
    }
  }

  const toggleFavorite = (track) => {
    const newFavorites = favorites.some(fav => fav.id === track.id)
      ? favorites.filter(fav => fav.id !== track.id)
      : [...favorites, track]
    
    setFavorites(newFavorites)
    localStorage.setItem('music_favorites', JSON.stringify(newFavorites))
  }

  const selectMood = (mood) => {
    setSelectedMood(mood)
    const playlist = musicLibrary[mood] || []
    setCurrentPlaylist(playlist)
    setCurrentIndex(0)
  }

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const renderMoodGrid = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Ruh Haline Göre Müzik</h2>
        <p className="text-gray-600">Moodnuza uygun müzikleri keşfedin</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(moodCategories).map(([mood, category]) => (
          <button
            key={mood}
            onClick={() => selectMood(mood)}
            disabled={category.isPremium && !isPremium}
            className={`relative p-6 rounded-2xl text-white transition-all duration-200 hover:scale-105 ${
              category.isPremium && !isPremium 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:shadow-xl cursor-pointer'
            } bg-gradient-to-br ${category.color}`}
          >
            {category.isPremium && !isPremium && (
              <div className="absolute top-2 right-2">
                <Crown className="w-4 h-4" />
              </div>
            )}
            
            <div className="text-center space-y-2">
              <div className="text-3xl mb-2">{category.emoji}</div>
              <div className="font-semibold">{category.name}</div>
              <div className="text-xs opacity-80">{category.description}</div>
              <div className="text-xs opacity-60">
                {musicLibrary[mood]?.length || 0} şarkı
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Free vs Premium Info */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900 mb-1">
              🎵 Müzik Deneyiminizi Geliştirin
            </h3>
            <p className="text-sm text-gray-600">
              {isPremium 
                ? 'Tüm mood kategorilerine erişiminiz var!'
                : 'Premium ile 8 mood kategorisine ve sınırsız şarkıya erişin'
              }
            </p>
          </div>
          {!isPremium && (
            <button
              onClick={() => window.location.href = '/premium'}
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-pink-600 transition-colors"
            >
              Premium'a Geç
            </button>
          )}
        </div>
      </div>
    </div>
  )

  const renderPlaylist = () => {
    const tracks = musicLibrary[selectedMood] || []
    const mood = moodCategories[selectedMood]

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${mood.color} flex items-center justify-center text-2xl`}>
            {mood.emoji}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{mood.name} Müzikler</h2>
            <p className="text-gray-600">{mood.description}</p>
          </div>
        </div>

        <div className="space-y-2">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-gray-50 ${
                currentTrack?.id === track.id ? 'bg-purple-50 border border-purple-200' : 'bg-white'
              } ${track.isPremium && !isPremium ? 'opacity-50' : ''}`}
            >
              <button
                onClick={() => playTrack(track)}
                disabled={track.isPremium && !isPremium}
                className="w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{track.title}</h3>
                  {track.isPremium && (
                    <Crown className="w-4 h-4 text-purple-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{track.artist}</p>
              </div>

              <div className="text-sm text-gray-500">{track.duration}</div>

              <button
                onClick={() => toggleFavorite(track)}
                className={`p-2 rounded-full transition-colors ${
                  favorites.some(fav => fav.id === track.id)
                    ? 'text-red-500 hover:text-red-600'
                    : 'text-gray-400 hover:text-red-500'
                }`}
              >
                <Heart className="w-5 h-5" fill={favorites.some(fav => fav.id === track.id) ? 'currentColor' : 'none'} />
              </button>
            </div>
          ))}
        </div>

        {tracks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Bu mood kategorisinde henüz şarkı bulunmuyor</p>
          </div>
        )}
      </div>
    )
  }

  const renderFavorites = () => (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-900">Favori Şarkılarım</h2>
        <p className="text-gray-600">Beğendiğiniz şarkılar</p>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <Heart className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Henüz favori şarkınız yok</p>
          <p className="text-sm">Şarkıları beğenerek favori listenizi oluşturun</p>
        </div>
      ) : (
        <div className="space-y-2">
          {favorites.map((track) => (
            <div
              key={track.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-gray-50 ${
                currentTrack?.id === track.id ? 'bg-purple-50 border border-purple-200' : 'bg-white'
              }`}
            >
              <button
                onClick={() => playTrack(track)}
                className="w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center transition-colors"
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause className="w-5 h-5" />
                ) : (
                  <Play className="w-5 h-5 ml-0.5" />
                )}
              </button>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-gray-900">{track.title}</h3>
                  {track.isPremium && (
                    <Crown className="w-4 h-4 text-purple-500" />
                  )}
                </div>
                <p className="text-sm text-gray-600">{track.artist}</p>
              </div>

              <div className="text-sm text-gray-500">{track.duration}</div>

              <button
                onClick={() => toggleFavorite(track)}
                className="p-2 rounded-full text-red-500 hover:text-red-600 transition-colors"
              >
                <Heart className="w-5 h-5" fill="currentColor" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <Headphones className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Ruh Hali Müziği</h1>
        <p className="text-gray-600">
          Moodnuza uygun müziklerle ruh halinizi iyileştirin
        </p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center">
        <div className="bg-white rounded-xl shadow-sm border p-1 flex gap-1">
          <button
            onClick={() => setActiveView('moods')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'moods'
                ? 'bg-purple-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Radio className="w-4 h-4 inline mr-2" />
            Mood'lar
          </button>
          <button
            onClick={() => setActiveView('playlist')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'playlist'
                ? 'bg-purple-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <List className="w-4 h-4 inline mr-2" />
            Playlist
          </button>
          <button
            onClick={() => setActiveView('favorites')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeView === 'favorites'
                ? 'bg-purple-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Heart className="w-4 h-4 inline mr-2" />
            Favoriler
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl shadow-lg p-8">
        {activeView === 'moods' && renderMoodGrid()}
        {activeView === 'playlist' && renderPlaylist()}
        {activeView === 'favorites' && renderFavorites()}
      </div>

      {/* Music Player Bar */}
      {currentTrack && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-50">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4">
              {/* Track Info */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Music className="w-6 h-6 text-purple-600" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-medium text-gray-900 truncate">{currentTrack.title}</h4>
                  <p className="text-sm text-gray-600 truncate">{currentTrack.artist}</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={playPrevious}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <SkipBack className="w-5 h-5" />
                </button>
                
                <button
                  onClick={togglePlayPause}
                  className="p-3 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5" />
                  ) : (
                    <Play className="w-5 h-5 ml-0.5" />
                  )}
                </button>
                
                <button
                  onClick={playNext}
                  className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <SkipForward className="w-5 h-5" />
                </button>
              </div>

              {/* Progress */}
              <div className="flex items-center gap-2 flex-1 max-w-md">
                <span className="text-xs text-gray-500 min-w-[40px]">
                  {formatTime(currentTime)}
                </span>
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer"
                >
                  <div
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 min-w-[40px]">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Volume & Options */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsShuffle(!isShuffle)}
                  className={`p-2 rounded transition-colors ${
                    isShuffle ? 'text-purple-600' : 'text-gray-400'
                  }`}
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setIsRepeat(!isRepeat)}
                  className={`p-2 rounded transition-colors ${
                    isRepeat ? 'text-purple-600' : 'text-gray-400'
                  }`}
                >
                  <Repeat className="w-4 h-4" />
                </button>

                <button onClick={toggleMute} className="p-2 text-gray-600 hover:text-gray-900">
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        onError={() => {
          console.log('Audio error occurred')
          setIsPlaying(false)
        }}
      />
    </div>
  )
}

export default MusicPlayer