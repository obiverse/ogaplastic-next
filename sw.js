// OGA PLASTIC — Service Worker
// Auto-updating: DEPLOY_HASH is replaced at build time by Makefile

const DEPLOY_HASH = "20260325144940-7da10e1";
const CACHE_NAME = `oga-${DEPLOY_HASH}`;

// Install: activate immediately (don't wait for old tabs to close)
self.addEventListener("install", () => {
  self.skipWaiting();
});

// Activate: purge ALL old caches, claim clients, notify them to reload
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
      .then(() =>
        self.clients
          .matchAll({ type: "window" })
          .then((clients) =>
            clients.forEach((c) => c.postMessage({ type: "sw-updated" }))
          )
      )
  );
});

// Fetch: network-first for navigation, stale-while-revalidate for everything else
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin
  if (request.method !== "GET" || url.origin !== location.origin) return;

  // Navigation: always go to network, fallback to cache for offline
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((c) => c.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match("./")))
    );
    return;
  }

  // All other assets: stale-while-revalidate
  // Serve from cache immediately (fast), but always fetch fresh copy in background
  event.respondWith(
    caches.open(CACHE_NAME).then((cache) =>
      cache.match(request).then((cached) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            if (response.ok) {
              cache.put(request, response.clone());
            }
            return response;
          })
          .catch(() => cached);

        return cached || fetchPromise;
      })
    )
  );
});

// Message handler
self.addEventListener("message", (event) => {
  if (event.data === "purge") {
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => event.source?.postMessage("purged"));
  }
  if (event.data === "version") {
    event.source?.postMessage({ type: "version", version: DEPLOY_HASH });
  }
});
