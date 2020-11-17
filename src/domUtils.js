function resolveTarget(target) {
  if (typeof target === 'string') {
    return document.querySelector(target);
  } else {
    return target;
  }
}

function createCanvasHTMLElement() {
  const el = document.createElement('canvas');

  el.style.maxWidth = '100%';

  return el;
}

function getCanvasContext(canvasHTMLElement) {
  return canvasHTMLElement.getContext('2d');
}

function mountCanvasToDOM(target, el) {
  target.appendChild(el);
}

export {
  resolveTarget,
  createCanvasHTMLElement,
  getCanvasContext,
  mountCanvasToDOM,
};
