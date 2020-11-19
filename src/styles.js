function insertAfter(newNode, referenceNode) {
  referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function createBaseCanvasStyles() {
  const baseStyleSheet = document.createElement('style');
  const target = document.styleSheets[0]?.ownerNode || document.head.firstChild;

  baseStyleSheet.id = 'vb-canvas-base-styles';

  document.head.insertBefore(baseStyleSheet, target);

  baseStyleSheet.sheet.insertRule(
    '.vb-canvas { width: 100%; max-width: 100%; }',
    0
  );
}

function createCanvasStyleSheet(id) {
  const canvasStyleSheet = document.createElement('style');
  const target = document.getElementById('vb-canvas-base-styles');

  canvasStyleSheet.setAttribute('data-canvas-id', id);

  insertAfter(canvasStyleSheet, target);

  return canvasStyleSheet.sheet;
}

export { createCanvasStyleSheet, createBaseCanvasStyles };
