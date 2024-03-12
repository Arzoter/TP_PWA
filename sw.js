const PREFIX = 'my-pwa-cache';
const CACHE_NAME = PREFIX + '-v1';
const urlsToCache = [
    '/index.html',
    '/styles.css',
    '/manifest.json',
    '/icons/192.png',
    '/icons/512.png',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
];

// Installation du service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// Gestion des mises à jour du service worker et nettoyage du cache
self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys.map(key => {
                    if (!key.includes(PREFIX)) {
                        return caches.delete(key);
                    }
                })
            );
        })()
    );
});

// Intercepte les requêtes réseau et retourne la réponse du cache si disponible
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});