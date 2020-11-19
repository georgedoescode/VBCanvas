function createCanvasStyleSheet(id) {
  const canvasStyleSheet = document.createElement('style');
  const firstStyleSheet = document.styleSheets[0].ownerNode;

  canvasStyleSheet.setAttribute('data-canvas-id', id);

  document.head.insertBefore(canvasStyleSheet, firstStyleSheet);

  canvasStyleSheet.sheet.insertRule(
    'canvas { width: 100%; max-width: 100%; }',
    0
  );

  return canvasStyleSheet.sheet;
}

export { createCanvasStyleSheet };
