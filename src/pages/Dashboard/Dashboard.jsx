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
  Bell
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import MotivationBot from "../../components/motivation/MotivationBot";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState({
    todayMood: null,
    weeklyAverage: 0,
    activeStreak: 0,
    monthlyGoal: { current: 0, target: 30 },
    recentMoods: []
  });

  // Simulated data - gerÃ§ek API'dan gelecek
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setDashboardStats({
          todayMood: null, // BugÃ¼n henÃ¼z ruh hali girilmemiÅŸ
          weeklyAverage: 7.2,
          activeStreak: 5,
          monthlyGoal: { current: 23, target: 30 },
          recentMoods: [
            { date: '2024-12-23', mood: 8, emoji: 'ğŸ˜Š' },
            { date: '2024-12-22', mood: 6, emoji: 'ğŸ˜' },
            { date: '2024-12-21', mood: 9, emoji: 'ğŸ˜„' },
            { date: '2024-12-20', mood: 7, emoji: 'ğŸ™‚' },
            { date: '2024-12-19', mood: 5, emoji: 'ğŸ˜•' }
          ]
        });
      } catch (error) {
        toast.error('Dashboard verileri yÃ¼klenirken hata oluÅŸtu');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadDashboardData();
    }
  }, [user?.id]);

  const getTrendIcon = (current, previous) => {
    if (current > previous) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (current < previous) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return <Minus className="w-4 h-4 text-gray-500" />;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.full_name || user?.email?.split('@')[0] || 'KullanÄ±cÄ±';
    
    if (hour < 12) return `GÃ¼naydÄ±n ${name}! ğŸŒ…`;
    if (hour < 18) return `Ä°yi gÃ¼nler ${name}! â˜€ï¸`;
    return `Ä°yi akÅŸamlar ${name}! ğŸŒ™`;
  };

  const handleQuickMoodEntry = (mood) => {
    // HÄ±zlÄ± ruh hali giriÅŸi
    setDashboardStats(prev => ({
      ...prev,
      todayMood: { mood, emoji: getMoodEmoji(mood) }
    }));
    toast.success('Ruh haliniz kaydedildi! ğŸ‰');
  };

  const getMoodEmoji = (mood) => {
    if (mood >= 9) return 'ğŸ˜„';
    if (mood >= 7) return 'ğŸ˜Š';
    if (mood >= 5) return 'ğŸ˜';
    if (mood >= 3) return 'ğŸ˜•';
    return 'ğŸ˜¢';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Dashboard yÃ¼kleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}
          </h1>
          <p className="text-gray-600">
            BugÃ¼n nasÄ±l hissediyorsun? Kendine iyi bak ve hedeflerine odaklan.
          </p>
        </div>

        {/* Ãœst Ä°statistik KartlarÄ± */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* BugÃ¼nkÃ¼ Ruh Hali */}
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
              BugÃ¼nkÃ¼ Ruh Halim
            </h3>
            {dashboardStats.todayMood ? (
              <div>
                <p className="text-2xl font-bold text-purple-600">
                  {dashboardStats.todayMood.mood}/10
                </p>
                <p className="text-sm text-green-600">Kaydedildi âœ“</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-gray-500 mb-3">HenÃ¼z girilmedi</p>
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

          {/* HaftalÄ±k Ortalama */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-blue-100">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              {getTrendIcon(dashboardStats.weeklyAverage, 6.8)}
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              HaftalÄ±k Ortalama
            </h3>
            <div>
              <p className="text-2xl font-bold text-blue-600">
                {dashboardStats.weeklyAverage}/10
              </p>
              <p className="text-sm text-gray-600">Son 7 gÃ¼n</p>
            </div>
          </div>

          {/* Aktif GÃ¼n Serisi */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-green-100">
            <div className="flex items-center justify-between mb-4">
              <Zap className="w-8 h-8 text-green-600" />
              <Calendar className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Aktif GÃ¼n Serisi
            </h3>
            <div>
              <p className="text-2xl font-bold text-green-600">
                {dashboardStats.activeStreak} gÃ¼n
              </p>
              <p className="text-sm text-gray-600">Devam ediyor ğŸ”¥</p>
            </div>
          </div>

          {/* AylÄ±k Hedef */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-100">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-orange-600" />
              <Award className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              AylÄ±k Hedef
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

        {/* Ana Ä°Ã§erik Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol KÄ±sÄ±m - Motivasyon Botu ve HÄ±zlÄ± Aksiyonlar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Motivasyon Botu Widget */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">
                  BugÃ¼nÃ¼n Motivasyonu
                </h2>
              </div>
              <div className="p-6">
                <MotivationBot embedded={true} />
              </div>
            </div>

            {/* HÄ±zlÄ± Aksiyonlar */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                HÄ±zlÄ± Aksiyonlar
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <button className="p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors text-left">
                  <Heart className="w-6 h-6 text-purple-600 mb-2" />
                  <h3 className="font-medium text-gray-800">Ruh Hali Gir</h3>
                  <p className="text-sm text-gray-600">BugÃ¼nkÃ¼ hislerini kaydet</p>
                </button>
                
                <button className="p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors text-left">
                  <BarChart3 className="w-6 h-6 text-blue-600 mb-2" />
                  <h3 className="font-medium text-gray-800">GeÃ§miÅŸi GÃ¶r</h3>
                  <p className="text-sm text-gray-600">Ruh hali geÃ§miÅŸin</p>
                </button>
                
                <button className="p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors text-left">
                  <Target className="w-6 h-6 text-green-600 mb-2" />
                  <h3 className="font-medium text-gray-800">Hedef Belirle</h3>
                  <p className="text-sm text-gray-600">Yeni hedefler oluÅŸtur</p>
                </button>
                
                <button className="p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors text-left">
                  <Settings className="w-6 h-6 text-orange-600 mb-2" />
                  <h3 className="font-medium text-gray-800">Ayarlar</h3>
                  <p className="text-sm text-gray-600">Profili dÃ¼zenle</p>
                </button>
              </div>
            </div>
          </div>

          {/* SaÄŸ KÄ±sÄ±m - Son Aktiviteler ve Ä°puÃ§larÄ± */}
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

            {/* GÃ¼nÃ¼n Ä°pucu */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <h2 className="text-xl font-semibold mb-4">ğŸ’¡ GÃ¼nÃ¼n Ä°pucu</h2>
              <p className="text-purple-100 mb-4">
                Ruh halinizi dÃ¼zenli olarak takip etmek, duygusal saÄŸlÄ±ÄŸÄ±nÄ±z hakkÄ±nda deÄŸerli bilgiler sunar. 
                Her gÃ¼n sadece 2 dakika ayÄ±rÄ±n!
              </p>
              <button className="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                Daha Fazla Ä°pucu
              </button>
            </div>

            {/* Bildirimler */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Bildirimler
                </h2>
                <Bell className="w-5 h-5 text-gray-400" />
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                  <p className="text-sm font-medium text-blue-800">
                    HaftalÄ±k rapor hazÄ±r! ğŸ“Š
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    2 saat Ã¶nce
                  </p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
                  <p className="text-sm font-medium text-green-800">
                    5 gÃ¼nlÃ¼k seri tamamlandÄ±! ğŸ‰
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    1 gÃ¼n Ã¶nce
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

