// src/App.jsx
// EMOTICE - GERÇEK TAM İŞLEVSEL UYGULAMA
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';

// Supabase
import { supabase } from './lib/supabase';

// Components
import LoadingScreen from './components/ui/LoadingScreen';
import Navbar from './components/layout/Navbar';
import ConsentModal from './components/legal/ConsentModal';

// Pages
import Dashboard from './pages/Dashboard';
import MoodHistoryPage from './pages/MoodHistoryPage';
import ProfilePage from './pages/ProfilePage';
import PremiumPage from './pages/PremiumPage';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [consentStatus, setConsentStatus] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Kullanıcı durumunu kontrol et
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      // Auth state değişikliklerini dinle
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setUser(session?.user ?? null);
          
          if (session?.user) {
            await checkUserConsent(session.user.id);
          } else {
            setConsentStatus(null);
          }
        }
      );

      // İlk yükleme için consent kontrolü
      if (user) {
        await checkUserConsent(user.id);
      }

      return () => {
        subscription.unsubscribe();
      };

    } catch (error) {
      console.error('App başlatma hatası:', error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserConsent = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('user_consents')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Consent kontrol hatası:', error);
        return;
      }

      if (data) {
        setConsentStatus(data);
        setShowConsentModal(false);
      } else {
        setConsentStatus(null);
        setShowConsentModal(true);
      }
    } catch (error) {
      console.error('Consent kontrol hatası:', error);
    }
  };

  const handleConsentComplete = (consentData) => {
    setConsentStatus(consentData);
    setShowConsentModal(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setConsentStatus(null);
      setShowConsentModal(false);
    } catch (error) {
      console.error('Çıkış hatası:', error);
    }
  };

  // Basit Auth Bileşeni (mevcut sisteminizi kullanabilirsiniz)
  const SimpleAuth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [authLoading, setAuthLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleAuth = async (e) => {
      e.preventDefault();
      setAuthLoading(true);
      setMessage('');

      try {
        if (isLogin) {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });
          if (error) throw error;
          setMessage('Giriş başarılı!');
        } else {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                name: name
              }
            }
          });
          if (error) throw error;
          setMessage('Kayıt başarılı! Lütfen email adresinizi doğrulayın.');
        }
      } catch (error) {
        setMessage(error.message);
      } finally {
        setAuthLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-md w-full space-y-8 p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl font-bold">💜</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-800">EMOTICE</h2>
            <p className="text-gray-600 mt-2">Duygusal Sağlık Takibi</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold text-center mb-4">
              {isLogin ? 'Giriş Yapın' : 'Kayıt Olun'}
            </h3>
            
            <form onSubmit={handleAuth} className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Adınız"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  required
                />
              )}
              
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              
              <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                required
              />
              
              <button
                type="submit"
                disabled={authLoading}
                className={`w-full py-3 rounded-lg font-semibold ${
                  authLoading 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-purple-500 hover:bg-purple-600'
                } text-white transition-colors`}
              >
                {authLoading ? 'Yükleniyor...' : (isLogin ? 'Giriş Yap' : 'Kayıt Ol')}
              </button>
            </form>
            
            <div className="mt-4 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-purple-600 hover:text-purple-800"
              >
                {isLogin ? 'Hesabınız yok mu? Kayıt olun' : 'Hesabınız var mı? Giriş yapın'}
              </button>
            </div>
            
            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                message.includes('başarılı') 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Loading ekranı
  if (loading) {
    return <LoadingScreen />;
  }

  // Giriş yapılmamışsa Auth sayfasına yönlendir
  if (!user) {
    return (
      <>
        <SimpleAuth />
        <ToastContainer position="top-right" />
      </>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
        {/* Navbar - sadece oturum açmış ve consent vermiş kullanıcılar için */}
        {user && consentStatus && !showConsentModal && (
          <Navbar user={user} onLogout={handleLogout} />
        )}

        {/* Consent Modal */}
        {showConsentModal && user && (
          <ConsentModal
            isOpen={showConsentModal}
            onConsent={handleConsentComplete}
            userAge={25} // Test için sabit yaş, gerçek sistemde dinamik olacak
          />
        )}

        {/* Ana Routes - sadece consent verilmişse */}
        {user && consentStatus && !showConsentModal ? (
          <div className={user && consentStatus && !showConsentModal ? 'pt-16' : ''}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<MoodHistoryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/premium" element={<PremiumPage />} />
              
              {/* Redirect any unknown routes to dashboard */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        ) : user && !consentStatus && !showConsentModal ? (
          // Consent durumu belirsizse loading göster
          <div className="min-h-screen flex items-center justify-center">
            <LoadingScreen message="Verileriniz kontrol ediliyor..." />
          </div>
        ) : null}

        {/* Toast Container */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          className="mt-16"
        />
      </div>
    </Router>
  );
}

export default App;
