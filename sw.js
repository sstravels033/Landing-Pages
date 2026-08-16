const CACHE_NAME = 'sstravels-v2'; // Bumped version to reset existing caches
const ASSETS = [
    './',
    './index.html',
    './css/fonts.css',
    './css/all.min.css',
    './css/variables.css',
    './css/base.css',
    './css/layout.css',
    './css/hero.css',
    './script.js',
    './js/map.js',
    './manifest.json',
    './assets/icon-192.png',
    './assets/icon-512.png',
];

self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(
                names.filter(function (name) { return name !== CACHE_NAME; })
                    .map(function (name) { return caches.delete(name); })
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', function (e) {
    // Only handle GET requests
    if (e.request.method !== 'GET') return;

    const isHTML = e.request.mode === 'navigate' || e.request.destination === 'document';

    if (isHTML) {
        // Network-First for HTML to ensure instant updates on reload
        e.respondWith(
            fetch(e.request)
                .then(function (response) {
                    if (response && response.status === 200) {
                        const clone = response.clone();
                        caches.open(CACHE_NAME).then(function(cache) {
                            cache.put(e.request, clone);
                        });
                    }
                    return response;
                })
                .catch(function () {
                    // Fallback to cache if offline
                    return caches.match(e.request).then(function(cached) {
                        return cached || caches.match('./index.html');
                    });
                })
        );
    } else {
        // Stale-While-Revalidate for all other assets (CSS, JS, Images)
        // Delivers cached version instantly, but updates cache in background for next visit
        e.respondWith(
            caches.match(e.request).then(function (cached) {
                const fetchPromise = fetch(e.request).then(function (networkResponse) {
                    if (networkResponse && networkResponse.status === 200) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then(function (cache) {
                            cache.put(e.request, clone);
                        });
                    }
                    return networkResponse;
                }).catch(function() {
                    // Network failed, silently ignore as we have the cached version
                });
                
                return cached || fetchPromise;
            })
        );
    }
});
