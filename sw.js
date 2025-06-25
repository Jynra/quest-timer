// ===== SERVICE WORKER PWA OPTIMISÉ =====

const CACHE_VERSION = 'quest-timer-v1.0.0';
const CACHE_NAME = `quest-timer-${CACHE_VERSION}`;

// Ressources à mettre en cache pour le mode offline
const CORE_FILES = [
  './',
  './index.html',
  './manifest.json'
];

// ===== INSTALL EVENT =====
self.addEventListener('install', (event) => {
  console.log('⚔️ Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Caching core files for offline support');
        return cache.addAll(CORE_FILES);
      })
      .then(() => {
        console.log('✅ Core files cached successfully');
        // Skip waiting pour activation immédiate
        return self.skipWaiting();
      })
      .catch(error => {
        console.warn('⚠️ Failed to cache some files:', error);
        // Continue même si le cache échoue
        return self.skipWaiting();
      })
  );
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    // Nettoyer les anciens caches
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => {
            console.log(`🗑️ Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          })
      );
    }).then(() => {
      console.log('✅ Service Worker activated and old caches cleaned');
      // Prendre le contrôle immédiatement
      return self.clients.claim();
    })
  );
});

// ===== FETCH EVENT =====
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) return;
  
  // Skip chrome-extension requests
  if (event.request.url.startsWith('chrome-extension://')) return;
  
  // Stratégie: Network First avec Cache Fallback
  event.respondWith(
    fetch(event.request, {
      cache: 'no-cache' // Toujours essayer le réseau en premier
    })
    .then(response => {
      // Si la réponse réseau est OK, la retourner et optionnellement la cacher
      if (response && response.status === 200) {
        // Cloner la réponse car elle ne peut être lue qu'une fois
        const responseToCache = response.clone();
        
        // Mettre en cache seulement les fichiers principaux
        if (CORE_FILES.some(file => event.request.url.endsWith(file))) {
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
        }
        
        return response;
      }
      
      // Si la réponse réseau n'est pas OK, essayer le cache
      return caches.match(event.request);
    })
    .catch(() => {
      // Si le réseau échoue, essayer le cache
      return caches.match(event.request).then(response => {
        if (response) {
          console.log('📱 Serving from cache (offline):', event.request.url);
          return response;
        }
        
        // Si c'est une page HTML et qu'on n'a rien en cache, servir index.html
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
        
        // Sinon, laisser échouer
        throw new Error('No network and no cache available');
      });
    })
  );
});

// ===== MESSAGE HANDLING =====
self.addEventListener('message', (event) => {
  console.log('💬 SW Message received:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('⏭️ Skipping waiting...');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({
      version: CACHE_VERSION,
      mode: 'PWA_OPTIMIZED',
      timestamp: Date.now(),
      cacheSize: CORE_FILES.length
    });
  }
  
  // Clear cache
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(names => {
      return Promise.all(names.map(name => caches.delete(name)));
    }).then(() => {
      console.log('🧹 All caches cleared');
      event.ports[0].postMessage({ success: true });
    });
  }
  
  // Refresh cache
  if (event.data && event.data.type === 'REFRESH_CACHE') {
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CORE_FILES);
    }).then(() => {
      console.log('🔄 Cache refreshed');
      event.ports[0].postMessage({ success: true });
    });
  }
});

// ===== BACKGROUND SYNC (si supporté) =====
if ('sync' in self.registration) {
  self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
      console.log('🔄 Background sync triggered');
      // Ici on pourrait synchroniser les données hors ligne
    }
  });
}

// ===== NOTIFICATION CLICK =====
self.addEventListener('notificationclick', (event) => {
  console.log('🔔 Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  // Ouvrir ou focuser l'app
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      // Si l'app est déjà ouverte, la focuser
      for (const client of clientList) {
        if (client.url === self.location.origin + '/' && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Sinon, ouvrir une nouvelle fenêtre
      if (clients.openWindow) {
        return clients.openWindow('./');
      }
    })
  );
});

// ===== PUSH NOTIFICATIONS (pour futures fonctionnalités) =====
self.addEventListener('push', (event) => {
  console.log('📨 Push notification received');
  
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Quest Timer notification',
      icon: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxOTIgMTkyIj48cmVjdCB3aWR0aD0iMTkyIiBoZWlnaHQ9IjE5MiIgZmlsbD0iIzYzNjZmMSIgcng9IjQyIi8+PHRleHQgeD0iOTYiIHk9IjEyNCIgZm9udC1mYW1pbHk9InN5c3RlbS11aSIgZm9udC1zaXplPSI3MiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPuKalDwvdGV4dD48L3N2Zz4=',
      badge: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNzIiIGhlaWdodD0iNzIiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgNzIgNzIiPjxyZWN0IHdpZHRoPSI3MiIgaGVpZ2h0PSI3MiIgZmlsbD0iIzYzNjZmMSIgcng9IjE2Ii8+PHRleHQgeD0iMzYiIHk9IjQ2IiBmb250LWZhbWlseT0ic3lzdGVtLXVpIiBmb250LXNpemU9IjI4IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+4pqUITwvdGV4dD48L3N2Zz4=',
      vibrate: [200, 100, 200],
      tag: 'quest-timer',
      requireInteraction: false
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title || 'Quest Timer', options)
    );
  }
});

// ===== LOGGING =====
console.log('⚔️ Quest Timer Service Worker - PWA Optimized');
console.log(`📦 Cache: ${CACHE_NAME}`);
console.log(`🔧 Core files: ${CORE_FILES.length}`);
console.log('📱 Ready for standalone PWA experience!');