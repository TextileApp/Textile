export declare class ModuleRoute {
    readonly path: string;
    readonly className: string;
    constructor(path: string, className?: string);
    toString(): string;
    static fromString(entry: string): ModuleRoute;
}
