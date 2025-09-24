import React, { useState } from 'react';
import { 
  Star, 
  Coffee, 
  Calculator, 
  Sparkles,
  Crown,
  Lock,
  ArrowRight
} from 'lucide-react';
import TarotDeck from './tarot/TarotDeck';
import CoffeeReading from './coffee/CoffeeReading';
import { useAuth } from '../../contexts/AuthContext';
import { usePremium } from '../../hooks/usePremium';

const FortuneTelling = () => {
  const { user } = useAuth();
  const { isPremium } = usePremium();
  const [activeService, setActiveService] = useState('menu');

  // Fortune telling services
  const fortuneServices = [
    {
      id: 'tarot',
      title: 'Tarot Falı',
      description: 'Gizemli tarot kartlarıyla geleceğinizi keşfedin',
      icon: Star,
      color: 'from-purple-600 to-pink-600',
      bgColor: 'from-purple-50 to-pink-50',
      premium: true,
      features: ['Interactive kartlar', '3 farklı açılım', 'Detaylı yorumlar', 'Fal geçmişi']
    },
    {
      id: 'coffee',
      title: 'Türk Kahvesi Falı',
      description: 'Geleneksel kahve telvenizle fal baktırın',
      icon: Coffee,
      color: 'from-amber-600 to-orange-600',
      bgColor: 'from-amber-50 to-orange-50',
      premium: true,
      features: ['Foto analiz', 'Desen tanıma', 'Zaman çizelgesi', 'Kültürel yorumlar']
    },
    {
      id: 'numerology',
      title: 'Numeroloji',
      description: 'Sayılarla kişilik analizi ve gelecek tahmini',
      icon: Calculator,
      color: 'from-blue-600 to-cyan-600',
      bgColor: 'from-blue-50 to-cyan-50',
      premium: true,
      features: ['Yaşam yolu sayısı', 'Kişilik analizi', 'Şanslı sayılar', 'Uyumluluk testi'],
      comingSoon: true
    }
  ];

  const handleServiceClick = (serviceId) => {
    const service = fortuneServices.find(s => s.id === serviceId);
    
    if (service?.comingSoon) {
      return; // Do nothing for coming soon services
    }
    
    if (service?.premium && !isPremium) {
      // Redirect to premium page
      window.location.href = '/premium';
      return;
    }
    
    setActiveService(serviceId);
  };

  const goBackToMenu = () => {
    setActiveService('menu');
  };

  // Render active service component
  if (activeService === 'tarot') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto py-4">
          <button
            onClick={goBackToMenu}
            className="flex items-center gap-2 px-4 py-2 mb-4 text-purple-600 hover:text-purple-800 transition-colors"
          >
            ← Fal Menüsüne Dön
          </button>
          <TarotDeck />
        </div>
      </div>
    );
  }

  if (activeService === 'coffee') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="container mx-auto py-4">
          <button
            onClick={goBackToMenu}
            className="flex items-center gap-2 px-4 py-2 mb-4 text-amber-600 hover:text-amber-800 transition-colors"
          >
            ← Fal Menüsüne Dön
          </button>
          <CoffeeReading />
        </div>
      </div>
    );
  }

  // Main menu
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Fal & Kehanet
              </h1>
              <p className="text-xl text-gray-600 mt-2">Gizemin kapılarını aralayın</p>
            </div>
          </div>

          {/* Premium Status */}
          {isPremium ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-full text-sm font-medium mb-4">
              <Crown className="w-4 h-4" />
              Premium Üye - Tüm Fallara Erişim
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-medium mb-4">
              <Lock className="w-4 h-4" />
              Premium ile Tüm Fallara Erişim
            </div>
          )}

          {/* Warning */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 max-w-3xl mx-auto">
            <p className="text-amber-800 text-sm">
              🔮 <strong>Eğlence ve İntrospeksiyon Amaçlıdır:</strong> Tüm fal hizmetleri eğlence, kişisel gelişim ve 
              introspeksiyon amaçlıdır. Önemli yaşam kararlarınızı alırken uzman danışmanlık alın.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {fortuneServices.map((service) => {
              const Icon = service.icon;
              const isAccessible = !service.premium || isPremium;
              
              return (
                <div
                  key={service.id}
                  className={`
                    relative group cursor-pointer transform transition-all duration-300 hover:scale-105
                    ${isAccessible ? 'hover:shadow-2xl' : 'opacity-75'}
                  `}
                  onClick={() => handleServiceClick(service.id)}
                >
                  {/* Card */}
                  <div className={`
                    relative overflow-hidden rounded-3xl p-8 h-full
                    bg-gradient-to-br ${service.bgColor} border-2 border-white
                    ${isAccessible ? 'shadow-lg hover:shadow-xl' : 'shadow-md'}
                    transition-all duration-300
                  `}>
                    {/* Premium Badge */}
                    {service.premium && (
                      <div className="absolute top-4 right-4">
                        <div className={`
                          px-3 py-1 rounded-full text-xs font-bold text-white
                          ${isPremium ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 'bg-gray-400'}
                        `}>
                          {isPremium ? 'Premium' : 'Premium'}
                        </div>
                      </div>
                    )}

                    {/* Coming Soon Badge */}
                    {service.comingSoon && (
                      <div className="absolute top-4 left-4">
                        <div className="px-3 py-1 bg-blue-500 text-white rounded-full text-xs font-bold">
                          Yakında
                        </div>
                      </div>
                    )}

                    {/* Icon */}
                    <div className={`
                      w-16 h-16 rounded-2xl mb-6 flex items-center justify-center
                      bg-gradient-to-r ${service.color} shadow-lg
                    `}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    {/* Content */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">
                          {service.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {service.description}
                        </p>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <div className={`
                              w-1.5 h-1.5 rounded-full
                              bg-gradient-to-r ${service.color}
                            `} />
                            {feature}
                          </li>
                        ))}
                      </ul>

                      {/* Action */}
                      <div className="pt-4">
                        {service.comingSoon ? (
                          <div className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-200 text-gray-500 rounded-xl font-semibold cursor-not-allowed">
                            Yakında Gelecek
                          </div>
                        ) : !isAccessible ? (
                          <div className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                            <Lock className="w-4 h-4" />
                            Premium Gerekli
                          </div>
                        ) : (
                          <div className={`
                            flex items-center justify-center gap-2 px-6 py-3 text-white rounded-xl font-semibold
                            bg-gradient-to-r ${service.color} hover:shadow-lg transition-all
                          `}>
                            Fala Başla
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Decorative elements */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white bg-opacity-10 rounded-full blur-xl" />
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white bg-opacity-5 rounded-full blur-2xl" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        {!isPremium && (
          <div className="text-center mt-16">
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl p-8 max-w-2xl mx-auto text-white">
              <Crown className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-2">Tüm Fallara Premium ile Erişin</h3>
              <p className="text-purple-100 mb-6">
                Tarot, kahve falı ve numeroloji hizmetlerimizin tamamını kullanın
              </p>
              <a
                href="/premium"
                className="inline-flex items-center gap-2 px-8 py-3 bg-white text-purple-600 font-bold rounded-xl hover:shadow-lg transition-all"
              >
                Premium'a Yükselt
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FortuneTelling;