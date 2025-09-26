import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  BarChart3, 
  Calendar, 
  Target, 
  Award, 
  Zap,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Settings,
  Bell,
  Crown,
  Star,
  Lock
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({
    todayMood: null,
    weeklyAverage: 0,
    activeStreak: 0,
    monthlyGoal: { current: 0, target: 30 },
    recentMoods: []
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Premium durumu kontrol et
        const premiumStatus = localStorage.getItem('emotice_premium_status') === 'active' || 
                             profile?.subscription_status === 'premium';
        setIsPremium(premiumStatus);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDashboardStats({
          todayMood: null,
          weeklyAverage: 7.2,
          activeStreak: 5,
          monthlyGoal: { current: 23, target: 30 },
          recentMoods: [
            { date: '2024-12-23', mood: 8, emoji: '😊' },
            { date: '2024-12-22', mood: 6, emoji: '😐' },
            { date: '2024-12-21', mood: 9, emoji: '😄' },
            { date: '2024-12-20', mood: 7, emoji: '🙂' },
            { date: '2024-12-19', mood: 5, emoji: '😕' }
          ]
        });
      } catch (error) {
        toast.error('Dashboard verileri yüklenirken hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id, profile]);

  const getTrendIcon = (current, previous) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı';
    
    if (hour < 12) return `Günaydın ${name}! 🌅`;
    if (hour < 18) return `İyi günler ${name}! ☀️`;
    return `İyi akşamlar ${name}! 🌙`;
  };

  const handleQuickMoodEntry = (mood) => {
    setDashboardStats(prev => ({
      ...prev,
      todayMood: { mood, emoji: getMoodEmoji(mood) }
    }));
    toast.success('Ruh haliniz kaydedildi! 🎉');
  };

  const getMoodEmoji = (mood) => {
    if (mood >= 9) return '😄';
    if (mood >= 7) return '😊';
    if (mood >= 5) return '😐';
    if (mood >= 3) return '😕';
    return '😢';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Premium Status */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              {getGreeting()}
            </h1>
            
            {/* Premium Status Badge */}
            <div className="flex items-center gap-4">
              {isPremium ? (
                <div className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-2 rounded-full shadow-lg">
                  <Crown className="w-5 h-5" />
                  <span className="font-semibold">Premium</span>
                  <Star className="w-4 h-4" />
                </div>
              ) : (
                <a 
                  href="/premium"
                  className="flex items-center gap-2 bg-white border-2 border-purple-200 text-purple-600 px-4 py-2 rounded-full hover:bg-purple-50 transition-colors shadow-sm"
                >
                  <Crown className="w-5 h-5" />
                  <span className="font-semibold">Premium'a Geç</span>
                </a>
              )}
            </div>
          </div>
          
          <p className="text-gray-600">
            Bugün nasıl hissediyorsun? Kendine iyi bak ve hedeflerine odaklan.
          </p>
        </div>

        {/* Premium Benefits Banner (sadece free kullanıcılar için) */}
        {!isPremium && (
          <div className="mb-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2 flex items-center gap-2">
                  <Crown className="w-6 h-6" />
                  Premium Özellikleri Keşfet
                </h3>
                <p className="text-purple-100 mb-4">
                  Sınırsız mood tracking, gelişmiş analytics ve özel içerikler
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Sınırsız Geçmiş
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    AI Insights
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    Veri Export
                  </span>
                </div>
              </div>
              <div className="text-right">
                <a 
                  href="/premium"
                  className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-colors inline-block"
                >
                  Hemen Başla
                </a>
                <p className="text-purple-200 text-sm mt-2">$16.99/ay'dan başlayan fiyatlarla</p>
              </div>
            </div>
          </div>
        )}

        {/* İstatistik Kartları */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Bugünkü Ruh Hali */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
            <div className="flex items-center justify-between mb-4">
              <Heart className="w-8 h-8 text-purple-600" />
              {dashboardStats.todayMood && (
                <span className="text-2xl">
                  {dashboardStats.todayMood.emoji}
                </span>
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Bugünkü Ruh Halim
            </h3>
            {dashboardStats.todayMood ? (
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardStats.todayMood.mood}/10
                </p>
                <p className="text-sm text-green-600">Kaydedildi ✓</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-3">Henüz girilmedi</p>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map(mood => (
                    <button
                      key={mood}
                      onClick={() => handleQuickMoodEntry(mood * 2)}
                      className="w-8 h-8 rounded-full bg-purple-100 hover:bg-purple-200 flex items-center justify-center text-sm font-medium text-purple-600 transition-colors"
                    >
                      {mood * 2}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Haftalık Ortalama */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              {getTrendIcon(dashboardStats.weeklyAverage, 6.8)}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Haftalık Ortalama
            </h3>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {dashboardStats.weeklyAverage}/10
              </p>
              <p className="text-sm text-gray-600">Son 7 gün</p>
            </div>
          </div>

          {/* Aktif Gün Serisi */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-green-600" />
              <Calendar className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Aktif Gün Serisi
            </h3>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {dashboardStats.activeStreak} gün
              </p>
              <p className="text-sm text-gray-600">Devam ediyor 🔥</p>
            </div>
          </div>

          {/* Aylık Hedef */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100 relative">
            {/* Free kullanıcılar için lock overlay */}
            {!isPremium && (
              <div className="absolute inset-0 bg-white bg-opacity-90 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <Lock className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Premium Özellik</p>
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-orange-600" />
              <Award className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Aylık Hedef
            </h3>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {dashboardStats.monthlyGoal.current}/{dashboardStats.monthlyGoal.target}
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all"
                  style={{ 
                    width: `${(dashboardStats.monthlyGoal.current / dashboardStats.monthlyGoal.target) * 100}%` 
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Ana İçerik Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Kısım - Hızlı Aksiyonlar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hızlı Aksiyonlar */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Hızlı Aksiyonlar
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left">
                  <Heart className="w-6 h-6 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-800">Ruh Hali Gir</h3>
                  <p className="text-sm text-gray-600">Bugünkü hislerini kaydet</p>
                </button>
                
                <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-left">
                  <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-800">Geçmişi Gör</h3>
                  <p className="text-sm text-gray-600">
                    {isPremium ? 'Sınırsız geçmiş' : 'Son 7 gün (Premium: Sınırsız)'}
                  </p>
                </button>
                
                <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-left relative">
                  {!isPremium && (
                    <Lock className="absolute top-2 right-2 w-4 h-4 text-gray-400" />
                  )}
                  <Target className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-800">Hedef Belirle</h3>
                  <p className="text-sm text-gray-600">
                    {isPremium ? 'Kişisel hedefler oluştur' : 'Premium özellik'}
                  </p>
                </button>
                
                <a 
                  href="/premium"
                  className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl hover:bg-amber-100 transition-colors text-left"
                >
                  <Crown className="w-6 h-6 text-amber-600 mb-2" />
                  <h3 className="font-medium text-gray-800">Premium</h3>
                  <p className="text-sm text-gray-600">Tüm özellikleri keşfet</p>
                </a>
              </div>
            </div>
          </div>

          {/* Sağ Kısım - Son Aktiviteler */}
          <div className="space-y-6">
            {/* Son Ruh Halleri */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                Son Ruh Hallerin
              </h2>
              <div className="space-y-3">
                {dashboardStats.recentMoods.map((mood, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{mood.emoji}</span>
                      <div>
                        <p className="font-medium text-gray-800">{mood.mood}/10</p>
                        <p className="text-sm text-gray-600">
                          {new Date(mood.date).toLocaleDateString('tr-TR', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      mood.mood >= 7 ? 'bg-green-400' : 
                      mood.mood >= 5 ? 'bg-yellow-400' : 'bg-red-400'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Premium Özellikler (Free kullanıcılar için) */}
            {!isPremium && (
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Crown className="w-6 h-6" />
                  Premium Özellikleri
                </h2>
                <ul className="space-y-2 text-purple-100 mb-4">
                  <li>✨ Sınırsız geçmiş</li>
                  <li>✨ Gelişmiş analytics</li>
                  <li>✨ Kişisel AI insights</li>
                  <li>✨ Veri export (CSV, PDF)</li>
                  <li>✨ Öncelikli destek</li>
                </ul>
                <a 
                  href="/premium"
                  className="block w-full bg-white text-purple-600 px-4 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors text-center"
                >
                  Premium'a Geç - $16.99/ay
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;