import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import './index.css'

function App() {
  const [currentPage, setCurrentPage] = useState('welcome')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('testing')
  const [user, setUser] = useState(null)

  const [registerForm, setRegisterForm] = useState({
    email: '',
    password: '',
    birthDate: '',
    agreedToTerms: false
  })

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  // Test Supabase connection and auth state
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('profiles').select('count').limit(1)
        setConnectionStatus(error ? 'error' : 'connected')
      } catch (err) {
        setConnectionStatus('error')
      }
    }

    // Check current user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        if (event === 'SIGNED_IN') {
          setMessage('Giriş başarılı! Hoş geldiniz.')
          setCurrentPage('dashboard')
        }
        if (event === 'SIGNED_OUT') {
          setMessage('Çıkış yapıldı.')
          setCurrentPage('welcome')
        }
      }
    )

    testConnection()
    getUser()

    return () => subscription.unsubscribe()
  }, [])

  // Calculate age
  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  // Form validation
  const validateRegisterForm = () => {
    if (!registerForm.email || !registerForm.password || !registerForm.birthDate) {
      setMessage('Lütfen tüm alanları doldurun.')
      return false
    }
    
    if (registerForm.password.length < 6) {
      setMessage('Şifre en az 6 karakter olmalıdır.')
      return false
    }
    
    const age = calculateAge(registerForm.birthDate)
    if (age < 16) {
      setMessage('16 yaşından küçükseniz kayıt olamazsınız.')
      return false
    }
    
    if (!registerForm.agreedToTerms) {
      setMessage('Kullanım şartlarını kabul etmeniz gerekiyor.')
      return false
    }
    
    return true
  }

  // Handle registration with full Supabase integration
  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (!validateRegisterForm()) {
      setLoading(false)
      return
    }

    try {
      // Step 1: Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerForm.email,
        password: registerForm.password
      })

      if (authError) throw authError

      // Step 2: Create profile manually
      if (authData?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: authData.user.id,
            email: registerForm.email,
            birth_date: registerForm.birthDate,
            age_verified: true,
            terms_accepted_at: new Date().toISOString(),
            privacy_accepted_at: new Date().toISOString()
          })

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Continue anyway - auth was successful
        }
      }

      setMessage('Kayıt başarılı! Email doğrulama linkini kontrol edin.')
      
      // Clear form
      setRegisterForm({
        email: '',
        password: '',
        birthDate: '',
        agreedToTerms: false
      })

      // Redirect to login after 3 seconds
      setTimeout(() => {
        setCurrentPage('login')
        setMessage('Şimdi giriş yapabilirsiniz.')
      }, 3000)

    } catch (error) {
      console.error('Registration error:', error)
      setMessage(`Kayıt hatası: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle login
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (!loginForm.email || !loginForm.password) {
      setMessage('Email ve şifre gereklidir.')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginForm.email,
        password: loginForm.password
      })

      if (error) throw error

      // Success message will be handled by onAuthStateChange
      setLoginForm({ email: '', password: '' })

    } catch (error) {
      console.error('Login error:', error)
      setMessage(`Giriş hatası: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Handle logout
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      setMessage(`Çıkış hatası: ${error.message}`)
    }
  }

  // Connection Status Component
  const ConnectionStatus = () => (
    <div className="fixed top-4 right-4 z-50">
      <div className={`px-3 py-2 rounded-lg text-sm font-medium ${
        connectionStatus === 'connected' 
          ? 'bg-green-100 text-green-800' 
          : connectionStatus === 'error'
          ? 'bg-red-100 text-red-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}>
        {connectionStatus === 'connected' && 'Supabase Bağlı'}
        {connectionStatus === 'error' && 'Bağlantı Hatası'}
        {connectionStatus === 'testing' && 'Test Ediliyor...'}
      </div>
    </div>
  )

  // Welcome Page
  const WelcomePage = () => (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <ConnectionStatus />
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-600 rounded-full mb-4">
            <span className="text-2xl font-bold text-white">E</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Emotice</h1>
          <p className="text-gray-600">Ruh halinizi takip edin, kendinizi keşfedin</p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="space-y-4">
            <button
              onClick={() => setCurrentPage('register')}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Kayıt Ol
            </button>
            <button
              onClick={() => setCurrentPage('login')}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Giriş Yap
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Register Page - TAM FONKSİYONEL
  const RegisterPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ConnectionStatus />
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Hesap Oluştur</h2>
            <p className="text-gray-600 mt-2">Emotice'ye hoş geldiniz</p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.includes('başarılı') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Adresiniz
              </label>
              <input
                type="email"
                placeholder="ornek@email.com"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifreniz
              </label>
              <input
                type="password"
                placeholder="En az 6 karakter"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                minLength={6}
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Doğum Tarihiniz (16+ yaş gerekli)
              </label>
              <input
                type="date"
                value={registerForm.birthDate}
                onChange={(e) => setRegisterForm({...registerForm, birthDate: e.target.value})}
                max={new Date().toISOString().split('T')[0]}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
              {registerForm.birthDate && (
                <p className="mt-1 text-sm text-gray-600">
                  Yaşınız: {calculateAge(registerForm.birthDate)}
                </p>
              )}
            </div>

            <div className="flex items-start">
              <input
                type="checkbox"
                checked={registerForm.agreedToTerms}
                onChange={(e) => setRegisterForm({...registerForm, agreedToTerms: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-0.5"
                required
                disabled={loading}
              />
              <label className="ml-3 text-sm text-gray-700">
                16 yaşından büyüğüm ve Kullanım Şartları'nı kabul ediyorum.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || connectionStatus !== 'connected'}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Hesap Oluşturuluyor...' : 'Hesap Oluştur'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentPage('welcome')}
              className="text-blue-600 hover:underline"
              disabled={loading}
            >
              ← Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Login Page - TAM FONKSİYONEL
  const LoginPage = () => (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <ConnectionStatus />
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Giriş Yap</h2>
            <p className="text-gray-600 mt-2">Hesabınıza erişin</p>
          </div>

          {message && (
            <div className={`mb-4 p-3 rounded-lg ${
              message.includes('başarılı') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Adresiniz
              </label>
              <input
                type="email"
                placeholder="ornek@email.com"
                value={loginForm.email}
                onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Şifreniz
              </label>
              <input
                type="password"
                placeholder="Şifrenizi girin"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading || connectionStatus !== 'connected'}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <div className="mt-6 text-center space-y-2">
            <button
              onClick={() => setCurrentPage('register')}
              className="text-blue-600 hover:underline text-sm"
              disabled={loading}
            >
              Hesabınız yok mu? Kayıt olun
            </button>
            <br />
            <button
              onClick={() => setCurrentPage('welcome')}
              className="text-gray-500 hover:text-gray-700 text-sm"
              disabled={loading}
            >
              ← Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  // Dashboard Page - BASİT VERSİYON
  const DashboardPage = () => (
    <div className="min-h-screen bg-gray-50">
      <ConnectionStatus />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Hoş geldiniz, {user?.email}</p>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Başarılı!</h2>
              <p className="text-blue-800">
                Emotice kayıt ve giriş sistemi tam olarak çalışıyor. 
                Supabase bağlantısı aktif ve kullanıcı authentication'ı tamamlandı.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Sonraki Özellikler</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Mood tracking sistemi</li>
                  <li>• Mental health anketi</li>
                  <li>• Premium özellikler</li>
                  <li>• Motivasyon sistemi</li>
                </ul>
              </div>
              
              <div className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Tamamlanan</h3>
                <ul className="text-sm text-green-600 space-y-1">
                  <li>✓ Supabase entegrasyonu</li>
                  <li>✓ Kullanıcı kayıt sistemi</li>
                  <li>✓ Giriş/çıkış sistemi</li>
                  <li>✓ Yaş doğrulama</li>
                </ul>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleLogout}
                className="px-6 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  // Main render logic
  const renderPage = () => {
    if (user && currentPage !== 'dashboard') {
      return <DashboardPage />
    }
    
    switch (currentPage) {
      case 'register':
        return <RegisterPage />
      case 'login':
        return <LoginPage />
      case 'dashboard':
        return <DashboardPage />
      default:
        return <WelcomePage />
    }
  }

  return (
    <div className="App">
      {renderPage()}
    </div>
  )
}

export default App