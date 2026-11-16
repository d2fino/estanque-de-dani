// Offline cache for El Estanque de Dani (launcher, 2D and 3D). The version changes with every build.
const CACHE = 'estanque-559be9c3a1';
const CORE = ['./', 'index.html', '2d.html', '3d.html', 'three.min.js', 'thumbs/2d.jpg', 'thumbs/3d.jpg', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'icons/apple-touch-icon.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url), own = url.origin === location.origin, font = /fonts\.(googleapis|gstatic)\.com$/.test(url.hostname);
  if (!own && !font) return;
  if (own && e.request.mode === 'navigate'){ // newest page when online, cached copy when not
    e.respondWith(fetch(e.request).then(r => { if (r.ok){ const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })
      .catch(() => caches.match(e.request, { ignoreSearch: true }).then(hit => hit || caches.match('index.html'))));
    return; }
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).then(r => { if (r.ok || r.type === 'opaque'){ const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); } return r; })));
});
