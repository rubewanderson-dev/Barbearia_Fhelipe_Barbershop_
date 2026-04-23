const CACHE_NAME = "barbearia-v2";

// INSTALAÇÃO (mínimo necessário)
self.addEventListener("install", event => {
  console.log("SW instalado");

  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll([
        "/",
        "/index.html"
      ]);
    })
  );
});

// ATIVAÇÃO (limpa versões antigas)
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// FETCH (cache inteligente)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      
      // se já estiver em cache → usa
      if (response) return response;

      // senão busca e salva
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          
          // só salva se for válido
          if (event.request.method === "GET") {
            cache.put(event.request, networkResponse.clone());
          }

          return networkResponse;
        });
      });

    })
  );
});