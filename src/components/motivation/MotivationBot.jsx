import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  ThumbsUp, 
  ThumbsDown, 
  RefreshCw, 
  Settings,
  Clock,
  TrendingUp,
  Heart,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Share2,
  BarChart3
} from 'lucide-react';
import { getMotivationMessage, recordMessageFeedback, getUserMotivationStats } from '../../services/motivationService';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const MotivationBot = ({ 
  autoMode = false, 
  showControls = true,
  embedded = false 
}) => {
  const { user } = useAuth();
  const { t, i18n } = useTranslation();
  
  const [currentMessage, setCurrentMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [preferences, setPreferences] = useState({
    mood: 'motivated',
    length: 'medium',
    autoRefresh: false,
    soundEnabled: true,
    showTime: true
  });
  const [showSettings, setShowSettings] = useState(false);
  const [showStats, setShowStats] = useState(false);

  // Sayfa yüklendiğinde ilk mesajı al
  useEffect(() => {
    if (user?.id) {
      loadUserStats();
      getNewMessage();
      
      if (autoMode) {
        startAutoMode();
      }
    }
  }, [user?.id, autoMode]);

  // Kullanıcı istatistiklerini yükle
  const loadUserStats = () => {
    if (user?.id) {
      const stats = getUserMotivationStats(user.id);
      setUserStats(stats);
    }
  };

  // Yeni mesaj al
  const getNewMessage = async (customOptions = {}) => {
    setIsLoading(true);
    
    try {
      const options = {
        userMood: preferences.mood,
        currentTime: new Date(),
        language: i18n.language,
        preferredLength: preferences.length,
        userId: user?.id,
        ...customOptions
      };

      const result = getMotivationMessage(options);
      setCurrentMessage(result);
      
      // Ses çal (eğer aktifse)
      if (preferences.soundEnabled) {
        playNotificationSound();
      }
      
      loadUserStats(); // İstatistikleri güncelle
    } catch (error) {
      console.error('Error getting motivation message:', error);
      toast.error('Mesaj alınırken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  // Feedback kaydet
  const handleFeedback = (type) => {
    if (!currentMessage || !user?.id) return;

    recordMessageFeedback(
      currentMessage.metadata?.messageId,
      user.id,
      type,
      currentMessage.message
    );

    // Kullanıcıya bildirim ver
    if (type === 'like') {
      toast.success('👍 Teşekkürler! Beğendiğiniz mesajları not ettim.');
    } else {
      toast.info('👎 Anlıyorum. Daha iyi mesajlar için çalışacağım.');
      // Hemen yeni mesaj öner
      setTimeout(() => getNewMessage(), 1000);
    }
    
    loadUserStats();
  };

  // Paylaş
  const handleShare = () => {
    if (!currentMessage) return;

    const shareText = `🤖 ${currentMessage.message}\n\n💫 Emotice Motivasyon Robotu\nhttps://emotice.com`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Motivasyon Mesajı',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast.success('Mesaj panoya kopyalandı!');
    }
  };

  // Kopyala
  const handleCopy = () => {
    if (!currentMessage) return;
    
    navigator.clipboard.writeText(currentMessage.message);
    toast.success('Mesaj kopyalandı!');
  };

  // Ses çal
  const playNotificationSound = () => {
    if (typeof Audio !== 'undefined') {
      try {
        // Web Audio API ile basit bildirim sesi
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.log('Sound not supported');
      }
    }
  };

  // Otomatik mod başlat
  const startAutoMode = () => {
    if (!preferences.autoRefresh) return;
    
    const interval = setInterval(() => {
      getNewMessage();
    }, 300000); // Her 5 dakikada bir
    
    return () => clearInterval(interval);
  };

  // Mesaj stilini belirle
  const getMessageStyle = () => {
    if (!currentMessage) return '';
    
    const category = currentMessage.category;
    const styles = {
      motivation: 'from-orange-500 to-red-500',
      relaxation: 'from-blue-500 to-indigo-500',
      self_improvement: 'from-green-500 to-emerald-500',
      morning: 'from-yellow-400 to-orange-400',
      evening: 'from-purple-500 to-indigo-500',
      anxiety: 'from-teal-500 to-blue-500',
      focus: 'from-gray-600 to-gray-800',
      gratitude: 'from-pink-500 to-rose-500'
    };
    
    return styles[category] || styles.motivation;
  };

  // Kategori ikonunu al
  const getCategoryIcon = (category) => {
    const icons = {
      motivation: '🚀',
      relaxation: '🧘‍♀️',
      self_improvement: '📈',
      morning: '🌅',
      evening: '🌙',
      anxiety: '💙',
      focus: '🎯',
      gratitude: '🙏'
    };
    
    return icons[category] || '💫';
  };

  if (!user?.id && !embedded) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-6 text-center">
          <MessageCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Giriş Yapın</h3>
          <p className="text-yellow-700">
            Motivasyon robotundan faydalanmak için lütfen giriş yapın.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${embedded ? '' : 'max-w-4xl mx-auto p-4'}`}>
      {/* Ana Kart */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        {!embedded && (
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Motivasyon Robotu</h1>
                  <p className="text-purple-100">Kişisel motivasyon asistanınız</p>
                </div>
              </div>
              
              {showControls && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowStats(!showStats)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="İstatistikler"
                  >
                    <BarChart3 className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setShowSettings(!showSettings)}
                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    title="Ayarlar"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mesaj Alanı */}
        <div className="p-6">
          {currentMessage ? (
            <div className="space-y-4">
              {/* Mesaj */}
              <div className={`
                bg-gradient-to-r ${getMessageStyle()} 
                rounded-2xl p-6 text-white relative overflow-hidden
              `}>
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">
                        {getCategoryIcon(currentMessage.category)}
                      </span>
                      <span className="text-sm font-medium opacity-90 capitalize">
                        {currentMessage.category}
                      </span>
                    </div>
                    
                    {preferences.showTime && (
                      <div className="flex items-center gap-1 text-sm opacity-75">
                        <Clock className="w-4 h-4" />
                        {new Date(currentMessage.metadata.timestamp).toLocaleTimeString('tr-TR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-lg leading-relaxed font-medium">
                    {currentMessage.message}
                  </p>
                </div>
                
                {/* Dekoratif elementler */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl" />
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-white bg-opacity-5 rounded-full blur-lg" />
              </div>

              {/* Kontroller */}
              {showControls && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleFeedback('like')}
                      className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                      title="Beğendim"
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">Beğendim</span>
                    </button>
                    
                    <button
                      onClick={() => handleFeedback('dislike')}
                      className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                      title="Beğenmedim"
                    >
                      <ThumbsDown className="w-4 h-4" />
                      <span className="text-sm">Değiştir</span>
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopy}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Kopyala"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={handleShare}
                      className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Paylaş"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => getNewMessage()}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                      title="Yeni Mesaj"
                    >
                      <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                      {isLoading ? 'Yükleniyor...' : 'Yeni Mesaj'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Motivasyon mesajı yükleniyor...</p>
              <button
                onClick={getNewMessage}
                className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                Mesaj Al
              </button>
            </div>
          )}
        </div>

        {/* İstatistikler Panel */}
        {showStats && userStats && (
          <div className="border-t bg-gray-50 p-6">
            <h3 className="font-semibold text-gray-800 mb-4">📊 İstatistikleriniz</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">{userStats.totalMessages}</div>
                <div className="text-sm text-gray-600"></div>