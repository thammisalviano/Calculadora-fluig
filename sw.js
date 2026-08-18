const CACHE='fluig-v41';

const ASSETS=[
 './',
 './index.html',
 './admin.html',
 './manifest.json',
 './sw.js',
 './precos_atuais.json',
 './regras_ativas.json'
];

self.addEventListener('install',e=>
  e.waitUntil(
    caches.open(CACHE).then(c=>c.addAll(ASSETS))
  )
);

self.addEventListener('activate',e=>
  e.waitUntil(
    caches.keys().then(keys=>
      Promise.all(
        keys
          .filter(k=>k!==CACHE)
          .map(k=>caches.delete(k))
      )
    )
  )
);

self.addEventListener('fetch',e=>{
  const url = new URL(e.request.url);

  if(url.pathname.endsWith('.json')){
    e.respondWith(
      fetch(e.request)
        .then(resp=>{
          const clone = resp.clone();
          caches.open(CACHE).then(cache=>cache.put(e.request,clone));
          return resp;
        })
        .catch(()=>caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.match(e.request).then(r=>r||fetch(e.request))
  );
});
