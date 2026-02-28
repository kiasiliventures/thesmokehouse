self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("smokehouse-shell-v1").then((cache) => {
      return cache.addAll(["/", "/cart", "/checkout", "/manifest.json", "/icons/icon-192.png", "/icons/icon-512.png"]);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.includes("smokehouse")).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  if (event.request.method !== "GET") return;

  if (url.pathname.startsWith("/_next/") || url.pathname.startsWith("/api/menu") || url.pathname.startsWith("/icons/") || url.hostname.includes("images.unsplash.com")) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        const networkFetch = fetch(event.request)
          .then((response) => {
            const responseClone = response.clone();
            caches.open("smokehouse-runtime-v1").then((cache) => cache.put(event.request, responseClone));
            return response;
          })
          .catch(() => cached);

        return cached || networkFetch;
      })
    );
  }
});
