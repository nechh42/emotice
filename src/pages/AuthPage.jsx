import React from 'react';
import { Heart } from 'lucide-react';

const AuthPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-white" size={32} />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">EMOTICE</h2>
          <p className="text-gray-600 mt-2">Duygusal Sağlık Takibi</p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h3 className="text-xl font-semibold text-center mb-4">Giriş Yapın</h3>
          <p className="text-center text-gray-600 mb-6">
            Mevcut auth sisteminiz burada entegre edilecek
          </p>
          <div className="space-y-4">
            <button className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600">
              Email ile Giriş
            </button>
            <button className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600">
              Google ile Giriş
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
