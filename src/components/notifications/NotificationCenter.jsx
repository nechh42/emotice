import React, { useState, useRef, useEffect } from 'react';
import { 
  Bell, 
  X, 
  Check, 
  CheckCheck, 
  Trash2, 
  Settings,
  Clock,
  Award,
  Heart,
  Star,
  AlertCircle
} from 'lucide-react';
import { useNotifications } from './NotificationSystem';
import { useTranslation } from 'react-i18next';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

const NotificationCenter = ({ isOpen, onClose }) => {
  const { 
    notifications, 
    unreadCount, 
    loading,
    markAsRead,
    markAllAsRead,
    deleteNotification 
  } = useNotifications();
  
  const { t } = useTranslation();
  const [filter, setFilter] = useState('all');
  const panelRef = useRef(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Get icon for notification type
  const getNotificationIcon = (type) => {
    const icons = {
      mood_reminder: <Heart className="w-5 h-5 text-pink-500" />,
      weekly_summary: <Clock className="w-5 h-5 text-blue-500" />,
      achievement: <Award className="w-5 h-5 text-yellow-500" />,
      premium_feature: <Star className="w-5 h-5 text-purple-500" />,
      system: <AlertCircle className="w-5 h-5 text-gray-500" />
    };
    return icons[type] || <Bell className="w-5 h-5 text-gray-500" />;
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return notification.type === filter;
  });

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await markAsRead(notification.id);
    }

    // Handle notification actions
    if (notification.data?.action) {
      switch (notification.data.action) {
        case 'open_mood_tracker':
          window.location.href = '/mood';
          break;
        case 'open_analytics':
          window.location.href = '/analytics';
          break;
        case 'open_premium':
          window.location.href = '/premium';
          break;
        default:
          break;
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-25" onClick={onClose} />
      
      {/* Panel */}
      <div 
        ref={panelRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <div className="flex items-center space-x-2">
            <Bell className="w-6 h-6" />
            <h2 className="text-lg font-semibold">{t('notifications.title', 'Bildirimler')}</h2>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                {unreadCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls */}
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'all' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {t('notifications.all', 'Tümü')}
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filter === 'unread' 
                    ? 'bg-purple-100 text-purple-700' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {t('notifications.unread', 'Okunmamış')}
              </button>
            </div>
            
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center space-x-1 px-3 py-1 text-sm text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{t('notifications.markAllRead', 'Tümünü Okundu İşaretle')}</span>
              </button>
            )}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <Bell className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-center">
                {filter === 'unread' 
                  ? t('notifications.noUnread', 'Okunmamış bildirim yok')
                  : t('notifications.noNotifications', 'Henüz bildirim yok')
                }
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                    !notification.read ? 'bg-purple-50 border-l-4 border-purple-500' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    {/* Icon */}
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-400 mt-2">
                            {formatDistanceToNow(new Date(notification.created_at), { 
                              addSuffix: true,
                              locale: tr 
                            })}
                          </p>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center space-x-1 ml-2">
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="p-1 text-gray-400 hover:text-purple-600 hover:bg-purple-100 rounded transition-colors"
                              title={t('notifications.markAsRead', 'Okundu işaretle')}
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notification.id);
                            }}
                            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-100 rounded transition-colors"
                            title={t('notifications.delete', 'Sil')}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <button
            onClick={() => {
              window.location.href = '/settings#notifications';
              onClose();
            }}
            className="flex items-center justify-center w-full space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>{t('notifications.settings', 'Bildirim Ayarları')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;