const CACHE_NAME = 'sstravels-v1';
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
    e.respondWith(
        caches.match(e.request).then(function (cached) {
            return cached || fetch(e.request).then(function (response) {
                if (response.status === 200 && e.request.method === 'GET') {
                    var clone = response.clone();
                    caches.open(CACHE_NAME).then(function (cache) {
                        cache.put(e.request, clone);
                    });
                }
                return response;
            });
        }).catch(function () {
            if (e.request.destination === 'document') {
                return caches.match('./index.html');
            }
        })
    );
});
