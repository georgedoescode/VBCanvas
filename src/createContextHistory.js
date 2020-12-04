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

export { createContextHistory };
