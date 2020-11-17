import DEFAULTS from './defaults';

import {
  resolveTarget,
  createCanvasHTMLElement,
  getCanvasContext,
  mountCanvasToDOM,
} from './domUtils';

import { createContextHistory } from './createContextHistory';
import { createObservableContext } from './createObservableContext';
import { observeElDimensions } from './observeElDimensions';
import { setCanvasHTMLElementDimensions } from './setCanvasHTMLElementDimensions';
import { transformContextMatrix } from './transformContextMatrix';
import { restoreFromHistory } from './restoreFromHistory';

function createCanvas(opts) {
  opts = Object.assign(DEFAULTS, opts);
  opts.target = resolveTarget(opts.target);

  let canvasHasResized = false;

  const history = createContextHistory();

  const canvasHTMLElement = createCanvasHTMLElement();

  const baseContext = getCanvasContext(canvasHTMLElement);
  const observableContext = createObservableContext(
    baseContext,
    (type, name, args) => {
      history.push(type, name, args);
    }
  );

  function resizeCanvas() {
    setCanvasHTMLElementDimensions({
      el: canvasHTMLElement,
      autoAspectRatio: opts.autoAspectRatio,
      viewBox: opts.viewBox,
      resolution: opts.resolution,
      canvasHasResized,
    });

    transformContextMatrix({
      ctx: baseContext,
      viewBox: opts.viewBox,
      resolution: opts.resolution,
      scaleMode: opts.scaleMode,
    });

    if (opts.preserveHistory) {
      restoreFromHistory(baseContext, history);
    }

    canvasHasResized = true;
  }

  mountCanvasToDOM(opts.target, canvasHTMLElement);

  resizeCanvas();

  observeElDimensions(canvasHTMLElement, resizeCanvas);

  return {
    el: canvasHTMLElement,
    ctx: opts.preserveHistory ? observableContext : baseContext,
  };
}

export { createCanvas };
