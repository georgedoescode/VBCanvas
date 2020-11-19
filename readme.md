# VBCanvas (in dev!)

VBCanvas is a simple, un-opinionated JavaScript library for creating _responsive_ `<canvas>` elements.

By default, canvas elements will always fill their container, and their aspect ratio will match
that of their `viewBox`

If the canvas width is explicitely resized, it's height will automatically adjust to maintain aspect ratio.

Unlike SVG, if the canvas height is explicitely set / resized, it's width will not automatically change to maintain aspect ratio and will remain at 100%.

Styles are applied by a class in an stylesheet, to ensure developers do not run into any specificity issues when trying to resize their canvas.
