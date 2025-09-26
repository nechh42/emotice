// src/pages/Premium/PremiumFeatures.jsx
import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { fortuneService } from '../../services/fortuneService'
import { meditationService } from '../../services/meditationService'
import { musicService } from '../../services/musicService'
import TarotReader from '../../components/fortune/TarotReader'
import Astrology from '../../components/fortune/Astrology'
import Numerology from '../../components/fortune/numerology/Numerology'
import MotivationBot from '../../components/motivation/MotivationBot'
import MeditationTools from '../../components/meditation/MeditationTools'
import MusicPlayer from '../../components/music/MusicPlayer'
import PremiumFeatures from './pages/Premium/PremiumFeatures'
import { 
  Sparkles, 
  Star, 
  Calculator, 
  Heart, 
  Bot, 
  Music, 
  Crown,
  ChevronRight,
  Lock,
  Clock,
  TrendingUp,
  Wind,
  Flame,
  Headphones
} from 'lucide-react'

const PremiumFeatures = () => {
  const { user, userProfile } = useAuth()
  const [activeFeature, setActiveFeature] = useState('overview')
  const [fortuneStats, setFortuneStats] = useState(null)
  const [meditationStats, setMeditationStats] = useState(null)
  const [musicStats, setMusicStats] = useState(null)
  const [loading, setLoading] = useState(true)

  const isPremium = userProfile?.subscription_status === 'active'

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    if (!user) return
    
    setLoading(true)
    
    // Fortune stats yükle
    const fortuneResult = await fortuneService.getFortuneStats()
    if (fortuneResult.success) {
      setFortuneStats(fortuneResult.data)
    }

    // Meditation stats yükle
    const meditationResult = await meditationService.getMeditationStats()
    if (meditationResult.success) {
      setMeditationStats(meditationResult.data)
    }

    // Music stats yükle
    const musicResult = await musicService.getMusicStats()
    if (musicResult.success) {
      setMusicStats(musicResult.data)
    }
    
    setLoading(false)
  }

  const features = [
    {
      id: 'tarot',
      title: 'Tarot Falı',
      icon: Sparkles,
      description: '78 kart ile detaylı tarot okumalarında',
      color: 'bg-purple-500',
      isPremium: false,
      count: fortuneStats?.tarot || 0
    },
    {
      id: 'astrology',
      title: 'Astroloji',
      icon: Star,
      description: 'Burç uyumlulukları ve astrolojik analizler',
      color: 'bg-blue-500',
      isPremium: false,
      count: fortuneStats?.astrology || 0
    },
    {
      id: 'numerology',
      title: 'Numeroloji',
      icon: Calculator,
      description: 'Sayıların gizli anlamları ve kişilik analizi',
      color: 'bg-green-500',
      isPremium: false,
      count: fortuneStats?.numerology || 0
    },
    {
      id: 'meditation',
      title: 'Meditasyon Araçları',
      icon: Wind,
      description: 'Nefes egzersizleri ve rehberli meditasyon',
      color: 'bg-teal-500',
      isPremium: false,
      count: meditationStats?.totalSessions || 0
    },
    {
      id: 'music',
      title: 'Ruh Hali Müziği',
      icon: Music,
      description: 'Mood tabanlı müzik önerileri ve player',
      color: 'bg-pink-500',
      isPremium: true,
      count: musicStats?.totalPlays || 0
    },
    {
      id: 'motivation',
      title: 'Motivasyon Robotu',
      icon: Bot,
      description: '750+ özelleştirilmiş motivasyon mesajı',
      color: 'bg-orange-500',
      isPremium: true,
      count: 0
    },
    {
      id: 'compatibility',
      title: 'Partner Uyumluluğu',
      icon: Heart,
      description: 'Numerolojik uyumluluk analizi',
      color: 'bg-red-500',
      isPremium: true,
      count: fortuneStats?.compatibility || 0
    }
  ]

  const renderFeature = () => {
    switch (activeFeature) {
      case 'tarot':
        return <TarotReader />
      case 'astrology':
        return <Astrology />
      case 'numerology':
        return <Numerology />
      case 'meditation':
        return <MeditationTools />
      case 'music':
        if (!isPremium) {
          return <PremiumRequired feature="Ruh Hali Müziği" />
        }
        return <MusicPlayer />
      case 'motivation':
        if (!isPremium) {
          return <PremiumRequired feature="Motivasyon Robotu" />
        }
        return <MotivationBot />
      case 'compatibility':
        if (!isPremium) {
          return <PremiumRequired feature="Partner Uyumluluğu" />
        }
        return <NumerologyCompatibility />
      default:
        return <OverviewDashboard />
    }
  }

  const PremiumRequired = ({ feature }) => (
    <div className="max-w-2xl mx-auto text-center p-8">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-6">
        <Crown className="w-10 h-10 text-purple-600" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        {feature} Premium Özelliği
      </h2>
      <p className="text-gray-600 mb-8">
        Bu özelliğe erişebilmek için premium üyeliğe geçmeniz gerekmektedir.
      </p>
      <button
        onClick={() => window.location.href = '/premium'}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
      >
        Premium'a Geç
      </button>
    </div>
  )

  const NumerologyCompatibility = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <Heart className="w-8 h-8 text-red-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Partner Uyumluluğu</h1>
        <p className="text-gray-600 mt-2">
          Numerolojik analiz ile partner uyumluluğunuzu keşfedin
        </p>
      </div>
      
      <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-8 text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          💕 Gelişmiş Uyumluluk Analizi
        </h3>
        <p className="text-gray-700 mb-6">
          Bu özellik şu anda geliştirme aşamasında. Yakında partnerinizle numerolojik uyumluluğunuzu detaylı bir şekilde analiz edebileceksiniz.
        </p>
        <div className="space-y-2 text-sm text-gray-600">
          <p>✨ Yaşam yolu uyumluluğu</p>
          <p>💫 Kader sayısı analizi</p>
          <p>💖 Ruh sayısı bağlantısı</p>
          <p>🎯 İlişki önerileri</p>
        </div>
      </div>
    </div>
  )

  const OverviewDashboard = () => (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full mb-4">
          <Sparkles className="w-10 h-10 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Premium Özellikler</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Ruh halinizi iyileştiren ve kişisel gelişiminizi destekleyen premium araçlarımızı keşfedin
        </p>
        
        {/* Premium Status */}
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
          isPremium 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-600'
        }`}>
          <Crown className="w-4 h-4" />
          {isPremium ? 'Premium Üye' : 'Ücretsiz Kullanıcı'}
        </div>
      </div>

      {/* Stats Cards */}
      {(fortuneStats || meditationStats || musicStats) && !loading && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{fortuneStats?.total || 0}</div>
            <div className="text-sm text-purple-600">Toplam Fal</div>
          </div>
          <div className="bg-teal-50 border border-teal-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-teal-600">{meditationStats?.totalSessions || 0}</div>
            <div className="text-sm text-teal-600">Meditasyon</div>
          </div>
          <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-pink-600">{musicStats?.totalPlays || 0}</div>
            <div className="text-sm text-pink-600">Müzik</div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{meditationStats?.currentStreak || 0}</div>
            <div className="text-sm text-orange-600">Günlük Seri</div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{fortuneStats?.thisMonth || 0}</div>
            <div className="text-sm text-blue-600">Bu Ay Fal</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {musicStats?.totalListeningMinutes || meditationStats?.totalMinutes ? 
                Math.round((musicStats?.totalListeningMinutes || 0) + (meditationStats?.totalMinutes || 0)) : 0}
            </div>
            <div className="text-sm text-green-600">Dakika</div>
          </div>
        </div>
      )}

      {/* Feature Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.id}
            onClick={() => setActiveFeature(feature.id)}
            className={`relative bg-white rounded-2xl shadow-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-xl hover:scale-105 ${
              feature.isPremium && !isPremium ? 'opacity-75' : ''
            }`}
          >
            {/* Premium Badge */}
            {feature.isPremium && (
              <div className="absolute -top-2 -right-2">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  {isPremium ? 'Premium' : '🔒 Premium'}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className={`inline-flex items-center justify-center w-12 h-12 ${feature.color} rounded-xl`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>

              {/* Usage Count */}
              {feature.count !== undefined && feature.count > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <TrendingUp className="w-4 h-4" />
                  {feature.count} kez kullandınız
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  {feature.isPremium && !isPremium ? 'Premium Gerekli' : 'Kullanılabilir'}
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">🚀 Hızlı Başlangıç</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <button
            onClick={() => setActiveFeature('meditation')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <Wind className="w-6 h-6 text-teal-500 mb-2" />
            <div className="font-medium">Nefes Egzersizi</div>
            <div className="text-sm text-gray-600">Hemen rahatla</div>
          </button>
          
          <button
            onClick={() => setActiveFeature('numerology')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <Calculator className="w-6 h-6 text-green-500 mb-2" />
            <div className="font-medium">Numeroloji</div>
            <div className="text-sm text-gray-600">Kişiliğini keşfet</div>
          </button>
          
          <button
            onClick={() => setActiveFeature('tarot')}
            className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <Sparkles className="w-6 h-6 text-purple-500 mb-2" />
            <div className="font-medium">Tarot Falı</div>
            <div className="text-sm text-gray-600">Günlük rehberlik</div>
          </button>
          
          <button
            onClick={() => setActiveFeature('music')}
            className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow text-left ${
              !isPremium ? 'opacity-50' : ''
            }`}
            disabled={!isPremium}
          >
            <Headphones className="w-6 h-6 text-pink-500 mb-2" />
            <div className="font-medium">Müzik Player</div>
            <div className="text-sm text-gray-600">
              {isPremium ? 'Mood müziği' : 'Premium gerekli'}
            </div>
          </button>
        </div>
      </div>

      {/* Meditation Streak Card */}
      {meditationStats && meditationStats.currentStreak > 0 && (
        <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-2xl p-8 text-white text-center">
          <Flame className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">
            {meditationStats.currentStreak} Günlük Meditasyon Serisi! 🔥
          </h3>
          <p className="opacity-90">
            Harika! Meditasyon alışkanlığınızı sürdürmeye devam edin.
          </p>
        </div>
      )}

      {/* Music Stats Card */}
      {musicStats && musicStats.totalPlays > 0 && isPremium && (
        <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl p-8 text-white text-center">
          <Music className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">
            {musicStats.totalPlays} Şarkı Dinlediniz! 🎵
          </h3>
          <p className="opacity-90">
            En sevdiğiniz mood: {musicStats.topMoodCategory || 'henüz belirlenmedi'}
          </p>
        </div>
      )}

      {/* Premium Upgrade CTA */}
      {!isPremium && (
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center">
          <Crown className="w-12 h-12 mx-auto mb-4" />
          <h3 className="text-2xl font-bold mb-2">Premium'a Geçin</h3>
          <p className="mb-6 opacity-90">
            Müzik sistemi, gelişmiş meditasyon, motivasyon robotu ve daha fazlasına erişin
          </p>
          <div className="grid md:grid-cols-3 gap-4 mb-6 text-sm">
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <Music className="w-6 h-6 mx-auto mb-2" />
              <div>Sınırsız Müzik</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <Bot className="w-6 h-6 mx-auto mb-2" />
              <div>750+ Motivasyon</div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-lg p-3">
              <Heart className="w-6 h-6 mx-auto mb-2" />
              <div>Partner Uyumluluğu</div>
            </div>
          </div>
          <button
            onClick={() => window.location.href = '/premium'}
            className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Premium Planları İncele
          </button>
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-600">Yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center gap-8 py-4 overflow-x-auto">
            <button
              onClick={() => setActiveFeature('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                activeFeature === 'overview'
                  ? 'bg-purple-100 text-purple-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              Genel Bakış
            </button>
            
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeFeature === feature.id
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-600 hover:text-gray-900'
                } ${feature.isPremium && !isPremium ? 'opacity-60' : ''}`}
              >
                <feature.icon className="w-4 h-4" />
                {feature.title}
                {feature.isPremium && !isPremium && (
                  <Lock className="w-3 h-3" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="py-8">
        {renderFeature()}
      </div>
    </div>
  )
}

export default PremiumFeatures