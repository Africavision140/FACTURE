// Service worker — Africa Vision Facturation
// Change CACHE_NOM a chaque mise a jour pour forcer le rafraichissement.
const CACHE_NOM = "avv-facturation-v5";
const FICHIERS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE_NOM).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cles) =>
      Promise.all(cles.filter((c) => c !== CACHE_NOM).map((c) => caches.delete(c)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Les appels Firestore passent toujours par le reseau (donnees a jour).
  if (e.request.url.includes("firestore.googleapis.com")) return;
  e.respondWith(
    caches.match(e.request).then((r) => r || fetch(e.request).catch(() => caches.match("./index.html")))
  );
});
