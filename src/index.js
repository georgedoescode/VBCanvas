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
