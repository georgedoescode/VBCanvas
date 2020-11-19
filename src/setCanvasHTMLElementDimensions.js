function calculateHeightFromAspectRatio(el, viewBox) {
  const width = el.getBoundingClientRect().width;
  const aspectRatioPercentage = viewBox[3] / viewBox[2];

  return width * aspectRatioPercentage + 'px';
}

function setCanvasHTMLElementDimensions({
  id,
  el,
  autoAspectRatio,
  viewBox,
  resolution,
  styleSheet,
}) {
  if (autoAspectRatio) {
    if (styleSheet.rules.length) styleSheet.deleteRule(0);

    styleSheet.insertRule(
      `.${id} { height: ${calculateHeightFromAspectRatio(el, viewBox)} }`,
      0
    );
  }

  const { width, height } = el.getBoundingClientRect();

  el.width = width * resolution;
  el.height = height * resolution;
}

export { setCanvasHTMLElementDimensions };
