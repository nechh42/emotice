// src/pages/ErrorPages/ServerError.jsx
import React from 'react'
import { RefreshCw, Home, Mail, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ServerError = () => {
  const navigate = useNavigate()

  const handleRefresh = () => {
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-red-200 mb-4">500</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sunucu Hatası</h1>
          <p className="text-gray-600 mb-8">
            Üzgünüz, sunucumuzda teknik bir sorun yaşanıyor. En kısa sürede düzeltilecek.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center justify-center mb-6">
            <AlertTriangle className="w-16 h-16 text-orange-500" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ne yapabilirsiniz?</h2>
          
          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              className="w-full flex items-center justify-center gap-3 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              Sayfayı Yenile
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-3 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Ana Sayfaya Git
            </button>
          </div>
        </div>

        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-orange-800 mb-2">Sorun devam ediyor mu?</h3>
          <p className="text-sm text-orange-700 mb-3">
            Bu hatayı alıyorsanız, teknik ekibimize bildirin. Size en kısa sürede yardımcı olalım.
          </p>
          <a 
            href="mailto:emotice2025@gmail.com?subject=500 Sunucu Hatası"
            className="inline-flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors text-sm"
          >
            <Mail className="w-4 h-4" />
            Hata Bildir
          </a>
        </div>

        <div className="text-sm text-gray-500">
          <p>Hata Kodu: 500 - Internal Server Error</p>
          <p className="mt-1">Zaman: {new Date().toLocaleString('tr-TR')}</p>
        </div>
      </div>
    </div>
  )
}

export default ServerError