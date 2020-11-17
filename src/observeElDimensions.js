import ResizeObserver from 'resize-observer-polyfill';
import { debounce } from 'lodash-es';

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

export { observeElDimensions };
