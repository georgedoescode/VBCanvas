import ResizeObserver from 'resize-observer-polyfill';
import { debounce } from 'lodash-es';

var DEFAULTS = {
  target: null,
  viewBox: [0, 0, 300, 150],
  autoAspectRatio: true,
  scaleMode: 'fit',
  resolution: 1,
  preserveHistory: false,
};

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
    push(type, name, args) {
      store.set(position, { type, name, args });

      position++;
    },
    clear() {
      store.clear();
    },
  };
}

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

  const resizeObserver = new ResizeObserver(
    debounce(([entry]) => {
      const { width, height } = entry.contentRect;

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
  el,
  autoAspectRatio,
  viewBox,
  resolution,
  canvasHasResized,
}) {
  if (autoAspectRatio) {
    el.style.height = calculateHeightFromAspectRatio(el, viewBox);
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

  return { fitWidth: srcWidth * ratio, fitHeight: srcHeight * ratio };
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

  const { fitWidth, fitHeight } = calculateAspectRatio(
    viewBoxWidth,
    viewBoxHeight,
    canvasWidth,
    canvasHeight,
    scaleMode
  );

  const scaleX = fitWidth / viewBoxWidth;
  const scaleY = fitHeight / viewBoxHeight;

  const translateX = (canvasWidth - fitWidth) / 2;
  const translateY = (canvasHeight - fitHeight) / 2;

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
//# sourceMappingURL=index.js.map
