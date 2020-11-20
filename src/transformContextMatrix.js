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

  return {
    fitWidth: srcWidth * ratio,
    fitHeight: srcHeight * ratio,
    ratio: ratio,
  };
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

  const { fitWidth, fitHeight, ratio } = calculateAspectRatio(
    viewBoxWidth,
    viewBoxHeight,
    canvasWidth,
    canvasHeight,
    scaleMode
  );

  const scaleX = fitWidth / viewBoxWidth;
  const scaleY = fitHeight / viewBoxHeight;

  const translateX = -viewBox[0] * ratio + (canvasWidth - fitWidth) / 2;
  const translateY = -viewBox[1] * ratio + (canvasHeight - fitHeight) / 2;

  ctx.setTransform(scaleX, 0, 0, scaleY, translateX, translateY);

  clipCtx(ctx, viewBoxWidth, viewBoxHeight);
}

export { transformContextMatrix };
