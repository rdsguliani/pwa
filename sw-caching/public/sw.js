
self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open('static-v2').then(cache => {
      cache.addAll([
            '/',
            '/index.html',
            '/src/js/app.js',
            '/src/js/feed.js',
            '/src/js/fetch.js',
            '/src/js/material.min.js',
            '/src/js/promise.js',
            '/src/css/app.css',
            '/src/css/feed.css',
            '/src/css/help.css',
            '/src/images/main-image.jpg',
            'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
          ]
        )
    })
  )
});

self.addEventListener('activate', function(event) {
  console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function(key) {
         if (key != 'dynamic' && key != 'static-v2') {
           caches.delete(key);
         }
      }))
    })
  )
  return self.clients.claim();
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then( function(response) {
        if (response) {
          return response
        } else {
          return fetch(event.request)
            .then(function (res) {
                return caches.open('dynamic')
                .then(cache => {
                  cache.put(event.request.url, res.clone())
                  return res
                })
                .catch(err => console.log(err));
            })
        }
      })
    ) 
  })