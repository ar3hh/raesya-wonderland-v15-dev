// This cache is scoped to the independent V15 development path. Never deploy over V14.
const CACHE='raesyas-wonderland-v15-dev-v9-inline-banner';
const ASSETS=['./','./index.html','./styles.css?v=9','./app.js?v=9','./manifest.webmanifest','./assets/icon.svg'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('raesyas-wonderland-v15-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);const scope=new URL('./',self.location.href);if(u.origin!==scope.origin||!u.pathname.startsWith(scope.pathname))return;e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(r.ok&&r.type==='basic'){const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}return r}))) });
