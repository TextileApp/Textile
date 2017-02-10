import { IPush, PushDependencies, PushOptions, PushSaveTokenOptions, PushToken } from '../definitions';
/**
 * `Push` handles push notifications for this app.
 *
 * @featured
 */
export declare class Push implements IPush {
    options: PushOptions;
    /**
     * The push plugin (window.PushNotification).
     */
    plugin: any;
    /**
     * @private
     */
    private config;
    /**
     * @private
     */
    private auth;
    /**
     * @private
     */
    private userService;
    /**
     * @private
     */
    private device;
    /**
     * @private
     */
    private client;
    /**
     * @private
     */
    private emitter;
    /**
     * @private
     */
    private storage;
    /**
     * @private
     */
    private logger;
    /**
     * @private
     */
    private blockRegistration;
    /**
     * @private
     */
    private blockUnregister;
    /**
     * @private
     */
    private blockSaveToken;
    /**
     * @private
     */
    private registered;
    /**
     * @private
     */
    private _token?;
    constructor(deps: PushDependencies, options?: PushOptions);
    token: PushToken | undefined;
    /**
     * Register a token with the API.
     *
     * When a token is saved, you can send push notifications to it. If a user is
     * logged in, the token is linked to them by their ID.
     *
     * @param token - The token.
     * @param options
     */
    saveToken(token: PushToken, options?: PushSaveTokenOptions): Promise<PushToken>;
    /**
     * Registers the device with GCM/APNS to get a push token.
     *
     * After a device is registered, you will likely want to save the token with
     * [`saveToken()`](/api/client/push/#saveToken) to the API.
     */
    register(): Promise<PushToken>;
    /**
     * Invalidate the current push token.
     */
    unregister(): Promise<void>;
    /**
     * @private
     */
    private _callbackRegistration();
    /**
     * @private
     */
    private _getPushPlugin();
}
