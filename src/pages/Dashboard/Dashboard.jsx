// src/pages/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import MoodTracker from '../components/mood/MoodTracker';
import { 
  TrendingUp, Calendar, Heart, Zap, 
  Target, Award, Clock, BarChart3 
} from 'lucide-react';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [todaysMood, setTodaysMood] = useState(null);
  const [recentMoods, setRecentMoods] = useState([]);
  const [weekStats, setWeekStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showMoodTracker, setShowMoodTracker] = useState(false);

  useEffect(() => {
    initializeDashboard();
  }, []);

  const initializeDashboard = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      
      if (user) {
        await Promise.all([
          fetchTodaysMood(user.id),
          fetchRecentMoods(user.id),
          fetchWeekStats(user.id)
        ]);
      }
    } catch (error) {
      console.error('Dashboard yüklenirken hata:', error);
      toast.error('Dashboard yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const fetchTodaysMood = async (userId) => {
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .eq('date', today)
      .order('created_at', { ascending: false })
      .limit(1);
    
    setTodaysMood(data?.[0] || null);
  };

  const fetchRecentMoods = async (userId) => {
    const { data } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(7);
    
    setRecentMoods(data || []);
  };

  const fetchWeekStats = async (userId) => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { data } = await supabase
      .from('mood_entries')
      .select('*')
      .eq('user_id', userId)
      .gte('created_at', weekAgo)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      const scores = data.map(entry => entry.mood_level);
      const average = scores.reduce((a, b) => a + b, 0) / scores.length;
      const trend = calculateTrend(data);
      
      setWeekStats({
        average: Math.round(average * 10) / 10,
        totalEntries: data.length,
        trend,
        bestDay: Math.max(...scores),
        worstDay: Math.min(...scores)
      });
    }
  };

  const calculateTrend = (entries) => {
    if (entries.length < 2) return 'stable';
    
    const recent = entries.slice(0, Math.ceil(entries.length / 2));
    const older = entries.slice(Math.ceil(entries.length / 2));
    
    const recentAvg = recent.reduce((a, b) => a + b.mood_level, 0) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b.mood_level, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Günaydın';
    if (hour < 17) return 'İyi Öğlenler';
    return 'İyi Akşamlar';
  };

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving':
        return <TrendingUp className="text-green-500" size={20} />;
      case 'declining':
        return <TrendingUp className="text-red-500 transform rotate-180" size={20} />;
      default:
        return <TrendingUp className="text-blue-500 transform rotate-90" size={20} />;
    }
  };

  const getTrendText = (trend) => {
    switch(trend) {
      case 'improving':
        return 'İyileşiyor 📈';
      case 'declining':
        return 'Dikkat Gerekiyor 📉';
      default:
        return 'Stabil ➡️';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Karşılama Bölümü */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            {getGreeting()}, {user?.user_metadata?.name || 'Dostum'}! 👋
          </h1>
          <p className="text-gray-600 text-lg">
            {todaysMood ? 
              `Bugün kendinizi ${todaysMood.mood_type} hissediyorsunuz` :
              'Bugünkü ruh halinizi henüz kaydetmediniz'
            }
          </p>
        </div>

        {/* Hızlı Eylemler */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Bugünkü Ruh Hali */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Heart className="text-purple-500" size={24} />
              {todaysMood && (
                <span className="text-3xl">{todaysMood.mood_emoji}</span>
              )}
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Bugünkü Ruh Halim</h3>
            {todaysMood ? (
              <div>
                <p className="text-sm text-gray-600">{todaysMood.mood_type}</p>
                <p className="text-lg font-bold text-purple-600">
                  {todaysMood.mood_level}/10
                </p>
              </div>
            ) : (
              <button
                onClick={() => setShowMoodTracker(true)}
                className="w-full py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors text-sm"
              >
                Kaydet
              </button>
            )}
          </div>

          {/* Haftalık Ortalama */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="text-blue-500" size={24} />
              {weekStats && getTrendIcon(weekStats.trend)}
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Haftalık Ortalama</h3>
            {weekStats ? (
              <div>
                <p className="text-lg font-bold text-blue-600">
                  {weekStats.average}/10
                </p>
                <p className="text-sm text-gray-600">
                  {getTrendText(weekStats.trend)}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Veri yeterli değil</p>
            )}
          </div>

          {/* Takip Günleri */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Calendar className="text-green-500" size={24} />
              <Zap className="text-yellow-500" size={20} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Aktif Günler</h3>
            <div>
              <p className="text-lg font-bold text-green-600">
                {weekStats?.totalEntries || 0}/7
              </p>
              <p className="text-sm text-gray-600">Bu hafta</p>
            </div>
          </div>

          {/* Hedefler */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <Target className="text-orange-500" size={24} />
              <Award className="text-yellow-500" size={20} />
            </div>
            <h3 className="font-semibold text-gray-800 mb-2">Bu Ay Hedefiniz</h3>
            <div>
              <p className="text-lg font-bold text-orange-600">
                {recentMoods.length}/30
              </p>
              <p className="text-sm text-gray-600">Günlük takip</p>
            </div>
          </div>
        </div>

        {/* Ana İçerik Alanı */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Sütun - Mood Tracker */}
          <div className="lg:col-span-2">
            {showMoodTracker || !todaysMood ? (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <MoodTracker />
                {showMoodTracker && (
                  <button
                    onClick={() => setShowMoodTracker(false)}
                    className="mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    ← Geri Dön
                  </button>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Hoş Geldiniz! 🎯
                </h2>
                
                {/* Hızlı Eylemler */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <button
                    onClick={() => setShowMoodTracker(true)}
                    className="p-6 border-2 border-dashed border-purple-300 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center group"
                  >
                    <Heart className="mx-auto text-purple-500 mb-2 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="font-semibold text-gray-800">Yeni Kayıt</h3>
                    <p className="text-sm text-gray-600">Ruh halinizi kaydedin</p>
                  </button>
                  
                  <button
                    onClick={() => window.location.href = '/history'}
                    className="p-6 border-2 border-dashed border-blue-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-center group"
                  >
                    <BarChart3 className="mx-auto text-blue-500 mb-2 group-hover:scale-110 transition-transform" size={32} />
                    <h3 className="font-semibold text-gray-800">Geçmişi Görüntüle</h3>
                    <p className="text-sm text-gray-600">Raporlarınızı inceleyin</p>
                  </button>
                </div>

                {/* Günlük İpucu */}
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-800 mb-2">💡 Günün İpucu</h3>
                  <p className="text-gray-700">
                    Her gün ruh halinizi takip etmek, duygusal kalıplarınızı anlamanıza 
                    ve daha iyi kararlar vermenize yardımcı olur. Küçük değişiklikler 
                    büyük farklar yaratabilir!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Sağ Sütun - Son Aktiviteler */}
          <div className="space-y-6">
            {/* Son Ruh Halleri */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                <Clock className="mr-2" size={20} />
                Son Kayıtlarınız
              </h3>
              
              {recentMoods.length > 0 ? (
                <div className="space-y-3">
                  {recentMoods.slice(0, 5).map((mood, index) => (
                    <div key={mood.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{mood.mood_emoji}</span>
                        <div>
                          <p className="text-sm font-medium text-gray-800">{mood.mood_type}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(mood.created_at).toLocaleDateString('tr-TR')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-purple-600">
                          {mood.mood_level}/10
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar size={48} className="mx-auto mb-4 opacity-50" />
                  <p>Henüz ruh hali kaydınız yok</p>
                  <p className="text-sm">İlk kaydınızı oluşturun!</p>
                </div>
              )}
            </div>

            {/* Motivasyon Kartı */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg p-6 text-white">
              <h3 className="font-semibold mb-3">🌟 Günlük Motivasyon</h3>
              <p className="text-sm opacity-90 leading-relaxed">
                "Ruh halinizi takip etmek, kendinize verdiğiniz değerin bir göstergesidir. 
                Her gün biraz daha güçlü oluyorsunuz!"
              </p>
              <div className="mt-4 flex justify-between items-center text-xs opacity-75">
                <span>EMOTICE Ekibi</span>
                <span>💜</span>
              </div>
            </div>

            {/* İstatistik Özeti */}
            {weekStats && (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-semibold text-gray-800 mb-4">📊 Bu Hafta Özet</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">En İyi Gün:</span>
                    <span className="font-bold text-green-600">{weekStats.bestDay}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Zor Gün:</span>
                    <span className="font-bold text-red-600">{weekStats.worstDay}/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ortalama:</span>
                    <span className="font-bold text-purple-600">{weekStats.average}/10</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;