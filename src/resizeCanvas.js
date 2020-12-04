import { setCanvasHTMLElementDimensions } from './setCanvasHTMLElementDimensions';
import { transformContextMatrix } from './transformContextMatrix';
import { restoreFromHistory } from './restoreFromHistory';

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

export { resizeCanvas };
