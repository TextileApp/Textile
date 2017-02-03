/// <reference types="node" />
export declare class BuildError extends Error {
    hasBeenLogged: boolean;
    isFatal: boolean;
    constructor(err?: any);
    toJson(): {
        message: string;
        name: string;
        stack: string;
        hasBeenLogged: boolean;
    };
}
export declare class IgnorableError extends Error {
    constructor(msg?: string);
}
