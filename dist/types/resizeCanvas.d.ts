export type ResizeCanvasOptions = {
    opts: import(".").CreateCanvasOptions;
    canvasID: string;
    canvasHTMLElement: HTMLCanvasElement;
    canvasStyleSheet: CSSStyleSheet;
    baseContext: CanvasRenderingContext2D;
    history: ReturnType<typeof import("./createContextHistory").createContextHistory>;
};
/**
 * @typedef ResizeCanvasOptions
 * @property {import(".").CreateCanvasOptions} opts
 * @property {string} canvasID
 * @property {HTMLCanvasElement} canvasHTMLElement
 * @property {CSSStyleSheet} canvasStyleSheet
 * @property {CanvasRenderingContext2D} baseContext
 * @property {ReturnType<typeof import("./createContextHistory").createContextHistory>} history
 */
/**
 * @param {ResizeCanvasOptions} options
 */
export function resizeCanvas({ opts, canvasID, canvasHTMLElement, canvasStyleSheet, baseContext, history, }: ResizeCanvasOptions): void;
