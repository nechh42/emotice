import React from 'react';
import { Crown, Star, Zap, Heart } from 'lucide-react';

const PremiumPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Crown className="mx-auto text-yellow-500 mb-4" size={48} />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">EMOTICE Premium</h1>
            <p className="text-xl text-gray-600">Duygusal sağlığınız için gelişmiş özellikler</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Ücretsiz</h2>
              <ul className="space-y-3 text-gray-600">
                <li> Temel ruh hali takibi</li>
                <li> 7 günlük geçmiş</li>
                <li> Basit analytics</li>
                <li> Topluluk desteği</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg shadow-lg p-8 text-white relative">
              <Crown className="absolute top-4 right-4 text-yellow-400" size={24} />
              <h2 className="text-2xl font-bold mb-4">Premium</h2>
              <ul className="space-y-3">
                <li>✨ Sınırsız geçmiş</li>
                <li>✨ Gelişmiş analytics</li>
                <li>✨ Kişisel AI insights</li>
                <li>✨ Veri export</li>
                <li>✨ Premium içerikler</li>
              </ul>
              <button className="w-full mt-6 bg-white text-purple-600 font-bold py-3 rounded-lg hover:bg-gray-100">
                Yakında...
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPage;
