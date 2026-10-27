const CACHE_NAME = "banakar-finclub-v430";
const APP_SHELL = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./config.js",
  "./manifest.json",
  "./icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

// Notifications are switched off: incoming push messages are ignored.
const PUSH_OFF = false;

self.addEventListener("push", (event) => {
  if (PUSH_OFF) return;
  const data = event.data?.json() || {};
  const title = data.title || "Banakar FinClub";
  const options = {
    body: data.body || "",
    icon: self.registration.scope + "icon.svg",
    badge: self.registration.scope + "icon.svg",
    vibrate: [200, 100, 200],
    data: { url: self.registration.scope },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.startsWith(self.registration.scope) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(self.registration.scope);
    })
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  const requestUrl = new URL(event.request.url);
  const isAppAsset = requestUrl.origin === self.location.origin;

  if (!isAppAsset) return;

  // "no-cache" makes the browser ask the server whether the file changed on every load
  // (a cheap 304 when it hasn't), so a new deploy shows on the next open instead of
  // after GitHub Pages' 10-minute cache expires. Offline still falls back to the cache below.
  event.respondWith(
    fetch(event.request, { cache: "no-cache" })
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request).then((cached) => cached || caches.match("./index.html")))
  );
});
