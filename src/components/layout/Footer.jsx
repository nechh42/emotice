// ========================================
// DOSYA: src/components/common/Footer.jsx
// ========================================

import React from 'react'
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo ve Açıklama */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-full p-2">
                <Heart className="h-6 w-6 text-white" fill="currentColor" />
              </div>
              <span className="text-2xl font-bold">Emotice</span>
            </div>
            <p className="text-gray-300 mb-4">
              Mental sağlığınızı iyileştirin, daha mutlu ve dengeli bir yaşam sürün.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
          </div>

          {/* Ürün */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Ürün</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Özellikler</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Fiyatlandırma</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Mobil Uygulama</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">API</a></li>
            </ul>
          </div>

          {/* Şirket */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Şirket</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Hakkımızda</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Blog</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Kariyer</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Basın</a></li>
            </ul>
          </div>

          {/* Destek */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Destek</h4>
            <ul className="space-y-2 text-gray-300">
              <li><a href="#" className="hover:text-white transition-colors duration-200">Yardım Merkezi</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">SSS</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">İletişim</a></li>
              <li><a href="#" className="hover:text-white transition-colors duration-200">Topluluk</a></li>
            </ul>
          </div>
        </div>

        {/* Alt Bölüm */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm mb-4 md:mb-0">
              © {currentYear} Emotice. Tüm hakları saklıdır.
            </div>
            <div className="flex space-x-6 text-sm text-gray-300">
              <a href="#" className="hover:text-white transition-colors duration-200">Gizlilik Politikası</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Kullanım Şartları</a>
              <a href="#" className="hover:text-white transition-colors duration-200">Çerez Politikası</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer