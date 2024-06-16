// const CACHE_NAME = 'my-pwa-cache-v1';
// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/style.css',
//   '/main.js',
//   '/ui/mainField.js',
//   '/threeD/space3DController.js',
//   '/threeD/space3DModel.js',
//   '/threeD/space3DView.js',

//   '/images/icon-192x192.png',
//   '/icons/apple-touch-icon_120.png',
//   '/icons/apple-touch-icon_180.png'
// ];

// // Установка Service Worker и кэширование всех статических ресурсов
// self.addEventListener('install', event => {
//   event.waitUntil(
//     caches.open(CACHE_NAME)
//       .then(cache => {
//         console.log('Opened cache');
//         return cache.addAll(urlsToCache);
//       })
//       .catch(error => {
//         console.error('Failed to cache', error);
//       })
//   );
// });

// // Обработка запросов и возврат кэшированных ресурсов, если они доступны
// self.addEventListener('fetch', event => {

//   if (event.request.url.startsWith('chrome-extension://')) {
//     return; // Пропустите запросы с схемой chrome-extension
//   }

//   // Исключение для запросов WebSocket
//   if (event.request.url.startsWith('ws://')) {
//     return; 
//   }

//   event.respondWith(
//     caches.match(event.request)
//       .then(response => {
//         if (response) {
//           console.log('Found in cache:', event.request.url);
//           return response;
//         } else {
//           console.log('Network request for:', event.request.url);
//           return fetch(event.request).then(networkResponse => {
//             if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
//               return networkResponse;
//             }
//             return caches.open(CACHE_NAME).then(cache => {
//               cache.put(event.request, networkResponse.clone());
//               return networkResponse;
//             });
//           }).catch(error => {
//             console.error('Fetch failed:', error);
//             throw error;
//           });
//         }
//       })
//       .catch(error => {
//         console.error('Cache match failed:', error);
//         throw error;
//       })
//   );
// });

// // Обновление Service Worker и удаление устаревшего кэша
// self.addEventListener('activate', event => {
//   const cacheWhitelist = [CACHE_NAME];
//   event.waitUntil(
//     caches.keys().then(cacheNames => {
//       return Promise.all(
//         cacheNames.map(cacheName => {
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             console.log('Deleting outdated cache:', cacheName);
//             return caches.delete(cacheName);
//           }
//         })
//       );
//     })
//   );
// });
