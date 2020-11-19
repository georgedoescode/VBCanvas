function createBaseCanvasStyles() {
  const baseStyleSheet = document.createElement('style');
  const firstStyleSheet = document.styleSheets[0].ownerNode;

  document.head.insertBefore(baseStyleSheet, firstStyleSheet);

  baseStyleSheet.sheet.insertRule(
    '.vb-canvas { width: 100%; max-width: 100%; }',
    0
  );
}

function createCanvasStyleSheet(id) {
  const canvasStyleSheet = document.createElement('style');
  const firstStyleSheet = document.styleSheets[0].ownerNode;

  canvasStyleSheet.setAttribute('data-canvas-id', id);

  document.head.insertBefore(canvasStyleSheet, firstStyleSheet);

  return canvasStyleSheet.sheet;
}

export { createCanvasStyleSheet, createBaseCanvasStyles };
