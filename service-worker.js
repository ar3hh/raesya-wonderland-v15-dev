/* WonderLand v47 robust offline app shell */
const VERSION = 'wonderland-v15-offline-v47';
const PREFIX='wonderland-v15-offline-';
const CORE=["./", "./index.html", "./styles.css?v=47", "./app.js?v=47", "./revision.js?v=31", "./full-content.js?v=31", "./full-features.js?v=31", "./game-improvements.js?v=34", "./art-rebuild.js?v=35", "./lpw-v44-assets.js?v=44", "./game-polish.js?v=44", "./premium-ui.js?v=37", "./little-picture-engine.js?v=44", "./mobile-fix-v45.js?v=47", "./offline-ready-v47.js?v=47", "./manifest.webmanifest", "./assets/icon.svg"];
const EXTRAS=["./LPW_ASSET_MANIFEST.json", "./LPW_ASSET_MANIFEST_v40.json", "./LPW_V44_ASSET_MANIFEST.json", "./LPW_VISUAL_MANIFEST_v41.json", "./LPW_VISUAL_MANIFEST_v43.json", "./assets/learning/apple.svg", "./assets/learning/banana.svg", "./assets/learning/bird.svg", "./assets/learning/butterfly.svg", "./assets/learning/carrot.svg", "./assets/learning/cat.svg", "./assets/learning/cherry.svg", "./assets/learning/dog.svg", "./assets/learning/duck.svg", "./assets/learning/elephant.svg", "./assets/learning/fish.svg", "./assets/learning/flower.svg", "./assets/learning/grapes.svg", "./assets/learning/lemon.svg", "./assets/learning/lion.svg", "./assets/learning/orange.svg", "./assets/learning/pear.svg", "./assets/learning/rabbit.svg", "./assets/learning/star.svg", "./assets/learning/tiger.svg", "./assets/raesya-main-header.webp", "./assets/rizqi-header.webp", "./assets/rizqi-mobile.webp", "./curriculum-bank.json"];
const base = new URL('./', self.location.href);
const abs = path => new URL(path,base).href;
async function seed() {
  const cache = await caches.open(VERSION);
  // Cache must have all critical files before we report Offline Ready.
  const failed=[];
  for(const path of CORE) {
    try {const u=abs(path);const response=await fetch(u,{cache:'reload'});
      if(!response.ok) throw new Error(String(response.status));
      await cache.put(u,response);
    }catch(error){failed.push(path);}
  }
  if(failed.length) throw new Error('Missing core: '+failed.join(', '));
  // Additional images: cache only, no install failure from one optional asset.
  for(const path of EXTRAS){try{const u=abs(path); if(!(await cache.match(u))){const r=await fetch(u);if(r.ok)await cache.put(u,r);}}catch(_) {}}
}
self.addEventListener('install',event=>event.waitUntil(seed().then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==VERSION).map(k=>caches.delete(k)));
  await self.clients.claim();
})()));
self.addEventListener('message',event=>{
  if(!event.data||event.data.type!=='CHECK_OFFLINE')return;
  event.waitUntil((async()=>{
    try{const cache=await caches.open(VERSION); const missing=[];
      for(const path of CORE)if(!(await cache.match(abs(path))))missing.push(path);
      event.ports[0]?.postMessage({ready:missing.length===0,missing});
    }catch(e){event.ports[0]?.postMessage({ready:false,reason:String(e)});}
  })());
});
self.addEventListener('fetch',event=>{
 const req=event.request;if(req.method!=='GET')return;
 const url=new URL(req.url);
 if(url.origin!==base.origin||!url.pathname.startsWith(base.pathname))return;
 event.respondWith((async()=>{
   const cache=await caches.open(VERSION);
   if(req.mode==='navigate') {
     // Offline-first navigation, including installed Home Screen entry point.
     const local=await cache.match(abs('./index.html'))||await cache.match(abs('./'));
     if(local)return local;
     try{return await fetch(req)}catch(_){return Response.error()}
   }
   const cached=await cache.match(req)||await cache.match(abs('./'+url.pathname.slice(base.pathname.length)))||await cache.match(abs('./'+url.pathname.slice(base.pathname.length)+url.search));
   if(cached)return cached;
   try{const fresh=await fetch(req);if(fresh.ok)await cache.put(req,fresh.clone());return fresh}
   catch(_){return Response.error()}
 })());
});
