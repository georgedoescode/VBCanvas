import DEFAULTS from './defaults';

import {
  resolveTarget,
  createCanvasHTMLElement,
  getCanvasContext,
  mountCanvasToDOM,
  randomID,
} from './domUtils';

import { createContextHistory } from './createContextHistory';
import { createObservableContext } from './createObservableContext';
import { observeElDimensions } from './observeElDimensions';
import { resizeCanvas } from './resizeCanvas';
import { createCanvasStyleSheet, createBaseCanvasStyles } from './styles';

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

export { createCanvas };
