/**
 * @name Mixpanel
 * @description
 * Cordova Plugin that wraps Mixpanel SDK for Android and iOS
 *
 * @usage
 * ```
 * import {Mixpanel} from 'ionic-native';
 *
 * Mixpanel.init(token)
 *   .then(onSuccess)
 *   .catch(onError);
 *
 * ```
 * @classes
 * MixpanelPeople
 */
export declare class Mixpanel {
    /**
     *
     * @param aliasId {string}
     * @param originalId {string}
     * @returns {Promise<any>}
     */
    static alias(aliasId: string, originalId: string): Promise<any>;
    /**
     *
     * @returns {Promise<any>}
     */
    static distinctId(): Promise<any>;
    /**
     * @returns {Promise<any>}
     */
    static flush(): Promise<any>;
    /**
     *
     * @param distinctId {string}
     * @returns {Promise<any>}
     */
    static identify(distinctId: string): Promise<any>;
    /**
     *
     * @param token {string}
     * @returns {Promise<any>}
     */
    static init(token: string): Promise<any>;
    /**
     *
     * @param superProperties {any}
     * @returns {Promise<any>}
     */
    static registerSuperProperties(superProperties: any): Promise<any>;
    /**
     *
     * @returns {Promise<any>}
     */
    static reset(): Promise<any>;
    /**
     *
     * @param eventName {string}
     * @param eventProperties {any} optional
     * @returns {Promise<any>}
     */
    static track(eventName: string, eventProperties?: any): Promise<any>;
    /**
     *
     * @returns {Promise<any>}
     */
    static showSurvey(): Promise<any>;
    /**
     *
     * @returns {MixpanelPeople}
     */
    static readonly people: typeof MixpanelPeople;
}
/**
 * @private
 */
export declare class MixpanelPeople {
    /**
     * @private
     */
    static plugin: string;
    /**
     * @private
     */
    static pluginRef: string;
    /**
     *
     * @param distinctId {string}
     * @return {Promise<any>}
     */
    static identify(distinctId: string): Promise<any>;
    /**
     *
     * @param peopleProperties {string}
     * @return {Promise<any>}
     */
    static increment(peopleProperties: any): Promise<any>;
    /**
     *
     * @param pushId
     * @return {Promise<any>}
     */
    static setPushId(pushId: string): Promise<any>;
    /**
     *
     * @param peopleProperties
     * @return {Promise<any>}
     */
    static set(peopleProperties: any): Promise<any>;
    /**
     *
     * @param peopleProperties
     * @return {Promise<any>}
     */
    static setOnce(peopleProperties: any): Promise<any>;
}
