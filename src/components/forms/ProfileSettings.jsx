import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  User, 
  Mail, 
  Calendar, 
  Lock, 
  Bell, 
  Shield, 
  Download, 
  Trash2, 
  Upload,
  Save,
  Eye,
  EyeOff,
  Moon,
  Sun,
  Monitor
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

// Validation schemas
const profileSchema = z.object({
  full_name: z.string().min(2, 'Ad en az 2 karakter olmalı'),
  email: z.string().email('Geçerli email adresi girin'),
  birth_date: z.string().min(1, 'Doğum tarihi gerekli'),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say'])
});

const passwordSchema = z.object({
  current_password: z.string().min(6, 'Mevcut şifre gerekli'),
  new_password: z.string().min(8, 'Yeni şifre en az 8 karakter olmalı'),
  confirm_password: z.string()
}).refine(data => data.new_password === data.confirm_password, {
  message: "Şifreler eşleşmiyor",
  path: ["confirm_password"]
});

const ProfileSettings = () => {
  const { user, profile, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(profile?.avatar_url || '');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [theme, setTheme] = useState('system');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    daily_reminder: true,
    weekly_summary: true
  });

  // Profile form
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      email: user?.email || '',
      birth_date: profile?.birth_date || '',
      gender: profile?.gender || 'prefer_not_to_say'
    }
  });

  // Password form
  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      current_password: '',
      new_password: '',
      confirm_password: ''
    }
  });

  // Load user preferences
  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (preferences) {
        setTheme(preferences.theme || 'system');
        setNotifications(preferences.notifications || notifications);
      }
    } catch (error) {
      console.error('Preferences yüklenirken hata:', error);
    }
  };

  // Avatar upload handler
  const handleAvatarChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Dosya boyutu 2MB\'dan küçük olmalı');
        return;
      }

      setAvatar(file);
      const preview = URL.createObjectURL(file);
      setAvatarPreview(preview);
    }
  };

  // Upload avatar to Supabase Storage
  const uploadAvatar = async () => {
    if (!avatar) return avatarPreview;

    try {
      const fileExt = avatar.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(fileName, avatar);

      if (error) throw error;

      const { data: publicURL } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return publicURL.publicUrl;
    } catch (error) {
      console.error('Avatar yükleme hatası:', error);
      toast.error('Avatar yüklenirken hata oluştu');
      return avatarPreview;
    }
  };

  // Profile update handler
  const onProfileSubmit = async (data) => {
    setLoading(true);
    try {
      const avatarUrl = await uploadAvatar();

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.full_name,
          birth_date: data.birth_date,
          gender: data.gender,
          avatar_url: avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      await updateProfile({ 
        ...data, 
        avatar_url: avatarUrl 
      });
      
      toast.success('Profil başarıyla güncellendi');
      setAvatar(null);
    } catch (error) {
      console.error('Profil güncelleme hatası:', error);
      toast.error('Profil güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Password update handler
  const onPasswordSubmit = async (data) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.new_password
      });

      if (error) throw error;

      toast.success('Şifre başarıyla güncellendi');
      passwordForm.reset();
    } catch (error) {
      console.error('Şifre güncelleme hatası:', error);
      toast.error('Şifre güncellenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Save preferences
  const savePreferences = async () => {
    try {
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          theme,
          notifications,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      toast.success('Ayarlar kaydedildi');
    } catch (error) {
      console.error('Ayarlar kaydedilirken hata:', error);
      toast.error('Ayarlar kaydedilirken hata oluştu');
    }
  };

  // Export data
  const exportData = async (format = 'json') => {
    try {
      setLoading(true);
      
      const { data: moodEntries } = await supabase
        .from('mood_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      const exportData = {
        profile: profile,
        mood_entries: moodEntries,
        export_date: new Date().toISOString()
      };

      if (format === 'json') {
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `emotice-data-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
      } else if (format === 'csv') {
        const csvRows = [
          ['Tarih', 'Ruh Hali', 'Skor', 'Notlar', 'Etiketler'],
          ...moodEntries.map(entry => [
            new Date(entry.created_at).toLocaleDateString('tr-TR'),
            entry.mood_type,
            entry.mood_score,
            entry.notes || '',
            entry.tags ? entry.tags.join(', ') : ''
          ])
        ];
        
        const csvContent = csvRows.map(row => row.join(',')).join('\n');
        const dataUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', `emotice-moods-${new Date().toISOString().split('T')[0]}.csv`);
        linkElement.click();
      }

      toast.success('Veriler başarıyla dışa aktarıldı');
    } catch (error) {
      console.error('Veri dışa aktarım hatası:', error);
      toast.error('Veriler dışa aktarılırken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  // Delete account
  const deleteAccount = async () => {
    const confirmed = window.confirm(
      'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!'
    );
    
    if (!confirmed) return;

    const doubleConfirm = window.prompt(
      'Hesabınızı silmek için "HESABI SIL" yazın:'
    );

    if (doubleConfirm !== 'HESABI SIL') {
      toast.error('Doğrulama başarısız');
      return;
    }

    try {
      setLoading(true);

      // Delete user data
      await supabase.from('mood_entries').delete().eq('user_id', user.id);
      await supabase.from('user_preferences').delete().eq('user_id', user.id);
      await supabase.from('profiles').delete().eq('id', user.id);

      // Delete auth user
      const { error } = await supabase.auth.admin.deleteUser(user.id);
      if (error) throw error;

      toast.success('Hesap başarıyla silindi');
      window.location.href = '/';
    } catch (error) {
      console.error('Hesap silme hatası:', error);
      toast.error('Hesap silinirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Profil Bilgileri', icon: User },
    { id: 'password', label: 'Şifre', icon: Lock },
    { id: 'notifications', label: 'Bildirimler', icon: Bell },
    { id: 'privacy', label: 'Gizlilik', icon: Shield },
    { id: 'data', label: 'Veri Yönetimi', icon: Download }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Ayarları</h1>
        <p className="text-gray-600">Hesap bilgilerinizi ve tercihlerinizi yönetin</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Sidebar */}
          <div className="w-full md:w-1/4 bg-gray-50 border-r">
            <nav className="p-4 space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-purple-100 text-purple-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Profil Bilgileri</h2>
                
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gray-200 rounded-full overflow-hidden">
                      {avatarPreview ? (
                        <img 
                          src={avatarPreview} 
                          alt="Avatar" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-purple-700 transition-colors">
                      <Upload className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Profil Fotoğrafı</h3>
                    <p className="text-sm text-gray-500">JPG, PNG formatında, max 2MB</p>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ad Soyad
                      </label>
                      <input
                        {...profileForm.register('full_name')}
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Adınızı girin"
                      />
                      {profileForm.formState.errors.full_name && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileForm.formState.errors.full_name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        E-posta
                      </label>
                      <input
                        {...profileForm.register('email')}
                        type="email"
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                      />
                      <p className="mt-1 text-sm text-gray-500">E-posta adresi değiştirilemez</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Doğum Tarihi
                      </label>
                      <input
                        {...profileForm.register('birth_date')}
                        type="date"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                      {profileForm.formState.errors.birth_date && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileForm.formState.errors.birth_date.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cinsiyet
                      </label>
                      <select
                        {...profileForm.register('gender')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      >
                        <option value="prefer_not_to_say">Belirtmek istemiyorum</option>
                        <option value="male">Erkek</option>
                        <option value="female">Kadın</option>
                        <option value="other">Diğer</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {loading ? 'Kaydediliyor...' : 'Profili Güncelle'}
                  </button>
                </form>
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Şifre Değiştir</h2>
                
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mevcut Şifre
                    </label>
                    <div className="relative">
                      <input
                        {...passwordForm.register('current_password')}
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.current_password && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordForm.formState.errors.current_password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre
                    </label>
                    <div className="relative">
                      <input
                        {...passwordForm.register('new_password')}
                        type={showNewPassword ? 'text' : 'password'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.new_password && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordForm.formState.errors.new_password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Yeni Şifre (Tekrar)
                    </label>
                    <input
                      {...passwordForm.register('confirm_password')}
                      type="password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    {passwordForm.formState.errors.confirm_password && (
                      <p className="mt-1 text-sm text-red-600">
                        {passwordForm.formState.errors.confirm_password.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                  </button>
                </form>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Bildirim Ayarları</h2>
                
                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'E-posta Bildirimleri', desc: 'Önemli güncellemeler için e-posta alın' },
                    { key: 'push', label: 'Tarayıcı Bildirimleri', desc: 'Tarayıcı bildirimleri alın' },
                    { key: 'daily_reminder', label: 'Günlük Hatırlatıcı', desc: 'Ruh halinizi kaydetmeniz için günlük hatırlatıcı' },
                    { key: 'weekly_summary', label: 'Haftalık Özet', desc: 'Haftalık ruh hali özet raporu alın' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div>
                        <h3 className="font-medium text-gray-900">{item.label}</h3>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key]}
                          onChange={(e) => setNotifications(prev => ({ 
                            ...prev, 
                            [item.key]: e.target.checked 
                          }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <button
                  onClick={savePreferences}
                  className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Ayarları Kaydet
                </button>
              </div>
            )}

            {/* Privacy Tab */}
            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Gizlilik ve Güvenlik</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Tema Tercihi</h3>
                    <div className="flex space-x-4">
                      {[
                        { value: 'light', label: 'Açık', icon: Sun },
                        { value: 'dark', label: 'Koyu', icon: Moon },
                        { value: 'system', label: 'Sistem', icon: Monitor }
                      ].map((themeOption) => {
                        const Icon = themeOption.icon;
                        return (
                          <label key={themeOption.value} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name="theme"
                              value={themeOption.value}
                              checked={theme === themeOption.value}
                              onChange={(e) => setTheme(e.target.value)}
                              className="text-purple-600 focus:ring-purple-500"
                            />
                            <Icon className="w-4 h-4" />
                            <span>{themeOption.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Veri Güvenliği</h3>
                    <p className="text-sm text-blue-700">
                      Verileriniz end-to-end şifreleme ile korunmaktadır. 
                      Ruh hali verileriniz sadece sizin erişebileceğiniz şekilde saklanır.
                    </p>
                  </div>
                </div>

                <button
                  onClick={savePreferences}
                  className="flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Ayarları Kaydet
                </button>
              </div>
            )}

            {/* Data Management Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">Veri Yönetimi</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">Verilerini Dışa Aktar</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Tüm ruh hali verilerinizi ve profil bilgilerinizi dışa aktarabilirsiniz.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={() => exportData('json')}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        JSON Formatında İndir
                      </button>
                      <button
                        onClick={() => exportData('csv')}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        CSV Formatında İndir
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border-2 border-red-200 rounded-lg bg-red-50">
                    <h3 className="font-medium text-red-900 mb-2">Tehlikeli Bölge</h3>
                    <p className="text-sm text-red-700 mb-4">
                      Hesabınızı kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz ve tüm verileriniz silinir.
                    </p>
                    <button
                      onClick={deleteAccount}
                      disabled={loading}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {loading ? 'Siliniyor...' : 'Hesabı Kalıcı Olarak Sil'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;