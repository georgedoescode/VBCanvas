export function createContextHistory(): {
    readonly entries: IterableIterator<any>;
    readonly size: number;
    /**
     * @param {"function" | "set"} type
     * @param {string | number | symbol} name
     * @param {unknown} args
     */
    push(type: "function" | "set", name: string | number | symbol, args: unknown): void;
    clear(): void;
};
