
const CACHE_NAME = 'baby-study-v3';
// 只缓存真正需要且一定存在的静态资源
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  // 注意：在 ES6 Module 模式下，这些文件是作为模块加载的，因此需要缓存
  './index.tsx',
  './App.tsx',
  './types.ts',
  './constants.ts',
  './services/geminiService.ts',
  // 第三方 CDN 资源
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=ZCOOL+KuaiLe&family=Ma+Shan+Zheng&display=swap'
];

// 安装阶段：预缓存所有核心资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('正在预缓存关键资源...');
      // 使用 map 逐个添加，防止单个资源失败导致全部失败
      return Promise.allSettled(
        ASSETS.map(url => cache.add(url))
      );
    })
  );
  self.skipWaiting();
});

// 激活阶段：清理旧版本的缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    })
  );
});

// 策略：网络优先，失败后回退到缓存
// 对于这种学习应用，网络优先可以确保家长随时收到最新的字词更新，没网时自动切换到本地
self.addEventListener('fetch', (event) => {
  // 只处理 GET 请求
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 如果网络请求成功，克隆一份存入缓存（可选，实现动态缓存）
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => {
        // 如果网络失败（离线），则从缓存中读取
        return caches.match(event.request).then(cachedResponse => {
          if (cachedResponse) return cachedResponse;
          
          // 如果是页面导航请求且缓存里也没有，返回首页
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
