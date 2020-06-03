
var CACHE_STATIC_NAME = 'static-v10';
var CACHE_DYNAMIC_NAME = 'dynamic-v5';

var STATIC_ASSETS = [
  '/',
  '/index.html',
  '/src/css/app.css',
  '/src/css/main.css',
  '/src/js/main.js',
  '/src/js/material.min.js',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll(STATIC_ASSETS);
      })
  )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
});




// cache with network fallback and cache only
self.addEventListener('fetch', function(event) {
  const url = 'https://httpbin.org/ip';

  if (event.request.url.indexOf(url) != -1) {
    event.respondWith(
      fetch(event.request)
        .then(function(res) {
          return caches.open(CACHE_DYNAMIC_NAME)
            .then(function(cache) {
              cache.put(event.request.url, res.clone());
              return res;
            });
        }).catch (e => {
          return caches.match(event.request);
        })
    );
  } else if (new RegExp('\\b' + STATIC_ASSETS.join('\\b|\\b') + '\\b').test(event.request.url) ) {
      event.respondWith(cache.match(event.request.url))
  }
  else {
    event.respondWith(
      caches.match(event.request)
        .then( function(response) {
          if (response) {
            return response
          } else {
            return fetch(event.request)
              .then(function (res) {
                  return caches.open(DYNAMIC_CACHE)
                  .then(cache => {
                    cache.put(event.request.url, res.clone())
                    return res
                  })
                })
                .catch(err => {
                  console.log(err);
                  return caches.open(STATIC_CACHE)
                    .then (function (cache) {
                      return cache.match('/offline.html')
                    })    
              });
          }
        })
      ) 
  }
});


// NETWORK only
// self.addEventListener('fetch', function(event) {
//   event.respondWith(fetch(event.request));
// });

// CACHE only
// self.addEventListener('fetch', function(event) {
//   event.respondWith(caches.match(event.request));
// });

// NETWORK CACHE fallback with DYNAMIC CONTENT
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//     .then ((response) => {
//       return caches.open(CACHE_DYNAMIC_NAME)
//         .then(cache => {
//           cache.put(event.request.url, response.clone());
//           return response;
//         })
//     }).catch (e => {
//       return caches.match(event.request)
//     })
//   );
// });

// cache, then fetch strategy, no fallback
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     fetch(event.request)
//       .then(function(res) {
//         return caches.open(CACHE_DYNAMIC_NAME)
//           .then(function(cache) {
//             cache.put(event.request.url, res.clone());
//             return res;
//           });
//       }).catch (e => {
//         return caches.match(event.request);
//       })
//   );
// });


// cache fallback to Network with DYNAMIC CACHING
// self.addEventListener('fetch', (event) => {
//   event.respondWith(
//     event.respondWith(
//       caches.match(event.request)
//         .then( function(response) {
//           if (response) {
//             return response
//           } else {
//             return fetch(event.request)
//               .then(function (res) {
//                   return caches.open(DYNAMIC_CACHE)
//                   .then(cache => {
//                     cache.put(event.request.url, res.clone())
//                     return res
//                   })
//                 })
//                 .catch(err => {

//               });
//           }
//         })
//       ) 
//   )
// })