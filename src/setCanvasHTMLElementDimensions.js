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

export { setCanvasHTMLElementDimensions };
