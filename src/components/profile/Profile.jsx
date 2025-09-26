import React, { useState, useEffect } from 'react'
import { 
  User, Mail, Calendar, Settings, Crown, Shield, 
  Edit3, Save, X, Check, Lock, Star, Download, 
  Eye, EyeOff, Trash2, Bell, Globe 
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'react-toastify'

const Profile = () => {
  const { user, profile, updateProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    birth_date: '',
    gender: '',
    phone: '',
    bio: '',
    timezone: 'Europe/Istanbul',
    language: 'tr'
  })
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: 'private',
    data_analytics: true,
    marketing_emails: false,
    push_notifications: true
  })
  const [accountStats, setAccountStats] = useState({
    member_since: '',
    total_entries: 0,
    streak_days: 0,
    average_mood: 0
  })

  const genderOptions = [
    { value: 'male', label: 'Erkek' },
    { value: 'female', label: 'Kadın' },
    { value: 'prefer_not_to_say', label: 'Belirtmek İstemiyorum' }
  ]

  useEffect(() => {
    loadProfileData()
  }, [user, profile])

  const loadProfileData = async () => {
    try {
      // Premium durumunu kontrol et
      const premiumStatus = localStorage.getItem('emotice_premium_status') === 'active' || 
                           profile?.subscription_status === 'premium'
      setIsPremium(premiumStatus)

      // Profil verilerini yükle
      if (profile) {
        setProfileData({
          full_name: profile.full_name || '',
          email: user?.email || '',
          birth_date: profile.birth_date || '',
          gender: profile.gender || '',
          phone: profile.phone || '',
          bio: profile.bio || '',
          timezone: profile.timezone || 'Europe/Istanbul',
          language: profile.language || 'tr'
        })
      }

      // Yaş doğrulama verilerini local storage'dan al
      const ageVerified = localStorage.getItem('emotice_age_verified')
      if (ageVerified) {
        const savedData = localStorage.getItem('emotice_verification_data')
        if (savedData) {
          const verificationData = JSON.parse(savedData)
          setProfileData(prev => ({
            ...prev,
            birth_date: verificationData.birthDate || prev.birth_date,
            gender: verificationData.gender || prev.gender
          }))
        }
      }

      // Hesap istatistiklerini simüle et
      setAccountStats({
        member_since: profile?.created_at || user?.created_at || new Date().toISOString(),
        total_entries: Math.floor(Math.random() * 50) + 10,
        streak_days: Math.floor(Math.random() * 15) + 1,
        average_mood: (Math.random() * 3 + 6).toFixed(1)
      })

      // Gizlilik ayarlarını yükle
      setPrivacySettings({
        profile_visibility: profile?.profile_visibility || 'private',
        data_analytics: profile?.data_analytics !== false,
        marketing_emails: profile?.marketing_consent || false,
        push_notifications: profile?.push_notifications !== false
      })

    } catch (error) {
      console.error('Profile loading error:', error)
      toast.error('Profil verileri yüklenirken hata oluştu')
    }
  }

  const calculateAge = (birthDate) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({
      ...prev,
      [setting]: value
    }))
  }

  const saveProfile = async () => {
    setLoading(true)
    try {
      // Profil güncelleme simülasyonu
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Local storage'a kaydet (gerçek uygulamada Supabase kullanılacak)
      localStorage.setItem('emotice_profile_data', JSON.stringify(profileData))
      localStorage.setItem('emotice_privacy_settings', JSON.stringify(privacySettings))
      
      toast.success('Profil başarıyla güncellendi!')
      setEditMode(false)
    } catch (error) {
      console.error('Profile update error:', error)
      toast.error('Profil güncellenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const exportUserData = () => {
    if (!isPremium) {
      toast.error('Veri export Premium özelliğidir!')
      return
    }

    const exportData = {
      profile: profileData,
      privacy: privacySettings,
      stats: accountStats,
      exported_at: new Date().toISOString()
    }

    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    
    const link = document.createElement('a')
    link.href = url
    link.download = `emotice-profile-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    
    toast.success('Profil verileriniz export edildi!')
  }

  const deleteAccount = () => {
    if (window.confirm('Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!')) {
      toast.error('Hesap silme özelliği henüz aktif değil. Destek ekibiyle iletişime geçin.')
    }
  }

  const userAge = calculateAge(profileData.birth_date)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  {profileData.full_name || 'Kullanıcı'}
                  {isPremium && (
                    <div className="flex items-center gap-1 bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-sm">
                      <Crown className="w-4 h-4" />
                      Premium
                    </div>
                  )}
                </h1>
                <p className="text-gray-600">{profileData.email}</p>
                {userAge && (
                  <p className="text-sm text-gray-500">{userAge} yaşında</p>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              {!editMode ? (
                <button
                  onClick={() => setEditMode(true)}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  Düzenle
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={saveProfile}
                    disabled={loading}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {loading ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                  <button
                    onClick={() => setEditMode(false)}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                    İptal
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Ana Profil Bilgileri */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Kişisel Bilgiler */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <User className="mr-2" size={20} />
                Kişisel Bilgiler
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ad Soyad
                  </label>
                  {editMode ? (
                    <input
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{profileData.full_name || 'Belirtilmemiş'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    E-posta
                  </label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-600">{profileData.email}</p>
                  <p className="text-xs text-gray-500 mt-1">E-posta değiştirilemez</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doğum Tarihi
                  </label>
                  {editMode ? (
                    <input
                      type="date"
                      value={profileData.birth_date}
                      onChange={(e) => handleInputChange('birth_date', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      {profileData.birth_date ? (
                        <div>
                          <p>{new Date(profileData.birth_date).toLocaleDateString('tr-TR')}</p>
                          {userAge && <p className="text-sm text-gray-600">{userAge} yaşında</p>}
                        </div>
                      ) : (
                        'Belirtilmemiş'
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cinsiyet
                  </label>
                  {editMode ? (
                    <select
                      value={profileData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seçiniz</option>
                      {genderOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {genderOptions.find(g => g.value === profileData.gender)?.label || 'Belirtilmemiş'}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  {editMode ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+90 5XX XXX XX XX"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">{profileData.phone || 'Belirtilmemiş'}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Zaman Dilimi
                  </label>
                  {editMode ? (
                    <select
                      value={profileData.timezone}
                      onChange={(e) => handleInputChange('timezone', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Europe/Istanbul">İstanbul (UTC+3)</option>
                      <option value="Europe/London">Londra (UTC+0)</option>
                      <option value="America/New_York">New York (UTC-5)</option>
                    </select>
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg">
                      {profileData.timezone === 'Europe/Istanbul' ? 'İstanbul (UTC+3)' : profileData.timezone}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hakkımda
                </label>
                {editMode ? (
                  <textarea
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Kendiniz hakkında birkaç kelime..."
                    rows="3"
                    maxLength={isPremium ? 500 : 150}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
                  />
                ) : (
                  <p className="p-3 bg-gray-50 rounded-lg min-h-[80px]">
                    {profileData.bio || 'Henüz bir açıklama eklenmemiş'}
                  </p>
                )}
                {editMode && (
                  <p className="text-xs text-gray-500 mt-1">
                    {profileData.bio.length}/{isPremium ? 500 : 150} karakter
                  </p>
                )}
              </div>
            </div>

            {/* Gizlilik Ayarları */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Shield className="mr-2" size={20} />
                Gizlilik ve Güvenlik
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Profil Görünürlüğü</h3>
                    <p className="text-sm text-gray-600">Profilinizin kimler tarafından görülebileceğini belirleyin</p>
                  </div>
                  <select
                    value={privacySettings.profile_visibility}
                    onChange={(e) => handlePrivacyChange('profile_visibility', e.target.value)}
                    disabled={!editMode}
                    className="p-2 border border-gray-300 rounded-lg disabled:bg-gray-50"
                  >
                    <option value="private">Özel</option>
                    <option value="friends">Arkadaşlar</option>
                    <option value="public">Herkese Açık</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Veri Analizi</h3>
                    <p className="text-sm text-gray-600">Hizmet iyileştirme için anonim veri kullanımı</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyChange('data_analytics', !privacySettings.data_analytics)}
                    disabled={!editMode}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      privacySettings.data_analytics ? 'bg-purple-600' : 'bg-gray-300'
                    } disabled:opacity-50`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      privacySettings.data_analytics ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Pazarlama E-postaları</h3>
                    <p className="text-sm text-gray-600">Yeni özellikler ve promosyonlar hakkında bildirim</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyChange('marketing_emails', !privacySettings.marketing_emails)}
                    disabled={!editMode}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      privacySettings.marketing_emails ? 'bg-purple-600' : 'bg-gray-300'
                    } disabled:opacity-50`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      privacySettings.marketing_emails ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">Push Bildirimleri</h3>
                    <p className="text-sm text-gray-600">Mood hatırlatıcıları ve bildirimler</p>
                  </div>
                  <button
                    onClick={() => handlePrivacyChange('push_notifications', !privacySettings.push_notifications)}
                    disabled={!editMode}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      privacySettings.push_notifications ? 'bg-purple-600' : 'bg-gray-300'
                    } disabled:opacity-50`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                      privacySettings.push_notifications ? 'translate-x-6' : 'translate-x-1'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Yan Panel */}
          <div className="space-y-6">
            
            {/* Hesap İstatistikleri */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Hesap İstatistikleri</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Üyelik Tarihi</p>
                  <p className="font-semibold">
                    {new Date(accountStats.member_since).toLocaleDateString('tr-TR')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Toplam Mood Giriş</p>
                  <p className="font-semibold">{accountStats.total_entries}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Aktif Gün Serisi</p>
                  <p className="font-semibold">{accountStats.streak_days} gün</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ortalama Mood</p>
                  <p className="font-semibold">{accountStats.average_mood}/10</p>
                </div>
              </div>
            </div>

            {/* Premium Status */}
            <div className={`rounded-2xl shadow-lg p-6 ${
              isPremium 
                ? 'bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200' 
                : 'bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200'
            }`}>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Crown className={`mr-2 ${isPremium ? 'text-amber-600' : 'text-purple-600'}`} size={20} />
                {isPremium ? 'Premium Üye' : 'Free Plan'}
              </h3>
              
              {isPremium ? (
                <div className="space-y-2">
                  <p className="text-sm text-amber-800">Premium üyeliğiniz aktif!</p>
                  <ul className="text-xs text-amber-700 space-y-1">
                    <li>✓ Sınırsız mood giriş</li>
                    <li>✓ Gelişmiş analytics</li>
                    <li>✓ Veri export</li>
                    <li>✓ Öncelikli destek</li>
                  </ul>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-purple-800">Premium'a geçin ve tüm özellikleri keşfedin</p>
                  <a 
                    href="/premium"
                    className="block w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-center text-sm"
                  >
                    Premium'a Geç
                  </a>
                </div>
              )}
            </div>

            {/* Veri ve Güvenlik Aksiyonları */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Veri ve Güvenlik</h3>
              <div className="space-y-3">
                <button
                  onClick={exportUserData}
                  disabled={!isPremium}
                  className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                    isPremium 
                      ? 'bg-blue-500 text-white hover:bg-blue-600' 
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  Verilerimi Export Et
                  {!isPremium && <Lock className="w-4 h-4" />}
                </button>
                
                <button className="w-full bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors">
                  Şifre Değiştir
                </button>
                
                <button 
                  onClick={deleteAccount}
                  className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Hesabı Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile