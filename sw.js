// ===== SERVICE WORKER FOR QUEST TIMER =====

const CACHE_NAME = 'quest-timer-v1.0.0';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './assets/css/main.css',
  './assets/css/components.css',
  './assets/css/animations.css',
  './assets/js/utils.js',
  './assets/js/timer.js',
  './assets/js/rpg.js',
  './assets/js/debug.js',
  './assets/js/app.js',
  './assets/icons/icon-72.png',
  './assets/icons/icon-96.png',
  './assets/icons/icon-128.png',
  './assets/icons/icon-144.png',
  './assets/icons/icon-152.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-384.png',
  './assets/icons/icon-512.png',
  './assets/icons/hourglass.png'
];

// ===== INSTALL EVENT =====
self.addEventListener('install', (event) => {
  console.log('⚔️ Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app shell');
        return cache.addAll(urlsToCache.map(url => new Request(url, {cache: 'reload'})));
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error);
      })
  );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('🗑️ Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control immediately
      self.clients.claim()
    ]).then(() => {
      console.log('✅ Service Worker activated successfully');
    })
  );
});

// ===== FETCH EVENT - Cache First Strategy =====
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        return fetch(event.request)
          .then((response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone and cache
            const responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // Fallback to offline page for documents
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
});

// ===== PUSH NOTIFICATIONS =====
self.addEventListener('push', (event) => {
  console.log('📱 Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Time for a break!',
    icon: './assets/icons/icon-192.png',
    badge: './assets/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2'
    },
    actions: [
      {
        action: 'start-timer',
        title: 'Start Timer',
        icon: './assets/icons/action-start.png'
      },
      {
        action: 'view-stats',
        title: 'View Stats',
        icon: './assets/icons/action-stats.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Quest Timer', options)
  );
});

// ===== NOTIFICATION CLICK =====
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification clicked:', event.action);
  
  event.notification.close();
  
  const action = event.action;
  const urlToOpen = action === 'view-stats' 
    ? './index.html?view=stats'
    : './index.html?action=start';
  
  event.waitUntil(
    clients.matchAll({
      type: 'window'
    }).then((windowClients) => {
      // Check if there's already a window/tab open with the target URL
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      
      // If no window/tab is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// ===== MESSAGE HANDLING =====
self.addEventListener('message', (event) => {
  console.log('💬 Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_NAME,
      timestamp: Date.now()
    });
  }
});

// ===== BACKGROUND SYNC =====
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('🔄 Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  try {
    // Could sync progress data to cloud here
    console.log('💾 Background sync completed');
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

// ===== PERIODIC BACKGROUND SYNC =====
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-stats') {
    console.log('📊 Daily stats sync triggered');
    event.waitUntil(syncDailyStats());
  }
});

async function syncDailyStats() {
  try {
    // Could update daily statistics here
    console.log('📊 Daily stats synchronized');
  } catch (error) {
    console.error('❌ Daily stats sync failed:', error);
  }
}

// ===== PWA INSTALLATION EVENTS =====
self.addEventListener('beforeinstallprompt', (event) => {
  console.log('📱 PWA install prompt triggered');
});

self.addEventListener('appinstalled', (event) => {
  console.log('🎉 PWA was installed successfully');
});

// ===== ERROR HANDLING =====
self.addEventListener('error', (event) => {
  console.error('💥 Service Worker error:', event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error('💥 Service Worker unhandled rejection:', event.reason);
});

// ===== LOGGING =====
console.log('⚔️ Quest Timer Service Worker loaded');
console.log('📦 Cache name:', CACHE_NAME);
console.log('📁 URLs to cache:', urlsToCache.length);