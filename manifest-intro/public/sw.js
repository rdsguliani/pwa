
self.addEventListener("install", (event) => {
    console.log("service worker installed", event);
})

self.addEventListener("activate", (event) => {
    console.log("service worker activated", event);
})

self.addEventListener("fetch", (event) => {
    console.log("service worker activated", event);
    event.respondWith(fetch(event.request))
})