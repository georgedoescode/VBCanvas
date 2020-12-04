'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var ResizeObserver = require('resize-observer-polyfill');
var lodashEs = require('lodash-es');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ResizeObserver__default = /*#__PURE__*/_interopDefaultLegacy(ResizeObserver);

var DEFAULTS = {
  target: document.body,
  viewBox: [0, 0, 300, 150],
  autoAspectRatio: true,
  scaleMode: 'fit',
  resolution: window.devicePixelRatio || 1,
  static: false,
  id: Math.random(),
};

function resolveTarget(target) {
  if (typeof target === 'string') {
    return document.querySelector(target);
  } else {
    return target;
  }
}

function createCanvasHTMLElement(id) {
  const el = document.createElement('canvas');

  el.classList.add('vb-canvas');
  el.classList.add(id);

  return el;
}

/** @param {HTMLCanvasElement} canvasHTMLElement */
function getCanvasContext(canvasHTMLElement) {
  return canvasHTMLElement.getContext('2d');
}

/**
 * @param {HTMLElement} target
 * @param {HTMLCanvasElement} el
 */
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

function createContextHistory() {
  const store = new Map();
  let position = 0;

  return {
    get entries() {
      return store.values();
    },
    get size() {
      return store.size;
    },
    /**
     * @param {"function" | "set"} type
     * @param {string | number | symbol} name
     * @param {unknown} args
     */
    push(type, name, args) {
      store.set(position, { type, name, args });

      position++;
    },
    clear() {
      store.clear();
    },
  };
}

/**
 * @param {CanvasRenderingContext2D} baseContext
 * @param {ReturnType<typeof import("./createContextHistory").createContextHistory>['push']} observe
 */
function createObservableContext(baseContext, observe) {
  return new Proxy(baseContext, {
    get(target, name) {
      if (typeof target[name] === 'function') {
        return function () {
          target[name].apply(target, arguments);

          observe('function', name, [...arguments]);
        };
      } else {
        return target[name];
      }
    },
    set(target, name, val) {
      target[name] = val;

      observe('set', name, val);

      // succesful operation ✅
      return true;
    },
  });
}

function observeElDimensions(el, callback) {
  let { width: prevWidth, height: prevHeight } = el.getBoundingClientRect();

  const resizeObserver = new ResizeObserver__default['default'](
    lodashEs.debounce(([entry]) => {
      const { width, height } = entry.target.getBoundingClientRect();

      // prevent infinite resize loops if canvas CSS dimensions are not explicitely set

      if (width !== prevWidth || height !== prevHeight) {
        callback(entry);

        prevWidth = width;
        prevHeight = height;
      }
    }, 500)
  );

  resizeObserver.observe(el);
}

function calculateHeightFromAspectRatio(el, viewBox) {
  const width = el.getBoundingClientRect().width;
  const aspectRatioPercentage = viewBox[3] / viewBox[2];

  return width * aspectRatioPercentage + 'px';
}

function setCanvasHTMLElementDimensions({
  id,
  el,
  autoAspectRatio,
  viewBox,
  resolution,
  styleSheet,
}) {
  if (autoAspectRatio) {
    if (styleSheet.rules?.length) styleSheet.deleteRule(0);

    styleSheet.insertRule(
      `.${id} { height: ${calculateHeightFromAspectRatio(el, viewBox)} }`,
      0
    );
  }

  const { width, height } = el.getBoundingClientRect();

  el.width = width * resolution;
  el.height = height * resolution;
}

function calculateAspectRatio(
  srcWidth,
  srcHeight,
  maxWidth,
  maxHeight,
  scaleMode
) {
  let ratio;

  if (scaleMode === 'fit') {
    ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
  } else {
    ratio = Math.max(maxWidth / srcWidth, maxHeight / srcHeight);
  }

  return {
    fitWidth: srcWidth * ratio,
    fitHeight: srcHeight * ratio,
    ratio: ratio,
  };
}

function clipCtx(ctx, viewBoxWidth, viewBoxHeight) {
  ctx.beginPath(viewBoxWidth, viewBoxHeight);
  ctx.rect(0, 0, viewBoxWidth, viewBoxHeight);
  ctx.clip();
  ctx.closePath();
}

function transformContextMatrix({ ctx, viewBox, resolution, scaleMode }) {
  const viewBoxWidth = viewBox[2];
  const viewBoxHeight = viewBox[3];

  let {
    width: canvasWidth,
    height: canvasHeight,
  } = ctx.canvas.getBoundingClientRect();

  canvasWidth *= resolution;
  canvasHeight *= resolution;

  const { fitWidth, fitHeight, ratio } = calculateAspectRatio(
    viewBoxWidth,
    viewBoxHeight,
    canvasWidth,
    canvasHeight,
    scaleMode
  );

  const scaleX = fitWidth / viewBoxWidth;
  const scaleY = fitHeight / viewBoxHeight;

  const translateX = -viewBox[0] * ratio + (canvasWidth - fitWidth) / 2;
  const translateY = -viewBox[1] * ratio + (canvasHeight - fitHeight) / 2;

  ctx.setTransform(scaleX, 0, 0, scaleY, translateX, translateY);

  clipCtx(ctx, viewBoxWidth, viewBoxHeight);
}

