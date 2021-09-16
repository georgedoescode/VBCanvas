/**
 * @param {CanvasRenderingContext2D} baseContext
 * @param {ReturnType<typeof import("./createContextHistory").createContextHistory>['push']} observe
 */
function createObservableContext(baseContext, observe) {
  return new Proxy(baseContext, {
    get(target, name) {
      if (typeof target[name] === 'function') {
        return function () {
          observe('function', name, [...arguments]);

          return target[name].apply(target, arguments);
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

export { createObservableContext };
