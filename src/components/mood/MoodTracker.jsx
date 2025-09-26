// src/components/mood/MoodTracker.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-toastify';
import { 
  Calendar, Clock, Tag, FileText, Save, Crown, Lock, 
  Download, BarChart3, TrendingUp, Star, Zap 
} from 'lucide-react';

const MoodTracker = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [moodLevel, setMoodLevel] = useState(5);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState([]);
  const [customTag, setCustomTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [moodHistory, setMoodHistory] = useState([]);
  const [weeklyStats, setWeeklyStats] = useState(null);

  // Mood seçenekleri (emoji + isim + renk)
  const moodOptions = [
    { id: 1, emoji: '😭', name: 'Çok Üzgün', color: '#ef4444', value: 1 },
    { id: 2, emoji: '😢', name: 'Üzgün', color: '#f97316', value: 2 },
    { id: 3, emoji: '😐', name: 'Nötr', color: '#eab308', value: 3 },
    { id: 4, emoji: '🙂', name: 'İyi', color: '#22c55e', value: 4 },
    { id: 5, emoji: '😊', name: 'Mutlu', color: '#06b6d4', value: 5 },
    { id: 6, emoji: '😄', name: 'Çok Mutlu', color: '#8b5cf6', value: 6 },
    { id: 7, emoji: '🤗', name: 'Sevgi Dolu', color: '#ec4899', value: 7 },
    { id: 8, emoji: '😌', name: 'Huzurlu', color: '#10b981', value: 8 },
    { id: 9, emoji: '🤯', name: 'Heyecanlı', color: '#f59e0b', value: 9 },
    { id: 10, emoji: '🥳', name: 'Coşkulu', color: '#dc2626', value: 10 }
  ];

  // Premium etiketler (free kullanıcılar sınırlı)
  const basicTags = ['İş', 'Aile', 'Arkadaş', 'Sağlık', 'Stres'];
  const premiumTags = [
    'Spor', 'Beslenme', 'Uyku', 'Aşk', 'Hobiler', 'Eğitim', 'Para',
    'Seyahat', 'Müzik', 'Kitap', 'Sosyal Medya', 'Hava Durumu',
    'İlaç', 'Terapi', 'Meditasyon', 'Yoga'
  ];

  const availableTags = isPremium ? [...basicTags, ...premiumTags] : basicTags;

  useEffect(() => {
    initializeComponent();
  }, []);

  const initializeComponent = async () => {
    try {
      // Kullanıcı bilgilerini al
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Premium durumunu kontrol et
        const premiumStatus = localStorage.getItem('emotice_premium_status') === 'active';
        setIsPremium(premiumStatus);

        // Mood geçmişini yükle
        await loadMoodHistory(user.id, premiumStatus);
      }
    } catch (error) {
      console.error('Component initialization error:', error);
    }
  };

  const loadMoodHistory = async (userId, isPremium) => {
    try {
      // Free: Son 7 gün, Premium: Son 30 gün
      const daysLimit = isPremium ? 30 : 7;
      const limitDate = new Date(Date.now() - daysLimit * 24 * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', limitDate)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setMoodHistory(data || []);

      // Haftalık istatistikleri hesapla
      if (data && data.length > 0) {
        const weekData = data.slice(0, 7);
        const avgMood = weekData.reduce((sum, entry) => sum + entry.mood_level, 0) / weekData.length;
        setWeeklyStats({
          average: Math.round(avgMood * 10) / 10,
          entries: weekData.length,
          trend: calculateTrend(weekData)
        });
      }
    } catch (error) {
      console.error('Mood history loading error:', error);
    }
  };

  const calculateTrend = (data) => {
    if (data.length < 3) return 'stable';
    const recent = data.slice(0, Math.ceil(data.length / 2));
    const older = data.slice(Math.ceil(data.length / 2));
    const recentAvg = recent.reduce((sum, entry) => sum + entry.mood_level, 0) / recent.length;
    const olderAvg = older.reduce((sum, entry) => sum + entry.mood_level, 0) / older.length;
    
    if (recentAvg > olderAvg + 0.5) return 'improving';
    if (recentAvg < olderAvg - 0.5) return 'declining';
    return 'stable';
  };

  // Etiket ekleme (Premium kontrolü ile)
  const addTag = (tag) => {
    if (!isPremium && premiumTags.includes(tag)) {
      toast.error('Bu etiket Premium özelliği gerektirir!');
      return;
    }
    
    if (tag && !tags.includes(tag) && tags.length < (isPremium ? 10 : 3)) {
      setTags([...tags, tag]);
      setCustomTag('');
    }
  };

  // Etiket kaldırma
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  // Advanced mood analytics (Premium)
  const generateAdvancedAnalytics = () => {
    if (!isPremium || moodHistory.length < 5) return null;

    const patterns = {
      bestTime: getMostCommonTimePattern(),
      worstTime: getLeastCommonTimePattern(),
      topTags: getTopTags(),
      moodVariability: getMoodVariability()
    };

    return patterns;
  };

  const getMostCommonTimePattern = () => {
    const timeGroups = { morning: 0, afternoon: 0, evening: 0 };
    moodHistory.forEach(entry => {
      const hour = new Date(entry.created_at).getHours();
      if (hour < 12) timeGroups.morning++;
      else if (hour < 18) timeGroups.afternoon++;
      else timeGroups.evening++;
    });
    
    return Object.keys(timeGroups).reduce((a, b) => 
      timeGroups[a] > timeGroups[b] ? a : b
    );
  };

  const getLeastCommonTimePattern = () => {
    // Implementation for worst time pattern
    return 'evening'; // Simplified
  };

  const getTopTags = () => {
    const tagCount = {};
    moodHistory.forEach(entry => {
      if (entry.tags) {
        entry.tags.forEach(tag => {
          tagCount[tag] = (tagCount[tag] || 0) + 1;
        });
      }
    });
    
    return Object.entries(tagCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([tag]) => tag);
  };

  const getMoodVariability = () => {
    const moods = moodHistory.map(entry => entry.mood_level);
    const avg = moods.reduce((sum, mood) => sum + mood, 0) / moods.length;
    const variance = moods.reduce((sum, mood) => sum + Math.pow(mood - avg, 2), 0) / moods.length;
    return Math.sqrt(variance);
  };

  // Export data (Premium)
  const exportMoodData = () => {
    if (!isPremium) {
      toast.error('Veri export Premium özelliğidir!');
      return;
    }

    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Mood,Level,Tags,Notes\n"
      + moodHistory.map(entry => 
          `${entry.date},${entry.mood_type},${entry.mood_level},"${entry.tags?.join(';') || ''}","${entry.notes || ''}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `emotice-mood-data-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Verileriniz başarıyla export edildi!');
  };

  // Mood kaydetme
  const saveMoodEntry = async () => {
    if (!selectedMood || !user) {
      toast.error('Lütfen bir ruh hali seçin!');
      return;
    }

    // Free kullanıcı limiti kontrolü
    if (!isPremium) {
      const today = new Date().toISOString().split('T')[0];
      const todayEntries = moodHistory.filter(entry => entry.date === today);
      if (todayEntries.length >= 3) {
        toast.error('Free kullanıcılar günde en fazla 3 mood giriş yapabilir. Premium\'a geçin!');
        return;
      }
    }

    setLoading(true);
    
    try {
      const moodData = {
        user_id: user.id,
        mood_type: selectedMood.name,
        mood_emoji: selectedMood.emoji,
        mood_level: selectedMood.value,
        intensity_score: moodLevel,
        notes: note,
        tags: tags,
        created_at: new Date().toISOString(),
        date: new Date().toISOString().split('T')[0]
      };

      const { data, error } = await supabase
        .from('mood_entries')
        .insert(moodData);

      if (error) throw error;

      toast.success('Ruh haliniz başarıyla kaydedildi! 🎉');
      
      // Form'u sıfırla ve geçmişi yenile
      setSelectedMood(null);
      setMoodLevel(5);
      setNote('');
      setTags([]);
      setCustomTag('');
      
      // Geçmişi yenile
      await loadMoodHistory(user.id, isPremium);

    } catch (error) {
      console.error('Mood kayıt hatası:', error);
      toast.error('Kayıt sırasında bir hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const analytics = generateAdvancedAnalytics();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ana Form */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Bugünkü Ruh Halinizi Nasıl Hissediyorsunuz?
            </h2>
            <p className="text-gray-600">
              Duygularınızı takip edin ve kendinizi daha iyi tanıyın
            </p>
          </div>

          {/* Premium Banner (Free kullanıcılar için) */}
          {!isPremium && (
            <div className="mb-6 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">
                    Premium ile daha fazla özellik!
                  </span>
                </div>
                <a href="/premium" className="text-xs bg-amber-600 text-white px-3 py-1 rounded-full hover:bg-amber-700">
                  Upgrade
                </a>
              </div>
              <p className="text-xs text-amber-700 mt-1">
                Free: 3 giriş/gün, 5 etiket • Premium: Sınırsız, gelişmiş analiz
              </p>
            </div>
          )}

          {/* Mood Seçici */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Calendar className="mr-2" size={20} />
              Ruh Halinizi Seçin
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {moodOptions.map((mood) => (
                <button
                  key={mood.id}
                  onClick={() => setSelectedMood(mood)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedMood?.id === mood.id
                      ? 'border-purple-500 bg-purple-50 scale-105'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <div className="text-3xl mb-1">{mood.emoji}</div>
                  <div className="text-xs text-gray-600">{mood.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Yoğunluk Seviyesi */}
          {selectedMood && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center">
                <Clock className="mr-2" size={20} />
                Bu Duyguyu Ne Kadar Yoğun Hissediyorsunuz? ({moodLevel}/10)
              </h3>
              <input
                type="range"
                min="1"
                max="10"
                value={moodLevel}
                onChange={(e) => setMoodLevel(e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, ${selectedMood.color} 0%, ${selectedMood.color} ${moodLevel * 10}%, #e5e7eb ${moodLevel * 10}%, #e5e7eb 100%)`
                }}
              />
            </div>
          )}

          {/* Etiketler */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Tag className="mr-2" size={20} />
              Bu Ruh Halinin Sebebi Ne Olabilir?
              {!isPremium && (
                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                  {tags.length}/3
                </span>
              )}
            </h3>
            
            <div className="flex flex-wrap gap-2 mb-3">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => addTag(tag)}
                  disabled={tags.includes(tag) || tags.length >= (isPremium ? 10 : 3)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors flex items-center gap-1 ${
                    tags.includes(tag)
                      ? 'bg-purple-100 text-purple-700 border-purple-300'
                      : premiumTags.includes(tag) && !isPremium
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-purple-50'
                  } ${tags.length >= (isPremium ? 10 : 3) && !tags.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {tag}
                  {premiumTags.includes(tag) && !isPremium && (
                    <Crown className="w-3 h-3" />
                  )}
                </button>
              ))}
            </div>

            {/* Özel etiket ekleme */}
            <div className="flex gap-2">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTag(customTag)}
                placeholder="Özel etiket ekle..."
                disabled={tags.length >= (isPremium ? 10 : 3)}
                className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50"
              />
              <button
                onClick={() => addTag(customTag)}
                disabled={!customTag || tags.length >= (isPremium ? 10 : 3)}
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ekle
              </button>
            </div>

            {/* Seçili etiketler */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-2 hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Not Ekleme */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <FileText className="mr-2" size={20} />
              Ek Notlar (Opsiyonel)
              {!isPremium && <Lock className="w-4 h-4 ml-2 text-gray-400" />}
            </h3>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={isPremium ? "Bugün neler oldu? Ne hissettiniz?" : "Premium üyelikte uzun notlar ekleyebilirsiniz"}
              rows="4"
              disabled={!isPremium}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none disabled:bg-gray-50"
              maxLength={isPremium ? 1000 : 100}
            />
            <p className="text-xs text-gray-500 mt-1">
              {note.length}/{isPremium ? 1000 : 100} karakter
            </p>
          </div>

          {/* Kaydet Butonu */}
          <button
            onClick={saveMoodEntry}
            disabled={!selectedMood || loading}
            className={`w-full p-4 rounded-lg font-semibold flex items-center justify-center transition-all ${
              !selectedMood || loading
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
            }`}
          >
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Kaydediliyor...
              </div>
            ) : (
              <div className="flex items-center">
                <Save className="mr-2" size={20} />
                Ruh Halimi Kaydet
              </div>
            )}
          </button>
        </div>

        {/* Yan Panel - İstatistikler ve Premium Özellikler */}
        <div className="space-y-6">
          {/* Haftalık İstatistikler */}
          {weeklyStats && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BarChart3 className="mr-2" size={20} />
                Bu Hafta
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Ortalama:</span>
                  <span className="font-semibold">{weeklyStats.average}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Giriş:</span>
                  <span className="font-semibold">{weeklyStats.entries}/7</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Trend:</span>
                  <div className="flex items-center gap-1">
                    {weeklyStats.trend === 'improving' && <TrendingUp className="w-4 h-4 text-green-500" />}
                    {weeklyStats.trend === 'declining' && <TrendingUp className="w-4 h-4 text-red-500 transform rotate-180" />}
                    {weeklyStats.trend === 'stable' && <span className="text-blue-500">Stabil</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Premium Analytics */}
          {isPremium && analytics && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Star className="mr-2 text-amber-500" size={20} />
                AI Insights
              </h3>
              <div className="space-y-3 text-sm">
                <div>
                  <span className="text-gray-600">En aktif olduğunuz zaman:</span>
                  <span className="ml-2 font-semibold">{analytics.bestTime}</span>
                </div>
                <div>
                  <span className="text-gray-600">En çok kullandığınız etiketler:</span>
                  <div className="mt-1">
                    {analytics.topTags.map(tag => (
                      <span key={tag} className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs mr-1">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Export & Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Eylemler</h3>
            <div className="space-y-3">
              <button
                onClick={exportMoodData}
                disabled={!isPremium}
                className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                  isPremium 
                    ? 'bg-blue-500 text-white hover:bg-blue-600' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Download className="w-4 h-4" />
                Veri Export {!isPremium && <Lock className="w-4 h-4" />}
              </button>
              
              <a 
                href="/history"
                className="block w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors text-center"
              >
                Geçmişi Görüntüle
              </a>
              
              {!isPremium && (
                <a 
                  href="/premium"
                  className="block w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-white py-2 px-4 rounded-lg hover:from-amber-600 hover:to-yellow-600 transition-colors text-center"
                >
                  Premium'a Geç
                </a>
              )}
            </div>
          </div>

          {/* Premium Features Showcase (Free users) */}
          {!isPremium && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
              <h3 className="text-lg font-semibold mb-4 flex items-center text-purple-700">
                <Crown className="mr-2" size={20} />
                Premium Özellikleri
              </h3>
              <ul className="space-y-2 text-sm text-purple-600">
                <li className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Sınırsız mood giriş
                </li>
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4" />
                  AI destekli analiz
                </li>
                <li className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Veri export (CSV/PDF)
                </li>
                <li className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Uzun notlar
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;