// ===== SERVICE WORKER FOR QUEST TIMER =====

// 🔥 HOT RELOAD: Incrémentez cette version pour forcer la mise à jour du cache
const CACHE_VERSION = '1.0.2';
const CACHE_NAME = `quest-timer-v${CACHE_VERSION}`;

// 🔥 CORRECTION: Détection d'environnement FLEXIBLE
function detectDevelopmentMode() {
    // 1. Hostname localhost
    const isLocalhost = location.hostname === 'localhost' || location.hostname === '127.0.0.1';
    
    // 2. Port de développement
    const isDevPort = location.port === '3046';
    
    // 3. Domaine de développement
    const isDevDomain = location.hostname.includes('dev.') || 
                       location.hostname.includes('test.') ||
                       location.hostname.includes('staging.');
    
    // 4. Force development mode (sera défini par message du client)
    const forceDev = self.forceDevelopmentMode || false;
    
    return isLocalhost || isDevPort || isDevDomain || forceDev;
}

let isDevelopment = detectDevelopmentMode();

console.log(`🔥 SW: Development mode = ${isDevelopment}`, {
    hostname: location.hostname,
    port: location.port,
    forceDev: self.forceDevelopmentMode || false
});

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
  console.log(`⚔️ Service Worker v${CACHE_VERSION} installing (dev: ${isDevelopment})...`);
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app shell');
        // 🔥 HOT RELOAD: Force reload en développement
        const cachePromises = urlsToCache.map(url => {
          const request = new Request(url, {
            cache: isDevelopment ? 'no-cache' : 'default'
          });
          return cache.add(request).catch(error => {
            console.warn(`⚠️ Failed to cache ${url}:`, error);
          });
        });
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log(`✅ Service Worker v${CACHE_VERSION} installed successfully`);
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('❌ Service Worker installation failed:', error);
      })
  );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', (event) => {
  console.log(`🚀 Service Worker v${CACHE_VERSION} activating (dev: ${isDevelopment})...`);
  
  event.waitUntil(
    Promise.all([
      // Clean old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName.startsWith('quest-timer-v')) {
              console.log(`🗑️ Deleting old cache: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Take control immediately
      self.clients.claim()
    ]).then(() => {
      console.log(`✅ Service Worker v${CACHE_VERSION} activated successfully`);
      
      // 🔥 HOT RELOAD: Notifier les clients de la nouvelle version
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SW_UPDATED',
            version: CACHE_VERSION,
            isDevelopment: isDevelopment
          });
        });
      });
    })
  );
});

// ===== FETCH EVENT =====
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // 🔥 CORRECTION: Stratégie adaptative selon le mode
  if (isDevelopment) {
    // Mode développement: Network First avec bypass cache
    console.log(`🔥 SW Dev: Network First for ${event.request.url}`);
    event.respondWith(
      fetch(event.request, {
        cache: 'no-cache',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
        .then(response => {
          // Clone et cache la réponse seulement si elle est valide
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseToCache);
            });
          }
          return response;
        })
        .catch((error) => {
          console.warn(`🔥 SW Dev: Network failed for ${event.request.url}, falling back to cache`);
          // Fallback vers le cache si le réseau échoue
          return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || caches.match('./index.html');
          });
        })
    );
  } else {
    // Mode production: Cache First (performance optimale)
    event.respondWith(
      caches.match(event.request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          return fetch(event.request)
            .then((response) => {
              if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
              }
              
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
              
              return response;
            })
            .catch(() => {
              if (event.request.destination === 'document') {
                return caches.match('./index.html');
              }
            });
        })
    );
  }
});

// ===== MESSAGE HANDLING =====
self.addEventListener('message', (event) => {
  console.log('💬 SW Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
      cacheName: CACHE_NAME,
      isDevelopment: isDevelopment,
      timestamp: Date.now()
    });
  }
  
  // 🔥 CORRECTION: Forcer le mode développement
  if (event.data && event.data.type === 'FORCE_DEV_MODE') {
    console.log('🔥 SW: Forcing development mode ON');
    isDevelopment = true;
    self.forceDevelopmentMode = true;
    
    // Notifier tous les clients du changement
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'DEV_MODE_UPDATED',
          isDevelopment: true
        });
      });
    });
  }
  
  // 🔥 CORRECTION: Clear cache maintenant sans restriction
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    const force = event.data.force === true;
    
    if (isDevelopment || force) {
      Promise.all([
        caches.delete(CACHE_NAME),
        // Clear all quest-timer caches
        caches.keys().then(names => {
          return Promise.all(
            names.filter(name => name.includes('quest-timer'))
                 .map(name => caches.delete(name))
          );
        })
      ]).then(() => {
        console.log('🧹 All caches cleared for hot reload');
        event.ports[0].postMessage({ success: true });
      }).catch(error => {
        console.error('❌ Failed to clear cache:', error);
        event.ports[0].postMessage({ success: false, error: error.message });
      });
    } else {
      console.log('🔒 Cache clear denied - not in development mode');
      event.ports[0].postMessage({ success: false, reason: 'not in development mode' });
    }
  }
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
      primaryKey: '2',
      version: CACHE_VERSION,
      isDevelopment: isDevelopment
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
      for (let i = 0; i < windowClients.length; i++) {
        const client = windowClients[i];
        if (client.url.includes('quest-timer') && 'focus' in client) {
          return client.focus();
        }
      }
      
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// ===== ERROR HANDLING =====
self.addEventListener('error', (event) => {
  console.error(`💥 Service Worker v${CACHE_VERSION} error:`, event.error);
});

self.addEventListener('unhandledrejection', (event) => {
  console.error(`💥 Service Worker v${CACHE_VERSION} unhandled rejection:`, event.reason);
});

// ===== LOGGING =====
console.log(`⚔️ Quest Timer Service Worker v${CACHE_VERSION} loaded`);
console.log(`🔥 Hot Reload Mode: ${isDevelopment ? 'ENABLED' : 'DISABLED'}`);
console.log('📦 Cache name:', CACHE_NAME);
console.log('📁 URLs to cache:', urlsToCache.length);
console.log('🌐 Location:', { hostname: location.hostname, port: location.port });