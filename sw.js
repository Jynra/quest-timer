// ===== SERVICE WORKER SIMPLE - PAS DE CACHE =====

const CACHE_VERSION = '1.0.0';

// ===== INSTALL EVENT =====
self.addEventListener('install', (event) => {
  console.log('⚔️ Service Worker installing (NO CACHE MODE)...');
  // Skip waiting pour activation immédiate
  self.skipWaiting();
});

// ===== ACTIVATE EVENT =====
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating (NO CACHE MODE)...');
  
  event.waitUntil(
    // Supprimer TOUS les caches existants
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          console.log(`🗑️ Deleting cache: ${cacheName}`);
          return caches.delete(cacheName);
        })
      );
    }).then(() => {
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
  
  // 🔥 TOUJOURS ALLER CHERCHER SUR LE RÉSEAU - PAS DE CACHE
  event.respondWith(
    fetch(event.request, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }).catch(() => {
      // Seulement si le réseau échoue, servir l'index pour les pages
      if (event.request.destination === 'document') {
        return fetch('./index.html', { cache: 'no-cache' });
      }
    })
  );
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
      mode: 'NO_CACHE',
      timestamp: Date.now()
    });
  }
  
  // Clear cache (même si on cache pas)
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(names => {
      return Promise.all(names.map(name => caches.delete(name)));
    }).then(() => {
      console.log('🧹 All caches cleared');
      event.ports[0].postMessage({ success: true });
    });
  }
});

// ===== LOGGING =====
console.log('⚔️ Quest Timer Service Worker - NO CACHE MODE');
console.log('🔥 All requests go to network - modifications are instant!');