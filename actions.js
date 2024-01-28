document.addEventListener('click', (e) => {
  if (e.target.id === 'h2') {
    browser.tabs.create({ url: browser.runtime.getURL('frames_h2.html') });
  } else if (e.target.id === 'h3') {
    browser.tabs.create({ url: browser.runtime.getURL('frames_h3.html') });
  } else if (e.target.id === 'v2') {
    browser.tabs.create({ url: browser.runtime.getURL('frames_v2.html') });
  }

  e.preventDefault();
  window.close();
});
