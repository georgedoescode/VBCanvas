import { setCanvasHTMLElementDimensions } from './setCanvasHTMLElementDimensions';
import { transformContextMatrix } from './transformContextMatrix';
import { restoreFromHistory } from './restoreFromHistory';

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
