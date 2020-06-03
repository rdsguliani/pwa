

self.addEventListener('install', function(event) {
    console.log(" INIITALIZED .. ")
    event.waitUntil(
        caches.open('static-v3')
        .then(function (cache) {
            cache.addAll(
                [
                    '/',
                    '/index.html',
                    '/src/js/main.js',
                    '/src/js/material.min.js',
                    '/src/css/app.css',
                    '/src/css/main.css',
                    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
                ]
            )
        })
    )

})

self.addEventListener('activate', function(event) {
    console.log(" ACTIVATED ..  ")
    event.waitUntil(
        caches.keys()
        .then( function (keyList) {
            Promise.all( keyList.map(key => {
            if (key != 'static-v3' && key != 'dynamic') {
                caches.delete(key);
            }
            }) 
            )
        }
        )
    )
})


self.addEventListener('fetch', function(event) {
    console.log(" FETCHED ")
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            if (response) {
                return response 
            } else {
                return fetch(event.request)
                    .then (function (response) {
                        return caches.open('dynamic')
                        .then(function (cache) {
                            cache.put(event.request.url, response.clone())
                            return response;
                        })
                    })
            }
        })
        .catch(e => console.log(e))
    )
})