/* Service Worker
   - 網站程式／樣式／圖片：網路優先（有新版立刻生效），離線時改用快取
   - 影片 HTML、教材 PDF：快取優先（檔案大，看過一次就能離線重看）
   - Google Fonts：快取優先 */
const VERSION = 'hva-v2';
const SHELL = `${VERSION}-shell`;
const RUNTIME = `${VERSION}-runtime`;
const BIG = `${VERSION}-big`;

const SHELL_FILES = [
  './', './index.html', './manifest.webmanifest',
  './assets/css/style.css',
  './assets/js/scenes.js', './assets/js/data.js', './assets/js/i18n.js', './assets/js/sound.js',
  './assets/js/settings.js', './assets/js/lab.js', './assets/js/app.js',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png', './assets/icons/apple-touch-icon.png', './assets/icons/favicon-64.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(SHELL)
      .then(c => c.addAll(SHELL_FILES.map(u => new Request(u, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => !k.startsWith(VERSION)).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

const networkFirst = async (req, cacheName) => {
  const c = await caches.open(cacheName);
  try {
    const r = await fetch(req);
    if (r && r.ok) c.put(req, r.clone());
    return r;
  } catch (err) {
    const hit = await c.match(req) || await caches.match(req);
    if (hit) return hit;
    if (req.mode === 'navigate') return caches.match('./index.html');
    throw err;
  }
};

const cacheFirst = async (req, cacheName) => {
  const c = await caches.open(cacheName);
  const hit = await c.match(req);
  if (hit) return hit;
  const r = await fetch(req);
  if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone());
  return r;
};

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
    if (/\/(videos|materials|docs)\//.test(url.pathname)) { e.respondWith(cacheFirst(req, BIG)); return; }
    e.respondWith(networkFirst(req, req.mode === 'navigate' ? SHELL : RUNTIME));
    return;
  }
  if (url.host.endsWith('fonts.googleapis.com') || url.host.endsWith('fonts.gstatic.com')) {
    e.respondWith(cacheFirst(req, RUNTIME));
  }
});
