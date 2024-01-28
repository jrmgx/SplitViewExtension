const tabIds = {};
function handleMessage(request, sender, sendResponse) {
  if (request.request === 'give-me-tabs') {
    tabIds[sender.tab.id] = true;
    browser.tabs.query({ currentWindow: true }).then((tabs) => {
      sendResponse({ data: tabs });
    });
    return true; // This means that we used sendResponse
  }
}

browser.runtime.onMessage.addListener(handleMessage);

function isCSPHeader(headerName) {
  return (headerName === 'CONTENT-SECURITY-POLICY') || (headerName === 'X-WEBKIT-CSP');
}

function isXFrameHeader(headerName) {
  return (headerName === 'X-FRAME-OPTIONS');
}

// Listens on new request
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/webRequest/onHeadersReceived
browser.webRequest.onHeadersReceived.addListener((details) => {
  let active = false;
  const tabIdsKeys = Object.keys(tabIds);
  for (const tabId of tabIdsKeys) {
    if (tabIds[tabId]) {
      active = true;
      continue;
    }
  }
  if (!active) {
    return;
  }

  for (let i = 0; i < details.responseHeaders.length; i += 1) {
    const responseHeader = details.responseHeaders[i];
    const currentHeaderNameNormalized = responseHeader.name.toUpperCase();
    if (isCSPHeader(currentHeaderNameNormalized)) {
      responseHeader.value = 'default-src * \'unsafe-inline\' \'unsafe-eval\' data: blob:; ';
      continue;
    }

    if (isXFrameHeader(currentHeaderNameNormalized)) {
      // Not a valid value, so it will be ignored by the browser
      responseHeader.value = 'ALLOWALL';
      continue;
    }
  }
  return { // Return the new HTTP header
    responseHeaders: details.responseHeaders,
  };
}, {
  urls: ['<all_urls>'],
}, ['blocking', 'responseHeaders']);

browser.tabs.onRemoved.addListener((tabId, _) => {
  tabIds[tabId] = false;
});
