function resolveTarget(target) {
  if (typeof target === 'string') {
    return document.querySelector(target);
  } else {
    return target;
  }
}

function createCanvasHTMLElement(id) {
  const el = document.createElement('canvas');

  el.classList.add(id);

  return el;
}

function getCanvasContext(canvasHTMLElement) {
  return canvasHTMLElement.getContext('2d');
}

function mountCanvasToDOM(target, el) {
  target.appendChild(el);
}

// https://gist.github.com/gordonbrander/2230317
function randomID() {
  // Math.random should be unique because of its seeding algorithm.
  // Convert it to base 36 (numbers + letters), and grab the first 9 characters
  // after the decimal.
  return '_' + Math.random().toString(36).substr(2, 9);
}

export {
  resolveTarget,
  createCanvasHTMLElement,
  getCanvasContext,
  mountCanvasToDOM,
  randomID,
};
