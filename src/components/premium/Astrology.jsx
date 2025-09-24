import React, { useState, useEffect } from 'react';
import { Star, Moon, Sun, Sparkles, Calendar, Info, TrendingUp } from 'lucide-react';

interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  element: string;
  dates: string;
  traits: string[];
}

interface DailyHoroscope {
  sign: string;
  date: string;
  general: string;
  love: string;
  career: string;
  health: string;
  luckyNumber: number;
  luckyColor: string;
}

interface MoonPhase {
  phase: string;
  description: string;
  influence: string;
  icon: React.ComponentType<any>;
}

const AstrologySection: React.FC = () => {
  const [selectedSign, setSelectedSign] = useState('');
  const [showScientificWarning, setShowScientificWarning] = useState(true);
  const [currentMoonPhase, setCurrentMoonPhase] = useState<MoonPhase | null>(null);

  const zodiacSigns: ZodiacSign[] = [
    { id: 'aries', name: 'Koç', symbol: '♈', element: 'Ateş', dates: '21 Mart - 19 Nisan', traits: ['Cesur', 'Enerjik', 'Lider'] },
    { id: 'taurus', name: 'Boğa', symbol: '♉', element: 'Toprak', dates: '20 Nisan - 20 Mayıs', traits: ['Sabırlı', 'Güvenilir', 'Pratik'] },
    { id: 'gemini', name: 'İkizler', symbol: '♊', element: 'Hava', dates: '21 Mayıs - 20 Haziran', traits: ['Meraklı', 'Sosyal', 'Çok yönlü'] },
    { id: 'cancer', name: 'Yengeç', symbol: '♋', element: 'Su', dates: '21 Haziran - 22 Temmuz', traits: ['Duygusal', 'Koruyucu', 'Sezgisel'] },
    { id: 'leo', name: 'Aslan', symbol: '♌', element: 'Ateş', dates: '23 Temmuz - 22 Ağustos', traits: ['Yaratıcı', 'Cömert', 'Dramatik'] },
    { id: 'virgo', name: 'Başak', symbol: '♍', element: 'Toprak', dates: '23 Ağustos - 22 Eylül', traits: ['Analitik', 'Mükemmeliyetçi', 'Pratik'] },
    { id: 'libra', name: 'Terazi', symbol: '♎', element: 'Hava', dates: '23 Eylül - 22 Ekim', traits: ['Dengeli', 'Diplomatik', 'Estetik'] },
    { id: 'scorpio', name: 'Akrep', symbol: '♏', element: 'Su', dates: '23 Ekim - 21 Kasım', traits: ['Yoğun', 'Tutkulu', 'Gizemli'] },
    { id: 'sagittarius', name: 'Yay', symbol: '♐', element: 'Ateş', dates: '22 Kasım - 21 Aralık', traits: ['Özgür', 'Maceraperest', 'Felsefi'] },
    { id: 'capricorn', name: 'Oğlak', symbol: '♑', element: 'Toprak', dates: '22 Aralık - 19 Ocak', traits: ['Disiplinli', 'Hırslı', 'Sorumlu'] },
    { id: 'aquarius', name: 'Kova', symbol: '♒', element: 'Hava', dates: '20 Ocak - 18 Şubat', traits: ['Özgün', 'Hümanist', 'Vizyoner'] },
    { id: 'pisces', name: 'Balık', symbol: '♓', element: 'Su', dates: '19 Şubat - 20 Mart', traits: ['Empatik', 'Yaratıcı', 'Sezgisel'] }
  ];

  const moonPhases: MoonPhase[] = [
    {
      phase: 'Yeni Ay',
      description: 'Yeni başlangıçlar için ideal zaman',
      influence: 'Hedef belirleme ve yeni projeler başlatma',
      icon: Moon
    },
    {
      phase: 'Büyüyen Ay',
      description: 'Büyüme ve gelişim dönemi',
      influence: 'Motivasyon artışı ve pozitif enerji',
      icon: Sun
    },
    {
      phase: 'Dolunay',
      description: 'Duygusal yoğunluk ve tamamlanma',
      influence: 'İçgörü kazanma ve duygusal denge',
      icon: Star
    },
    {
      phase: 'Azalan Ay',
      description: 'Bırakma ve temizlenme zamanı',
      influence: 'Eski alışkanlıkları bırakma ve arınma',
      icon: Sparkles
    }
  ];

  const getDailyHoroscope = (sign: string): DailyHoroscope => {
    const horoscopes: { [key: string]: DailyHoroscope } = {
      aries: {
        sign: 'Koç',
        date: new Date().toLocaleDateString('tr-TR'),
        general: 'Bugün enerjiniz yüksek ve yeni projelere başlamak için ideal bir gün. Cesur adımlar atın.',
        love: 'Aşk hayatınızda heyecan verici gelişmeler olabilir. Açık iletişim kurun.',
        career: 'İş hayatında liderlik özellikleriniz öne çıkacak. Fırsatları değerlendirin.',
        health: 'Fiziksel aktiviteye odaklanın. Enerjinizi doğru kanallara yönlendirin.',
        luckyNumber: 7,
        luckyColor: 'Kırmızı'
      },
      taurus: {
        sign: 'Boğa',
        date: new Date().toLocaleDateString('tr-TR'),
        general: 'Sabır ve kararlılığınız bugün size avantaj sağlayacak. Planlı hareket edin.',
        love: 'İlişkilerinizde istikrar arayın. Güven duygusu önemli.',
        career: 'Maddi konularda dikkatli olun. Uzun vadeli planlar yapın.',
        health: 'Beslenme alışkanlıklarınızı gözden geçirin. Düzenli yaşam önemli.',
        luckyNumber: 2,
        luckyColor: 'Yeşil'
      },
      gemini: {
        sign: 'İkizler',
        date: new Date().toLocaleDateString('tr-TR'),
        general: 'İletişim becerileriniz bugün öne çıkacak. Sosyal aktivitelere katılın.',
        love: 'Çeşitlilik arayışınız ilişkilerinizi etkileyebilir. Denge kurun.',
        career: 'Yaratıcı projeler için uygun zaman. Fikirlerinizi paylaşın.',
        health: 'Zihinsel aktivitelere odaklanın. Stres yönetimi önemli.',
        luckyNumber: 5,
        luckyColor: 'Sarı'
      }
    };

    return horoscopes[sign] || horoscopes.aries;
  };

  useEffect(() => {
    // Set current moon phase (simplified)
    const phases = moonPhases;
    const currentPhaseIndex = Math.floor(Math.random() * phases.length);
    setCurrentMoonPhase(phases[currentPhaseIndex]);
  }, []);

  const getElementColor = (element: string) => {
    const colors = {
      'Ateş': 'from-red-400 to-orange-500',
      'Toprak': 'from-green-400 to-emerald-500',
      'Hava': 'from-blue-400 to-cyan-500',
      'Su': 'from-purple-400 to-indigo-500'
    };
    return colors[element as keyof typeof colors] || 'from-gray-400 to-gray-500';
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Astroloji & Burçlar</h1>
              <p className="text-gray-600">Günlük burç yorumları ve ay döngüleri</p>
            </div>
          </div>

          {/* Scientific Warning */}
          {showScientificWarning && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-800 mb-1">Bilimsel Uyarı</h3>
                  <p className="text-amber-700 text-sm mb-3">
                    Astroloji içerikleri eğlence amaçlıdır ve bilimsel dayanağı yoktur. 
                    Önemli kararlarınızı alırken profesyonel danışmanlık alın.
                  </p>
                  <button
                    onClick={() => setShowScientificWarning(false)}
                    className="text-amber-600 text-sm font-medium hover:text-amber-700"
                  >
                    Anladım, kapat
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Zodiac Signs */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Burç Seçin</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {zodiacSigns.map((sign) => (
                <button
                  key={sign.id}
                  onClick={() => setSelectedSign(sign.id)}
                  className={`p-4 rounded-2xl text-center transition-all duration-200 ${
                    selectedSign === sign.id
                      ? `bg-gradient-to-r ${getElementColor(sign.element)} text-white shadow-lg scale-105`
                      : 'bg-white border border-gray-200 hover:shadow-md hover:scale-102'
                  }`}
                >
                  <div className="text-2xl mb-2">{sign.symbol}</div>
                  <div className="font-medium">{sign.name}</div>
                  <div className="text-xs opacity-75">{sign.dates}</div>
                </button>
              ))}
            </div>

            {/* Daily Horoscope */}
            {selectedSign && (
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className={`w-12 h-12 bg-gradient-to-r ${getElementColor(zodiacSigns.find(s => s.id === selectedSign)?.element || 'Ateş')} rounded-xl flex items-center justify-center`}>
                    <span className="text-white text-xl">
                      {zodiacSigns.find(s => s.id === selectedSign)?.symbol}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {getDailyHoroscope(selectedSign).sign} Burcu
                    </h3>
                    <p className="text-gray-600">{getDailyHoroscope(selectedSign).date}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-xl">
                      <h4 className="font-semibold text-purple-800 mb-2">Genel</h4>
                      <p className="text-purple-700 text-sm">{getDailyHoroscope(selectedSign).general}</p>
                    </div>
                    
                    <div className="p-4 bg-pink-50 rounded-xl">
                      <h4 className="font-semibold text-pink-800 mb-2">Aşk</h4>
                      <p className="text-pink-700 text-sm">{getDailyHoroscope(selectedSign).love}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 rounded-xl">
                      <h4 className="font-semibold text-blue-800 mb-2">Kariyer</h4>
                      <p className="text-blue-700 text-sm">{getDailyHoroscope(selectedSign).career}</p>
                    </div>
                    
                    <div className="p-4 bg-green-50 rounded-xl">
                      <h4 className="font-semibold text-green-800 mb-2">Sağlık</h4>
                      <p className="text-green-700 text-sm">{getDailyHoroscope(selectedSign).health}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center space-x-8 mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{getDailyHoroscope(selectedSign).luckyNumber}</div>
                    <div className="text-sm text-gray-600">Şanslı Sayı</div>
                  </div>
                  <div className="text-center">
                    <div className="w-8 h-8 rounded-full mx-auto mb-1" style={{ backgroundColor: getDailyHoroscope(selectedSign).luckyColor.toLowerCase() }}></div>
                    <div className="text-sm text-gray-600">Şanslı Renk</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Moon Phase */}
            {currentMoonPhase && (
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Moon className="w-6 h-6 text-purple-600" />
                  <h3 className="text-xl font-bold text-gray-800">Ay Döngüsü</h3>
                </div>
                
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <currentMoonPhase.icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="font-bold text-gray-800">{currentMoonPhase.phase}</h4>
                  <p className="text-gray-600 text-sm mt-2">{currentMoonPhase.description}</p>
                </div>
                
                <div className="p-4 bg-purple-50 rounded-xl">
                  <h5 className="font-semibold text-purple-800 mb-2">Duygusal Etki</h5>
                  <p className="text-purple-700 text-sm">{currentMoonPhase.influence}</p>
                </div>
              </div>
            )}

            {/* Zodiac Traits */}
            {selectedSign && (
              <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Burç Özellikleri</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Element</span>
                    <span className="font-semibold text-gray-800">
                      {zodiacSigns.find(s => s.id === selectedSign)?.element}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tarih Aralığı</span>
                    <span className="font-semibold text-gray-800 text-sm">
                      {zodiacSigns.find(s => s.id === selectedSign)?.dates}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Temel Özellikler</h4>
                  <div className="flex flex-wrap gap-2">
                    {zodiacSigns.find(s => s.id === selectedSign)?.traits.map((trait, index) => (
                      <span key={index} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Weekly Forecast */}
            <div className="bg-white rounded-2xl shadow-lg border border-purple-100 p-6">
              <div className="flex items-center space-x-2 mb-4">
                <TrendingUp className="w-5 h-5 text-purple-600" />
                <h3 className="text-xl font-bold text-gray-800">Haftalık Öngörü</h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Pazartesi</span>
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${i <= 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Salı</span>
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${i <= 3 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-700">Çarşamba</span>
                  <div className="flex space-x-1">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`w-4 h-4 ${i <= 5 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrologySection;