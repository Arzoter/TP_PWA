const BASE = location.protocol + "//" + location.host;
const PREFIX = "V3";
const CACHED_FILES = [
    "https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css",
    `${BASE}/index.js`
]


self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        (async () => {
            const cache = await caches.open(PREFIX);
            await Promise.all([...CACHED_FILES, '/offline.html'].map((path) => {
                return cache.add(new Request(path))
            }))
        })()
    )
    console.log(`${PREFIX} Install`);
})
self.addEventListener('activate', (event) => {
    clients.claim();
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(
            keys.map((key) => {
                if (!key.includes(PREFIX)) {
                    caches.delete(key)
                }
            })
        )
    })())
    console.log(`${PREFIX} Active`);
})



self.addEventListener('fetch', (event) => {
    console.log(`${PREFIX} Fetching : ${event.request.url}, Mode : ${event.request.mode}`);
    if (event.request.mode === "navigate") {
        event.respondWith (
            (async () => {
                try {
                    const preloadResponse = await event.preloadResponse;
                    if (preloadResponse) {
                        return preloadResponse
                    }

                    return await fetch(event.request)
                } catch (err) {
                    const cache = await caches.open(PREFIX);
                    return await cache.match('/offline.html')
                }
            })()
        )
    } else if(CACHED_FILES.includes(event.request.url)) {
        event.respondWith(caches.match(event.request));
    }
})