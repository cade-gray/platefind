/*
 * Offline shell for PlateFind.
 *
 * The plate list itself is cached by the app in localStorage; this only exists
 * so that the app can be *opened* with no signal at all. Deliberately small and
 * dependency-free: a runtime cache filled as you browse, rather than a
 * precache manifest that has to be regenerated on every build.
 */
const CACHE = "platefind-shell-v1";

// Fonts come from Google and are immutable once fetched, so they are worth
// keeping around — otherwise the first offline load falls back to system type.
const FONT_HOSTS = ["https://fonts.googleapis.com", "https://fonts.gstatic.com"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.add("/")));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // The plate list is the app's own business: it handles caching and staleness
  // itself, and must never be served a stale body behind its back.
  if (url.hostname === "api.platefind.app") return;

  // Navigations: try the network so a deploy is picked up, fall back to the
  // cached shell when there is nothing to talk to.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put("/", copy));
          return response;
        })
        .catch(() => caches.match("/").then((cached) => cached ?? Response.error())),
    );
    return;
  }

  if (url.origin === self.location.origin || FONT_HOSTS.includes(url.origin)) {
    event.respondWith(cacheFirst(request).catch(() => caches.match(request).then((c) => c ?? Response.error())));
  }
});
