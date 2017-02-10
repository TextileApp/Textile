import { IDetailedError } from './definitions';
/**
 * @hidden
 */
export declare class Exception extends Error {
    message: string;
    name: string;
    stack: string;
    constructor(message: string);
    toString(): string;
}
/**
 * An error with generic error details.
 *
 * Error details can be extracted depending on the type of `D`. For instance,
 * if the type of `D` is `string[]`, you can do this:
 *
 * ```typescript
 * function handleError(err: IDetailedError<string[]>) {
 *   for (let i in err.details) {
 *     console.error('got error code: ' + i);
 *   }
 * }
 * ```
 *
 * @featured
 */
export declare class DetailedError<D> extends Exception implements IDetailedError<D> {
    /**
     * The error message.
     */
    message: string;
    /**
     * The error details.
     */
    details: D;
    constructor(
        /**
         * The error message.
         */
        message: string, 
        /**
         * The error details.
         */
        details?: D);
}
