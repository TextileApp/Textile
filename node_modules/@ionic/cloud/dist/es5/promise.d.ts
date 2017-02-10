/**
 * @hidden
 */
export declare class DeferredPromise<T, E extends Error> {
    resolve: (value?: T) => Promise<T>;
    reject: (err?: E) => Promise<T>;
    promise: Promise<T>;
    constructor();
    init(): void;
    static rejectImmediately<T, E extends Error>(err?: E): Promise<T>;
}
