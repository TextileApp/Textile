/**
 * @name WebIntent
 * @description
 * @usage
 * For usage information please refer to the plugin's Github repo.
 *
 * ```typescript
 * import {WebIntent} from 'ionic-native';
 *
 * WebIntent.startActivity(options).then(onSuccess, onError);
 *
 * ```
 */
export declare class WebIntent {
    static ACTION_VIEW: any;
    static EXTRA_TEXT: any;
    /**
     * @param options {Object} { action: any, url: string, type?: string }
     * @returns {Promise<any>}
     */
    static startActivity(options: {
        action: any;
        url: string;
        type?: string;
    }): Promise<any>;
    /**
     * @param extra {any}
     * @returns {Promise<any>}
     */
    static hasExtra(extra: any): Promise<any>;
    /**
     * @param extra {any}
     * @returns {Promise<any>}
     */
    static getExtra(extra: any): Promise<any>;
    /**
     * @returns {Promise<any>}
     */
    static getUri(): Promise<string>;
    /**
     * @returns {Promise<string>}
     */
    static onNewIntent(): Promise<string>;
    /**
     * @param options {Object} { action: string, extras?: { option: boolean } }
     * @returns {Promise<any>}
     */
    static sendBroadcast(options: {
        action: string;
        extras?: {
            option: boolean;
        };
    }): Promise<any>;
}