function restoreFromHistory(ctx, history) {
  for (const entry of history.entries) {
    if (entry.type === 'function') {
      ctx[entry.name].apply(ctx, entry.args);
    } else {
      ctx[entry.name] = entry.args;
    }
  }
}

/**
 * @typedef ResizeCanvasOptions
 * @property {import(".").CreateCanvasOptions} opts
 * @property {string} canvasID
 * @property {HTMLCanvasElement} canvasHTMLElement
 * @property {CSSStyleSheet} canvasStyleSheet
 * @property {CanvasRenderingContext2D} baseContext
 * @property {ReturnType<typeof import("./createContextHistory").createContextHistory>} history
 */

/**
 * @param {ResizeCanvasOptions} options
 */
function resizeCanvas({
  opts,
  canvasID,
  canvasHTMLElement,
  canvasStyleSheet,
  baseContext,
  history,
}) {
  setCanvasHTMLElementDimensions({
    id: canvasID,
    el: canvasHTMLElement,
    autoAspectRatio: opts.autoAspectRatio,
    viewBox: opts.viewBox,
    resolution: opts.resolution,
    styleSheet: canvasStyleSheet,
  });

  transformContextMatrix({
    ctx: baseContext,
    viewBox: opts.viewBox,
    resolution: opts.resolution,
    scaleMode: opts.scaleMode,
  });

  if (opts.static) {
    restoreFromHistory(baseContext, history);
  }
}

function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function createBaseCanvasStyles() {
  const baseStyleSheet = document.createElement('style');
  const target = document.styleSheets[0]?.ownerNode || document.head.firstChild;

  baseStyleSheet.id = 'vb-canvas-base-styles';

  document.head.insertBefore(baseStyleSheet, target);

  baseStyleSheet.sheet.insertRule(
    '.vb-canvas { width: 100%; max-width: 100%; }',
    0
  );
}

function createCanvasStyleSheet(id) {
  const canvasStyleSheet = document.createElement('style');
  const target = document.getElementById('vb-canvas-base-styles');

  canvasStyleSheet.setAttribute('data-canvas-id', id);

  insertAfter(canvasStyleSheet, target);

  return canvasStyleSheet.sheet;
}

createBaseCanvasStyles();

/**
 * @typedef CreateCanvasOptions
 * @property {HTMLElement} [target=document.body] Where to add the `<canvas>` element in the DOM.
 * @property {[x: number, y: number, w: number, h: number]} [viewBox=[0, 0, 200, 200]] Canvas viewbox (x, y, w, h). Mirrors SVG Behaviour.
 * @property {boolean} [autoAspectRatio=true] Match DOM dimensions to `viewBox`. When true, `<canvas>` elements behave in a similar way to `<svg>`.
 * @property {"fit" | "fill"} [scaleMode='fit'] VBCanvas's version of `preserveAspectRatio`. Accepts `fit` or `fill`. `fit` is equal to SVG'sxMidYMid meet. `fill` is equal to SVG'sxMidYMid slice.
 * @property {number} [resolution=window.devicePixelRatio] Pixel density of the `<canvas>`.
 * @property {boolean} [static=false] Retains canvas drawing on resize, without the need of an animation loop.
 */

/**
 * @param {CreateCanvasOptions} opts
 */
function createCanvas(opts) {
  opts = Object.assign({}, DEFAULTS, opts);
  opts.target = resolveTarget(opts.target);

  const canvasID = randomID();

  const history = createContextHistory();

  const canvasHTMLElement = createCanvasHTMLElement(canvasID);
  const canvasStyleSheet = createCanvasStyleSheet(canvasID);

  const baseContext = getCanvasContext(canvasHTMLElement);
  const observableContext = createObservableContext(
    baseContext,
    (type, name, args) => {
      history.push(type, name, args);
    }
  );

  mountCanvasToDOM(opts.target, canvasHTMLElement);

  const resize = () =>
    resizeCanvas({
      opts,
      canvasID,
      canvasHTMLElement,
      canvasStyleSheet,
      baseContext,
      history,
    });

  resize();
  observeElDimensions(canvasHTMLElement, resize);

  return {
    el: canvasHTMLElement,
    ctx: opts.static ? observableContext : baseContext,
  };
}

exports.createCanvas = createCanvas;
//# sourceMappingURL=index.js.map
