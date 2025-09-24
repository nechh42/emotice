// sw.js - Service Worker for Push Notifications
const CACHE_NAME = 'emotice-v1';
const API_BASE = 'https://your-supabase-url.supabase.co';

// Install event
self.addEventListener('install', (event) => {
  console.log('SW: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/manifest.json',
        '/favicon.ico',
        '/offline.html'
      ]);
    })
  );
  
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('SW: Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  self.clients.claim();
});

// Push event - Handle incoming push notifications
self.addEventListener('push', (event) => {
  console.log('SW: Push received:', event);
  
  let notificationData = {
    title: 'Emotice',
    body: 'Yeni bir bildiriminiz var',
    icon: '/favicon.ico',
    badge: '/badge-icon.png',
    tag: 'emotice-notification',
    renotify: true,
    vibrate: [100, 50, 100],
    data: {
      url: '/'
    }
  };

  // Parse notification data if available
  if (event.data) {
    try {
      const payload = event.data.json();
      notificationData = {
        ...notificationData,
        ...payload
      };
    } catch (e) {
      console.error('SW: Error parsing push payload:', e);
    }
  }

  // Show notification
  event.waitUntil(
    self.registration.showNotification(notificationData.title, {
      body: notificationData.body,
      icon: notificationData.icon,
      badge: notificationData.badge,
      tag: notificationData.tag,
      renotify: notificationData.renotify,
      vibrate: notificationData.vibrate,
      data: notificationData.data,
      actions: [
        {
          action: 'open',
          title: 'Aç',
          icon: '/action-open.png'
        },
        {
          action: 'close',
          title: 'Kapat',
          icon: '/action-close.png'
        }
      ],
      requireInteraction: false,
      silent: false
    })
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('SW: Notification clicked:', event);
  
  event.notification.close();
  
  const action = event.action;
  const data = event.notification.data || {};
  
  if (action === 'close') {
    return; // Just close the notification
  }
  
  // Determine URL to open
  let urlToOpen = data.url || '/';
  
  if (action === 'open') {
    urlToOpen = data.url || '/';
  }
  
  // Open or focus the app
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(self.location.origin)) {
          // Focus existing window and navigate
          return client.focus().then(() => {
            return client.navigate(urlToOpen);
          });
        }
      }
      
      // Open new window
      return clients.openWindow(urlToOpen);
    })
  );
  
  // Track notification interaction
  trackNotificationClick(action, data);
});

// Background sync for sending notifications when online
self.addEventListener('sync', (event) => {
  console.log('SW: Background sync:', event.tag);
  
  if (event.tag === 'notification-queue') {
    event.waitUntil(processNotificationQueue());
  }
});

// Fetch event - Cache strategy
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  // Skip requests to external domains
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        return response;
      }
      
      // Fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        
        // Clone the response
        const responseToCache = response.clone();
        
        // Add to cache
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        
        return response;
      }).catch(() => {
        // Return offline page if available
        if (event.request.destination === 'document') {
          return caches.match('/offline.html');
        }
        
        // Return default offline response
        return new Response('Offline', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      });
    })
  );
});

// Helper function to process notification queue
async function processNotificationQueue() {
  try {
    // Get queued notifications from IndexedDB
    const db = await openDB();
    const notifications = await getQueuedNotifications(db);
    
    for (const notification of notifications) {
      try {
        // Send notification to server
        await sendNotificationToServer(notification);
        
        // Remove from queue
        await removeFromQueue(db, notification.id);
      } catch (error) {
        console.error('SW: Failed to send notification:', error);
      }
    }
  } catch (error) {
    console.error('SW: Error processing notification queue:', error);
  }
}

// Helper function to track notification clicks
function trackNotificationClick(action, data) {
  // Send analytics event
  fetch('/api/analytics/notification-click', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      action,
      data,
      timestamp: new Date().toISOString()
    })
  }).catch((error) => {
    console.error('SW: Failed to track notification click:', error);
  });
}

// IndexedDB helpers for offline notification queue
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('emotice-notifications', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('queue')) {
        const store = db.createObjectStore('queue', { keyPath: 'id' });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });
}

function getQueuedNotifications(db) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['queue'], 'readonly');
    const store = transaction.objectStore('queue');
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

function removeFromQueue(db, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(['queue'], 'readwrite');
    const store = transaction.objectStore('queue');
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

async function sendNotificationToServer(notification) {
  const response = await fetch(`${API_BASE}/rest/v1/notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': 'your-supabase-anon-key'
    },
    body: JSON.stringify(notification)
  });
  
  if (!response.ok) {
    throw new Error(`Failed to send notification: ${response.statusText}`);
  }
  
  return response.json();
}

// Scheduled notification handling
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SCHEDULE_NOTIFICATION') {
    const { notification, delay } = event.data;
    
    setTimeout(() => {
      self.registration.showNotification(notification.title, notification.options);
    }, delay);
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Periodic background sync for daily reminders
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-reminder') {
    event.waitUntil(sendDailyReminder());
  }
});

async function sendDailyReminder() {
  try {
    // Check if user has enabled daily reminders
    const preferences = await getUserPreferences();
    
    if (preferences.daily_reminder && !isQuietHours(preferences.quiet_hours)) {
      await self.registration.showNotification('Ruh Hali Hatırlatıcısı', {
        body: 'Bugün nasıl hissediyorsun? Ruh halini kaydetmeyi unutma! 😊',
        icon: '/favicon.ico',
        badge: '/badge-icon.png',
        tag: 'daily-reminder',
        data: {
          url: '/mood',
          action: 'open_mood_tracker'
        },
        actions: [
          {
            action: 'track_mood',
            title: 'Ruh Halimi Kaydet'
          },
          {
            action: 'dismiss',
            title: 'Şimdi Değil'
          }
        ]
      });
    }
  } catch (error) {
    console.error('SW: Error sending daily reminder:', error);
  }
}

async function getUserPreferences() {
  try {
    const response = await fetch(`${API_BASE}/rest/v1/user_preferences?select=notifications`, {
      headers: {
        'apikey': 'your-supabase-anon-key'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      return data[0]?.notifications || { daily_reminder: false };
    }
  } catch (error) {
    console.error('SW: Error getting user preferences:', error);
  }
  
  return { daily_reminder: false };
}

function isQuietHours(quietHoursConfig) {
  if (!quietHoursConfig?.enabled) return false;
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const [startHour, startMin] = quietHoursConfig.start.split(':').map(Number);
  const [endHour, endMin] = quietHoursConfig.end.split(':').map(Number);
  
  const startTime = startHour * 60 + startMin;
  const endTime = endHour * 60 + endMin;
  
  if (startTime < endTime) {
    return currentTime >= startTime && currentTime < endTime;
  } else {
    return currentTime >= startTime || currentTime < endTime;
  }
}

console.log('SW: Service Worker loaded successfully');