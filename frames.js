function onError(error) {
  console.log(`Error: ${error}`);
}

function combine(id) {
  const i = parseInt(id, 10);
  const j = i + 1;
  return `${i}-${j}`;
}

function onClickTabTitle(e) {
  const tab = this;
  const a = e.target;
  const { frameId } = a.dataset;

  const iframe = document.getElementById(`iframe-${frameId}`);
  iframe.src = tab.url;
  const tabs = document.getElementById(`tabs-${frameId}`);
  tabs.style.display = 'none';
  iframe.style.display = 'block';
}

function createListOfTabs(tabs, id) {
  const ul = document.createElement('ul');
  for (const tab of tabs) {
    const li = document.createElement('li');
    const a = document.createElement('a');

    // moz-extension:// This way we allow showing extensions,
    // including our own (and it can becomes crazy)
    if (!tab.url.match(/^(https?|moz-extension):\/\//) || !tab.title) continue;

    a.href = '#';
    a.dataset.frameId = id;
    a.textContent = tab.title;
    a.onclick = onClickTabTitle.bind(tab);

    li.appendChild(a);
    ul.appendChild(li);
  }

  const container = document.getElementById(`tabs-${id}`);
  container.appendChild(ul);
}

function init(arrayOfIds, vertical) {
  browser.runtime.sendMessage({ request: 'give-me-tabs' })
    .then((message) => {
      for (const ids of arrayOfIds) {
        createListOfTabs(message.data, ids);
      }
    }, onError);

  // const numberOfFrames = arrayOfIds.length;
  const containers = {};
  const handles = {};
  const isClicked = {};
  document.addEventListener('mouseup', () => {
    const keys = Object.keys(isClicked);
    for (const id of keys) {
      isClicked[id] = false;
    }
  });
  document.addEventListener('mousemove', (e) => {
    const keys = Object.keys(isClicked);
    for (const id of keys) {
      if (isClicked[id]) {
        let position = vertical ? e.pageY : e.pageX;
        const handle = handles[id];
        const c1 = containers[id];
        const c2 = containers[parseInt(id, 10) + 1];
        const c1ww = vertical ? c1.offsetHeight : c1.offsetWidth;
        const c2ww = vertical ? c2.offsetHeight : c2.offsetWidth;

        // This is a bit buggy but acceptable
        if (c1ww < 310) {
          // Drop the event so we don't continue resizing
          isClicked[id] = false;
          // How much "too far" we have been? + margin
          const diff = 310 - c1ww + 10;
          // Restore correct position
          // We are moving on the left, position is decreasing
          position += diff;
        }
        if (c2ww < 310) {
          isClicked[id] = false;
          const diff = 310 - c2ww + 10;
          // We are moving on the right, position is increasing
          position -= diff;
        }

        if (vertical) {
          handle.style.top = `calc(${position}px - 2.5px)`;
          c1.style.bottom = `calc(100vh - ${position}px - 2.5px)`;
          c2.style.top = `calc(${position}px)`;
        } else {
          handle.style.left = `calc(${position}px - 2.5px)`;
          c1.style.right = `calc(100vw - ${position}px - 2.5px)`;
          c2.style.left = `calc(${position}px)`;
        }

        return;
      }
    }
  });
  for (const id of arrayOfIds) {
    containers[id] = document.getElementById(`container-${id}`);
    const idCombine = combine(id);
    const h = document.getElementById(`handle-${idCombine}`);
    if (h) {
      handles[id] = h;
      isClicked[id] = false;
      h.addEventListener('mousedown', () => {
        isClicked[id] = true;
      });
    }
  }
}

const script = document.getElementById('script');
init(script.dataset.ids.split(','), script.dataset.direction === 'vertical');
