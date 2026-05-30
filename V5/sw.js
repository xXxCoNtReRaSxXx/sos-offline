/* SOS Offline V5 — Service Worker.
 * Precarga todos los recursos en la instalación para funcionar sin conexión
 * desde la primera visita. Sube el número de versión de CACHE al cambiar
 * cualquier recurso para forzar la actualización.
 */
const CACHE = 'sos-offline-v5';

const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './assets/css/styles.css',
  './assets/js/i18n.js',
  './assets/js/data.js',
  './assets/js/content-extra.js',
  './assets/js/illustrations.js',
  './assets/js/icons.js',
  './assets/js/app.js',
  './assets/icons/icon.svg',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Cache-first: el contenido es estático y debe estar siempre disponible.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request)
        .then((response) => {
          if (response.ok && request.url.startsWith(self.location.origin)) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
