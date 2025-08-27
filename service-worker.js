// 定義 Service Worker 的快取名稱和版本
const CACHE_NAME = 'yellow-cat-pet-app-v1';
// 定義要快取的所有檔案列表
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  // 這是一個通用的 Tailwind CSS CDN URL，確保應用程式離線時也能正確顯示樣式。
  'https://cdn.tailwindcss.com',
  // 這是一個通用的 Google Fonts URL，確保應用程式離線時字體能正常顯示。
  'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap'
];

// 監聽 Service Worker 的 'install' 事件
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  // 執行快取所有資源的操作
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// 監聽 Service Worker 的 'fetch' 事件
self.addEventListener('fetch', (event) => {
  // 攔截所有網路請求
  event.respondWith(
    // 檢查快取中是否已有請求的資源
    caches.match(event.request)
      .then((response) => {
        // 如果快取中有，則直接回傳快取中的資源
        if (response) {
          console.log('Service Worker: Found in cache', event.request.url);
          return response;
        }
        // 如果快取中沒有，則從網路獲取資源並同時將其快取起來
        console.log('Service Worker: Not in cache, fetching and caching', event.request.url);
        const fetchRequest = event.request.clone();
        return fetch(fetchRequest)
          .then((fetchResponse) => {
            // 檢查回應是否有效
            if (!fetchResponse || fetchResponse.status !== 200 || fetchResponse.type !== 'basic') {
              return fetchResponse;
            }

            // 複製回應以便將其放入快取
            const responseToCache = fetchResponse.clone();
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return fetchResponse;
          });
      })
  );
});

// 監聽 Service Worker 的 'activate' 事件
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  // 清理舊的快取
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
