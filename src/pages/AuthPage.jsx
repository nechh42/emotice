import React, { useState, useEffect } from "react"
import { useAuth } from "../contexts/AuthContext"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import AgeVerification from "../components/auth/AgeVerification"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showAgeVerification, setShowAgeVerification] = useState(false)
  
  const { signIn, signUp } = useAuth()

  useEffect(() => {
    // Yaş doğrulama kontrol et
    const ageVerified = localStorage.getItem('emotice_age_verified')
    if (!ageVerified) {
      setShowAgeVerification(true)
    }
  }, [])

  const handleAgeVerificationComplete = (data) => {
    localStorage.setItem('emotice_age_verified', 'true')
    setShowAgeVerification(false)
  }

  const handleAgeVerificationBack = () => {
    setShowAgeVerification(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (isLogin) {
        const result = await signIn(email, password)
        if (result.error) throw result.error
      } else {
        // Kayıt olurken yaş doğrulama gerekli
        const ageVerified = localStorage.getItem('emotice_age_verified')
        if (!ageVerified) {
          setShowAgeVerification(true)
          setLoading(false)
          return
        }
        
        const result = await signUp(email, password, { full_name: name })
        if (result.error) throw result.error
      }
    } catch (error) {
      setError(error.message || "Bir hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  // Yaş doğrulama kontrolü
  if (showAgeVerification) {
    return (
      <AgeVerification 
        onVerificationComplete={handleAgeVerificationComplete}
        onBack={handleAgeVerificationBack}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">EMOTICE</h1>
          <p className="text-gray-600">Duygusal Sağlık Takibi</p>
        </div>

        <div className="mb-6">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${isLogin ? "bg-white text-purple-600 shadow-sm" : "text-gray-600"}`}
            >
              Giriş Yap
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${!isLogin ? "bg-white text-purple-600 shadow-sm" : "text-gray-600"}`}
            >
              Kayıt Ol
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ad Soyad</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Adınızı girin"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="email@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Şifre</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Şifrenizi girin"
              required
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? "Yükleniyor..." : isLogin ? "Giriş Yap" : "Kayıt Ol"}
          </button>
        </form>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800 mb-2">Test için:</p>
          <button
            type="button"
            onClick={() => {
              localStorage.setItem('emotice_demo_user', 'true');
              localStorage.setItem('emotice_age_verified', 'true');
              window.location.reload();
            }}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Demo Giriş (Test)
          </button>
        </div>
      </div>
    </div>
  )
}

export default AuthPage