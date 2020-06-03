console.log(" in APP")
var deferredPrompt;
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(result => {
        console.log('[Service Worker] registered')
    }).catch(e => {
        console.log(e);
    })
}


window.addEventListener("beforeinstallprompt", function (event) {
    event.preventDefault();
    console.log(" PROMPT.......")
    deferredPrompt = event;

})

