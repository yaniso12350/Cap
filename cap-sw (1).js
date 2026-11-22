const V='cap-shell-v25',TILES='cap-tiles-v2';
const SHELL=['./','./cap.html','./cap.webmanifest','./cap-192.png','./cap-512.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V&&x!==TILES).map(x=>caches.delete(x)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(/basemaps\.cartocdn\.com$|tile\.openstreetmap\.org$/.test(u.hostname)){
  e.respondWith(caches.open(TILES).then(c=>c.match(r.url).then(h=>h||fetch(r).then(res=>{if(res.ok)c.put(r.url,res.clone());return res}))));return}
 if(u.origin===location.origin){
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(V).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(h=>h||caches.match('./cap.html'))))}
});
