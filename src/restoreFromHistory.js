function restoreFromHistory(ctx, history) {
  for (const entry of history.entries) {
    if (entry.type === 'function') {
      ctx[entry.name].apply(ctx, entry.args);
    } else {
      ctx[entry.name] = entry.args;
    }
  }
}

export { restoreFromHistory };
