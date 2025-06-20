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
  // Add icon paths when available
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png'
];

// ===== INSTALL EVENT =====
self.addEventListener('install', (event) => {
  console.log('⚔️ Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('✅ Service Worker installed successfully');
        // Force activation of new service worker
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
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old caches
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activated successfully');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// ===== FETCH EVENT =====
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }
        
        // Otherwise fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add to cache
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
            
            return response;
          })
          .catch(() => {
            // If both cache and network fail, return offline page
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
          });
      })
  );
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

// ===== UTILITY FUNCTIONS =====

// Clean up old caches
async function cleanupCaches() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    name.startsWith('quest-timer-') && name !== CACHE_NAME
  );
  
  await Promise.all(
    oldCaches.map(cacheName => caches.delete(cacheName))
  );
}

// Precache critical resources
async function precacheResources() {
  const cache = await caches.open(CACHE_NAME);
  return cache.addAll(urlsToCache);
}

// Update cache with new resources
async function updateCache() {
  const cache = await caches.open(CACHE_NAME);
  const requests = urlsToCache.map(url => fetch(url));
  const responses = await Promise.all(requests);
  
  const cachePromises = responses.map((response, index) => {
    if (response.ok) {
      return cache.put(urlsToCache[index], response);
    }
  });
  
  return Promise.all(cachePromises);
}

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