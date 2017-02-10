import { DeployChannel, DeployDependencies, DeployDownloadOptions, DeployExtractOptions, DeployOptions, IDeploy } from '../definitions';
/**
 * `Deploy` handles live deploys of the app. Downloading, extracting, and
 * rolling back snapshots.
 *
 * @featured
 */
export declare class Deploy implements IDeploy {
    /**
     * @hidden
     */
    options: DeployOptions;
    /**
     * The active deploy channel. Set this to change the channel on which
     * `Deploy` operates.
     */
    channel: DeployChannel;
    /**
     * The deploy plugin. Full documentation and examples can be found on the
     * plugin's
     * [README](https://github.com/driftyco/ionic-plugin-deploy#cordova-plugin-api),
     * but we recommend using the Cloud Client.
     */
    plugin: any;
    /**
     * @private
     */
    private config;
    /**
     * @private
     */
    private emitter;
    /**
     * @private
     */
    private logger;
    constructor(deps: DeployDependencies, 
        /**
         * @hidden
         */
        options?: DeployOptions);
    /**
     * Check for updates on the active channel.
     *
     * The promise resolves with a boolean. When `true`, a new snapshot exists on
     * the channel.
     */
    check(): Promise<boolean>;
    /**
     * Download the available snapshot.
     *
     * This should be used in conjunction with
     * [`extract()`](/api/client/deploy/#extract).
     *
     * @param options
     *  Options for this download, such as a progress callback.
     */
    download(options?: DeployDownloadOptions): Promise<void>;
    /**
     * Extract the downloaded snapshot.
     *
     * This should be called after [`download()`](/api/client/deploy/#download)
     * successfully resolves.
     *
     * @param options
     */
    extract(options?: DeployExtractOptions): Promise<void>;
    /**
     * Immediately reload the app with the latest deployed snapshot.
     *
     * This is only necessary to call if you have downloaded and extracted a
     * snapshot and wish to instantly reload the app with the latest deploy. The
     * latest deploy will automatically be loaded when the app is started.
     */
    load(): void;
    /**
     * Get information about the current snapshot.
     *
     * The promise is resolved with an object that has key/value pairs pertaining
     * to the currently deployed snapshot.
     */
    info(): Promise<any>;
    /**
     * List the snapshots that have been installed on this device.
     *
     * The promise is resolved with an array of snapshot UUIDs.
     */
    getSnapshots(): Promise<any>;
    /**
     * Remove a snapshot from this device.
     *
     * @param uuid
     *  The snapshot UUID to remove from the device.
     */
    deleteSnapshot(uuid: string): Promise<any>;
    /**
     * Fetches the metadata for a given snapshot. If no UUID is given, it will
     * attempt to grab the metadata for the most recently known snapshot.
     *
     * @param uuid
     *  The snapshot from which to grab metadata.
     */
    getMetadata(uuid?: string): Promise<any>;
    /**
     * @private
     */
    private _getPlugin();
}
