import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Translation resources
const resources = {
  tr: {
    translation: {
      // Common
      common: {
        loading: 'Yükleniyor...',
        save: 'Kaydet',
        cancel: 'İptal',
        delete: 'Sil',
        edit: 'Düzenle',
        close: 'Kapat',
        back: 'Geri',
        next: 'İleri',
        previous: 'Önceki',
        search: 'Ara',
        filter: 'Filtrele',
        export: 'Dışa Aktar',
        import: 'İçe Aktar',
        settings: 'Ayarlar',
        profile: 'Profil',
        logout: 'Çıkış Yap',
        login: 'Giriş Yap',
        register: 'Kayıt Ol',
        yes: 'Evet',
        no: 'Hayır',
        ok: 'Tamam',
        error: 'Hata',
        success: 'Başarılı',
        warning: 'Uyarı',
        info: 'Bilgi'
      },

      // Navigation
      nav: {
        dashboard: 'Ana Sayfa',
        mood: 'Ruh Halim',
        analytics: 'Analitik',
        history: 'Geçmiş',
        premium: 'Premium',
        community: 'Topluluk',
        notifications: 'Bildirimler',
        profile: 'Profil',
        settings: 'Ayarlar'
      },

      // Mood tracking
      mood: {
        title: 'Ruh Halim',
        subtitle: 'Bugün nasıl hissediyorsun?',
        selectMood: 'Ruh halinizi seçin',
        addNote: 'Not ekle (isteğe bağlı)',
        addTags: 'Etiket ekle',
        intensity: 'Yoğunluk',
        save: 'Kaydet',
        saved: 'Ruh haliniz kaydedildi',
        noMoodSelected: 'Lütfen bir ruh hali seçin',
        moods: {
          happy: 'Mutlu',
          sad: 'Üzgün',
          angry: 'Sinirli',
          anxious: 'Endişeli',
          excited: 'Heyecanlı',
          calm: 'Sakin',
          tired: 'Yorgun',
          energetic: 'Enerjik',
          confused: 'Karışık',
          grateful: 'Minnettarlık'
        }
      },

      // Notifications
      notifications: {
        title: 'Bildirimler',
        all: 'Tümü',
        unread: 'Okunmamış',
        read: 'Okunmuş',
        markAsRead: 'Okundu işaretle',
        markAllRead: 'Tümünü Okundu İşaretle',
        delete: 'Sil',
        settings: 'Bildirim Ayarları',
        noNotifications: 'Henüz bildirim yok',
        noUnread: 'Okunmamış bildirim yok',
        
        // Notification types
        types: {
          mood_reminder: 'Ruh Hali Hatırlatıcısı',
          weekly_summary: 'Haftalık Özet',
          achievement: 'Başarı',
          premium_feature: 'Premium Özellik',
          system: 'Sistem'
        },

        // Notification settings
        preferences: {
          title: 'Bildirim Tercihleri',
          email: 'E-posta Bildirimleri',
          emailDesc: 'Önemli güncellemeler için e-posta alın',
          push: 'Tarayıcı Bildirimleri',
          pushDesc: 'Tarayıcı bildirimleri alın',
          dailyReminder: 'Günlük Hatırlatıcı',
          dailyReminderDesc: 'Ruh halinizi kaydetmeniz için günlük hatırlatıcı',
          weeklySummary: 'Haftalık Özet',
          weeklySummaryDesc: 'Haftalık ruh hali özet raporu alın',
          quietHours: 'Sessiz Saatler',
          quietHoursDesc: 'Bu saatlerde bildirim almayın',
          quietStart: 'Başlangıç Saati',
          quietEnd: 'Bitiş Saati'
        }
      },

      // Profile & Settings
      profile: {
        title: 'Profil Ayarları',
        personalInfo: 'Kişisel Bilgiler',
        accountPreferences: 'Hesap Tercihleri',
        dataManagement: 'Veri Yönetimi',
        
        // Personal info
        fullName: 'Ad Soyad',
        email: 'E-posta',
        birthDate: 'Doğum Tarihi',
        gender: 'Cinsiyet',
        avatar: 'Profil Fotoğrafı',
        updateProfile: 'Profili Güncelle',
        
        // Gender options
        genders: {
          male: 'Erkek',
          female: 'Kadın',
          other: 'Diğer',
          prefer_not_to_say: 'Belirtmek istemiyorum'
        },

        // Password
        changePassword: 'Şifre Değiştir',
        currentPassword: 'Mevcut Şifre',
        newPassword: 'Yeni Şifre',
        confirmPassword: 'Yeni Şifre (Tekrar)',
        updatePassword: 'Şifreyi Güncelle',
        
        // Theme
        theme: 'Tema',
        themeLight: 'Açık',
        themeDark: 'Koyu',
        themeSystem: 'Sistem',
        
        // Data
        exportData: 'Verilerini Dışa Aktar',
        exportDataDesc: 'Tüm ruh hali verilerinizi ve profil bilgilerinizi dışa aktarabilirsiniz',
        exportJSON: 'JSON Formatında İndir',
        exportCSV: 'CSV Formatında İndir',
        deleteAccount: 'Hesabı Kalıcı Olarak Sil',
        deleteAccountDesc: 'Hesabınızı kalıcı olarak silebilirsiniz. Bu işlem geri alınamaz ve tüm verileriniz silinir',
        
        // Messages
        profileUpdated: 'Profil başarıyla güncellendi',
        passwordUpdated: 'Şifre başarıyla güncellendi',
        settingsSaved: 'Ayarlar kaydedildi',
        dataExported: 'Veriler başarıyla dışa aktarıldı',
        accountDeleted: 'Hesap başarıyla silindi'
      },

      // Analytics
      analytics: {
        title: 'Ruh Hali Analizi',
        overview: 'Genel Bakış',
        trends: 'Trendler',
        patterns: 'Kalıplar',
        insights: 'İçgörüler',
        
        // Stats
        averageMood: 'Ortalama Ruh Hali',
        totalEntries: 'Toplam Kayıt',
        longestStreak: 'En Uzun Seri',
        currentStreak: 'Mevcut Seri',
        mostFrequent: 'En Sık',
        leastFrequent: 'En Az',
        
        // Time periods
        last7Days: 'Son 7 Gün',
        last30Days: 'Son 30 Gün',
        last3Months: 'Son 3 Ay',
        lastYear: 'Son 1 Yıl',
        allTime: 'Tüm Zamanlar',
        
        // Chart types
        lineChart: 'Çizgi Grafik',
        barChart: 'Sütun Grafik',
        pieChart: 'Pasta Grafik',
        heatmap: 'Isı Haritası'
      },

      // Premium
      premium: {
        title: 'Premium Özellikler',
        subtitle: 'Ruh hali takibinizi bir üst seviyeye taşıyın',
        currentPlan: 'Mevcut Plan',
        upgradeToPremium: 'Premium\'a Yükselt',
        
        features: {
          unlimitedHistory: 'Sınırsız Geçmiş',
          advancedAnalytics: 'Gelişmiş Analitik',
          dataExport: 'Veri Dışa Aktarma',
          customReminders: 'Özel Hatırlatıcılar',
          prioritySupport: 'Öncelikli Destek',
          noAds: 'Reklamsız Deneyim'
        }
      },

      // Error messages
      errors: {
        somethingWentWrong: 'Bir şeyler ters gitti',
        networkError: 'Ağ hatası',
        serverError: 'Sunucu hatası',
        validationError: 'Doğrulama hatası',
        notFound: 'Bulunamadı',
        unauthorized: 'Yetkisiz erişim',
        forbidden: 'Yasak',
        
        // Form validation
        required: 'Bu alan gerekli',
        emailInvalid: 'Geçerli bir e-posta adresi girin',
        passwordTooShort: 'Şifre en az 8 karakter olmalı',
        passwordsNotMatch: 'Şifreler eşleşmiyor',
        ageRestriction: 'En az 16 yaşında olmalısınız',
        
        // File upload
        fileTooLarge: 'Dosya boyutu çok büyük',
        fileTypeNotSupported: 'Dosya tipi desteklenmiyor'
      },

      // Success messages
      success: {
        saved: 'Başarıyla kaydedildi',
        updated: 'Başarıyla güncellendi',
        deleted: 'Başarıyla silindi',
        sent: 'Başarıyla gönderildi',
        uploaded: 'Başarıyla yüklendi'
      }
    }
  },

  en: {
    translation: {
      // Common
      common: {
        loading: 'Loading...',
        save: 'Save',
        cancel: 'Cancel',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        search: 'Search',
        filter: 'Filter',
        export: 'Export',
        import: 'Import',
        settings: 'Settings',
        profile: 'Profile',
        logout: 'Logout',
        login: 'Login',
        register: 'Register',
        yes: 'Yes',
        no: 'No',
        ok: 'OK',
        error: 'Error',
        success: 'Success',
        warning: 'Warning',
        info: 'Info'
      },

      // Navigation
      nav: {
        dashboard: 'Dashboard',
        mood: 'My Mood',
        analytics: 'Analytics',
        history: 'History',
        premium: 'Premium',
        community: 'Community',
        notifications: 'Notifications',
        profile: 'Profile',
        settings: 'Settings'
      },

      // Mood tracking
      mood: {
        title: 'My Mood',
        subtitle: 'How are you feeling today?',
        selectMood: 'Select your mood',
        addNote: 'Add note (optional)',
        addTags: 'Add tags',
        intensity: 'Intensity',
        save: 'Save',
        saved: 'Your mood has been saved',
        noMoodSelected: 'Please select a mood',
        moods: {
          happy: 'Happy',
          sad: 'Sad',
          angry: 'Angry',
          anxious: 'Anxious',
          excited: 'Excited',
          calm: 'Calm',
          tired: 'Tired',
          energetic: 'Energetic',
          confused: 'Confused',
          grateful: 'Grateful'
        }
      },

      // Notifications
      notifications: {
        title: 'Notifications',
        all: 'All',
        unread: 'Unread',
        read: 'Read',
        markAsRead: 'Mark as read',
        markAllRead: 'Mark all as read',
        delete: 'Delete',
        settings: 'Notification Settings',
        noNotifications: 'No notifications yet',
        noUnread: 'No unread notifications',
        
        types: {
          mood_reminder: 'Mood Reminder',
          weekly_summary: 'Weekly Summary',
          achievement: 'Achievement',
          premium_feature: 'Premium Feature',
          system: 'System'
        },

        preferences: {
          title: 'Notification Preferences',
          email: 'Email Notifications',
          emailDesc: 'Receive emails for important updates',
          push: 'Push Notifications',
          pushDesc: 'Receive browser notifications',
          dailyReminder: 'Daily Reminder',
          dailyReminderDesc: 'Daily reminder to log your mood',
          weeklySummary: 'Weekly Summary',
          weeklySummaryDesc: 'Receive weekly mood summary reports',
          quietHours: 'Quiet Hours',
          quietHoursDesc: 'Don\'t receive notifications during these hours',
          quietStart: 'Start Time',
          quietEnd: 'End Time'
        }
      },

      // Profile & Settings
      profile: {
        title: 'Profile Settings',
        personalInfo: 'Personal Information',
        accountPreferences: 'Account Preferences',
        dataManagement: 'Data Management',
        
        fullName: 'Full Name',
        email: 'Email',
        birthDate: 'Birth Date',
        gender: 'Gender',
        avatar: 'Profile Picture',
        updateProfile: 'Update Profile',
        
        genders: {
          male: 'Male',
          female: 'Female',
          other: 'Other',
          prefer_not_to_say: 'Prefer not to say'
        },

        changePassword: 'Change Password',
        currentPassword: 'Current Password',
        newPassword: 'New Password',
        confirmPassword: 'Confirm New Password',
        updatePassword: 'Update Password',
        
        theme: 'Theme',
        themeLight: 'Light',
        themeDark: 'Dark',
        themeSystem: 'System',
        
        exportData: 'Export Your Data',
        exportDataDesc: 'Download your mood tracking data and profile information',
        exportJSON: 'Download as JSON',
        exportCSV: 'Download as CSV',
        deleteAccount: 'Delete Account Permanently',
        deleteAccountDesc: 'Permanently delete your account. This action cannot be undone',
        
        profileUpdated: 'Profile updated successfully',
        passwordUpdated: 'Password updated successfully',
        settingsSaved: 'Settings saved',
        dataExported: 'Data exported successfully',
        accountDeleted: 'Account deleted successfully'
      },

      // Analytics
      analytics: {
        title: 'Mood Analytics',
        overview: 'Overview',
        trends: 'Trends',
        patterns: 'Patterns',
        insights: 'Insights',
        
        averageMood: 'Average Mood',
        totalEntries: 'Total Entries',
        longestStreak: 'Longest Streak',
        currentStreak: 'Current Streak',
        mostFrequent: 'Most Frequent',
        leastFrequent: 'Least Frequent',
        
        last7Days: 'Last 7 Days',
        last30Days: 'Last 30 Days',
        last3Months: 'Last 3 Months',
        lastYear: 'Last Year',
        allTime: 'All Time',
        
        lineChart: 'Line Chart',
        barChart: 'Bar Chart',
        pieChart: 'Pie Chart',
        heatmap: 'Heatmap'
      },

      // Premium
      premium: {
        title: 'Premium Features',
        subtitle: 'Take your mood tracking to the next level',
        currentPlan: 'Current Plan',
        upgradeToPremium: 'Upgrade to Premium',
        
        features: {
          unlimitedHistory: 'Unlimited History',
          advancedAnalytics: 'Advanced Analytics',
          dataExport: 'Data Export',
          customReminders: 'Custom Reminders',
          prioritySupport: 'Priority Support',
          noAds: 'Ad-free Experience'
        }
      },

      // Error messages
      errors: {
        somethingWentWrong: 'Something went wrong',
        networkError: 'Network error',
        serverError: 'Server error',
        validationError: 'Validation error',
        notFound: 'Not found',
        unauthorized: 'Unauthorized access',
        forbidden: 'Forbidden',
        
        required: 'This field is required',
        emailInvalid: 'Please enter a valid email address',
        passwordTooShort: 'Password must be at least 8 characters',
        passwordsNotMatch: 'Passwords do not match',
        ageRestriction: 'You must be at least 16 years old',
        
        fileTooLarge: 'File size is too large',
        fileTypeNotSupported: 'File type not supported'
      },

      success: {
        saved: 'Successfully saved',
        updated: 'Successfully updated',
        deleted: 'Successfully deleted',
        sent: 'Successfully sent',
        uploaded: 'Successfully uploaded'
      }
    }
  },

  es: {
    translation: {
      // Common
      common: {
        loading: 'Cargando...',
        save: 'Guardar',
        cancel: 'Cancelar',
        delete: 'Eliminar',
        edit: 'Editar',
        close: 'Cerrar',
        back: 'Atrás',
        next: 'Siguiente',
        previous: 'Anterior',
        search: 'Buscar',
        filter: 'Filtrar',
        export: 'Exportar',
        import: 'Importar',
        settings: 'Configuración',
        profile: 'Perfil',
        logout: 'Cerrar Sesión',
        login: 'Iniciar Sesión',
        register: 'Registrarse',
        yes: 'Sí',
        no: 'No',
        ok: 'OK',
        error: 'Error',
        success: 'Éxito',
        warning: 'Advertencia',
        info: 'Información'
      },

      nav: {
        dashboard: 'Panel',
        mood: 'Mi Estado',
        analytics: 'Análisis',
        history: 'Historial',
        premium: 'Premium',
        community: 'Comunidad',
        notifications: 'Notificaciones',
        profile: 'Perfil',
        settings: 'Configuración'
      },

      mood: {
        title: 'Mi Estado de Ánimo',
        subtitle: '¿Cómo te sientes hoy?',
        selectMood: 'Selecciona tu estado de ánimo',
        addNote: 'Añadir nota (opcional)',
        addTags: 'Añadir etiquetas',
        intensity: 'Intensidad',
        save: 'Guardar',
        saved: 'Tu estado de ánimo ha sido guardado',
        noMoodSelected: 'Por favor selecciona un estado de ánimo',
        moods: {
          happy: 'Feliz',
          sad: 'Triste',
          angry: 'Enojado',
          anxious: 'Ansioso',
          excited: 'Emocionado',
          calm: 'Tranquilo',
          tired: 'Cansado',
          energetic: 'Enérgico',
          confused: 'Confundido',
          grateful: 'Agradecido'
        }
      }
      // ... More Spanish translations
    }
  }
};

// i18n configuration
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: 'tr', // default language
    fallbackLng: 'tr',
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'i18nextLng',
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false // React already does escaping
    },

    // Debugging (set to false in production)
    debug: import.meta.env.NODE_ENV === 'development',

    // React options
    react: {
      bindI18n: 'languageChanged',
      bindI18nStore: '',
      transEmptyNodeValue: '',
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ['br', 'strong', 'i', 'em']
    }
  });

export default i18n;