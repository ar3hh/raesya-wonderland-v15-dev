/* WonderLand V15 v48 iPhone offline shell */
const VERSION='wonderland-v15-offline-v48', PREFIX='wonderland-v15-offline-';
const CORE=["./index.html", "./styles.css?v=48", "./app.js?v=48", "./revision.js?v=31", "./full-content.js?v=31", "./full-features.js?v=31", "./game-improvements.js?v=34", "./art-rebuild.js?v=35", "./lpw-v44-assets.js?v=44", "./game-polish.js?v=44", "./premium-ui.js?v=37", "./little-picture-engine.js?v=44", "./mobile-fix-v45.js?v=48", "./offline-ready-v48.js?v=48", "./manifest.webmanifest", "./assets/icon.svg"];
const base=new URL('./',self.location.href);
const abs=p=>new URL(p,base).href;
const shell=abs('./index.html');
async function verify(){const cache=await caches.open(VERSION);const missing=[];for(const p of CORE){if(!await cache.match(abs(p)))missing.push(p);}return missing;}
async function installCore(){
 const cache=await caches.open(VERSION);
 const failures=[];
 // Fetch critical resources in parallel rather than stalling on optional assets.
 await Promise.all(CORE.map(async path=>{
  const url=abs(path);
  try{
   const r=await fetch(url,{cache:'no-store'});
   if(!r.ok)throw new Error('HTTP '+r.status);
   await cache.put(url,r);
  }catch(e){failures.push(path+': '+String(e).slice(0,60));}
 }));
 if(failures.length)throw new Error('Core cache failed: '+failures.join(' | '));
}
self.addEventListener('install',e=>e.waitUntil(installCore().then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith(PREFIX)&&k!==VERSION).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener('message',e=>{
 if(e.data?.type!=='CHECK_OFFLINE')return;
 e.waitUntil((async()=>{
  let answer;
  try{const missing=await verify();answer={ready:!missing.length,missing,version:VERSION};}
  catch(ex){answer={ready:false,reason:String(ex),version:VERSION};}
  try{e.ports[0]?.postMessage(answer)}catch(ex){}
 })());
});
self.addEventListener('fetch',e=>{
 const req=e.request;
 if(req.method!=='GET')return;
 const u=new URL(req.url);
 if(u.origin!==base.origin||!u.pathname.startsWith(base.pathname))return;
 e.respondWith((async()=>{
  const c=await caches.open(VERSION);
  if(req.mode==='navigate'){
   const local=await c.match(shell);
   if(local)return local;
   try{return await fetch(req);}catch(_){return new Response('Offline cache not ready. Please connect once and reopen.',{status:503,headers:{'Content-Type':'text/plain'}})}
  }
  // Cache-first for app assets; query parameters are significant.
  const cached=await c.match(req);
  if(cached)return cached;
  try{const response=await fetch(req);if(response.ok)await c.put(req,response.clone());return response;}
  catch(_){return Response.error();}
 })());
});
