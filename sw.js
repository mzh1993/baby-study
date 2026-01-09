
// 动态获取 base 路径
const BASE_PATH = self.location.pathname.replace(/\/[^\/]*$/, '/') || '/';

const CACHE_NAME = 'baby-v8';
const CACHE_URLS = [
  BASE_PATH,
  BASE_PATH + 'index.html',
  BASE_PATH + 'manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(CACHE_URLS);
    })
  );
  self.skipWaiting(); // 立即激活新版本
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).catch(() => {
        // 如果网络请求失败且缓存中也没有，返回离线页面
        if (e.request.destination === 'document') {
          return caches.match(BASE_PATH + 'index.html');
        }
      });
    })
  );
});
