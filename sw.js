const CACHE_NAME = `sstravels-no-cache-1786847550000`; // Timestamp versioned for the purge

self.addEventListener('install', function (e) {
    self.skipWaiting(); // Force the waiting service worker to become the active service worker
});

self.addEventListener('activate', function (e) {
    // Delete ALL existing caches to clear the slate completely
    e.waitUntil(
        caches.keys().then(function (names) {
            return Promise.all(names.map(function (name) {
                return caches.delete(name);
            }));
        })
    );
    self.clients.claim(); // Claim clients so the new sw takes over immediately
});

self.addEventListener('fetch', function (e) {
    // Bypass cache completely and fetch directly from the network every single time
    e.respondWith(
        fetch(e.request).catch(function() {
            // If offline, just fail normally without a cached fallback
            return new Response("Offline mode is disabled. Please connect to the internet.", { 
                status: 503, 
                statusText: "Service Unavailable" 
            });
        })
    );
});
