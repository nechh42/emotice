import React, { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { Home, Heart, BarChart3, User } from 'lucide-react'
import MoodTracker from './components/mood/MoodTracker'
import { useAuth } from './hooks/useAuth'
import AuthPage from './pages/AuthPage'
import Dashboard from './components/dashboard/Dashboard'
import MoodHistory from './components/mood/MoodHistorySimple'
import Profile from './components/profile/Profile'

function App() {
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user, loading: authLoading } = useAuth()
  
  useEffect(() => {
    supabase.from('profiles').select('count').limit(1)
      .then(() => setConnected(true))
      .catch(() => setConnected(false))
      .finally(() => setLoading(false))
  }, [])

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  if (!connected) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-purple-600 mb-4">EMOTICE</h1>
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            Veritabanı Bağlantı Hatası
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <AuthPage />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        <nav className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-purple-600">EMOTICE</h1>
              </div>
              <div className="flex space-x-8">
                <Link to="/" className="flex items-center gap-2 text-gray-700 hover:text-purple-600">
                  <Home className="w-5 h-5" />
                  Ana Sayfa
                </Link>
                <Link to="/mood" className="flex items-center gap-2 text-gray-700 hover:text-purple-600">
                  <Heart className="w-5 h-5" />
                  Ruh Hali
                </Link>
                <Link to="/history" className="flex items-center gap-2 text-gray-700 hover:text-purple-600">
                  <BarChart3 className="w-5 h-5" />
                  Geçmiş
                </Link>
                <Link to="/profile" className="flex items-center gap-2 text-gray-700 hover:text-purple-600">
                  <User className="w-5 h-5" />
                  Profil
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/mood" element={<MoodTracker />} />
            <Route path="/history" element={<MoodHistory />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
      </div>
    </Router>
  )
}

export default App





