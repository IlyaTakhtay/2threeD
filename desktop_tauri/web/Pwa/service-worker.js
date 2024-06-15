const CACHE_NAME = 'my-pwa-cache-v1';
const urlsToCache = [
  '/',
  '../index.html',
  '../styles.css',
  '../main.js',
  '/images/icon-192x192.png',
  '/icons/apple-touch-icon_120.png',
  '/icons/apple-touch-icon_180.png'
];

// Установка Service Worker и кэширование всех статических ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Обработка запросов и возврат кэшированных ресурсов, если они доступны
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Возвращает ресурс из кэша или делает запрос к сети
        return response || fetch(event.request);
      })
  );
});

// Обновление Service Worker и удаление устаревшего кэша
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
