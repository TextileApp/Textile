import { CoreDependencies, ICore } from './definitions';
/**
 * @hidden
 */
export declare class Core implements ICore {
    /**
     * @private
     */
    private config;
    /**
     * @private
     */
    private logger;
    /**
     * @private
     */
    private emitter;
    /**
     * @private
     */
    private insights;
    /**
     * @private
     */
    private _version;
    constructor(deps: CoreDependencies);
    init(): void;
    readonly version: string;
    /**
     * @private
     */
    private onResume();
    /**
     * @private
     */
    private registerEventHandlers();
}
