const STATIC_CACHE = 'static-v8';
const DYNAMIC_CACHE = 'dynamic'

self.addEventListener('install', function(event) {
  console.log('[Service Worker] Installing Service Worker ...', event);
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      cache.addAll([
            '/',
            '/index.html',
            '/offline.html',
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
         if (key != DYNAMIC_CACHE && key != STATIC_CACHE) {
           caches.delete(key);
         }
      }))
    })
  )
  return self.clients.claim();
});

//  network first, cache second .. NOT Good for slow networks....
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function (res) {
//           return caches.open(DYNAMIC_CACHE)
//           .then(cache => {
//             cache.put(event.request.url, res.clone())
//             return res
//           })
//         })
//         .catch(err => {
//           console.log(err);
//           return cache.match(request.url)
//           .then (function (res) {
//             return res;
//           }) 
//       });
//     ) 
// })

//  caching first, network second 
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then( function(response) {
//         if (response) {
//           return response
//         } else {
//           return fetch(event.request)
//             .then(function (res) {
//                 return caches.open(DYNAMIC_CACHE)
//                 .then(cache => {
//                   cache.put(event.request.url, res.clone())
//                   return res
//                 })
//               })
//               .catch(err => {
//                 console.log(err);
//                 return caches.open(STATIC_CACHE)
//                   .then (function (cache) {
//                     return cache.match('/offline.html')
//                   })    
//             });
//         }
//       })
//     ) 
// })

// CACHE-ONLY
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//   ) 
// })


// NETWORK-ONLY
// self.addEventListener('fetch', function(event) {
//   event.respondWith( fetch(event.request)) 
// })