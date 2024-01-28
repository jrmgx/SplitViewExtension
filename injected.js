// This is not used
/*
manifest.json:
    "content_scripts": [{
        "js": ["injected.js"],
        "matches": ["<all_urls>"],
        "run_at": "document_start",
        "all_frames": true
    }],
*/
// function onError(error) {
//   console.error(error);
// }

// // This is used to inject the code into the page context (different from content context)
// // and then to communicate back and forth with the context page (then background page)
// const script = document.createElement('script');
// script.id = 'split-view';

// setTimeout(() => {
//   // We need to stringify the object so it loose the security context
//   const e = new CustomEvent('split-view-event', { detail: JSON.stringify('some message') });
//   // Send to injected script
//   script.dispatchEvent(e);
// }, 3000);

// // This will be converted to string and injected in the page
// function injectMe() {
//   console.log('injected in page context');

//   const script = document.getElementById('split-view');

//   script.addEventListener('split-view-event', (e) => {
//     console.log('split view event in page context', e.detail);
//   });
// }

// script.textContent = `(${injectMe.toString()})()`;

// if (document.contentType && document.contentType.endsWith('xml') === false) { // TODO update
//   document.documentElement.append(script);
// }
