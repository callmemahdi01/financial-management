const CACHE_NAME = 'portfolio-cache-v1';
const urlsToCache = [
  '/financial-management/',
  '/financial-management/index.html',
  '/financial-management/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.url.startsWith('http')) { // بررسی اینکه فقط درخواست‌های http/https کش شوند
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          // اگر درخواست موفقیت‌آمیز بود، پاسخ را در کش ذخیره می‌کنیم.
          return caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(function() {
          // اگر درخواست به شبکه با شکست مواجه شد، از کش استفاده می‌کنیم.
          return caches.match(event.request).then(function(response) {
            return response || caches.match('./index.html');
          });
        })
    );
  }
});

self.addEventListener('activate', function(event) {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
