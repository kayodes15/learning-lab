/* Learning Lab — only cache static app files; never collect data. */
const CACHE='learning-lab-public-v2';
const ASSETS=['./','./index.html','./maths-engine.js','./reading-engine.js','./explore-engine.js','./settings.js','./wallet.js','./wallet-ui.js','./parent-report.js','./backup.js','./sync-engine.js','./manifest.webmanifest','./icon.svg'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));self.skipWaiting();});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('learning-lab-public-')&&key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;event.respondWith(caches.match(event.request).then(hit=>hit||fetch(event.request)));});
