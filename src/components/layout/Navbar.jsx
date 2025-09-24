// ========================================
// GÜNCELLENMIŞ DOSYA: src/components/common/Navbar.jsx
// ========================================

import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Heart, User, Settings, LogOut, Bell } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../hooks/useNotifications'
import NotificationCenter from './NotificationCenter'
import { LanguageSelector } from './components/LanguageSelector';
<Link to="/profile" className="...">Profil</Link>
import { useTranslation } from 'react-i18next'
const Navbar = ({ onLoginClick, onRegisterClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, profile, signOut, isAuthenticated } = useAuth()
  const { unreadCount, hasUnreadNotifications } = useNotifications()

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen)
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen)

  const handleSignOut = async () => {
    await signOut()
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const handleNotificationClick = () => {
    setIsNotificationCenterOpen(true)
  }

  // Aktif link kontrolü
  const isActiveLink = (path) => {
    return location.pathname === path
  }

  // Navigation linkleri
  const navLinks = [
    { name: 'Ana Sayfa', path: '/', auth: false },
    { name: 'Özellikler', path: '/features', auth: false },
    { name: 'Fiyatlandırma', path: '/pricing', auth: false },
    { name: 'Dashboard', path: '/dashboard', auth: true },
    { name: 'Geçmiş', path: '/history', auth: true },
  ]

  // Filtreli linkler (auth durumuna göre)
  const filteredLinks = navLinks.filter(link => 
    isAuthenticated ? true : !link.auth
  )

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <div className="bg-white/20 rounded-full p-2">
                  <Heart className="h-6 w-6 text-white" fill="currentColor" />
                </div>
                <span className="text-white text-xl font-bold">
                  {import.meta.env.VITE_APP_NAME || 'Emotice'}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {filteredLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActiveLink(link.path)
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Desktop Auth Buttons / User Menu */}
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  {/* Bildirim ikonu */}
                  <button 
                    onClick={handleNotificationClick}
                    className="relative p-2 text-white/80 hover:text-white transition-colors duration-200"
                  >
                    <Bell className="h-5 w-5" />
                    {hasUnreadNotifications && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* User Menu */}
                  <div className="relative">
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors duration-200"
                    >
                      <div className="bg-white/20 rounded-full p-1">
                        <User className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-medium">
                        {profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı'}
                      </span>
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                          <Link
                            to="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4 mr-3" />
                            Profil
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4 mr-3" />
                            Ayarlar
                          </Link>
                          <hr className="my-1" />
                          <button
                            onClick={handleSignOut}
                            className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                          >
                            <LogOut className="h-4 w-4 mr-3" />
                            Çıkış Yap
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <button
                    onClick={onLoginClick}
                    className="text-white/80 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                  >
                    Giriş Yap
                  </button>
                  <button
                    onClick={onRegisterClick}
                    className="bg-white text-purple-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
                  >
                    Kaydol
                  </button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-white hover:text-white/80 p-2"
                aria-label="Menüyü aç/kapat"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white/10 backdrop-blur-sm">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {filteredLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                    isActiveLink(link.path)
                      ? 'bg-white/20 text-white'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="pt-4 pb-3 border-t border-white/20">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    {/* Mobile Notification Button */}
                    <button
                      onClick={() => {
                        handleNotificationClick()
                        setIsMenuOpen(false)
                      }}
                      className="flex items-center w-full text-left px-3 py-2 text-white/80 hover:text-white text-base font-medium"
                    >
                      <Bell className="h-5 w-5 mr-3" />
                      Bildirimler
                      {hasUnreadNotifications && (
                        <span className="ml-auto bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                          {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                      )}
                    </button>

                    <div className="flex items-center px-3 py-2">
                      <div className="bg-white/20 rounded-full p-1 mr-3">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-white text-sm font-medium">
                        {profile?.full_name || user?.email?.split('@')[0] || 'Kullanıcı'}
                      </span>
                    </div>
                    
                    <Link
                      to="/profile"
                      className="block px-3 py-2 text-white/80 hover:text-white text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Profil
                    </Link>
                    <Link
                      to="/settings"
                      className="block px-3 py-2 text-white/80 hover:text-white text-base font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Ayarlar
                    </Link>
                    <button
                      onClick={() => {
                        handleSignOut()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-red-200 hover:text-red-100 text-base font-medium"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        onLoginClick?.()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 text-white/80 hover:text-white text-base font-medium"
                    >
                      Giriş Yap
                    </button>
                    <button
                      onClick={() => {
                        onRegisterClick?.()
                        setIsMenuOpen(false)
                      }}
                      className="block w-full text-left px-3 py-2 bg-white text-purple-600 rounded-md text-base font-medium hover:bg-gray-100 transition-colors duration-200"
                    >
                      Kaydol
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Click outside to close user menu */}
        {isUserMenuOpen && (
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsUserMenuOpen(false)}
          />
        )}
      </nav>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={isNotificationCenterOpen}
        onClose={() => setIsNotificationCenterOpen(false)}
      />
    </>
  )
}

export default Navbar