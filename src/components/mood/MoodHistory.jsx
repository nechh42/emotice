// src/components/mood/MoodHistory.jsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, TrendingUp, Filter, Download, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

const MoodHistory = () => {
  const [moodEntries, setMoodEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [dateRange, setDateRange] = useState('7'); // Son 7 gün
  const [selectedMoodType, setSelectedMoodType] = useState('all');
  const [viewMode, setViewMode] = useState('chart'); // chart, list, calendar
  const [expandedEntry, setExpandedEntry] = useState(null);

  // Grafik için renk paleti
  const chartColors = {
    line: '#8b5cf6',
    bar: '#ec4899',
    area: '#06b6d4'
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchMoodEntries(user.id);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    filterEntries();
  }, [moodEntries, dateRange, selectedMoodType]);

  const fetchMoodEntries = async (userId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;
      setMoodEntries(data || []);
    } catch (error) {
      console.error('Veri çekme hatası:', error);
      toast.error('Ruh hali geçmişi yüklenirken hata oluştu!');
    } finally {
      setLoading(false);
    }
  };

  const filterEntries = () => {
    let filtered = [...moodEntries];

    // Tarih filtresi
    const now = new Date();
    const daysAgo = new Date(now.getTime() - (parseInt(dateRange) * 24 * 60 * 60 * 1000));
    
    if (dateRange !== 'all') {
      filtered = filtered.filter(entry => new Date(entry.created_at) >= daysAgo);
    }

    // Mood tipi filtresi
    if (selectedMoodType !== 'all') {
      filtered = filtered.filter(entry => entry.mood_type === selectedMoodType);
    }

    setFilteredEntries(filtered);
  };

  // Grafik verisi hazırlama
  const prepareChartData = () => {
    const dailyData = {};
    
    filteredEntries.forEach(entry => {
      const date = new Date(entry.created_at).toLocaleDateString('tr-TR', { 
        month: 'short', 
        day: 'numeric' 
      });
      
      if (!dailyData[date]) {
        dailyData[date] = {
          date,
          totalScore: 0,
          count: 0,
          entries: []
        };
      }
      
      dailyData[date].totalScore += entry.mood_level;
      dailyData[date].count += 1;
      dailyData[date].entries.push(entry);
    });

    return Object.values(dailyData).map(day => ({
      ...day,
      averageScore: Math.round((day.totalScore / day.count) * 10) / 10
    })).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Istatistikler hesaplama
  const calculateStats = () => {
    if (filteredEntries.length === 0) return null;

    const scores = filteredEntries.map(entry => entry.mood_level);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;
    const highest = Math.max(...scores);
    const lowest = Math.min(...scores);
    
    // En sık kullanılan mood
    const moodCounts = {};
    filteredEntries.forEach(entry => {
      moodCounts[entry.mood_type] = (moodCounts[entry.mood_type] || 0) + 1;
    });
    const mostFrequent = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );

    // Trend hesaplama (son 5 gün vs önceki 5 gün)
    const recent = filteredEntries.slice(0, 5);
    const previous = filteredEntries.slice(5, 10);
    const recentAvg = recent.length > 0 ? recent.reduce((a, b) => a + b.mood_level, 0) / recent.length : 0;
    const previousAvg = previous.length > 0 ? previous.reduce((a, b) => a + b.mood_level, 0) / previous.length : 0;
    const trend = recentAvg > previousAvg ? 'yükselen' : recentAvg < previousAvg ? 'düşen' : 'stabil';

    return {
      average: Math.round(average * 10) / 10,
      highest,
      lowest,
      mostFrequent,
      trend,
      totalEntries: filteredEntries.length
    };
  };

  // CSV export fonksiyonu
  const exportToCSV = () => {
    if (filteredEntries.length === 0) {
      toast.error('Dışa aktaracak veri bulunamadı!');
      return;
    }

    const csvData = filteredEntries.map(entry => ({
      Tarih: new Date(entry.created_at).toLocaleDateString('tr-TR'),
      'Ruh Hali': entry.mood_type,
      'Seviye': entry.mood_level,
      'Yoğunluk': entry.intensity_score,
      'Etiketler': entry.tags ? entry.tags.join(', ') : '',
      'Notlar': entry.notes || ''
    }));

    const csvString = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ruh-hali-gecmisi-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('Veriler CSV dosyası olarak indirildi!');
  };

  const stats = calculateStats();
  const chartData = prepareChartData();
  const uniqueMoodTypes = [...new Set(moodEntries.map(entry => entry.mood_type))];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Başlık ve Filtreler */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
            Mood History
          </h1>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={exportToCSV}
              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              <Download size={16} className="mr-2" />
              Dışa Aktar
            </button>
          </div>
        </div>

        {/* Filtreler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zaman Aralığı
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="7">Son 7 Gün</option>
              <option value="30">Son 30 Gün</option>
              <option value="90">Son 3 Ay</option>
              <option value="365">Son 1 Yıl</option>
              <option value="all">Tüm Zamanlar</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ruh Hali Tipi
            </label>
            <select
              value={selectedMoodType}
              onChange={(e) => setSelectedMoodType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Tüm Ruh Halleri</option>
              {uniqueMoodTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Görünüm
            </label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            >
              <option value="chart">Grafik Görünümü</option>
              <option value="list">Liste Görünümü</option>
            </select>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.average}</div>
            <div className="text-sm text-gray-600">Ortalama Skor</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.highest}</div>
            <div className="text-sm text-gray-600">En Yüksek</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-2xl font-bold text-red-600">{stats.lowest}</div>
            <div className="text-sm text-gray-600">En Düşük</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalEntries}</div>
            <div className="text-sm text-gray-600">Toplam Kayıt</div>
          </div>
        </div>
      )}

      {/* Ana İçerik */}
      {viewMode === 'chart' ? (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Ruh Hali Trendi</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[1, 10]} />
                <Tooltip 
                  formatter={(value, name) => [value, 'Ortalama Skor']}
                  labelStyle={{ color: '#666' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="averageScore" 
                  stroke={chartColors.line}
                  strokeWidth={3}
                  dot={{ fill: chartColors.line, strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="text-center py-12 text-gray-500">
              Seçilen kriterlere uygun veri bulunamadı
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-lg">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Detaylı Liste</h2>
          </div>
          <div className="divide-y">
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry, index) => (
                <div key={entry.id} className="p-4">
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setExpandedEntry(expandedEntry === index ? null : index)}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl">{entry.mood_emoji}</span>
                      <div>
                        <div className="font-medium text-gray-800">{entry.mood_type}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(entry.created_at).toLocaleDateString('tr-TR')} - 
                          {new Date(entry.created_at).toLocaleTimeString('tr-TR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold text-purple-600">
                          {entry.mood_level}/10
                        </div>
                        <div className="text-xs text-gray-500">Seviye</div>
                      </div>
                      <ChevronDown 
                        className={`transform transition-transform ${
                          expandedEntry === index ? 'rotate-180' : ''
                        }`}
                        size={20}
                      />
                    </div>
                  </div>

                  {/* Genişletilmiş detaylar */}
                  {expandedEntry === index && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      {/* Yoğunluk */}
                      <div>
                        <span className="text-sm font-medium text-gray-700">Yoğunluk: </span>
                        <span className="text-sm text-gray-600">{entry.intensity_score}/10</span>
                      </div>

                      {/* Etiketler */}
                      {entry.tags && entry.tags.length > 0 && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Etiketler: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {entry.tags.map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notlar */}
                      {entry.notes && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Notlar: </span>
                          <p className="text-sm text-gray-600 mt-1 bg-gray-50 p-3 rounded-lg">
                            {entry.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                Seçilen kriterlere uygun kayıt bulunamadı
              </div>
            )}
          </div>
        </div>
      )}

      {/* Insights ve Öneriler */}
      {stats && filteredEntries.length > 3 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            🤖 Kişisel İçgörüler
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">En Sık Ruh Haliniz:</span> {stats.mostFrequent}
              </p>
              <p className="text-sm">
                <span className="font-medium">Genel Trend:</span> 
                <span className={`ml-1 ${
                  stats.trend === 'yükselen' ? 'text-green-600' : 
                  stats.trend === 'düşen' ? 'text-red-600' : 'text-blue-600'
                }`}>
                  {stats.trend === 'yükselen' ? '📈 İyileşiyor' : 
                   stats.trend === 'düşen' ? '📉 Dikkat Gerekiyor' : '➡️ Stabil'}
                </span>
              </p>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Ortalama Skorunuz:</span> 
                <span className={`ml-1 ${
                  stats.average >= 7 ? 'text-green-600' : 
                  stats.average >= 4 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {stats.average >= 7 ? '😊 Harika' : 
                   stats.average >= 4 ? '🙂 İyi' : '😔 Destek Gerekiyor'}
                </span>
              </p>
              <p className="text-sm">
                <span className="font-medium">Takip Süresi:</span> {stats.totalEntries} gün
              </p>
            </div>
          </div>

          {/* Öneriler */}
          <div className="mt-4 p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">💡 Önerilerimiz:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {stats.trend === 'düşen' && (
                <li>• Son zamanlarda ruh halinizde düşüş gözleniyor. Profesyonel destek almayı düşünün.</li>
              )}
              {stats.average < 4 && (
                <li>• Düşük ortalama skorunuz endişe verici. Bir uzmanla görüşmenizi öneririz.</li>
              )}
              {stats.totalEntries >= 30 && (
                <li>• Harika! 30 gün boyunca düzenli takip yaptınız. Bu veri trendi anlamak için çok değerli.</li>
              )}
              <li>• Düzenli egzersiz, yeterli uyku ve sağlıklı beslenme ruh halinizi olumlu etkiler.</li>
              <li>• Meditasyon ve nefes egzersizleri stresi azaltmaya yardımcı olabilir.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Boş durum */}
      {filteredEntries.length === 0 && !loading && (
        <div className="bg-white rounded-lg shadow-lg p-12 text-center">
          <div className="text-6xl mb-4">📊</div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Henüz Ruh Hali Kaydınız Yok
          </h3>
          <p className="text-gray-600 mb-6">
            İlk ruh hali kaydınızı oluşturarak duygusal yolculuğunuzu takip etmeye başlayın!
          </p>
          <button
            onClick={() => window.location.href = '/mood-tracker'}
            className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            İlk Kaydımı Oluştur
          </button>
        </div>
      )}
    </div>
  );
};

export default MoodHistory;
