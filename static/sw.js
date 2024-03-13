const PREFIX = 'V3';
const CACHE_NAME = "my-pwa-cache_" + PREFIX;
const urlsToCache = [
    '/index.html', //no-cors
    '/styles.css', //no-cors
    '/offline.html',
    '/manifest.json',
    // '/icons/192.png', //no-cors
    // '/icons/512.png', //no-cors
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css'
];

// Installation du service worker
self.addEventListener('install', event => {
    console.log(`${PREFIX} Install`);
    self.skipWaiting();
    
    event.waitUntil(
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            await Promise.all(urlsToCache.map(async (path) => {
                let request
                try {
                    request = new Request(path);
                    await cache.add(request);
                } catch (error) {
                    console.error(`Error caching resource "${path}", Mode : ${request.mode}:`, error);
                }
            }));
        })()
    );
});

// Gestion des mises à jour du service worker et nettoyage du cache
self.addEventListener('activate', event => {
    clients.claim();
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys.map(key => {
                    if (!key.includes(CACHE_NAME)) {
                        return caches.delete(key);
                    }
                })
            );
        })()
    );
    console.log(`${PREFIX} Active`);
});

// Intercepte les requêtes réseau et retourne la réponse du cache si disponible
self.addEventListener('fetch', event => {
    console.log(`${PREFIX} Fetching : ${event.request.url}, Mode : ${event.request.mode}`);

    if (event.request.mode === "navigate") {
        event.respondWith(
            (async () => {
                try {
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        return preloadResponse;
                    }
    
                    // Tenter de récupérer la ressource en réseau
                    const networkResponse = await fetch(event.request);
                    // Si la réponse est OK, la mettre en cache et la retourner
                    if (networkResponse && networkResponse.ok) {
                        const cache = await caches.open(CACHE_NAME);
                        await cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    }
                } catch (error) {
                    console.log("no network response or not ok");
                    console.error('Fetch error:', error);
                        // Si la récupération en réseau a échoué, essayer de récupérer la ressource en cache
                        const cacheResponse = await caches.match(event.request);
                        if (cacheResponse) {
                            return cacheResponse;
                        }
                        // Si la ressource n'est pas disponible en cache ni en réseau, retourner une réponse de remplacement
                        return caches.match('/offline.html');
                }
            })()
        );
    } else {
        event.respondWith(
            (async () => {
                try {
                    // Tenter de récupérer la ressource en cache
                    const cacheResponse = await caches.match(event.request);
                    if (cacheResponse) {
                        return cacheResponse;
                    }
                    // Si la ressource n'est pas disponible en cache, effectuer une requête réseau normale
                    const networkResponse = await fetch(event.request);
                    // Mettre en cache la réponse en cas de réussite
                    if (networkResponse && networkResponse.ok) {
                        const cache = await caches.open(CACHE_NAME);
                        await cache.put(event.request, networkResponse.clone());
                    }
                    return networkResponse;
                } catch (error) {
                    console.error('Fetch error:', error);
                    // Retourner une réponse de remplacement en cas d'erreur
                    return caches.match('/offline.html');
                }
            })()
        );
    }
    if (event.request.url.endsWith('/matches')) {
        event.respondWith(
            caches.open(CACHE_NAME).then(cache => {
                return fetch(event.request)
                    .then(response => {
                        cache.put(event.request, response.clone());
                        return response;
                    })
                    .catch(() => cache.match(event.request));
            })
        );
    }
});
