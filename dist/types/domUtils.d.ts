export function resolveTarget(target: any): any;
export function createCanvasHTMLElement(id: any): HTMLCanvasElement;
/** @param {HTMLCanvasElement} canvasHTMLElement */
export function getCanvasContext(canvasHTMLElement: HTMLCanvasElement): CanvasRenderingContext2D;
/**
 * @param {HTMLElement} target
 * @param {HTMLCanvasElement} el
 */
export function mountCanvasToDOM(target: HTMLElement, el: HTMLCanvasElement): void;
export function randomID(): string;
