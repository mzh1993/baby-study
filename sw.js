
// Service Worker 版本 - 更新此版本号以强制清除旧缓存
const CACHE_NAME = 'baby-v10';

// 使用相对路径，自动适配GitHub Pages子路径
// Service Worker和index.html在同一目录，所以使用相对路径即可
const CACHE_URLS = [
  './index.html',
  './manifest.json'
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
  const url = e.request.url;
  
  // 拦截对不存在文件的请求，返回空响应避免404错误
  if (url.includes('index.css') || url.includes('index.tsx') || url.includes('App.tsx')) {
    e.respondWith(new Response('', {
      status: 200,
      statusText: 'OK',
      headers: { 'Content-Type': 'text/css' }
    }));
    return;
  }
  
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).catch(() => {
        // 如果网络请求失败且缓存中也没有，返回离线页面
        if (e.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
