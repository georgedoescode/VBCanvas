/**
 * @param {CanvasRenderingContext2D} baseContext
 * @param {ReturnType<typeof import("./createContextHistory").createContextHistory>['push']} observe
 */
export function createObservableContext(baseContext: CanvasRenderingContext2D, observe: ReturnType<typeof import("./createContextHistory").createContextHistory>['push']): CanvasRenderingContext2D;
