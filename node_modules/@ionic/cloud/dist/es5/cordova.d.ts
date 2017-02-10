import { AppStatus, CordovaDependencies, CordovaOptions, ICordova } from './definitions';
/**
 * @hidden
 */
export declare class Cordova implements ICordova {
    protected options: CordovaOptions;
    /**
     * Native information about the app.
     */
    app: AppStatus;
    /**
     * @private
     */
    private device;
    /**
     * @private
     */
    private emitter;
    /**
     * @private
     */
    private logger;
    constructor(deps: CordovaDependencies, options?: CordovaOptions);
    bootstrap(): void;
    /**
     * @private
     */
    private registerEventHandlers();
}
