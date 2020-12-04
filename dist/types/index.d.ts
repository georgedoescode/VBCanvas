export type CreateCanvasOptions = {
    /**
     * Where to add the `<canvas>` element in the DOM.
     */
    target?: HTMLElement;
    /**
     * Canvas viewbox (x, y, w, h). Mirrors SVG Behaviour.
     */
    viewBox?: [x: number, y: number, w: number, h: number];
    /**
     * Match DOM dimensions to `viewBox`. When true, `<canvas>` elements behave in a similar way to `<svg>`.
     */
    autoAspectRatio?: boolean;
    /**
     * VBCanvas's version of `preserveAspectRatio`. Accepts `fit` or `fill`. `fit` is equal to SVG'sxMidYMid meet. `fill` is equal to SVG'sxMidYMid slice.
     */
    scaleMode?: "fit" | "fill";
    /**
     * Pixel density of the `<canvas>`.
     */
    resolution?: number;
    /**
     * Retains canvas drawing on resize, without the need of an animation loop.
     */
    static?: boolean;
};
/**
 * @typedef CreateCanvasOptions
 * @property {HTMLElement} [target=document.body] Where to add the `<canvas>` element in the DOM.
 * @property {[x: number, y: number, w: number, h: number]} [viewBox=[0, 0, 200, 200]] Canvas viewbox (x, y, w, h). Mirrors SVG Behaviour.
 * @property {boolean} [autoAspectRatio=true] Match DOM dimensions to `viewBox`. When true, `<canvas>` elements behave in a similar way to `<svg>`.
 * @property {"fit" | "fill"} [scaleMode='fit'] VBCanvas's version of `preserveAspectRatio`. Accepts `fit` or `fill`. `fit` is equal to SVG'sxMidYMid meet. `fill` is equal to SVG'sxMidYMid slice.
 * @property {number} [resolution=window.devicePixelRatio] Pixel density of the `<canvas>`.
 * @property {boolean} [static=false] Retains canvas drawing on resize, without the need of an animation loop.
 */
/**
 * @param {CreateCanvasOptions} opts
 */
export function createCanvas(opts: CreateCanvasOptions): {
    el: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
};
