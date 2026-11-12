/* WonderLand V15 v46 offline reliability update */
const VERSION = 'raesyas-wonderland-v15-dev-v46-complete-offline';
const PREFIX = 'raesyas-wonderland-v15-dev-';
const CORE = ['./', './index.html', './styles.css?v=46', './app.js?v=31',
 './revision.js?v=31', './full-content.js?v=31', './full-features.js?v=31',
 './game-improvements.js?v=34', './art-rebuild.js?v=35',
 './lpw-v44-assets.js?v=44', './game-polish.js?v=44',
 './premium-ui.js?v=37', './little-picture-engine.js?v=44',
 './mobile-fix-v45.js?v=46', './manifest.webmanifest', './assets/icon.svg'];
const FILES = ["./LPW_ASSET_MANIFEST.json", "./LPW_ASSET_MANIFEST_v40.json", "./LPW_V44_ASSET_MANIFEST.json", "./LPW_VISUAL_MANIFEST_v41.json", "./LPW_VISUAL_MANIFEST_v43.json", "./app.js", "./art-rebuild.js", "./assets/icon.svg", "./assets/learning/apple.svg", "./assets/learning/banana.svg", "./assets/learning/bird.svg", "./assets/learning/butterfly.svg", "./assets/learning/carrot.svg", "./assets/learning/cat.svg", "./assets/learning/cherry.svg", "./assets/learning/dog.svg", "./assets/learning/duck.svg", "./assets/learning/elephant.svg", "./assets/learning/fish.svg", "./assets/learning/flower.svg", "./assets/learning/grapes.svg", "./assets/learning/lemon.svg", "./assets/learning/lion.svg", "./assets/learning/orange.svg", "./assets/learning/pear.svg", "./assets/learning/rabbit.svg", "./assets/learning/star.svg", "./assets/learning/tiger.svg", "./assets/raesya-main-header.webp", "./assets/rizqi-header.webp", "./assets/rizqi-mobile.webp", "./curriculum-bank.json", "./full-content.js", "./full-features.js", "./game-improvements.js", "./game-polish.js", "./index.html", "./little-picture-engine.js", "./lpw-v44-assets.js", "./manifest.webmanifest", "./mobile-fix-v45.js", "./premium-ui.js", "./revision.js", "./styles.css"];
const SCOPE = new URL('./', self.location.href);
const localURL = (path) => new URL(path, SCOPE).href;
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    // Vital app shell is atomic. If it cannot be cached, keep the previous working version.
    await cache.addAll(CORE.map(localURL));
    // Cache all other local assets without failing the whole installation for one missing file.
    const extras = FILES.filter(f => !CORE.some(c => c.split('?')[0].replace(/^\.\//, '') === f));
    const failures = [];
    for (const file of extras) {
      try { await cache.add(localURL(file)); } catch(e) { failures.push(file); }
    }
    if (failures.length) console.warn('Optional offline files not cached:', failures);
    await self.skipWaiting();
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== VERSION)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(VERSION);
    if (req.mode === 'navigate') {
      // Online: refresh the navigation shell. Offline: use the cached local index.
      try {
        const response = await fetch(req);
        if (response.ok) { await cache.put(localURL('./index.html'), response.clone()); return response; }
      } catch (_) {}
      return (await cache.match(localURL('./index.html'))) ||
             (await cache.match(localURL('./'))) ||
             Response.error();
    }
    // Serve offline assets immediately; transparently fall back to versions without query strings.
    const cached = await cache.match(req) || await cache.match(url.origin + url.pathname);
    if (cached) return cached;
    try {
      const response = await fetch(req);
      if (response.ok) await cache.put(req, response.clone());
      return response;
    } catch (_) { return Response.error(); }
  })());
});
