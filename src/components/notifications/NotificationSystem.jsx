import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';

// Notification types
export const NOTIFICATION_TYPES = {
  MOOD_REMINDER: 'mood_reminder',
  WEEKLY_SUMMARY: 'weekly_summary',
  ACHIEVEMENT: 'achievement',
  PREMIUM_FEATURE: 'premium_feature',
  SYSTEM: 'system'
};

// Notification actions
const NOTIFICATION_ACTIONS = {
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  SET_LOADING: 'SET_LOADING',
  SET_PERMISSION: 'SET_PERMISSION',
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES'
};

// Initial state
const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  permission: 'default',
  preferences: {
    push: false,
    email: true,
    daily_reminder: true,
    weekly_summary: true,
    quiet_hours: {
      enabled: false,
      start: '22:00',
      end: '08:00'
    }
  }
};

// Reducer
const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload,
        unreadCount: action.payload.filter(n => !n.read).length
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      const newNotifications = [action.payload, ...state.notifications];
      return {
        ...state,
        notifications: newNotifications,
        unreadCount: newNotifications.filter(n => !n.read).length
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      const updatedNotifications = state.notifications.map(n =>
        n.id === action.payload ? { ...n, read: true } : n
      );
      return {
        ...state,
        notifications: updatedNotifications,
        unreadCount: updatedNotifications.filter(n => !n.read).length
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      const allReadNotifications = state.notifications.map(n => ({ ...n, read: true }));
      return {
        ...state,
        notifications: allReadNotifications,
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.DELETE_NOTIFICATION:
      const filteredNotifications = state.notifications.filter(n => n.id !== action.payload);
      return {
        ...state,
        notifications: filteredNotifications,
        unreadCount: filteredNotifications.filter(n => !n.read).length
      };

    case NOTIFICATION_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };

    case NOTIFICATION_ACTIONS.SET_PERMISSION:
      return { ...state, permission: action.payload };

    case NOTIFICATION_ACTIONS.UPDATE_PREFERENCES:
      return { ...state, preferences: { ...state.preferences, ...action.payload } };

    default:
      return state;
  }
};

// Context
const NotificationContext = createContext();

// Provider
export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState);
  const { user } = useAuth();

  // Initialize notifications
  useEffect(() => {
    if (user?.id) {
      initializeNotifications();
      loadPreferences();
      requestNotificationPermission();
    }
  }, [user?.id]);

  // Load notifications from database
  const initializeNotifications = async () => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
      
      const { data: notifications, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      dispatch({ 
        type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS, 
        payload: notifications || [] 
      });
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Bildirimler yüklenirken hata oluştu');
    } finally {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Load user preferences
  const loadPreferences = async () => {
    try {
      const { data: preferences } = await supabase
        .from('user_preferences')
        .select('notifications')
        .eq('user_id', user.id)
        .single();

      if (preferences?.notifications) {
        dispatch({ 
          type: NOTIFICATION_ACTIONS.UPDATE_PREFERENCES, 
          payload: preferences.notifications 
        });
      }
    } catch (error) {
      console.error('Error loading notification preferences:', error);
    }
  };

  // Request notification permission
  const requestNotificationPermission = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      dispatch({ type: NOTIFICATION_ACTIONS.SET_PERMISSION, payload: permission });
      
      if (permission === 'granted') {
        await registerServiceWorker();
      }
    }
  };

  // Register service worker
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('SW registered:', registration);
        
        // Subscribe to push notifications
        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: import.meta.env.VITE_VAPID_PUBLIC_KEY
        });

        // Save subscription to database
        await supabase
          .from('push_subscriptions')
          .upsert({
            user_id: user.id,
            subscription: subscription,
            updated_at: new Date().toISOString()
          });

      } catch (error) {
        console.error('SW registration failed:', error);
      }
    }
  };

  // Create notification
  const createNotification = async (type, title, message, data = {}) => {
    try {
      const notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        user_id: user.id,
        type,
        title,
        message,
        data,
        read: false,
        created_at: new Date().toISOString()
      };

      // Save to database
      const { error } = await supabase
        .from('notifications')
        .insert([notification]);

      if (error) throw error;

      // Add to local state
      dispatch({ 
        type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION, 
        payload: notification 
      });

      // Show browser notification if permission granted
      if (state.permission === 'granted' && state.preferences.push) {
        showBrowserNotification(title, message);
      }

      // Show toast notification
      toast.info(title);

    } catch (error) {
      console.error('Error creating notification:', error);
      toast.error('Bildirim oluşturulurken hata oluştu');
    }
  };

  // Show browser notification
  const showBrowserNotification = (title, message) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        badge: '/badge-icon.png',
        tag: 'emotice-notification',
        renotify: true,
        silent: false
      });
    }
  };

  // Mark as read
  const markAsRead = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      dispatch({ 
        type: NOTIFICATION_ACTIONS.MARK_AS_READ, 
        payload: notificationId 
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user.id)
        .eq('read', false);

      if (error) throw error;

      dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user.id);

      if (error) throw error;

      dispatch({ 
        type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION, 
        payload: notificationId 
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Update preferences
  const updatePreferences = async (newPreferences) => {
    try {
      const updatedPreferences = { ...state.preferences, ...newPreferences };
      
      const { error } = await supabase
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          notifications: updatedPreferences,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      dispatch({ 
        type: NOTIFICATION_ACTIONS.UPDATE_PREFERENCES, 
        payload: newPreferences 
      });

      toast.success('Bildirim ayarları güncellendi');
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Ayarlar güncellenirken hata oluştu');
    }
  };

  // Schedule daily reminder
  const scheduleDailyReminder = () => {
    if (!state.preferences.daily_reminder) return;

    const now = new Date();
    const reminderTime = new Date();
    reminderTime.setHours(20, 0, 0, 0); // 8 PM

    if (now > reminderTime) {
      reminderTime.setDate(reminderTime.getDate() + 1);
    }

    const timeUntilReminder = reminderTime.getTime() - now.getTime();

    setTimeout(() => {
      createNotification(
        NOTIFICATION_TYPES.MOOD_REMINDER,
        'Ruh Hali Hatırlatıcısı',
        'Bugün nasıl hissediyorsun? Ruh halini kaydetmeyi unutma! 😊',
        { action: 'open_mood_tracker' }
      );
      
      // Schedule next day
      scheduleDailyReminder();
    }, timeUntilReminder);
  };

  // Check quiet hours
  const isQuietHours = () => {
    if (!state.preferences.quiet_hours.enabled) return false;

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = state.preferences.quiet_hours.start.split(':').map(Number);
    const [endHour, endMin] = state.preferences.quiet_hours.end.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime < endTime) {
      return currentTime >= startTime && currentTime < endTime;
    } else {
      return currentTime >= startTime || currentTime < endTime;
    }
  };

  // Start daily reminder scheduler
  useEffect(() => {
    if (user?.id && state.preferences.daily_reminder) {
      scheduleDailyReminder();
    }
  }, [user?.id, state.preferences.daily_reminder]);

  const value = {
    ...state,
    createNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updatePreferences,
    requestNotificationPermission,
    isQuietHours
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Hook
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export default NotificationProvider;