// src/pages/ErrorPages/NotFound.jsx
import React from 'react'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-purple-200 mb-4">404</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sayfa Bulunamadı</h1>
          <p className="text-gray-600 mb-8">
            Aradığınız sayfa mevcut değil veya taşınmış olabilir.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Ne yapmak istersiniz?</h2>
          
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center gap-3 bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Geri Dön
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-3 bg-gray-600 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Ana Sayfaya Git
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center justify-center gap-3 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Search className="w-5 h-5" />
              Dashboard'a Git
            </button>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          <p>Sorun devam ediyorsa, lütfen destek ekibimizle iletişime geçin.</p>
          <p className="mt-2">
            Email: <a href="mailto:emotice2025@gmail.com" className="text-purple-600 hover:underline">emotice2025@gmail.com</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default NotFound