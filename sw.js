// sw.js
const CACHE_NAME = "sih-flw-v1";
const FILES_TO_CACHE = [
  "/",   // root (GitHub Pages index, if any)

  // Welcome pages
  "/welcome-pages/welcome-page.html",
  "/welcome-pages/welcome-page-style.css",
  "/welcome-pages/welcome-page-script.js",
  "/welcome-pages/loader.css",
  "/welcome-pages/loader.js",

  // FLW login
  "/welcome-pages/flw-login-page.html",
  "/welcome-pages/flw-script.js",
  "/welcome-pages/common-login-style.css",

  // FLW dashboard
  "/flw-dashboard/test.html",
  "/flw-dashboard/test-style.css",
  "/flw-dashboard/test-script.js",


];

// Install - cache all FLW files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching FLW portal + dashboard files...");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activate - clean old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch - serve from cache first, then network
// Fetch - only cache FLW + Welcome files, others always online
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  if (
    url.pathname.startsWith("/welcome-pages/") ||
    url.pathname.startsWith("/flw-dashboard/")
  ) {
    // Serve from cache first
    event.respondWith(
      caches.match(event.request).then(response => response || fetch(event.request))
    );
  } else {
    // Always network for Admin/Vet
    event.respondWith(fetch(event.request));
  }
});
