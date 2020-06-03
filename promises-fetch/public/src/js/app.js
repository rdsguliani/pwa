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

var promise = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("executed after timer is out");
        // console.log("executed after timer is out")
    }, 3000);

});

fetch("http://httpbin.org/ip")
.then(response =>  {
    console.log(response)
    return response.json()
})
.then(response => console.log(response))
.catch(e => console.log(e)); 


fetch('https://httpbin.org/post', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    mode: 'no-cors',
    body: JSON.stringify({messgae: "does it work"})
})
.then(response => {
    console.log(response)
    return response.json()
})
.then(res => console.log(res))
.catch(e => console.log(e))


promise.then( result=> console.log(result));


console.log("will be done immediately")
